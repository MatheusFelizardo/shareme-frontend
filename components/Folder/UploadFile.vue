<template>
  <div>
    <DialogRoot modal :open="props.showFileUpload">
      <DialogPortal>
        <DialogOverlay
          class="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
        />
        <DialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
          
        >
          <DialogTitle class="m-0 text-[17px] my-2">
            Upload file
          </DialogTitle>
          <DialogDescription
            class="relative mt-3 mb-5 text-[15px] leading-normal"
          >
           <p class="text-xs">Please select a folder</p>
          
           <SelectRoot v-model="folder" >
            <SelectTrigger
              class="w-full inline-flex min-w-[160px] items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white border border-indigo-500 outline-none"
              aria-label="Customise options"
            >
              <SelectValue  placeholder="Select a folder..." />
            </SelectTrigger>
        
            <SelectPortal class="w-full">
              <SelectContent
                class="min-w-[160px] w-full bg-white rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] z-[100]"
                align="end"
              >
                <SelectScrollUpButton class="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
                  <Icon icon="radix-icons:chevron-up" />
                </SelectScrollUpButton>
        
                <SelectViewport class="p-[5px]">
                  <SelectItem
                    v-for="(folder, index) in folders"
                    :key="index"
                    class="text-[13px] leading-none rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none hover:bg-indigo-400 hover:text-white cursor-pointer border-none outline-none"
                    :value="folder"
                   
                  >
                    <SelectItemText>
                      {{ folder.name }}
                    </SelectItemText>
                  </SelectItem>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
           
          <span class="absolute left-0 -bottom-5 text-red-500 text-[12px]">{{ error }}</span>
          </DialogDescription>

          <div class="mt-[25px] flex justify-end">
            <Label
              @click="()=> {
                if (!folder) error = 'Please select a folder first'
              }"
              for="file-upload-h"
              class="inline-flex w-[120px] h-[35px] items-center justify-center rounded-[4px] px-[15px] leading-none focus:shadow-[0_0_0_2px] focus:outline-none relative"
              :class="
                !folder
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400'
              "
            >
              <input  
                :disabled="!folder"
                id="file-upload-h" 
                type="file" 
                class="sr-only" 
                multiple 
                @change="handleUpload"
              >
              <span>Upload file</span>
            </Label>
          </div>

          <DialogClose
            class="text-gray-500 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
            aria-label="Close"
            @click="handleClose()"
          >
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ></path>
            </svg>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>

    <Teleport to="body" v-if="showFileUploadStatus">
      <div class="fixed bottom-0 right-0 p-4 m-4 bg-white rounded-md shadow-md">
        <button @click="clearUploadStatus()" class="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700">
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
        </button>

        <p class="mb-4">
          <span>Upload status in </span> 
          <span class="font-semibold text-indigo-500">{{ folder.name}}</span>
        </p>
        <div v-for="file in fileUploadStatus" :key="file.id" class="flex gap-32 items-center mb-2 justify-between">
          <div class="flex gap-2 items-center">
            <div :title="file.message" v-html="getFileIcon(file.type)"></div>
            <p :title="file.name" class="truncate max-w-[300px]">{{ file.name }}</p>  
          </div>
          
          <div :title="file.message">
            <SpinIcon v-if="file.status === 'uploading'" class="animate-spin text-indigo-500" />
            <div v-if="file.status === 'success'" class="text-indigo-500">
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="#0F9D58"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
            </div>

            <div v-if="file.status === 'fail'" class="text-indigo-500">
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="#DC2626"  ><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import SpinIcon from '~/assets/img/icons/SpinIcon.vue'
import { getFileIcon, getFileType } from '~/assets/js/utils.js'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue";

const { $folderStore } = useNuxtApp();
const { folders } = storeToRefs($folderStore);

const folder = ref('')
const props = defineProps({
  showFileUpload: Boolean,
  close: Function
});

const isLoading = ref(false);
const error = ref("");
const status = ref("")
const timeouts = ref([]);

const handleClose = () => {
  isLoading.value = false;
  status.value = "";
  folder.value = "";
  timeouts.value.forEach((timeout) => clearTimeout(timeout));
  props.close();
};

const showFileUploadStatus = ref(false)
const fileUploadStatus = ref([])

const handleUpload = async (e) => {
  clearUploadStatus()
  showFileUploadStatus.value = true
  const files = e.target.files

  for (let i = 0; i < files.length; i++) {
    fileUploadStatus.value.push({
      name: files[i].name,
      status: 'uploading',
      type: getFileType(files[i]),
      message: 'Uploading file'
    })
  }

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData()
    formData.append('files', files[i])

    const uploadedFilesResponse = await $folderStore.uploadFile(formData, folder.value.id)

    const fileIndex = fileUploadStatus.value.findIndex(file => file.name === files[i].name)

    if (uploadedFilesResponse?.error) {
      fileUploadStatus.value[fileIndex].status = "fail";
      fileUploadStatus.value[fileIndex].message = uploadedFilesResponse.message;
      continue;
    }
    
    if (uploadedFilesResponse?.errors[0]) {
      fileUploadStatus.value[fileIndex].status = 'fail'
      fileUploadStatus.value[fileIndex].message = uploadedFilesResponse.errors[0].message
      continue
    }

    fileUploadStatus.value[fileIndex].status = 'success'
    fileUploadStatus.value[fileIndex].message = 'File updated successfully'
  }

  setTimeout(() => {
      clearUploadStatus()
    }, 3000)
  }

  watch(folder, (value) => {
      if (value) {
        error.value = "";
      }
    }
  )

  const clearUploadStatus = () => {
    showFileUploadStatus.value = false
    fileUploadStatus.value = []
  }
</script>
