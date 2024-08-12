import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { dateSelected, ScrapeData } from './helpers/generalTypes'

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
  
  saveFile: () => ipcRenderer.invoke('dialog:saveFile'),
  
  callFront: (callback) => ipcRenderer.on('call-front', (_event, value) => callback(value)),
  
  isLoading: (callback) => ipcRenderer.on('is-loading', (_event, value) => callback(value)),
  
  loginError: (callback) => ipcRenderer.on('login-error', (_event, value) => callback(value)),

  scrapeData: (scrapeData: ScrapeData) => ipcRenderer.send('scrape-data', scrapeData)


}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
