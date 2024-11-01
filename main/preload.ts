import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { dateSelected, importDataProps, ScrapeData } from './helpers/types/generalTypes'

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
  // ipcMain.handle('dialog:saveFile', async () => {
  // })

  callFront: (callback) => ipcRenderer.on('call-front', (_event, value) => callback(value)),

  isLoading: (callback) => ipcRenderer.on('is-loading', (_event, value) => callback(value)),
  
  loginError: (callback) => ipcRenderer.on('login-error', (_event, value) => callback(value)),
  
  scrapeData: (scrapeData: ScrapeData) => ipcRenderer.send('scrape-data', scrapeData),
  
  saveExcel: async () => ipcRenderer.send('save-excel'),
  
  processFinished: (callback) => ipcRenderer.on('process-finished', (_event, value) => callback(value)),
  
  sendExcelPath: async ({ excelPath, operationType }: importDataProps) => ipcRenderer.send('send-excel-path', { excelPath, operationType }),
  
  progressPercentual: (callback) => ipcRenderer.on('progress-percentual', (_event, value) => callback(value)),

  processosEncontrados: (callback) => ipcRenderer.on('processos-encontrados', (_event, value) => callback(value)),

  invalidExcelFormat: (callback) => ipcRenderer.on('invalid-excel-format', (_event, value) => callback(value)),

  progressMessagesDetails: (callback) => ipcRenderer.on('progress-messages', (_event, value) => callback(value)),
}

contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
