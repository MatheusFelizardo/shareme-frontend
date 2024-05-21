<template>
  <div>
    <DialogRoot modal :open="props.showShareFolder">
      <DialogPortal>
        <DialogOverlay
          class="share-overlay bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0 z-30"
        />
        <DialogContent
          class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
        >
          <DialogTitle class="text-mauve12 m-0 text-[17px] font-semibold">
            Sharing <span class="text-indigo-500">{{ props.folder.name }}</span>
          </DialogTitle>
          <DialogDescription
            class="share-description text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal"
          >
            <p class="text-xs mb-4">
              Select the users you want to share this folder with.
            </p>

            <ComboboxRoot class="relative">
              <ComboboxAnchor
                class="w-full text-xs inline-flex items-center justify-between rounded px-4 leading-none h-[35px] gap-[5px] bg-white border border-indigo-400 outline-none"
              >
                <ComboboxInput
                  class="!bg-transparent outline-none h-full min-w-[200px]"
                  placeholder="User"
                />
                <ComboboxTrigger class="flex-1 flex justify-end">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    class="h-4 w-4"
                    width="1em"
                    height="1em"
                    viewBox="0 0 15 15"
                  >
                    <path
                      fill="currentColor"
                      fill-rule="evenodd"
                      d="M3.135 6.158a.5.5 0 0 1 .707-.023L7.5 9.565l3.658-3.43a.5.5 0 0 1 .684.73l-4 3.75a.5.5 0 0 1-.684 0l-4-3.75a.5.5 0 0 1-.023-.707"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </ComboboxTrigger>
              </ComboboxAnchor>

              <ComboboxContent
                class="absolute z-10 w-full mt-2 min-w-[160px] bg-white overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              >
                <ComboboxViewport class="p-[5px]">
                  <ComboboxEmpty class="text-xs font-medium text-center py-2" />

                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="(user, index) in users"
                      :key="index"
                      class="text-[13px] text-indigo-500 leading-none rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none hover:bg-indigo-400 hover:text-white"
                      :disabled="checkIfUserIsSelected(user)"
                      :value="user.name"
                      @click="askPermissionForUser = user"
                    >
                      <span>
                        {{ `${user.name} - ${user.email}` }}
                      </span>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxViewport>
              </ComboboxContent>
            </ComboboxRoot>

            <div class="mt-2">
              <span v-if="selectedUsers.length === 0" class="text-xs"
                >Select at least one user to share</span
              >
              <div
                v-else
                class="flex gap-1 flex-wrap max-h-[60px] overflow-auto items-center"
              >
                <p class="text-xs">Sharing with:</p>
                <p class="text-xs absolute bottom-[25px] font-bold">Click in the name to remove</p>

                <div v-if="loadingUsers">
                  <SpinIcon class="animate-spin text-indigo-500" />
                </div>
                <div v-else class="flex gap-1">
                  <button
                    v-for="(user, index) in selectedUsers"
                    :key="user"
                    @click="removeSelectedUser(index, user)"
                    class="text-xs p-1 bg-gray-200 hover:bg-red-500"
                  >
                    {{ user.name }}
                  </button>
                </div>
               
              </div>
            </div>
          </DialogDescription>

          <div class="mt-[25px] flex justify-end">
            <button
              @click="share()"
              class="inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              :class="
                selectedUsers.length === 0
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400'
              "
              :disabled="selectedUsers.length === 0"
            >
              Share
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

    <Teleport to="body" v-if="showShareFolderStatus">
      <div
        class="fixed bottom-0 right-0 p-4 m-4 bg-white rounded-md shadow-md z-[999] min-w-[260px]"
      >
        <button
          @click="handleClose()"
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
          <span>Sharing </span>
          <span class="font-semibold text-indigo-500">{{
            props.folder.name
          }}</span>
        </p>

        <div>
          <div
            v-for="(status, index) in sharingStatus"
            :key="index"
            class="flex gap-2 items-center mb-2"
          >
            <p class="truncate max-w-[300px] flex-1">{{ status.user }}</p>
            <div :title="status.message">
              <SpinIcon
                v-if="status.status === 'sharing'"
                class="animate-spin text-indigo-500"
              />
              <div v-if="status.status === 'success'" class="text-indigo-500">
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

              <div v-if="status.status === 'fail'" class="text-indigo-500">
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
      </div>
    </Teleport>

    <Teleport to=".share-description" v-if="askPermissionForUser">
      <div
        class="absolute inset-0 bg-black/30 z-[9999] flex items-center justify-center"
      >
        <div
          class="z-[9999] fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-md max-w-[300px] w-full"
        >
          <p class="text-xs mb-4">Which permission do you want give for this user?</p>
          <div class="flex gap-2 justify-between">
            <div class="flex gap-2">
              <button
                @click="handleSelect({...askPermissionForUser, permission: 'read'}); askPermissionForUser = null"
                class="bg-gray-400 text-xs text-white p-1 px-2 min-w-[40px] hover:bg-indigo-500"
              >
                Read
              </button>
              <button
                @click="handleSelect({...askPermissionForUser, permission: 'edit'}); askPermissionForUser = null"
                class="bg-gray-400 text-xs text-white p-1 px-2 min-w-[40px] hover:bg-indigo-500"
              >
                Edit
              </button>
            </div>

            <button class="bg-red-500 text-xs text-white p-1 px-2 min-w-[40px] hover:bg-red-400" @click="askPermissionForUser = null;">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport> 
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
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
import SpinIcon from "~/assets/img/icons/SpinIcon.vue";

const props = defineProps({
  folder: Object,
  showShareFolder: Boolean,
  close: Function,
});

const { $userStore, $folderStore } = useNuxtApp();
const { users } = storeToRefs($userStore);

const selectedUsers = ref([]);
const showShareFolderStatus = ref(false);
const userWithFolderAccess = ref([]);
const sharingStatus = ref([]);
const timeouts = ref([]);
const loadingUsers = ref(true)
const askPermissionForUser = ref(null)

const checkIfUserIsSelected = (user) =>
  selectedUsers.value.some((selectedUser) => selectedUser.email === user.email);

const handleSelect = async (user) => {

  const hasTheUser = checkIfUserIsSelected(user);
  if (hasTheUser) return;
  selectedUsers.value.push(user);
};

const removeSelectedUser = async (index, user) => {
  selectedUsers.value.splice(index, 1);

  const userWithAccess = userWithFolderAccess.value.find(
    (ufa) => ufa.id === user.id
  );

  if (userWithAccess) {
    const response = await $folderStore.removeAccessToTheFolder(props.folder.id, user.id);
    if (response.error) {
      return;
    }
    userWithFolderAccess.value = userWithFolderAccess.value.filter(
      (ufa) => ufa.id !== user.id
    );

    if (userWithFolderAccess.value.length === 0) {
      $folderStore.removeSharedStatus(props.folder.id);
    }
  }
};

const handleClose = () => {
  selectedUsers.value = [];
  sharingStatus.value = [];
  showShareFolderStatus.value = false;  
  
  props.close();
  timeouts.value.forEach((timeout) => clearTimeout(timeout));
};

const share = async () => {
  if (selectedUsers.length === 0) {
    error.value = "Select at least one user";
    return
  }
  props.close();
  
  const userWithoutAccess = selectedUsers.value.filter(
    (user) => !userWithFolderAccess.value.some((ufa) => ufa.id === user.id)
  );

  if (userWithoutAccess.length === 0) {
    handleClose()
    return;
  }

  showShareFolderStatus.value = true;

  userWithoutAccess.forEach((user) => {
    sharingStatus.value.push({
      user: user.name,
      id: user.id,
      status: "sharing",
      message: "Sharing folder",
    });
  });

  for (let i = 0; i < selectedUsers.value.length; i++) {
    const shareResponse = await $folderStore.shareFolder(props.folder.id, [{
      id: selectedUsers.value[i].id,
      permission: selectedUsers.value[i].permission
    }]);

    if (shareResponse.error) {
      sharingStatus.value = sharingStatus.value.map((status) => {
        if (status.id === shareResponse.error.user.id) {
          return {
            ...status,
            status: "fail",
            message: shareResponse.error.message,
          };
        }
        return status;
      });
      
      
      continue;
    }

    sharingStatus.value = sharingStatus.value.map((status) => {
      if (status.status === "sharing") {
        return {
          ...status,
          status: "success",
          message: "Folder shared successfully",
        };
      }
      return status;
    });
  }

  const timeout = setTimeout(() => {
    handleClose()
  }, 1000);
  timeouts.value.push(timeout);
};

watchEffect(async () => {
  if (props.showShareFolder) {
    const userFolderResponse = await $folderStore.checkUsersWithFolderAccess(props.folder.id);
    userWithFolderAccess.value = userFolderResponse.map((ufResponse) => ufResponse.user);
    userWithFolderAccess.value.forEach((user) => {
      selectedUsers.value.push(user);
    });
    loadingUsers.value = false
  } else {
    userWithFolderAccess.value = [];
    loadingUsers.value = false
  }
});

</script>
