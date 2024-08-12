import { Browser, Page } from "puppeteer";
import { unescape } from "he";
import { AudienciaSimplificada, excelDataIdentified } from "../../audiencias";
import { credentials, dateSelected, PuppeteerCallback, ScrapeData } from "../../generalTypes";
import { scrapeURL } from "../scrapeURL";
import { ApiMinhaPautaResponse } from "./apiMinhaPautaTypes";


export async function consumeMinhaPautaApi(
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

        const json: ApiMinhaPautaResponse = JSON.parse(html);

        await new Promise(resolve => setTimeout(resolve, 3000));

        const identifier: excelDataIdentified["identifier"] = {
            trt: `TRT-${trt}`,
            grau: grau
        }

        // ERRO DE LOGIN
        if (json.codigoErro == "ARQ-516") {

            const loginErrorJson: excelDataIdentified = {
                excelData: [{
                    type: 'Minha pauta',
                    numeroProcesso: 'erro',
                    orgaoJulgador: 'erro',
                    tipoAudiencia: 'erro'
                }],
                identifier
            }

            await browser.close()

            return loginErrorJson
        }

        // EMPTY JSON
        if (json.totalRegistros == 0) {

            const emptyJson: excelDataIdentified = {
                excelData: [{
                    type: 'Minha pauta',
                    numeroProcesso: '',
                    orgaoJulgador: '',
                    tipoAudiencia: ''
                }],
                identifier
            }

            await browser.close()

            return emptyJson
        }

        const excelData: AudienciaSimplificada[] = []; // Inicializando um array vazio

        // MODELANDO JSON
        json.resultado.forEach((audit) => {
            excelData.push({
                type: 'Minha pauta',
                numeroProcesso: audit.processo.numero,
                tipoAudiencia: unescape(audit.tipo.descricao),
                orgaoJulgador: unescape(audit.processo.orgaoJulgador.descricao)
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
                type: 'Minha pauta',
                numeroProcesso: 'erro',
                orgaoJulgador: 'erro',
                tipoAudiencia: 'erro'
            }],
            identifier
        }
        return emptyJson
    }

}