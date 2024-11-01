import path from 'path'
import { app, dialog, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import PCR from "puppeteer-chromium-resolver";

// import MainBost from './helpers/main-bost';
import exceljs from 'exceljs'
import MainBost from './helpers/main-bost';
import { dateSelected, importDataProps, ScrapeData } from './helpers/types/generalTypes';
import MainBostExcel from './helpers/main-bost-excel-import';


const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

; (async () => {
  await app.whenReady()

  // CRIAÇÃO DA JANELA PRINCIPAL
  const mainWindow = createWindow('main', {
    icon: './app/images/logos/boTRT-icon.ico',
    // fullscreen:true,
    minimizable: true,
    resizable: true,
    closable: true,
    simpleFullscreen: true,
    minHeight:920,
    minWidth:720,
    center:true,
    // autoHideMenuBar:true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true
    },
  })

  const options = {};
  const stats = await PCR(options);

  // PRODUÇÃO
  if (isProd) {

    await mainWindow.loadURL('app://./home')
    const homeDir = require('os').homedir()
    const desktopDir = `${homeDir}/Desktop`

    try {

      ipcMain.on('send-excel-path', async (event, importData: importDataProps) => {


        mainWindow.webContents.send('is-loading', true)

        const { excelPath, operationType } = importData

        await MainBostExcel(mainWindow, excelPath, operationType)
      });


      ipcMain.on('scrape-data', async (event, scrapeData: ScrapeData) => {
        console.log('Dados recebidos do processo renderizador:', scrapeData);
        mainWindow.webContents.send('is-loading', true)
        await MainBost(mainWindow, scrapeData)

      });
      // ... continue com o código que utiliza o navegador ...
    } catch (error) {
      // Escreve o erro na célula A1 da planilha "teste.xlsx"

      mainWindow.webContents.send('is-loading', false)

      mainWindow.webContents.send('process-finished', true)

      mainWindow.webContents.send('invalid-excel-format', 'Ocorreu um problema. Por favor, verifique a conexão e tente novamente mais tarde.');


      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Planilha1');
      worksheet.getCell('A1').value = error.message;
      await workbook.xlsx.writeFile(`${desktopDir}/testeCatch2.xlsx`);
    }
  }
  // DSESENVOLVIMENTO
  else {

    try {

      console.log('Modo de desenvolvimento: ativado.')
      const port = process.argv[2]
      await mainWindow.loadURL(`http://localhost:${port}/home`)
      // mainWindow.webContents.openDevTools()

      ipcMain.on('send-excel-path', async (event, importData: importDataProps) => {


        mainWindow.webContents.send('is-loading', true)

        const { excelPath, operationType } = importData

        await MainBostExcel(mainWindow, excelPath, operationType)
      });


      ipcMain.on('scrape-data', async (event, scrapeData: ScrapeData) => {
        console.log('Dados recebidos do processo renderizador:', scrapeData);
        mainWindow.webContents.send('is-loading', true)
        await MainBost(mainWindow, scrapeData)

      });

    } catch (error) {

      mainWindow.webContents.send('is-loading', false)

      mainWindow.webContents.send('process-finished', true)

      mainWindow.webContents.send('invalid-excel-format', 'Ocorreu um problema. Por favor, verifique a conexão e tente novamente mais tarde.');

    }
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})




