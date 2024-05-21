export const fileIconMap = [
  {
    type: 'image',
    icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="#ef4444"><path d="M19 5v14H5V5zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4.86 8.86-3 3.87L9 13.14 6 17h12z"></path></svg>'
  },
  {
    type: 'pdf',
    icon: '<svg viewBox="0 0 24 24" width="24px" height="24px" fill="#ef4444"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H8V4h12zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4zm12 6V9c0-.55-.45-1-1-1h-2v5h2c.55 0 1-.45 1-1m-2-3h1v3h-1zm4 2h1v-1h-1V9h1V8h-2v5h1zm-8 0h1c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H9v5h1zm0-2h1v1h-1z"></path></svg>'
  },
  {
    type: 'doc',
    icon: '<svg viewBox="0 0 24 24" width="24px" height="24px" fill="#3b82f6"><path d="M19 5v14H5V5zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"></path><path d="M14 17H7v-2h7zm3-4H7v-2h10zm0-4H7V7h10z"></path></svg>'
  },
  {
    type: 'xls',
    icon: '<svg viewBox="0 0 16 16" fill="#22c55e" width="24px" height="24px"><path d="M14.222 0H1.778C.8 0 .008.8.008 1.778L0 4.444v9.778C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm0 7.111h-7.11v7.111H5.332v-7.11H1.778V5.332h3.555V1.778h1.778v3.555h7.111v1.778z"></path></svg>'
  },
  {
    type: 'ppt',
    icon: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#eab308" width="24px" height="24px"><path d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zM6.044 9.244v3.2h-1.6V3.556h3.823c1.36 0 1.91.266 2.489.79.577.525.8 1.218.8 2.08 0 .907-.232 1.6-.8 2.09-.57.488-1.156.728-2.49.728H6.045zm0-1.244V4.8H8.09c.587 0 1.04.222 1.333.533a1.5 1.5 0 0 1 .445 1.111c0 .49-.16.845-.445 1.112C9.138 7.83 8.8 8 8.196 8H6.044z"></path></svg>'
  },
  {
    type: 'other',
    icon: '<svg fill="#6b7280" viewBox="0 0 24 24" width="24px" height="24px"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zM6 20V4h7v5h5v11z"></path></svg>'
  }
]

export const getFileIcon = (type) => {
  const fileIcon = fileIconMap.find((icon) => icon.type === type)
  if (!fileIcon) return fileIconMap.find((icon) => icon.type === 'other').icon
  return fileIcon.icon
}

export const getFileType = (file) => {
  const mimeType = file.type;
  switch (mimeType) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
      return 'image'
    case 'application/pdf':
      return 'pdf'
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'doc'
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'xls'
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'ppt'
    case 'text/plain':
      return 'txt'
    case 'application/zip':
    case 'application/x-zip-compressed':
      return 'zip'
    default:
      return 'other'
  }
}

export const fileSizeToKb = (size) => {
  const fileInKb = size / 1024

  if (fileInKb < 1024) {
    return `${fileInKb.toFixed(2)} KB`
  }

  const fileInMb = fileInKb / 1024
  return `${fileInMb.toFixed(2)} MB`
}