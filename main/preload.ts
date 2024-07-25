import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { userDataProps } from './helpers/bostTypes'



const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },


  isLoading: (callback) => ipcRenderer.on('is-loading', (_event, value) => callback(value)),

  consoleMessages: (callback) => ipcRenderer.on('console-messages', (_event, value) => callback(value)),

  saveFile: () => ipcRenderer.invoke('dialog:saveFile'),
  
  sendUserData: (userData: userDataProps) => ipcRenderer.send('send-userData', userData),

}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler

