
<template>
  <AlertDialogRoot :open="props.createModalVisible">
    
    <AlertDialogPortal to="body">
      <AlertDialogOverlay class=" bg-black/30 fixed inset-0 z-30" />
      <AlertDialogContent
        class="z-[100] absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2  w-[400px] p-[30px] bg-white rounded-[4px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)] will-change-[transform,opacity]"
      >
        <AlertDialogTitle class="text-mauve11 font-semibold text-[20px] leading-[24px]">New folder</AlertDialogTitle>
        <AlertDialogDescription class="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
          <div class="relative pt-4">
            <input 
              ref="folderName"
              class="py-2 px-3 border border-gray-400 w-full rounded-lg" placeholder="Folder name" type="text" name="name"
              v-model="folder"
              @input="error = ''"
              autocomplete="off"
              autofocus
            >
            <div class="flex gap-1 mt-2">
              <div class="flex gap-1 items-center">
                <input v-model="isPublic" id="isPublic" name="isPublic" type="checkbox">
                <label for="isPublic">Public folder</label>
              </div>
              
              <TooltipProvider>
                <TooltipRoot>
                  <TooltipTrigger>
                    <svg width="16px" height="16px" viewBox="0 0 24 24"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"></path></svg>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent
                      class="z-[999] w-[140px] bg-indigo-200 shadow-lg text-[10px] p-2"
                      :side-offset="5"
                    >
                    By click on this checkbox, the folder will be <strong>public</strong> and everyone in the company can access it by your public address.
                      <TooltipArrow class="fill-indigo-200" :width="8" />
                    </TooltipContent>
                  </TooltipPortal>
                </TooltipRoot>
              </TooltipProvider>
              

            </div>
            <p v-if="error" class="text-xs text-red-500 absolute -bottom-5 right-0">{{ error }}</p>
          </div>
        </AlertDialogDescription>
        <div class="flex justify-end gap-[25px] pt-4">
          <button
            class="inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
            @click="handleClose"
            :disabled="isCreating"
          >
            Cancel
          </button>
          <AlertDialogAction
            class="text-indigo-100 bg-indigo-500 hover:bg-indigo-400 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] leading-none outline-none focus:shadow-[0_0_0_2px] transition-all"
            :class="isCreating ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer'"
            @click="createFolder"
          >
            Create
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<script setup >
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
  TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger 
} from 'radix-vue'



const { $folderStore } = useNuxtApp()

const props = defineProps({
  createModalVisible: Boolean,
  closeModal: Function
})

const folder = ref('')
const error = ref('')
const isCreating = ref(false)

const isPublic = ref(false)

const createFolder = async (e) => {
  isCreating.value = true
  if (folder.value === '') {
    error.value = 'Folder name is required'
    e.preventDefault()
    isCreating.value = false
    return
  }

  const data = await $folderStore.create({
    name: folder.value,
    isPublic: isPublic.value
  })
  
  if (!data.error) {
    error.value = ''
    folder.value = ''
    isPublic.value = false
    props.closeModal()
    isCreating.value = false
    return 
  }

  error.value = data.message
  isCreating.value = false
  return
}

const handleClose = () => {
  error.value = ''
  folder.value = ''
  isPublic.value = false
  props.closeModal()
}



</script>
