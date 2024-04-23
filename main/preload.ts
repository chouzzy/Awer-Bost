import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { dateSelected } from './helpers/generalTypes'

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

  sendMessage: (message: string) => ipcRenderer.send('send-message', message),
  dateSelected: (date: dateSelected) => ipcRenderer.send('date-selected', date),
  saveFile: () => ipcRenderer.invoke('dialog:saveFile')
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
