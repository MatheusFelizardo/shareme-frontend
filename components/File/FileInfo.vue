<template>
  <div>
    <DialogRoot modal :open="props.showFileInfo">
      <DialogPortal>
        <DialogOverlay
          class="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
        />
        <DialogContent
          class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
        >
          <DialogTitle :title="props.file.name" class="m-0 text-[17px] my-2 overflow-hidden truncate">
            Information about <span :title="props.file.name" class="text-indigo-500 font-bold">{{ props.file.name }}</span>
          </DialogTitle>
          <DialogDescription
            class="relative mt-4 text-[15px] leading-normal"
          >
            <div class="mb-1">
              <p>Name</p>
              <p :title="props.file.path" class="text-gray-500 truncate">{{ props.file.path }}</p>
            </div>

            <div class="mb-1">
              <p>Type</p>
              <p class="text-gray-500">{{ props.file.type }}</p>
            </div>

            <div v-if="props.file.size" class="mb-1">
              <p>Size</p>
              <p class="text-gray-500">{{ fileSizeToKb(props.file.size) }}</p>
            </div>

            <div class="mb-1">
              <p>Created by</p>
              <p class="text-gray-500">{{ props.file.creator_name }}</p>
            </div>


            <div class="mb-1">
              <p>Created at</p>
              <p class="text-gray-500">{{ `${new Date(props.file.created_at).toLocaleDateString('pt-PT')} - ${new Date(props.file.created_at).toLocaleTimeString('pt-PT')}` }}</p>
            </div>

            <div class="mb-1">
              <p>Last modified</p>
              <p class="text-gray-500">{{ `${new Date(props.file.updated_at).toLocaleDateString('pt-PT')} - ${new Date(props.file.updated_at).toLocaleTimeString('pt-PT')}` }}</p>
            </div>
          
          </DialogDescription>

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
import {fileSizeToKb} from '~/assets/js/utils.js';

const { $folderStore } = useNuxtApp();

const props = defineProps({
  file: Object,
  showFileInfo: Boolean,
  close: Function,
});

const handleClose = () => {
  props.close();
};

</script>
