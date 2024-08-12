import { Browser, Page } from "puppeteer";
import { credentials, dateSelected, PuppeteerCallback, ScrapeData } from "../../generalTypes";
import { scrapeURL } from "../scrapeURL";
import { AudienciaSimplificada, excelDataIdentified, ProcessosArquivadosSimplificado } from "../../audiencias";
import { unescape } from "he";
import { navTimeout } from "../../timeout";


export async function ConsumeProcessosArquivadosApi(
    painel: ScrapeData["painel"],
    dateSelected: dateSelected,
    grau: string,
    trt: number,
    credentials: credentials,
    startPuppeteer: PuppeteerCallback,
    mainWindow: Electron.CrossProcessExports.BrowserWindow
) {

    const { page, browser } = await startPuppeteer(false)

    await page.goto(`https://pje.trt${trt}.jus.br/${grau}/login.seam`);
    // await page.waitForNavigation({timeout:2000})

    try {

        await page.waitForSelector('#btnEntrar', { visible: true })
    } catch (error) {
        mainWindow.webContents.send('login-error', false)
        return 'loginError'
    }

    // LOGIN TRT
    const { user, password } = credentials

    await page.type('#username', user);
    await page.type('#password', password);


    await page.click('#btnEntrar')



    try {
        await page.waitForSelector('#brasao-republica', { visible: true })
    } catch (error) {
        mainWindow.webContents.send('login-error', false)
        return 'loginError'
    }

    try {
        await navTimeout(page)
        const url = await scrapeURL(painel, dateSelected, trt, 15, grau)
        console.log('url')
        console.log(url)

        await page.goto(url);

        try {
            await page.waitForSelector('pre');

        } catch (error) {
            console.log('erro-entrar')
        }

        const html = await page.$eval('pre', el => el.textContent);

        const json: ApiProcessosArquivadosResponse = JSON.parse(html);

        await new Promise(resolve => setTimeout(resolve, 3000));

        const identifier: excelDataIdentified["identifier"] = {
            trt: `TRT-${trt}`,
            grau: grau
        }

        if (json.codigoErro == "ARQ-516") {

            const emptyJson: excelDataIdentified = {
                excelData: [{
                    type: 'Processos arquivados',
                    numeroProcesso: 'erro',
                    nomeParteAutora: 'erro',
                    nomeParteRe: 'erro',
                    dataArquivamento: 'erro',
                }],
                identifier
            }

            await browser.close()

            return emptyJson
        }

        if (json.totalRegistros == 0) {

            const emptyJson: excelDataIdentified = {
                excelData: [{
                    type: 'Processos arquivados',
                    numeroProcesso: '',
                    nomeParteAutora: '',
                    nomeParteRe: '',
                    dataArquivamento: '',
                }],
                identifier
            }

            await browser.close()

            return emptyJson
        }

        const excelData: ProcessosArquivadosSimplificado[] = []; // Inicializando um array vazio

        json.resultado.forEach(audit => {
            excelData.push({
                type: 'Processos arquivados',
                numeroProcesso: unescape(audit.numeroProcesso),
                nomeParteAutora: unescape(audit.nomeParteAutora),
                nomeParteRe: unescape(audit.nomeParteRe),
                dataArquivamento: unescape(audit.dataArquivamento),
            });
        });


        await browser.close()

        const excelDataIdentified: excelDataIdentified = {
            excelData,
            identifier
        }

        return excelDataIdentified

    } catch {

        await browser.close()

        const identifier: excelDataIdentified["identifier"] = {
            trt: `TRT-${trt}`,
            grau: grau
        }

        const emptyJson: excelDataIdentified = {
            excelData: [{
                type: 'Processos arquivados',
                numeroProcesso: 'erro',
                nomeParteAutora: 'erro',
                nomeParteRe: 'erro',
                dataArquivamento: 'erro',
            }],
            identifier
        }
        return emptyJson
    }

}