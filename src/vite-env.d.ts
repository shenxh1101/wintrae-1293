/// <reference types="vite/client" />

interface ElectronAPI {
  openAudioDialog: () => Promise<{ filePath: string; fileName: string; size: number } | null>;
  openImageDialog: () => Promise<string | null>;
  getDataPath: () => Promise<string>;
}

interface Window {
  electronAPI?: ElectronAPI;
}
