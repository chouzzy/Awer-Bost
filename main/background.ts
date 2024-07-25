import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import puppeteer from 'puppeteer';
import PCR from "puppeteer-chromium-resolver";

// import MainBost from './helpers/main-bost';
import exceljs from 'exceljs'
import MainBost from './helpers/main-bost';
import { userDataProps } from './helpers/bostTypes';


const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

; (async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 640,
    height: 840,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const options = {};
  const stats = await PCR(options);


  // PRODUÇÃO
  if (isProd) {

    await mainWindow.loadURL('app://./home')
    const workbook = new exceljs.Workbook();
    const homeDir = require('os').homedir()
    const desktopDir = `${homeDir}/Desktop`

    try {
      const browser = await stats.puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
        executablePath: stats.executablePath
      }).catch(function (error) {
        console.log(error);
      });

      ipcMain.on('send-userData', async (event, userData: userDataProps) => {
        console.log(userData)
  
        await MainBost(userData, mainWindow, browser)
  
        app.quit()
      })
    } catch (error) {
      // Escreve o erro na célula A1 da planilha "teste.xlsx"
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Planilha1');
      worksheet.getCell('A1').value = error.message;
      await workbook.xlsx.writeFile(`${desktopDir}/testeCatch2.xlsx`);

      // Opcional: Exibe o erro no console para análise
      console.error(error);

      await workbook.xlsx.writeFile(`${desktopDir}/testeSuccess2.xlsx`);
    }

  }
  // DSESENVOLVIMENTO
  else {

    console.log('Modo de desenvolvimento: ativado.')
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)

    const browser = await stats.puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
      executablePath: stats.executablePath
    }).catch(function (error) {
      console.log(error);
    });

    // ABRE AS DEVTOOLS NO APP
    // mainWindow.webContents.openDevTools()

    ipcMain.on('send-userData', async (event, userData: userDataProps) => {
      console.log(userData)

      await MainBost(userData, mainWindow, browser)

      // app.quit()
    })

  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})



