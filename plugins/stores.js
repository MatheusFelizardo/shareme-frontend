import { useUserStore } from "~/stores/user";
import { useFolderStore } from "~/stores/folder";

export default defineNuxtPlugin((NuxtApp) => {
  return {
    provide: {
      userStore: useUserStore(),
      folderStore: useFolderStore(),
    },
  };
});
