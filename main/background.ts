import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import puppeteer from 'puppeteer';
import PCR from "puppeteer-chromium-resolver";

import goToGoogle from './helpers/go-to-google';
// import MainBost from './helpers/main-bost';
import MainBost2 from './helpers/main-bost-2';
import exceljs from 'exceljs'


const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

; (async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const options = {};
  const stats = await PCR(options);

  

  await mainWindow.loadURL('app://./home')
  const workbook = new exceljs.Workbook();
  const homeDir = require('os').homedir()
  const desktopDir = `${homeDir}/Desktop`

  try {


    const browser = await stats.puppeteer.launch({
      headless: false,
      args: ["--no-sandbox"],
      executablePath: stats.executablePath
    }).catch(function (error) {
      console.log(error);
    });

    const page = await browser.newPage();

    await page.goto('https://www.iobonline.com.br/index/login');
    // ... continue com o código que utiliza o navegador ...
  } catch (error) {
    // Escreve o erro na célula A1 da planilha "teste.xlsx"
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Planilha1');
    worksheet.getCell('A1').value = error.message;
    await workbook.xlsx.writeFile(`${desktopDir}/testeCatch2.xlsx`);

    // Opcional: Exibe o erro no console para análise
    console.error(error);
  }

  await workbook.xlsx.writeFile(`${desktopDir}/testeSuccess2.xlsx`);



  setTimeout(() => {

    app.quit()
  }, 10000)



  // if (isProd) {
  //   await mainWindow.loadURL('app://./home')

  //   ipcMain.on('send-message', async (event, message) => {
  //     console.log(message)

  //     // await openApp()
  //     // await MainBost(message)
  //     await MainBost2(message)
  //   })


  // } else {
  //   const port = process.argv[2]
  //   await mainWindow.loadURL(`http://localhost:${port}/home`)
  //   mainWindow.webContents.openDevTools()

  // }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})



