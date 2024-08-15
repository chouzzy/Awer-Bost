import { dialog, ipcMain } from 'electron';

import exceljs from 'exceljs'
import PCR from "puppeteer-chromium-resolver";
import { trtDict } from './trtDict';
import { writeData } from './writeData';
import { scrapeMinhaPauta } from './scrape/minhaPauta/scrapeMinhaPauta';
import { credentials, PuppeteerResult, ScrapeData } from './generalTypes';
import { excelDataIdentified } from './audiencias';
import { scrapeArquivados } from './scrape/processosArquivados/scrapeArquivados';

export default async function MainBost(scrapeData: ScrapeData, mainWindow: Electron.CrossProcessExports.BrowserWindow) {

    const { username, password, trt, painel, date } = scrapeData

    const trtSubmitted: number = trtDict[trt]

    const credentials: credentials = {
        user: username,
        password: password
        // 15992496858
        // Bqq188332@
    }

    async function timeoutDelay(seconds: number) {
        setTimeout(async () => {

            return true
        }, seconds * 1000)

        return true
    }

    async function acceptCookies(page) {
        const acceptCookieButton = '#onetrust-reject-all-handler';
        await page.waitForSelector(acceptCookieButton);
        await page.click(acceptCookieButton);
        await timeoutDelay(3);
    }

    async function searchInput(page, inputText) {
        const inputSearch = 'input#txtBusca';
        await page.waitForSelector(inputSearch);
        await page.type(inputSearch, inputText);
        await timeoutDelay(2);
    }

    async function closeBrowser(browser) {
        try {
            await browser.close();
        } catch (error) {
        }
    }

    async function getExcelNCMs(worksheet: exceljs.Worksheet) {

        // LER OS NCMS DA PLANILHA E RETORNAR NO ARRAY
        const jsonNCMs: exceljs.CellValue[] | { [key: string]: exceljs.CellValue; } = []

        worksheet.eachRow(function (row, rowNumber) {

            if (rowNumber > 1) {
                jsonNCMs.push(JSON.stringify(row.values[1]))

            }
        });

        // Retornar o JSON
        return jsonNCMs;
    }

    async function startPuppeteer(headless: boolean): Promise<PuppeteerResult> {


        const options = {};
        const stats = await PCR(options);

        const browser = await stats.puppeteer.launch({
            headless: headless,
            args: [
                "--no-sandbox",
                '--disable-web-security',
            ],
            executablePath: stats.executablePath
        }).catch(function (error) {
        });

        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 720,
        });
        await page.setBypassCSP(true)

        return { page, browser }
    }

    let listOfExcelData: excelDataIdentified[]

    switch (painel) {
        case "Minha pauta":

            listOfExcelData = await scrapeMinhaPauta(painel, date, credentials, 'primeirograu', trtSubmitted, startPuppeteer, mainWindow)

            mainWindow.webContents.send('is-loading', false)
            
            mainWindow.webContents.send('process-finished', true)


            ipcMain.on('save-excel', async (event) => {

                const { canceled, filePaths } = await dialog.showOpenDialog({
                    properties: ['openDirectory']
                })

                if (!canceled) {

                    await writeData(listOfExcelData, filePaths, painel)
                }

            })

            break;

        case 'Processos arquivados':

            listOfExcelData = await scrapeArquivados(painel, date, credentials, 'primeirograu', trtSubmitted, startPuppeteer, mainWindow)

            mainWindow.webContents.send('is-loading', false)

            mainWindow.webContents.send('process-finished', true)

            ipcMain.on('save-excel', async (event) => {

                const { canceled, filePaths } = await dialog.showOpenDialog({
                    properties: ['openDirectory']
                })

                if (!canceled) {

                    await writeData(listOfExcelData, filePaths, painel)
                }

            })

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
// }