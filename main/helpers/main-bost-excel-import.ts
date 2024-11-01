import { dialog, ipcMain } from 'electron';

import exceljs from 'exceljs'
import { trtDict } from './converters/trtDict';
import { scrapeMinhaPauta } from './scrape/minhaPauta/scrapeMinhaPauta';
import { processosArquivadosExcelList, scrapeDataListProps } from './types/generalTypes';
import { scrapeArquivados } from './scrape/processosArquivados/scrapeArquivados';
import { startPuppeteer } from './puppeteer/puppeteerHelpers';
import { writeMassiveData } from './export/writeMassiveData';
import { date } from 'yup';
import { apiResponseArquivadosProps } from './types/audiencias';

export default async function MainBostExcel(mainWindow: Electron.CrossProcessExports.BrowserWindow, excelPath: string, operationType: string) {

    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(excelPath);

    const worksheet = workbook.worksheets[0]

    // 15992496858
    // Bqq188332@



    switch (operationType) {

        case "Minha pauta":

            try {
                let scrapedData: any
                
                scrapedData = []

                let scrapeDataList: scrapeDataListProps[] = []

                // Verificar se as colunas têm os cabeçalhos corretos (ajuste os nomes conforme necessário)
                const expectedHeadersMinhaPauta = ['Selecione o TRT', 'Data inicial', 'Data final', 'Usuário', 'Senha'];

                if (
                    worksheet.getCell('A1').value == expectedHeadersMinhaPauta[0] &&
                    worksheet.getCell('B1').value == expectedHeadersMinhaPauta[1] &&
                    worksheet.getCell('C1').value == expectedHeadersMinhaPauta[2] &&
                    worksheet.getCell('D1').value == expectedHeadersMinhaPauta[3] &&
                    worksheet.getCell('E1').value == expectedHeadersMinhaPauta[4]

                ) { console.log('cabeçalhos ok MP') }
                else {

                    console.log('cabeçalhos errados MP')
                    mainWindow.webContents.send('is-loading', false)

                    mainWindow.webContents.send('process-finished', true)
                    mainWindow.webContents.send('invalid-excel-format', 'Erro ASC_7: Existe um problema com a planilha, verifique os cabeçalhos e tente novamente. Se o problema persistir, faça o download novamente da planilha modelo.');
                    return;
                }

                await worksheet.eachRow(async function (row, rowNumber) {

                    let trt: scrapeDataListProps["trt"]

                    // vinda do excel
                    let initialDate: string
                    // vinda do excel
                    let finalDate: string

                    let username: scrapeDataListProps["username"]
                    let password: scrapeDataListProps["password"]
                    let date: scrapeDataListProps["date"]

                    if (rowNumber > 1) {

                        trt = (JSON.stringify(row.values[1])).replace(/"/g, ''),
                            initialDate = new Date(row.values[2]).toLocaleString('en-US', { timeZone: 'UTC' });
                        finalDate = new Date(row.values[3]).toLocaleString('en-US', { timeZone: 'UTC' });
                        username = (JSON.stringify(row.values[4])).replace(/"/g, ''),
                            password = (JSON.stringify(row.values[5])).replace(/"/g, ''),



                            date = {
                                initial: {
                                    day: new Date(initialDate).getDate().toString().padStart(2, '0'),
                                    month: (new Date(initialDate).getMonth() + 1).toString().padStart(2, '0'),
                                    year: new Date(initialDate).getFullYear().toString(),
                                },
                                final: {
                                    day: new Date(finalDate).getDate().toString().padStart(2, '0'),
                                    month: (new Date(finalDate).getMonth() + 1).toString().padStart(2, '0'),
                                    year: new Date(finalDate).getFullYear().toString(),
                                }
                            }


                        scrapeDataList.push({
                            trt,
                            trtNumber: trtDict[trt],
                            username,
                            password,
                            date
                        })

                    }
                });


                try {
                    scrapedData = [];
                    let processedData = [];

                    const totalItems = scrapeDataList.length;
                    let processedItems = 0;

                    for (const scrapeData of scrapeDataList) {

                        const { trtNumber, date, username, password } = scrapeData;
                        processedData = await scrapeMinhaPauta(
                            operationType,
                            date,
                            { user: username, password },
                            trtNumber,
                            startPuppeteer,
                            mainWindow
                        );
                        scrapedData.push(processedData);

                        processedItems++;
                        const progress = Math.round((processedItems / totalItems) * 100);

                        mainWindow.webContents.send('progress-percentual', `${progress}`);
                    }

                } catch (error) {

                    mainWindow.webContents.send('is-loading', false)

                    mainWindow.webContents.send('process-finished', true)

                    mainWindow.webContents.send('invalid-excel-format', 'Erro ASC_5: Houve um erro inesperado. Por favor, tente novamente. Caso o problema persista, entre em contato com o desenvolvedor.');

                }

                const totalElements = scrapedData.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.length;
                }, 0);


                mainWindow.webContents.send('processos-encontrados', Number(totalElements));

                mainWindow.webContents.send('is-loading', false)

                mainWindow.webContents.send('process-finished', true)

                ipcMain.on('save-excel', async (event) => {

                    const { canceled, filePaths } = await dialog.showOpenDialog({
                        properties: ['openDirectory']
                    })

                    if (!canceled) {
                        await writeMassiveData(scrapedData, filePaths, operationType)
                    }

                })

            } catch (error) {

                mainWindow.webContents.send('is-loading', false)

                mainWindow.webContents.send('process-finished', true)

                mainWindow.webContents.send('invalid-excel-format', 'Erro ASC_4:Houve um erro inesperado. Por favor, tente novamente. Caso o problema persista, entre em contato com o desenvolvedor.');

                return
            }

            break;

        case 'Processos arquivados':

            try {

                let scrapedData: apiResponseArquivadosProps[][]

                scrapedData = []

                let processosArquivadosExcelList: processosArquivadosExcelList[] = []

                // Verificar se as colunas têm os cabeçalhos corretos (ajuste os nomes conforme necessário)
                const expectedHeadersProcessosArquivados = ['Selecione o TRT', 'Data inicial', 'Data final', 'Usuário', 'Senha'];
                if (
                    worksheet.getCell('A1').value == expectedHeadersProcessosArquivados[0] &&
                    worksheet.getCell('B1').value == expectedHeadersProcessosArquivados[1] &&
                    worksheet.getCell('C1').value == expectedHeadersProcessosArquivados[2] &&
                    worksheet.getCell('D1').value == expectedHeadersProcessosArquivados[3] &&
                    worksheet.getCell('E1').value == expectedHeadersProcessosArquivados[4]

                ) { console.log('cabeçalhos ok MP') }
                else {

                    console.log('cabeçalhos errados MP')
                    mainWindow.webContents.send('is-loading', false)

                    mainWindow.webContents.send('process-finished', true)
                    mainWindow.webContents.send('invalid-excel-format', 'Erro ASC_1: Existe um problema com a planilha, verifique os cabeçalhos e tente novamente. Se o problema persistir, faça o download novamente da planilha modelo.');
                    return;
                }

                await worksheet.eachRow(async function (row, rowNumber) {

                    let trt: processosArquivadosExcelList["trt"]
                    // vinda do excel
                    let initialDate: string
                    // vinda do excel
                    let finalDate: string
                    let username: processosArquivadosExcelList["username"]
                    let password: processosArquivadosExcelList["password"]
                    let date: processosArquivadosExcelList["date"]

                    if (rowNumber > 1) {

                        trt = (JSON.stringify(row.values[1])).replace(/"/g, ''),
                            initialDate = new Date(row.values[2]).toLocaleString('en-US', { timeZone: 'UTC' });
                        finalDate = new Date(row.values[3]).toLocaleString('en-US', { timeZone: 'UTC' });
                        username = (JSON.stringify(row.values[4])).replace(/"/g, ''),
                            password = (JSON.stringify(row.values[5])).replace(/"/g, ''),

                            date = {
                                initial: {
                                    day: new Date(initialDate).getDate().toString().padStart(2, '0'),
                                    month: (new Date(initialDate).getMonth() + 1).toString().padStart(2, '0'),
                                    year: new Date(initialDate).getFullYear().toString(),
                                },
                                final: {
                                    day: new Date(finalDate).getDate().toString().padStart(2, '0'),
                                    month: (new Date(finalDate).getMonth() + 1).toString().padStart(2, '0'),
                                    year: new Date(finalDate).getFullYear().toString(),
                                }
                            }

                        processosArquivadosExcelList.push({
                            trt,
                            trtNumber: trtDict[trt],
                            username,
                            password,
                            date
                        })

                    }
                });

                try {
                    let processedData: apiResponseArquivadosProps[]

                    const totalItems = processosArquivadosExcelList.length;
                    let processedItems = 0;

                    for (const processo of processosArquivadosExcelList) {

                        const { trtNumber, date, username, password } = processo;

                        processedData = await scrapeArquivados(
                            operationType,
                            { user: username, password },
                            trtNumber,
                            startPuppeteer,
                            mainWindow,
                            date,
                        );

                        scrapedData.push(processedData);

                        processedItems++;

                        // PROGRESSO
                        const progress = Math.round((processedItems / totalItems) * 100);

                        mainWindow.webContents.send('progress-percentual', `${progress}`);

                    }
                } catch (error) {

                    mainWindow.webContents.send('is-loading', false)

                    mainWindow.webContents.send('process-finished', true)

                    mainWindow.webContents.send('invalid-excel-format', 'Erro ASC_2: Houve um erro inesperado. Por favor, tente novamente. Caso o problema persista, entre em contato com o desenvolvedor.');

                }

                const totalElements = scrapedData.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.length;
                }, 0);


                mainWindow.webContents.send('processos-encontrados', Number(totalElements));

                mainWindow.webContents.send('is-loading', false)

                mainWindow.webContents.send('process-finished', true)



                ipcMain.on('save-excel', async (event) => {

                    const { canceled, filePaths } = await dialog.showOpenDialog({
                        properties: ['openDirectory']
                    })

                    if (!canceled) {
                        await writeMassiveData(scrapedData, filePaths, operationType)

                    }

                })

            } catch (error) {
                mainWindow.webContents.send('is-loading', false)

                mainWindow.webContents.send('process-finished', true)

                mainWindow.webContents.send('invalid-excel-format', 'Erro ASC_3: Houve um erro inesperado. Por favor, tente novamente. Caso o problema persista, entre em contato com o desenvolvedor.');

                return
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
// }