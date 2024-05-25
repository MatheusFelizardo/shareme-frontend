<template>
  <div class="w-full h-full px-4 pt-8">
    <Breadcrumb :links="links" />

    <p class="mt-8 mb-2">Use this terminal to make operations via command line</p>

    <div ref="terminalContainer" class="terminal-container"></div>
  </div>
</template>

<script setup>
import Breadcrumb from "~/components/Menu/Breadcrumb.vue";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import RenameFolder from "~/components/Folder/RenameFolder.vue";
const { $folderStore } = useNuxtApp();

definePageMeta({
  layout: "authenticated",
  breadcrumb: "Terminal",
});

const links = [
  {
    name: "Home",
    path: "/folders",
    folder: null,
  },
  {
    name: "Terminal",
    path: "/terminal",
    folder: null,
  },
];

const terminalContainer = ref(null);
let terminal;
let currentInput = '';

onMounted(() => {
  terminal = new Terminal({
    cursorBlink: true,
    
  });

  terminal.open(terminalContainer.value);

  terminal.writeln('\r ');
  terminal.writeln('ShareMe Terminal');
  terminal.writeln("For the list of available commands, type 'help'");
  terminal.writeln('\r ');

  terminal.writeln("You cannot create a folder with spaces in the name.");
  terminal.writeln("Use '-' instead of spaces. Example: 'my-folder' instead of 'my folder");

  terminal.prompt = () => {
  };
  terminal.prompt();
  prompt()
  terminal.onData((data) => {
    handleTerminalInput(data);
  });
  
});

onBeforeUnmount(() => {
  terminal.dispose();
}); 

async function handleTerminalInput(data) {
  const char = data;

  if (char === '\r') { // Enter key
    terminal.write('\r\n');
    await processCommand(currentInput);
    currentInput = '';
  } else if (char === '\u007F') { // Backspace key
    if (!currentInput) return
    if (currentInput.length > 0) {
      terminal.write('\b \b');
      currentInput = currentInput.slice(0, -1);
    }
  } else if (char === '\u001B[A' || char === '\u001B[B' || char === '\u0009') {
    return;
  } else {
    terminal.write(char);
    currentInput += char;
  }
}

async function processCommand(input) {
  const [command, ...args] = input.trim().split(' ');

  switch (command) {
    case 'help': 
      terminal.writeln('  Available commands:');
      terminal.writeln('  UNIX like'); 
      terminal.writeln('  - mkdir <folder_name> -p <optional>: Create a new folder*');
      terminal.writeln('  - mv <old_folder_name> <new_folder_name>: Rename a folder');
      terminal.writeln('  - rm <folder_name>: Remove a folder');
      terminal.writeln('  - ls: List all folders');
      terminal.writeln('  Application specific'); 
      terminal.writeln('  - folder:create <folder_name> -p <optional>: Create a new folder*');
      terminal.writeln('  - folder:rename <old_folder_name> <new_folder_name>: Rename a folder');
      terminal.writeln('  - folder:remove <folder_name>: Remove a folder');
      terminal.writeln('  - file:download <file_name>: Download a file');
      terminal.writeln('  - clear: Clear the terminal');
      terminal.writeln('  - help: Show this help message');
      terminal.writeln('\r\n* -p flag makes the folder public. Example: mkdir my-folder -p');

      prompt();
      break;
    case 'clear':
      terminal.clear();
      prompt()
      break;
    case 'mkdir':
      createFolder(args);
      break;
    case 'folder:create':
      createFolder(args);
      break;
    case 'mv':
      renameFolder(args);
      break;
    case 'folder:rename':
      renameFolder(args);
      break;
    case 'rm':
      removeFolder(args);
      break;
    case 'folder:delete':
      removeFolder(args);
      break;
    case 'ls':
      listFolders()
      break;
    case 'folder:show':
      listFolders()
      break;
    case 'file:download':
      downloadFile(args)
      break;
    default:
      terminal.writeln(`Unknown command: ${command}. For the list of available commands, type 'help'`);
      prompt();
      break;
  }
}


function prompt() {
  terminal.write('\r\n$ ');
}

const createFolder = async (args) => {
  if (!args[0]) {
    terminal.writeln('Folder name is required');
    return;
  }
  const folder = args[0];
  const isPublic = args.includes('-p');

  const createResponse =  await $folderStore.create({name: folder, isPublic});
  if (createResponse.error) {
    terminal.writeln(createResponse.message);
    prompt()
    return;
  }
  
  terminal.writeln(`Folder ${folder} created successfully.`);
  terminal.writeln(`Folder info:`);
  terminal.writeln(`  - Folder id: ${createResponse.data.id}`);
  terminal.writeln(`  - Folder name: ${createResponse.data.name}`);
  terminal.writeln(`  - Folder path: ${createResponse.data.path}`);
  terminal.writeln(`  - Created at: ${new Date(createResponse.data.createdAt).toLocaleDateString('pt-PT')} - ${new Date(createResponse.data.updatedAt).toLocaleTimeString('pt-PT')}`);
  prompt();
}

const renameFolder = async (args) => {
  if (!args[0] || !args[1]) {
    terminal.writeln('Folder id and new folder name are required');
    return;
  }

  const folderId = args[0];
  const newFolderName = args[1];

  const renameResponse = await $folderStore.renameFolder(folderId, newFolderName);
  if (renameResponse.error) {
    terminal.writeln(renameResponse.message);
    prompt();
    return;
  }

  terminal.writeln(`Folder ${folderId} renamed to ${newFolderName} successfully.`);
  prompt();
}

const removeFolder = async(args) => {
  if (!args[0]) {
    terminal.writeln('Folder id is required');
    return;
  }

  const folderId = args[0];
  const removeResponse = await $folderStore.deleteFolder(folderId);
  if (removeResponse.error) {
    terminal.writeln(removeResponse.message);
    prompt();
    return;
  }

  terminal.writeln(`Folder ${folderId} removed successfully.`);
  prompt();
}

const listFolders = async () => {
  const folders = await $folderStore.getFolders();

  folders.forEach((folder, index) => {

    if (index === 0) {
      terminal.write(`  ID`);
      for (let i = 0; i < 20 - folder.id.length; i++) {
        terminal.write(' ');
      }
      terminal.write(`  NAME`);
      for (let i = 0; i < 20 - folder.name.length; i++) {
        terminal.write(' ');
      }
      terminal.writeln(` `);
    }

    terminal.write(`  ${folder.id}`);
    for (let i = 0; i < 20 - folder.id.length; i++) {
      terminal.write(' ');
    }

    terminal.write(`  ${folder.name}`);
    for (let i = 0; i < 20 - folder.name.length; i++) {
      terminal.write(' ');
    }

    terminal.writeln(`  ${folder.path}`);

  });

  prompt();

}

const downloadFile = async (args) => {
  if (!args[0]) {
    terminal.writeln('File id is required');
    return;
  }

  const fileId = args[0];
  const file = await $folderStore.findFileById(fileId);

  if (file.error) {
    terminal.writeln(file.message);
    prompt();
    return;
  }
  
  const downloadResponse = await $folderStore.downloadFile(file.data);
  if (downloadResponse.error) {
    terminal.writeln(downloadResponse.message);
    prompt();
    return;
  }

  terminal.writeln(`File ${fileId} downloaded started.`);
  prompt();

}

</script>

<style>
.terminal-container {
  box-sizing: border-box; 
}

.xterm-screen {
  padding: 0 20px !important;
  box-sizing: border-box;
}

.xterm {
  height: 100%;
}

.xterm-viewport {
  overflow-y: auto !important;
}

.xterm-rows span {
  font-size: 12px !important;
}

.xterm .xterm-viewport {
  padding-top: 20px;
  padding-bottom: 30px;
}
</style>
