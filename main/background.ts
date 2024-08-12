import path from 'path'
import { app, dialog, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import PCR from "puppeteer-chromium-resolver";

// import MainBost from './helpers/main-bost';
import exceljs from 'exceljs'
import MainBost from './helpers/main-bost';
import { dateSelected, ScrapeData } from './helpers/generalTypes';


const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

; (async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    icon:'./app/images/logos/boTRT-icon.ico',
    // simpleFullscreen:true,
    autoHideMenuBar:true,
    height:1290,
    width:980,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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

      ipcMain.on('scrape-data', async (event, scrapeData: ScrapeData) => {
        console.log('Dados recebidos do processo renderizador:', scrapeData);
        mainWindow.webContents.send('is-loading', true)
        await MainBost(scrapeData, mainWindow)
  
      });
      // ... continue com o código que utiliza o navegador ...
    } catch (error) {
      // Escreve o erro na célula A1 da planilha "teste.xlsx"
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Planilha1');
      worksheet.getCell('A1').value = error.message;
      await workbook.xlsx.writeFile(`${desktopDir}/testeCatch2.xlsx`);
    }
  }
  // DSESENVOLVIMENTO
  else {

    console.log('Modo de desenvolvimento: ativado.')
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    // mainWindow.webContents.openDevTools()


    ipcMain.on('scrape-data', async (event, scrapeData: ScrapeData) => {
      console.log('Dados recebidos do processo renderizador:', scrapeData);
      mainWindow.webContents.send('is-loading', true)
      await MainBost(scrapeData, mainWindow)

    });
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})




