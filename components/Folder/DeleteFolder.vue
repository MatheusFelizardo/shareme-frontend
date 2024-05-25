<template>
  <div>
    <DialogRoot modal :open="props.showDeleteFolder">
      <DialogPortal>
        <DialogOverlay
          class="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
        />
        <DialogContent
          class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
        >
          <DialogTitle :title="props.folder.name" class="m-0 text-[17px] my-2 line-clamp-2">
            Are you sure you want to delete the folder <span class="text-indigo-500 font-bold">{{ props.folder.name }}</span>?
          </DialogTitle>
          <DialogDescription
            class="relative mt-3 mb-5 text-[15px] leading-normal"
          >
           <p>All files associated with this folder will be deleted.</p>
           <p>
            <span class="font-semibold text-red-500">This action cannot be undone.</span>
           </p>
          
           <p class="text-xs bold mt-4 mb-1">Type the folder name to confirm.</p>
            <input 
              ref="folderName"
              class="py-2 px-3 border border-gray-400 w-full rounded-lg" placeholder="Folder name" type="text" name="name"
              v-model="folder"
              @input="error = ''"
              autocomplete="off"
              autofocus
            >
            <span class="absolute left-0 -bottom-5 text-red-500 text-[12px]">{{ error }}</span>
          </DialogDescription>

          <div class="mt-[25px] flex justify-end">
            <button
              @click="deleteFolder()"
              class="inline-flex w-[120px] h-[35px] items-center justify-center rounded-[4px] px-[15px] leading-none focus:shadow-[0_0_0_2px] focus:outline-none relative"
              :class="
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-400'
              "
              :disabled="isLoading || status === 'success'"
            >
              <span>{{  status === 'success' ? 'Deleted' : 'Delete' }}</span>
              <SpinIcon v-if="isLoading && !status" class="absolute w-5 h-5 right-3 animate-spin text-white" />
            </button>
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
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import SpinIcon from './assets/img/icons/SpinIcon.vue';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
} from "radix-vue";

const { $folderStore } = useNuxtApp();

const props = defineProps({
  folder: Object,
  showDeleteFolder: Boolean,
  close: Function,
});

const isLoading = ref(false);
const folder = ref("");
const error = ref("");
const status = ref("")
const timeouts = ref([]);

const handleClose = () => {
  isLoading.value = false;
  status.value = "";
  timeouts.value.forEach((timeout) => clearTimeout(timeout));
  props.close();
};

const deleteFolder = async () => {
  if (folder.value !== props.folder.name) {
    error.value = "Folder name does not match";
    return;
  }

  isLoading.value = true;
  const response = await $folderStore.deleteFolder(props.folder.id);

  if (response.error) {
    status.value = "error";
    error.value = response.message;
    isLoading.value = false;
    return;
  }

  status.value = "success";
  const timeout = setTimeout(() => {
    handleClose();
  }, 2000);
  timeouts.value.push(timeout);
};

</script>
