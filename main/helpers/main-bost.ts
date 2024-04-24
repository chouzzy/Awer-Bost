// index.js

// O inicio do programa está em main.html

import puppeteer, { HTTPRequest } from 'puppeteer';
import { unescape } from 'he';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';

import exceljs from 'exceljs'
import { format } from 'date-fns';
import { AudienciaSimplificada, PautaAudienciaResponse } from './audiencias';
import { dateSelected } from './generalTypes';
import PCR from "puppeteer-chromium-resolver";

export default async function MainBost(dateSelectedTest: dateSelected, mainWindow: Electron.CrossProcessExports.BrowserWindow) {

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
    async function writeData(
        worksheet: exceljs.Worksheet,
        workbook: exceljs.Workbook,
        excelData: AudienciaSimplificada[],
        filePath
    ) {


        const homeDir = require('os').homedir()
        const desktopDir = `${homeDir}/Desktop`
        // Definindo os cabeçalhos das colunas
        worksheet.columns = [
            { header: 'Número do Processo', key: 'numeroProcesso', width: 25 },
            { header: 'Tipo de Audiência', key: 'tipoAudiencia', width: 30 },
            { header: 'Órgão Julgador', key: 'orgaoJulgador', width: 50 }
        ];

        // Preenchendo as células com os dados
        excelData.forEach((audiencia, index) => {
            worksheet.getRow(index + 2).values = [
                audiencia.numeroProcesso,
                audiencia.tipoAudiencia,
                audiencia.orgaoJulgador
            ];
        });

        // Salvando o arquivo Excel (adaptando o caminho do arquivo)
        const formattedDate = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
        // await workbook.xlsx.writeFile(`${desktopDir}/audiencias-${formattedDate}.xlsx`);
        await workbook.xlsx.writeFile(`${filePath}/audiencias-${formattedDate}.xlsx`);

    }

    async function startPuppeteer(headless: boolean) {
        const options = {};
        const stats = await PCR(options);

        const browser = await stats.puppeteer.launch({
            headless: headless,
            args: ["--no-sandbox"],
            executablePath: stats.executablePath
        }).catch(function (error) {
        });

        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 720,
        });

        return page
    }


    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Dados da Audiência')


    const page = await startPuppeteer(false)

    await page.goto('https://pje.trt1.jus.br/primeirograu/login.seam');
    // await page.waitForNavigation({timeout:2000})

    await page.waitForSelector('#btnEntrar', { visible: true })

    await page.type('#username', '15992496858');
    await page.type('#password', 'Bqq188332@');


    await page.click('#btnEntrar')

    await page.waitForNavigation({ waitUntil: 'networkidle2' })

    await page.goto(`https://pje.trt1.jus.br/pje-comum-api/api/pauta-usuarios-externos?dataFim=${dateSelectedTest.final.year}-${dateSelectedTest.final.month}-${dateSelectedTest.final.day}&dataInicio=${dateSelectedTest.initial.year}-${dateSelectedTest.initial.month}-${dateSelectedTest.initial.day}&codigoSituacao=M&numeroPagina=1&tamanhoPagina=15&ordenacao=asc`);

    await page.waitForSelector('pre');

    const html = await page.$eval('pre', el => el.textContent);

    const json = JSON.parse(html);

    const excelData: AudienciaSimplificada[] = []; // Inicializando um array vazio

    json.resultado.forEach(audit => {
        excelData.push({
            numeroProcesso: audit.processo.numero,
            tipoAudiencia: unescape(audit.tipo.descricao),
            orgaoJulgador: unescape(audit.processo.orgaoJulgador.descricao)
        });
    });

    mainWindow.webContents.send('is-loading', false)

    ipcMain.handle('dialog:saveFile', async () => {

        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })

        if (!canceled) {
            await writeData(worksheet, workbook, excelData, filePaths)
        }

    })



}
