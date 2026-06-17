import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openAudioDialog: () => ipcRenderer.invoke('dialog:openAudio'),
  openImageDialog: () => ipcRenderer.invoke('dialog:openImage'),
  getDataPath: () => ipcRenderer.invoke('app:getDataPath'),
})

declare global {
  interface Window {
    electronAPI: {
      openAudioDialog: () => Promise<{ filePath: string; fileName: string; size: number } | null>
      openImageDialog: () => Promise<string | null>
      getDataPath: () => Promise<string>
    }
  }
}
