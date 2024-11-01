import { dialog, ipcMain } from 'electron';

import { trtDict } from './converters/trtDict';
import { writeData } from './export/writeData';
import { scrapeMinhaPauta } from './scrape/minhaPauta/scrapeMinhaPauta';
import { credentials, ScrapeData } from './types/generalTypes';
import { apiResponseArquivadosProps, excelDataIdentified } from './types/audiencias';
import { scrapeArquivados } from './scrape/processosArquivados/scrapeArquivados';
import { startPuppeteer } from './puppeteer/puppeteerHelpers';

export default async function MainBost(mainWindow: Electron.CrossProcessExports.BrowserWindow, scrapeData: ScrapeData) {

    const { username, password, trt, painel, date } = scrapeData

    const trtSubmitted: number = trtDict[trt]

    const credentials: credentials = {
        user: username,
        password: password
        // 15992496858
        // Bqq188332@
    }




    switch (painel) {
        case "Minha pauta":

            let listOfExcelData: excelDataIdentified[]
            try {


                listOfExcelData = []

                listOfExcelData = await scrapeMinhaPauta(painel, date, credentials, trtSubmitted, startPuppeteer, mainWindow)



                mainWindow.webContents.send('is-loading', false)

                mainWindow.webContents.send('process-finished', true)

                mainWindow.webContents.send('processos-encontrados', '1');
                // mainWindow.webContents.send('processos-encontrados', Number(listOfExcelData[0].excelData.length + listOfExcelData[1].excelData.length));

                ipcMain.on('save-excel', async (event) => {

                    const { canceled, filePaths } = await dialog.showOpenDialog({
                        properties: ['openDirectory']
                    })

                    if (!canceled) {

                        await writeData(listOfExcelData, filePaths, painel)
                    }

                })

            } catch (error) {
                throw error
            }

            break;

        case 'Processos arquivados':

            try {

                let listOfExcelData: apiResponseArquivadosProps[]

                listOfExcelData = []

                listOfExcelData = await scrapeArquivados(painel, credentials, trtSubmitted, startPuppeteer, mainWindow)


                mainWindow.webContents.send('is-loading', false)

                mainWindow.webContents.send('process-finished', true)

                mainWindow.webContents.send('processos-encontrados', '1')
                // mainWindow.webContents.send('processos-encontrados', Number(listOfExcelData[0].excelData.length + listOfExcelData[1].excelData.length))

                ipcMain.on('save-excel', async (event) => {

                    const { canceled, filePaths } = await dialog.showOpenDialog({
                        properties: ['openDirectory']
                    })

                    if (!canceled) {

                        await writeData(listOfExcelData, filePaths, painel)
                    }

                })

            } catch (error) {
                throw error
            }

        default:
            break;
    }
}










// for (let trt = 24; trt >= 1; trt--) {

//     let json = await scrapeTRT(painel, date, credentials, 'primeirograu', `${trt}`, startPuppeteer)

//     listOfExcelData.push(json)

//     if (json.excelData[0].numeroProcesso === 'erro') {
//         loginErrors.push(trt)
//         listOfExcelData.push({
//             excelData:[{
//                 numeroProcesso:`erro ${trt}`,
//                 orgaoJulgador:`erro ${trt}`,
//                 tipoAudiencia:`erro ${trt}`
//             }],
//             identifier:{
//                 grau:`${trt}`,
//                 trt:`${trt}`
//             }
//         })
//     }

//     json = await scrapeTRT(painel, date, credentials, 'segundograu', `${trt}`, startPuppeteer)

//     listOfExcelData.push(json)

//     if (json.excelData[0].numeroProcesso === 'erro') {
//         loginErrors.push(trt)
//     }
// // } async function acceptCookies(page) {
//     const acceptCookieButton = '#onetrust-reject-all-handler';
//     await page.waitForSelector(acceptCookieButton);
//     await page.click(acceptCookieButton);
//     await timeoutDelay(3);
// }

// async function searchInput(page, inputText) {
//     const inputSearch = 'input#txtBusca';
//     await page.waitForSelector(inputSearch);
//     await page.type(inputSearch, inputText);
//     await timeoutDelay(2);
// }