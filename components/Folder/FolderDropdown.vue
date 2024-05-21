<template>
  <div>
    <DropdownMenuRoot v-model:open="toggleState">
      <DropdownMenuTrigger aria-label="Folder options">
        <slot />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          align="start"
          class="z-20 min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          :side-offset="5"
        >
          <label
            for="file-upload"
            class="flex px-2 py-1 items-center gap-2 cursor-pointer hover:bg-indigo-200"
          >
            <svg
              class="pointer-events-none"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              focusable="false"
              fill="currentColor"
            >
              <path
                d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10zM8 13.01l1.41 1.41L11 12.84V17h2v-4.16l1.59 1.59L16 13.01 12.01 9 8 13.01z"
              ></path>
            </svg>
            <DropdownMenuLabel class="pointer-events-none"
              >Upload file</DropdownMenuLabel
            >
            <input
              id="file-upload"
              type="file"
              class="sr-only"
              multiple
              @change="handleUpload"
            />
          </label>

          <DropdownMenuSeparator  v-if="user.id === props.folder.creator_id" class="h-[0.5px] bg-indigo-300 my-1" />

          <DropdownMenuItem
            v-if="user.id === props.folder.creator_id"
            @click="showShareFolder = true"
            class="flex px-2 py-1 items-center gap-2 cursor-pointer hover:bg-indigo-200"
          >
            <svg width="24px" height="24px" viewBox="0 0 24 24">
              <path
                d="M13 8c0-2.21-1.79-4-4-4S5 5.79 5 8s1.79 4 4 4 4-1.79 4-4m-2 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2M1 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4m2 0c.2-.71 3.3-2 6-2 2.69 0 5.78 1.28 6 2zm17-3v-3h3v-2h-3V7h-2v3h-3v2h3v3z"
              ></path>
            </svg>
            <DropdownMenuLabel>Share folder</DropdownMenuLabel>
          </DropdownMenuItem>

          <DropdownMenuSeparator class="h-[0.5px] bg-indigo-300 my-1" />

          <DropdownMenuItem
            @click="handleRename"
            class="flex px-1 py-1 items-center gap-3 cursor-pointer hover:bg-indigo-200"
          >
            <svg width="24px" height="24px" viewBox="0 0 24 24">
              <path
                d="M18.41 5.8 17.2 4.59c-.78-.78-2.05-.78-2.83 0l-2.68 2.68L3 15.96V20h4.04l8.74-8.74 2.63-2.63c.79-.78.79-2.05 0-2.83M6.21 18H5v-1.21l8.66-8.66 1.21 1.21zM11 20l4-4h6v4z"
              ></path>
            </svg>
            <DropdownMenuLabel>Rename</DropdownMenuLabel>
          </DropdownMenuItem>

          <DropdownMenuSeparator class="h-[0.5px] bg-indigo-300 my-1" />

          <DropdownMenuItem
            @click="handleDelete"
            class="flex px-1 py-1 items-center gap-3 cursor-pointer hover:bg-indigo-200"
          >
            <svg width="24px" height="24px" viewBox="0 0 24 24">
              <path
                d="M16 9v10H8V9zm-1.5-6h-5l-1 1H5v2h14V4h-3.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z"
              ></path>
            </svg>
            <DropdownMenuLabel>Delete</DropdownMenuLabel>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>

    <Teleport to="body" v-if="showFileUploadStatus">
      <div class="fixed bottom-0 right-0 p-4 m-4 bg-white rounded-md shadow-md">
        <button
          @click="clearUploadStatus()"
          class="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
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
        </button>

        <p class="mb-4">
          <span>Upload status in </span>
          <span class="font-semibold text-indigo-500">{{
            props.folder.name
          }}</span>
        </p>
        <div
          v-for="file in fileUploadStatus"
          :key="file.id"
          class="flex gap-32 items-center mb-2 justify-between"
        >
          <div class="flex gap-2 items-center">
            <div :title="file.message" v-html="getFileIcon(file.type)"></div>
            <p :title="file.name" class="truncate max-w-[300px]">
              {{ file.name }}
            </p>
          </div>

          <div :title="file.message">
            <SpinIcon
              v-if="file.status === 'uploading'"
              class="animate-spin text-indigo-500"
            />
            <div v-if="file.status === 'success'" class="text-indigo-500">
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="#0F9D58"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                ></path>
              </svg>
            </div>

            <div v-if="file.status === 'fail'" class="text-indigo-500">
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="#DC2626"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2zm0-4h-2V7h2z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <ShareFolder
      :folder="props.folder"
      :showShareFolder="showShareFolder"
      :close="() => (showShareFolder = false)"
    />
    <RenameFolder
      :folder="props.folder"
      :showRenameFolder="showRenameFolder"
      :close="() => (showRenameFolder = false)"
    />
    <DeleteFolder
      :folder="props.folder"
      :showDeleteFolder="showDeleteFolder"
      :close="() => (showDeleteFolder = false)"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "radix-vue";
import SpinIcon from "~/assets/img/icons/SpinIcon.vue";
import { getFileIcon, getFileType } from "~/assets/js/utils.js";
import ShareFolder from "~/components/Folder/ShareFolder.vue";
import RenameFolder from "~/components/Folder/RenameFolder.vue";
import DeleteFolder from "~/components/Folder/DeleteFolder.vue";
import { storeToRefs } from "pinia";

const { $folderStore, $userStore } = useNuxtApp();
const { user } = storeToRefs($userStore);

const toggleState = ref(false);

const props = defineProps({
  folder: Object,
  close: Function,
});

const showFileUploadStatus = ref(false);
const showShareFolder = ref(false);
const showRenameFolder = ref(false);
const showDeleteFolder = ref(false);
const fileUploadStatus = ref([]);

const handleUpload = async (e) => {
  toggleState.value = false;
  clearUploadStatus();
  showFileUploadStatus.value = true;
  const files = e.target.files;

  for (let i = 0; i < files.length; i++) {
    fileUploadStatus.value.push({
      name: files[i].name,
      status: "uploading",
      type: getFileType(files[i]),
      message: "Uploading file",
    });
  }

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append("files", files[i]);

    const uploadedFilesResponse = await $folderStore.uploadFile(
      formData,
      props.folder.id
    );
    const fileIndex = fileUploadStatus.value.findIndex(
      (file) => file.name === files[i].name
    );
    
    if (uploadedFilesResponse?.error) {
      fileUploadStatus.value[fileIndex].status = "fail";
      fileUploadStatus.value[fileIndex].message = uploadedFilesResponse.message;
      continue;
    }
    
    if (uploadedFilesResponse?.errors[0]) {
      fileUploadStatus.value[fileIndex].status = "fail";
      fileUploadStatus.value[fileIndex].message =
        uploadedFilesResponse.errors[0].message;
      continue;
    }

    fileUploadStatus.value[fileIndex].status = "success";
    fileUploadStatus.value[fileIndex].message = "File updated successfully";
  }

  setTimeout(() => {
    clearUploadStatus();
  }, 3000);
};

const clearUploadStatus = () => {
  showFileUploadStatus.value = false;
  fileUploadStatus.value = [];
};

const handleShare = () => {
  showShareFolder.value = true;
};

const handleRename = () => {
  showRenameFolder.value = true;
};

const handleDelete = () => {
  showDeleteFolder.value = true;
};
</script>
