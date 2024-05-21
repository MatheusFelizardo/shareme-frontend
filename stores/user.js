import { defineStore } from 'pinia'
import axios from '../plugins/axios'
import { jwtDecode } from "jwt-decode";

const $axios = axios().provide.axios

export const useUserStore = defineStore('user', {
  state: () => (
    {
      user: [],
      jwtToken: '',
      users: []
    }
  ),
  getters: {
  },
  actions: {

    async getAllUsers() {
      try {
        const response = await $axios.get('/users', {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`
          }
        })
        this.users = response.data.data.filter(user => user.id !== this.user.id)
        return response.data
      } catch (error) {
        return error.response
      }
    },
    async login(username, password) {
      try {
        const response = await $axios.post('/auth/login', { username, password })
        this.user = response.data

        if (response.data.access_token) {
          this.jwtToken = response.data.access_token
          localStorage.setItem('jwtToken', JSON.stringify(response.data.access_token))
          const {sub, iat, exp, ...user} = jwtDecode(response.data.access_token);
          this.user = user
          await this.getAllUsers()
          return {
            success: true,
            data: response.data.access_token,
          }
        }

        return {
          success: false
        }
      } catch (error) {
        return error.response
      }
    },

    async userLogin() {
      if (localStorage.getItem('jwtToken')) {
        this.jwtToken = JSON.parse(localStorage.getItem('jwtToken'))

        if (jwtDecode(this.jwtToken).exp < Date.now() / 1000) {
          localStorage.removeItem('jwtToken')
          this.restartUserStates()
          return false
        }

        const {sub, iat, exp, ...user} = jwtDecode(this.jwtToken);
        this.user = user
        await this.getAllUsers()
        return true
      }

      return false
    },

    async createAccount(data) {
      try {
        const response = await $axios.post('/users', data, {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`
          }
        })
        return response.data
      } catch (error) {
        return error.response
      }
    },

    async deleteUser(id) {
      try {
        const response = await $axios.delete(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`
          }
        })

        if (!response.error) {
          this.users = this.users.filter(user => user.id !== id)
        }

        return response.data
      } catch (error) {
        return error.response
      }
    },

    async editUserRole(id, role) {
      try {
        const response = await $axios.put(`/users/${id}/role`, { role }, {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`
          }
        })
        
        return response.data
      } catch (error) {
        return error.response
      }
    },
    
    restartUserStates() {
      this.jwtToken = ''
      this.user = []
    }
  },
})