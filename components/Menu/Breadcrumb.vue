<template>
  <div class="flex gap-2 items-center text-lg font-light">
    <div v-for="(link,index) in links" :key="link" class="flex gap-2 items-center">

      <div v-if="link.folder">
        <FolderDropdown :folder="link.folder">
          {{ link.name }}
        </FolderDropdown>
      </div>
      <router-link v-else :to="link.path" class="hover:text-gray-300">
        {{ link.name }}
      </router-link>
      <svg v-if="index !== links.length - 1" class=" a-s-fa-Ha-pa c-qd" width="24px" height="24px" viewBox="0 0 24 24" focusable="false" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  links: Array
})

</script>

