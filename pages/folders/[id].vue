<template>
  <div class="pt-8 px-4 relative overflow-hidden h-full">
    <Breadcrumb :links="links" />

    <div
      v-if="isLoading"
      class="pt-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <SpinIcon class="w-10 h-10 animate-spin text-indigo-500" />
    </div>
    <div
      v-else
      class="w-full h-full"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <label
        v-if="!folderFiles?.length"
        id="file-container"
        for="file-upload"
        :class="{
          'mt-8 w-full flex flex-col items-center justify-center min-h-72 border-2 border-dashed': true,
          'border-indigo-500': isDragging,
        }"
      >
        <div
          class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none"
        >
          <p>Click or drag/drop to upload your first file.</p>
        </div>
        <input
          id="file-upload"
          type="file"
          class="hidden"
          multiple
          @change="handleUpload"
        />
      </label>

      <div
        v-else
        id="file-container"
        for="file-upload"
        class="pt-8 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 relative"
      >
        <div
          v-for="file in folderFiles"
          :key="file"
          :title="file.name"
          class="shadow-md cursor-pointer bg-white hover:bg-gray-200 z-10 overflow-hidden relative flex gap-4"
        >
          <div
            @click.prevent="showFileInfo = true"
            class="flex items-center gap-4 w-11/12 px-4 py-2 text-black"
          >
            <div v-html="getFileIcon(file.type)"></div>
            <p class="pb-[2px] truncate">{{ file.name }}</p>
          </div>

          <div class="absolute right-2 top-3 cursor-pointer text-black">
            <FileDropdown :file="file" :folder="selectedFolder">
              <svg
                viewBox="0 0 20 20"
                focusable="false"
                width="20px"
                height="20px"
                fill="black"
              >
                <path fill="none" d="M0 0h20v20H0V0z"></path>
                <path
                  d="M10 6c.82 0 1.5-.68 1.5-1.5S10.82 3 10 3s-1.5.67-1.5 1.5S9.18 6 10 6zm0 5.5c.82 0 1.5-.68 1.5-1.5s-.68-1.5-1.5-1.5-1.5.68-1.5 1.5.68 1.5 1.5 1.5zm0 5.5c.82 0 1.5-.67 1.5-1.5 0-.82-.68-1.5-1.5-1.5s-1.5.68-1.5 1.5c0 .83.68 1.5 1.5 1.5z"
                ></path>
              </svg>
            </FileDropdown>
          </div>

          <FileInfo
            :file="file"
            :showFileInfo="showFileInfo"
            :close="() => (showFileInfo = false)"
          />
        </div>
      </div>

      <div
        class="w-full flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none absolute bottom-0 transition-all"
        :class="isDragging ? 'translate-y-0' : 'translate-y-full'"
      >
        <svg
          class="w-24 h-24 mb-8 animate-bounce"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="rgb(99 102 241)"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <div
          class="bg-indigo-500 py-4 px-32 rounded-full flex flex-col justify-center items-center"
        >
          <span class="mb-2 text-white font-semibold text-lg"
            >Drop to upload the file</span
          >
          <div class="flex gap-2">
            <svg viewBox="0 0 24 24" height="32px" width="32px" fill="white">
              <g>
                <path
                  d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
                ></path>
                <path d="M0 0h24v24H0z" fill="none"></path>
              </g>
            </svg>
            <p class="text-lg">{{ selectedFolder.name }}</p>
          </div>
        </div>
      </div>
    </div>

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
            selectedFolder.name
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
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import FileDropdown from "~/components/File/FileDropdown.vue";
import Breadcrumb from "~/components/Menu/Breadcrumb.vue";
import { getFileIcon, getFileType } from "~/assets/js/utils.js";
import SpinIcon from "~/assets/img/icons/SpinIcon.vue";
import FileInfo from "~/components/File/FileInfo.vue";

definePageMeta({
  layout: "authenticated",
});

const route = useRoute();
const { $folderStore } = useNuxtApp();
const { selectedFolder, folderFiles } = storeToRefs($folderStore);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const origin = computed(() => {
  return route.query.origin ? capitalize(route.query.origin) : null;
});
const folderId = route.params.id;

const links = computed(() => {
  const breadcrumbLinks = [
    {
      name: "Home",
      path: "/folders",
      folder: null,
    },
  ];

  if (origin.value === "Shared_with_me") {
    breadcrumbLinks.push({
      name: "Shared with me",
      path: `/folders/shared-with-me`,
      folder: null,
    });
  }

  if (origin.value === "sharing") {
    breadcrumbLinks.push({
      name: "Sharing",
      path: `/folders/sharing`,
      folder: null,
    });
  }

  breadcrumbLinks.push({
    name: folderId,
    path: `/folders/${folderId}`,
    folder: selectedFolder.value,
  });

  return breadcrumbLinks;
});

const isDragging = ref(false);
const showFileUploadStatus = ref(false);
const fileUploadStatus = ref([]);
const isLoading = ref(true);
const error = ref("");
const status = ref("");
const timeouts = ref([]);
const showFileInfo = ref(false);

const onDragEnter = () => {
  isDragging.value = true;
};

const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = async (e) => {
  isDragging.value = false;
  await handleUpload(e);
};

const handleUpload = async (e) => {
  const files = e.target.files || e.dataTransfer.files;
  clearUploadStatus();
  showFileUploadStatus.value = true;

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
      selectedFolder.value.id
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

onMounted(async () => {
  setTimeout(async () => {
    const id = selectedFolder.value.id || folderId;
    const response = await $folderStore.getFiles(id);

    console.log(response);

    if (response.error) {
      navigateTo("/folders");
    }
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }, 200);
 
});
</script>
