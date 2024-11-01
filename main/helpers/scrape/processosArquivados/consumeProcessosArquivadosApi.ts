import { Browser, Page } from "puppeteer";
import { credentials, dateSelected, PuppeteerCallback, ScrapeData } from "../../types/generalTypes";
import { scrapeURL } from "../scrapeURL";
import { apiResponseArquivadosProps, AudienciaSimplificada, excelDataIdentified, ProcessosArquivadosSimplificado } from "../../types/audiencias";
import { unescape } from "he";
import { navTimeout } from "../../puppeteer/timeout";


export async function ConsumeProcessosArquivadosApi(
    painel: ScrapeData["painel"],
    grau: string,
    trt: number,
    credentials: credentials,
    startPuppeteer: PuppeteerCallback,
    mainWindow: Electron.CrossProcessExports.BrowserWindow
):Promise<apiResponseArquivadosProps> {

    try {

        const { page, browser } = await startPuppeteer(false)
        let urlInterceptedID = ''


        try {


            try {

                await page.goto(`https://pje.trt${trt}.jus.br/${grau}/login.seam`);
                // await page.waitForNavigation({timeout:60000})
            } catch (error) {
            } finally {
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


            const loginErrorJson: apiResponseArquivadosProps = {
                excelData: [{
                    type: 'Processos arquivados',
                    usuario:credentials.user,
                    numeroProcesso: 'Erro de autenticação',
                    nomeParteAutora: 'Erro de autenticação',
                    nomeParteRe: 'Erro de autenticação',
                    dataArquivamento: 'Erro de autenticação',
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


            const loginErrorJson: apiResponseArquivadosProps = {
                excelData: [{
                    type: 'Processos arquivados',
                    usuario:credentials.user,
                    numeroProcesso: 'Erro de autenticação',
                    nomeParteAutora: 'Erro de autenticação',
                    nomeParteRe: 'Erro de autenticação',
                    dataArquivamento: 'Erro de autenticação',
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
            await navTimeout(page)

            await page.setRequestInterception(true);

            (async () => {

                page.on('request', interceptedRequest => {

                    if (interceptedRequest.url().includes(`https://pje.trt${trt}.jus.br/pje-comum-api/api/paineladvogado/`)) {

                        const regex = /\/paineladvogado\/(\d+)/;
                        const interceptedUrl = interceptedRequest.url()
                        const match = interceptedUrl.match(regex);
                        urlInterceptedID = match[1]

                        interceptedRequest.continue()
                        return urlInterceptedID
                    }
                    else {
                        interceptedRequest.continue()

                    }
                });
            })();

            await page.goto(`https://pje.trt${trt}.jus.br/pjekz/painel/usuario-externo/arquivados`)

            await page.waitForSelector("#mat-select-value-1 > span", { visible: true })

            const url = await scrapeURL(painel, trt, 1000, grau, undefined, urlInterceptedID)
            await page.goto(url);

            try {
                await page.waitForSelector('pre');

            } catch (error) {
                throw error
            }

            const html = await page.$eval('pre', el => el.textContent);

            const json: ApiProcessosArquivadosResponse = JSON.parse(html);

            await new Promise(resolve => setTimeout(resolve, 3000));

            const identifier: excelDataIdentified["identifier"] = {
                trt: `TRT-${trt}`,
                grau: grau
            }

            if (json.codigoErro == "ARQ-516") {

                const emptyJson: apiResponseArquivadosProps = {
                    excelData: [{
                        type: 'Processos arquivados',
                        usuario:credentials.user,
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

                const emptyJson: apiResponseArquivadosProps = {
                    excelData: [{
                        type: 'Processos arquivados',
                        usuario:credentials.user,
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
                    usuario:credentials.user,
                    numeroProcesso: unescape(audit.numeroProcesso),
                    nomeParteAutora: unescape(audit.nomeParteAutora),
                    nomeParteRe: unescape(audit.nomeParteRe),
                    dataArquivamento: unescape(audit.dataArquivamento),
                });
            });

            const excelDataIdentified = {
                excelData,
                identifier
            }
            await browser.close()


            return excelDataIdentified

        } catch (error) {
            await browser.close()

            const identifier: apiResponseArquivadosProps["identifier"] = {
                trt: `TRT-${trt}`,
                grau: grau
            }

            const emptyJson:apiResponseArquivadosProps = {
                excelData: [{
                    type: 'Processos arquivados',
                    usuario:credentials.user,
                    numeroProcesso: 'erro',
                    nomeParteAutora: 'erro',
                    nomeParteRe: 'erro',
                    dataArquivamento: 'erro',
                }],
                identifier
            }
            return emptyJson
        }

    } catch (error) {
        throw error
    }

}