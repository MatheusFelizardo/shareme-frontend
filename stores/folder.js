import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { jwtDecode } from "jwt-decode";
import { useUserStore } from './user';

const $axios = axios().provide.axios

export const useFolderStore = defineStore('folder', {
  state: () => (
    {
      folders: [],
      sharedFolders: [],
      selectedFolder: {},
      folderFiles: [],
      sharedWithMe: []
    }
  ),
  getters: {
  },
  actions: {
    async create(data) {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.post('/folders', data , {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.statusCode === 401) {
          this.unathorizedAccess()
        }

        if (response.data.error) {
          return response.data
        }

        this.folders.push(response.data.data)
        return response.data
      } catch (error) {
        return error.response
      }
    },

    async getFolders() {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.get('/folders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.statusCode === 401) {
          this.unathorizedAccess()
        }

        const { data } = response.data
        this.folders = data
        this.filterSharedFolders()
        const sharedWithMeResponse = await this.foldersSharedWithMe()
        this.folders.push(...sharedWithMeResponse.data)
        
        return this.folders
      } catch (error) {
        this.unathorizedAccess()
        return error.response
        
      }
    },

    async getPublicFolders(email) {

      try {
        const token = useUserStore().jwtToken
        const response = await $axios.get(`/folders/public?profile=${email}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const { data } = response.data
        return data
        return this.folders
      } catch (error) {
        return error.response
      }
    },

    filterSharedFolders() {
      this.sharedFolders = this.folders.filter(folder => folder.is_shared)
    },

    async setSelectedFolder(folder) {
      this.selectedFolder = folder
      await this.checkUsersWithFolderAccess(folder.id)
      await this.getFiles(folder.id)
    },

    async shareFolder(folderId, users) {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.post(`/folders/${folderId}/share`, { users }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const error = response.data.data.error[0]
        const success = response.data.data.success

        if (!error) {
          this.folders = this.folders.map(folder => {
            if (folder.id === folderId) {
              folder.is_shared = true
            }
            return folder
          })
          this.filterSharedFolders()
        }

        return {
          error,
          success
        }
      } catch (error) {
        return error.response
      }
    },

    async checkUsersWithFolderAccess(folderId) {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.get(`/folders/${folderId}/shared/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const { data } = response.data
        return data
      } catch (error) {
        return error.response
      }
    },

    async foldersSharedWithMe() {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.get(`/folders/shared/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const { data } = response.data
        this.sharedWithMe = data
        return response.data
      } catch (error) {
        return error.response
      }
    },

    async removeAccessToTheFolder(folderId, userId) {
      try {
        const token = useUserStore().jwtToken
        const data = {
          folderId: folderId,
          userId: userId
        }
        const response = await $axios.delete(`/folders/shared/remove`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data
        })

        return response.data
      } catch (error) {
        return error.response
      }
    },

    async renameFolder(folderId, name) {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.put(`/folders/${folderId}/rename`, { name }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.statusCode === 401) {
          this.unathorizedAccess()
        }

        if (!response.data.error) {
          this.getFolders()
        }

        return response.data
      } catch (error) {
        return error.response
      }
    },

    async deleteFolder(folderId) {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.delete(`/folders/${folderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data && !response.data.error) {
          this.folders = this.folders.filter(folder => folder.id !== folderId)
          this.filterSharedFolders()
        }

        return response.data
      } catch (error) {
        return error.response
      }
    },

    async uploadFile(formData, folderId) {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.post(`/files/upload?folder_id=${folderId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.error) {
          return response.data
        }

        const errors = response.data.data.errors
        const success = response.data.data.success

        if (success) {
          await this.getFiles(folderId)
        }

        return {
          errors,
          success
        }
      } catch (error) {
        return error.response
      }
    },

    async getFiles(folderId) {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.get(`/files/folder/${folderId}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const { data } = response.data
        this.folderFiles = data
        return response.data
      } catch (error) {
        return error.response
      }
    },

    async geFilesInPublicFolder(folderId, email) {
      try {
        const publicFolders = await this.getPublicFolders(email)
        if (!publicFolders) {
          return {
            message: 'No public folders found',
            data: []
          }
        }
        const hasFolder = publicFolders.some(folder => +folder.id === +folderId)
        if (!hasFolder) {
          return {
            message: 'No public folder found with this ID',
            data: []
          }
        }
        const hasSelectedFolderId = publicFolders.find(folder => folder.id === folderId)

        const token = useUserStore().jwtToken
        const response = await $axios.get(`/files/folder/public/${folderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.error) {
          return {
            message: response.data.message,
            data: []
          }
        }
        
        return response.data
      } catch (error) {
        return error.response
      }
    },

    async downloadFile(file) {
      try {
        const id = file.id
        const token = useUserStore().jwtToken;
        const response = await $axios.get(`/files/download/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          responseType: 'blob' 
        });
        console.log(response)

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.path);
        link.setAttribute('data-file-id', file.id);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    
        return response.data;
      } catch (error) {
        return error.response;
      }
    },

    async findFileById(fileId) {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.get(`/files/${fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        return response.data
      } catch (error) {
        return error.response
      }
    },

    async renameFile(fileId, name) {
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.put(`/files/rename/${fileId}`, { name }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.data.error) {
          this.folderFiles = this.folderFiles.map(file => {
            if (file.id === fileId) {
              file.name = name
              file.path = response.data.file.path
            }
            return file
          })
        }

        return response.data
      } catch (error) {
        return error.response
      }
    },

    async deleteFile(fileId){
      try {
        const token = useUserStore().jwtToken
        const response = await $axios.delete(`/files/remove/${fileId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.data.error) {
          this.folderFiles = this.folderFiles.filter(file => file.id !== fileId)
        }

        return response.data
      } catch (error) {
        return error.response
      }
    },

    removeSharedStatus(folderId) {
      this.folders = this.folders.map(folder => {
        if (folder.id === folderId) {
          folder.is_shared = false
        }
        return folder
      })
      this.filterSharedFolders()
    },

    async refatchFolders() {
      this.restartFolderStates()
      await this.getFolders()
    },

    sanitizePath(name) {
      return name.trim().replace(/\s/g, '_').toLowerCase();
    },

    restartFolderStates() {
      this.folders = []
      this.sharedFolders = []
      this.selectedFolder = {}
      this.folderFiles = []
    },

    unathorizedAccess() {
      localStorage.removeItem('jwtToken')
      if (process.client) {
        window.location.href = '/'
      }
    }
  },
})