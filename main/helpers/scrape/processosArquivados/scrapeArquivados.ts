import { excelDataIdentified } from "../../audiencias";
import { PuppeteerCallback, ScrapeData, credentials, dateSelected } from "../../generalTypes";
import { ConsumeProcessosArquivadosApi } from "./consumeProcessosArquivadosApi";

async function scrapeArquivados(painel: ScrapeData["painel"], dateSelected: dateSelected, credentials: credentials, grau: string, trt: number, startPuppeteer: PuppeteerCallback, mainWindow: Electron.CrossProcessExports.BrowserWindow) {


    let apiResponse: excelDataIdentified | "loginError"


    const listOfExcelData: excelDataIdentified[] = []
    apiResponse = await ConsumeProcessosArquivadosApi(painel, dateSelected, 'primeirograu', trt, credentials, startPuppeteer, mainWindow)

    if (apiResponse == "loginError") {
        return
    }

    listOfExcelData.push(apiResponse)

    apiResponse = await ConsumeProcessosArquivadosApi(painel, dateSelected, 'segundograu', trt, credentials, startPuppeteer, mainWindow)

    if (apiResponse == "loginError") {
        return
    }

    listOfExcelData.push(apiResponse)

    return listOfExcelData

}


export { scrapeArquivados }