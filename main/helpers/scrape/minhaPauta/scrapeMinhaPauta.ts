import { excelDataIdentified } from "../../audiencias";
import { PuppeteerCallback, ScrapeData, credentials, dateSelected } from "../../generalTypes";
import { consumeMinhaPautaApi } from "./consumeMinhaPautaApi";

async function scrapeMinhaPauta(painel: ScrapeData["painel"], dateSelected: dateSelected, credentials: credentials, grau: string, trt: number, startPuppeteer: PuppeteerCallback, mainWindow: Electron.CrossProcessExports.BrowserWindow) {


    let apiResponse: excelDataIdentified | "loginError"

    const listOfExcelData: excelDataIdentified[] = []


    apiResponse = await consumeMinhaPautaApi(painel, dateSelected, 'primeirograu', trt, credentials, startPuppeteer, mainWindow)
    
    if (apiResponse == "loginError") {
        return
    }

    listOfExcelData.push(apiResponse)

    apiResponse = await consumeMinhaPautaApi(painel, dateSelected, 'segundograu', trt, credentials, startPuppeteer, mainWindow)
    
    if (apiResponse == "loginError") {
        return
    }
   
    listOfExcelData.push(apiResponse)

    return listOfExcelData

}


export { scrapeMinhaPauta }