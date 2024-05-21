<template>
  <div class="pt-8 px-4 relative overflow-hidden h-full">
    <Breadcrumb :links="links" />

    <div v-if="isLoading" class="pt-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <SpinIcon class="w-10 h-10 animate-spin text-indigo-500" />
    </div>
    <div
      v-else
      class="w-full h-full"
    >
      <div
        id="file-container"
        for="file-upload"
        class="pt-8 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 relative"
        v-if="files.length > 0"
      >
        <div
          v-for="file in files"
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
            <FileDropdown :file="file">
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

          <FileInfo :file="file" :showFileInfo="showFileInfo" :close="() => showFileInfo = false" />
        </div>
      </div>

      <div v-else class="flex flex-col mt-8 pb-6">
        <p>There is no file in this folder yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import FileDropdown from "~/components/File/FileDropdown.vue";
import Breadcrumb from "~/components/Menu/Breadcrumb.vue";
import { getFileIcon, getFileType } from '~/assets/js/utils.js'
import SpinIcon from '~/assets/img/icons/SpinIcon.vue'
import FileInfo from '~/components/File/FileInfo.vue'

definePageMeta({
  layout: "authenticated",
});

const route = useRoute();
const { $folderStore } = useNuxtApp();

const origin = route.query.origin
const email = route.params.email;
const folderId = route.params.id;

const links = computed(() => {
    const breadcrumbLinks = [
      {
        name: "Home",
        path: "/folders",
        folder: null,
      },
    ];

    if (origin === "users") {
      breadcrumbLinks.push({
        name: 'Users',
        path: `/users`,
        folder: null,
      });
    }

    breadcrumbLinks.push({
      name: `${email}`,
      path: `/folders/_public/${email}${origin ? `?origin=${origin}` : ""}`,
      folder: null
    });

    breadcrumbLinks.push({
      name: `${folderId}`,
      path: `/folders/_public/${email}/${folderId}${origin ? `?origin=${origin}` : ""}`,
      folder: null
    });

    return breadcrumbLinks;
  });

const isDragging = ref(false);
const showFileUploadStatus = ref(false);
const fileUploadStatus = ref([]);
const isLoading = ref(true);
const showFileInfo = ref(false);
const files = ref([]);
const errorMessage = ref("");

onMounted(async () => {
  const filesResponse = await $folderStore.geFilesInPublicFolder(folderId, email);

  if (filesResponse.message) {
    navigateTo("/folders");
  }
  files.value = filesResponse.data

  setTimeout(() => {
    isLoading.value = false;
  }, 300);
});
</script>
