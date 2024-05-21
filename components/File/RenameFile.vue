<template>
  <div>
    <DialogRoot modal :open="props.showRenameFile">
      <DialogPortal>
        <DialogOverlay
          class="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
        />
        <DialogContent
          class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
        >
          <DialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
            Rename {{ oldName }}
          </DialogTitle>
          <DialogDescription
            class="relative mt-[10px] mb-5 text-[15px] leading-normal"
          >
            <input 
              ref="fileName"
              class="py-2 px-3 border border-gray-400 w-full rounded-lg" placeholder="Folder name" type="text" name="name"
              v-model="file"
              @input="error = ''"
              autocomplete="off"
              autofocus
            >
            <span class="absolute left-0 -bottom-5 text-red-500 text-[12px]">{{ error }}</span>
          </DialogDescription>

          <div class="mt-[25px] flex justify-end">
            <button
              @click="renameFile()"
              class="inline-flex w-[120px] h-[35px] items-center justify-center rounded-[4px] px-[15px] leading-none focus:shadow-[0_0_0_2px] focus:outline-none relative"
              :class="
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400'
              "
              :disabled="isLoading || status === 'success'"
            >
              <span>{{  status === 'success' ? 'Saved' : 'Save' }}</span>
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
} from "radix-vue";

const { $folderStore } = useNuxtApp();

const props = defineProps({
  file: Object,
  showRenameFile: Boolean,
  close: Function,
});

const isLoading = ref(false);
const file = ref(props.file.name);
const error = ref("");
const status = ref("")
const timeouts = ref([]);
const oldName = props.file.name;

const handleClose = () => {
  isLoading.value = false;
  status.value = "";
  timeouts.value.forEach((timeout) => clearTimeout(timeout));
  props.close();
};

const renameFile = async () => {
  status.value = "";
  isLoading.value = true;
  if (file.value === "") {
    error.value = "File name is required";
    isLoading.value = false;
    return;
  }

  if (file.value === oldName) {
    error.value = "File name is the same as the old name";
    isLoading.value = false;
    return;
  }

  const response = await $folderStore.renameFile(props.file.id, file.value);
  
  if (response?.error) {
    error.value = response?.message || 'Something went wrong. Please try again later.';
    isLoading.value = false;
    return;
  }

  status.value = 'success';
  isLoading.value = false;

  const timeout = setTimeout(() => {
    handleClose()
  }, 1000);
  timeouts.value.push(timeout);

  $folderStore.getFiles(props.file.folder_id);
};

</script>
