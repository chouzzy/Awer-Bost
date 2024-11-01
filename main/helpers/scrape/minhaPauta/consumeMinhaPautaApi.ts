import { unescape } from "he";
import { AudienciaSimplificada, excelDataIdentified } from "../../types/audiencias";
import { credentials, dateSelected, PuppeteerCallback, ScrapeData } from "../../types/generalTypes";
import { scrapeURL } from "../scrapeURL";
import { ApiMinhaPautaResponse } from "./apiMinhaPautaTypes";
import { timeoutDelay } from "../../converters/timeOutDelay";


export async function consumeMinhaPautaApi(
    painel: ScrapeData["painel"],
    dateSelected: dateSelected,
    grau: string,
    trt: number,
    credentials: credentials,
    startPuppeteer: PuppeteerCallback,
    mainWindow: Electron.CrossProcessExports.BrowserWindow
) {

    try {


        const { page, browser } = await startPuppeteer(false)

        try {
            try {

                await page.goto(`https://pje.trt${trt}.jus.br/${grau}/login.seam`);
                // await page.waitForNavigation({timeout:60000})
            } catch (error) {
                console.log('error')
                console.log(error)
            } finally {
                console.log('oi')
            }
            await page.waitForSelector('#btnEntrar', { visible: true })


            mainWindow.webContents.send(
                'progress-messages',
                `Buscando dados no TRT-${trt}...`
            );
        } catch (error) {

            const identifier: excelDataIdentified["identifier"] = {
                trt: `TRT-${trt}`,
                grau: grau
            }

            const loginErrorJson: excelDataIdentified = {
                excelData: [{
                    type: 'Minha pauta',
                    usuario:credentials.user,
                    numeroProcesso: 'Erro de autenticação',
                    orgaoJulgador: 'Erro de autenticação',
                    tipoAudiencia: 'Erro de autenticação',
                    dataInicio: 'Erro de autenticação',
                    dataFim: 'Erro de autenticação',
                    poloAtivo: 'Erro de autenticação',
                    poloPassivo: 'Erro de autenticação',
                }],
                identifier
            }

            mainWindow.webContents.send(
                'progress-messages',
                `Ocorreu um erro de autenticação no TRT-${trt}, seguindo para o próximo da lista...`
            );

            await browser.close()

            return loginErrorJson

        }

        // LOGIN TRT
        const { user, password } = credentials

        await page.type('#username', user);
        await page.type('#password', password);


        await page.click('#btnEntrar')

        try {
            await page.waitForSelector('#brasao-republica', { visible: true })
        } catch (error) {


            const identifier: excelDataIdentified["identifier"] = {
                trt: `TRT-${trt}`,
                grau: grau
            }

            const loginErrorJson: excelDataIdentified = {
                excelData: [{
                    type: 'Minha pauta',
                    usuario:credentials.user,
                    numeroProcesso: 'Erro de autenticação',
                    orgaoJulgador: 'Erro de autenticação',
                    tipoAudiencia: 'Erro de autenticação',
                    dataInicio: 'Erro de autenticação',
                    dataFim: 'Erro de autenticação',
                    poloAtivo: 'Erro de autenticação',
                    poloPassivo: 'Erro de autenticação',
                }],
                identifier
            }

            mainWindow.webContents.send(
                'progress-messages',
                `Ocorreu um erro de autenticação no TRT-${trt}, seguindo para o próximo da lista...`
            );


            await browser.close()

            return loginErrorJson
        }


        try {

            const url = await scrapeURL(painel, trt, 1000, grau, dateSelected)


            await page.goto(url);

            try {
                await page.waitForSelector('pre');


            } catch (error) {
                throw error
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
                        usuario:credentials.user,
                        numeroProcesso: 'erro',
                        orgaoJulgador: 'erro',
                        tipoAudiencia: 'erro',
                        dataInicio: 'erro',
                        dataFim: 'erro',
                        poloAtivo: 'erro',
                        poloPassivo: 'erro',
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
                        usuario:credentials.user,
                        numeroProcesso: '',
                        orgaoJulgador: '',
                        tipoAudiencia: '',
                        dataInicio: '',
                        dataFim: '',
                        poloAtivo: '',
                        poloPassivo: '',
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
                    usuario:credentials.user,
                    numeroProcesso: audit.processo.numero,
                    tipoAudiencia: unescape(audit.tipo.descricao),
                    orgaoJulgador: unescape(audit.processo.orgaoJulgador.descricao),
                    dataInicio: audit.dataInicio,
                    dataFim: audit.dataFim,
                    poloAtivo: audit.poloAtivo.nome,
                    poloPassivo: audit.poloPassivo.nome,
                    urlAudienciaVirtual: audit.urlAudienciaVirtual
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
                    usuario:credentials.user,
                    numeroProcesso: 'erro',
                    orgaoJulgador: 'erro',
                    tipoAudiencia: 'erro',
                    dataInicio: 'erro',
                    dataFim: 'erro',
                    poloAtivo: 'erro',
                    poloPassivo: 'erro',
                }],
                identifier
            }
            return emptyJson
        }

    } catch (error) {
        throw error
    }

}