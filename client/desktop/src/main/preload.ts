import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  webFrame,
} from 'electron';

export type Channels =
  | 'ipc-example'
  | 'webview-message'
  | 'close'
  | 'selectServer'
  | '$mount-webview'
  | '$unmount-webview'
  | '$update-webview-rect'
  | '$show-webview'
  | '$hide-webview'
  | '$hide-all-webview'
  | '$clear-all-webview';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    async getDesktopCapturerSource(): Promise<Electron.DesktopCapturerSource> {
      const source = await ipcRenderer.invoke('DESKTOP_CAPTURER_GET_SOURCES');

      return source;
    },
  },
});

const postMessageOverride = `window.postMessage = function (data) {
  window.electron.ipcRenderer.sendMessage('webview-message', JSON.stringify(data));
};`;

webFrame.executeJavaScript(postMessageOverride);
