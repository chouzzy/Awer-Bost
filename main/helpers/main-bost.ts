// index.js

// O inicio do programa está em main.html

import puppeteer, { Page } from 'puppeteer';
import exceljs from 'exceljs'
import { format } from 'date-fns';
import { ScrapedMVAs, userDataProps } from './bostTypes';
import { obterNomeEstado, obterValorEstado } from './findStateValue';
import { dialog, ipcMain } from 'electron';

interface NCMData {
    ncmNumber: string;
    estadoOrigem: string;
    estadoDestino: string;
  }
  
  

export default async function MainBost(userData: userDataProps, mainWindow:Electron.CrossProcessExports.BrowserWindow, browser) {


    async function getExcelNCMs(excelPath: string) {


        const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(filePath);

        // Acessar a primeira aba da planilha
        const worksheet = workbook.worksheets[0];

        // LER OS NCMS DA PLANILHA E RETORNAR NO ARRAY
        const jsonNCMs: NCMData[] = [];

        // const jsonNCMs: exceljs.CellValue[] | { [key: string]: exceljs.CellValue; } = []
        
        worksheet.eachRow(function (row, rowNumber) {

            if (rowNumber > 1) {

                
                let origem = String( obterValorEstado((JSON.stringify(row.values[2])).replace(/"/g, '')))
                let destino = String( obterValorEstado((JSON.stringify(row.values[3])).replace(/"/g, '')))



                jsonNCMs.push({

                    ncmNumber:(JSON.stringify(row.values[1])).replace(/"/g, ''),
                    estadoOrigem:origem,
                    estadoDestino:destino
                })

            }
        });


        // Retornar o JSON
        return { jsonNCMs, worksheet, workbook };
    }

    async function writeData(worksheet: exceljs.Worksheet, workbook: exceljs.Workbook, iobData: string[]) {

        // SALVANDO DADOS IOB NA PLANILHA NA COLUNA B
        iobData.forEach((element, index) => {
            worksheet.getCell(`B${index + 2}`).value = element
        })

        const formattedDate = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');

        await workbook.xlsx.writeFile(`renderer/public/data/ncm-${formattedDate}.xlsx`);

        return
    }

    async function openBrowser(browser) {

        // const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 720,
        });

        return page
    }

    async function loginIOB(page: Page, username:userDataProps["username"], password:userDataProps["password"]) {

        try {
            // EFETUANDO LOGIN
            await page.goto('https://www.iobsimuladortributario.com.br/pages/st/login.jsf');

            await page.waitForSelector('#username', { timeout: 180000, visible: true });

            await page.type('#username', username);
            await page.type('#password', password);
            // await page.type('#username', 'iob.6572749');
            // await page.type('#password', '41756199');

            await navTimeout(page)

            await page.click('#root > section > div > section > form > div._groupButton_cwe1u_99 > button')

            try {

                const userNotFoundAlert = await page.waitForSelector("#root > div > div > div > div.MuiAlert-message.css-1xsto0d", { timeout: 10000, visible: true });

                const alertText = await userNotFoundAlert.evaluate(element => element.textContent);
       
    
                if (alertText === "Usuário Não Encontrado") {
                    console.log('retornou falso')
                    return false
                }
                
            } catch (error) {} finally {}

            
            // CASO EXISTA, FECHA POP UP, SE NÃO, DÁ NAV TIMEOUT
            try {

                await page.waitForSelector("body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper.css-ekeie0 > div > div.MuiDialogActions-root.MuiDialogActions-spacing.css-1vskg8q > button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1kvsn8", { timeout: 3000, visible: true });
                await navTimeout(page)

                await page.click('body > div.MuiDialog-root.MuiModal-root.css-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper.css-ekeie0 > div > div.MuiDialogActions-root.MuiDialogActions-spacing.css-1vskg8q > button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1kvsn8')


            } catch (error) {

                console.log('encerrar sessão não encontrado')

                await navTimeout(page)
            } finally {
                await navTimeout(page, 5000)

                // await page.waitForSelector('#modalGenericoIST > div.closeSession > img.fechaModalSessao', { timeout: 30000, visible: true });


                // await page.click(".fechaModalSessao")

            
                
                    

                return true
            }

        } catch (error) {
            return false
        }
    }

    async function navTimeout(page: Page, timeout?: number) {

        // TIMEOUT
        try {
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: timeout ?? 1500 });
        } catch (error) {

        }

    }

    async function findUniqueSelectors(page: Page) {

        // BUSCA POR SELETORES ÚNICOS NOS BOTÕES DE CONSULTAR. NCMS COM VARIAÇÕES COMO CERVEJA/CHOPP ETC.
        await page.waitForSelector("#j_id193 > h2")
        const consultButtons = await page.$$('a.btn-nsu-tipi');
        
        const buttonSelectors = await Promise.all(
            consultButtons.map(async (button) => {
                return await button.evaluate((el) => {
                    // Retorna o seletor CSS completo do elemento
                    return el.matches('a') ? el.closest('a').getAttribute('data-nsu') : null;
                });
            })
        );
        
        const uniqueButtonSelectors = [...new Set(buttonSelectors)]; // Remove duplicatas

        return uniqueButtonSelectors
    }

    async function simulateNCM(page: Page, ncm:NCMData) {

        const {ncmNumber, estadoOrigem, estadoDestino} = ncm
        // QUERY PRINCIPAL

        await page.goto(`https://www.iobsimuladortributario.com.br/pages/coreonline/integracao/modulos.jsf?codProduto=IST&siglaModulo=ICMSSTHOME&tipo=1&codigo=${ncmNumber}&origem=${estadoOrigem}&destino=${estadoDestino}`)

        await navTimeout(page, 2000)

 

        return

    }

    async function getMVA(page: Page, ncm: string, estadoOrigem: string, estadoDestino:string) {
        // PEGA O MVA E A RESPECTIVA DESCRIÇÃO
        try {

            // CADA NCM POSSUI 1 OU MAIS MVA, SCRIPT IDENTIFICA NA TABELA QUANTOS MVAS ESTÃO DISPONIVEIS
            await page.waitForSelector("#j_id193 > div.ncmCapInfo > table > tbody > tr > td.ncmNumber")

            await page.waitForSelector(`#bla > fieldset > div > table`, { timeout: 1000 });

            const allTables = await page.$$('#bla > fieldset > div > table')

            const numVariations = allTables.length

            let mvaDict: string[] = []


            // CASO TENHA APENAS 1 MVA, FAZ A BUSCA E RETORNA
            if (numVariations == 1) {
                const mvaElement = await page.waitForSelector(`#bla > fieldset > div > table > tbody > tr.blockMVA > td.resultMVA.mvaVigente`, { timeout: 3000 });

                const mvaValue = await mvaElement.evaluate(element => element.textContent);

                const mvaCestElement = await page.waitForSelector(`#bla > fieldset > div > table > tbody > tr:nth-child(4) > td`, { timeout: 3000 });
                const mvaCest = await mvaCestElement.evaluate(element => element.textContent);

                const mvaDescElement = await page.waitForSelector(`#bla > fieldset > div > table > tbody > tr:nth-child(1) > td > span.produtoTipo`, { timeout: 3000 });
                const mvaDesc = await mvaDescElement.evaluate(element => element.textContent);

                const nomeEstadoOrigem = await obterNomeEstado(Number(estadoOrigem))
                const nomeEstadoDestino = await obterNomeEstado(Number(estadoDestino))

                mvaDict.push(`${ncm};${nomeEstadoOrigem};${nomeEstadoDestino};${mvaCest};${mvaDesc.replaceAll(";", " --")};${mvaValue}`)

            // CASO TENHA MAIS DE 1 MVA, FAZ A BUSCA PELA TABELA COM O NUMERO DE VARIAÇÕES E RETORNA O ARRAY COM OS DADOS
            } else if (numVariations > 1) {

                const variants: string[] = [];

                for (let i = 1; i <= numVariations; i++) {

                    const mvaElement = await page.waitForSelector(`#bla > fieldset > div > table:nth-child(${i}) > tbody > tr:nth-child(4) > td`, { timeout: 3000 });
                    const mvaValue = await mvaElement.evaluate(element => element.textContent);

                    const mvaCestElement = await page.waitForSelector(`#bla > fieldset > div > table:nth-child(${i}) > tbody > tr.blockMVA > td.resultMVA.mvaVigente`, { timeout: 3000 });
                    const mvaCest = await mvaElement.evaluate(element => element.textContent);
                    
                    const mvaDescElement = await page.waitForSelector(`#bla > fieldset > div > table:nth-child(${i}) > tbody > tr:nth-child(1) > td > span.produtoTipo`, { timeout: 3000 });
                    const mvaDesc = await mvaDescElement.evaluate(element => element.textContent);

                    const nomeEstadoOrigem = await obterNomeEstado(Number(estadoOrigem))
                    const nomeEstadoDestino = await obterNomeEstado(Number(estadoDestino))

                    variants.push(`${ncm};${nomeEstadoOrigem};${nomeEstadoDestino};${mvaCest};${mvaDesc.replaceAll(";", " --")};${mvaValue}`)


                }
                mvaDict.push(...variants)

            // ALGUNS NCMS NÃO POSSUEM MVA VALIDO
            } else {

                mvaDict = [`${ncm};NDA`]
            }

            return mvaDict

        } catch (error) {

            return [`${ncm};NDA`]; // Retorna um dicionário com um array vazio para o NCM em caso de erro
        }
    }

    async function scrapeMVA(ncm: NCMData) {

        try {

            // SIMULA NCM NA QUERY
            await simulateNCM(page, ncm)

            let mvaList: string[] = []

            const {ncmNumber, estadoOrigem, estadoDestino} = ncm

            try {

                await page.waitForSelector(`#j_id193 > h2`, { timeout: 3000 });
                
                // ENCONTRA OS SELETORES ÚNICOS DOS BOTÕES DE CONSULTAR
                const uniqueConsultarSelectors = await findUniqueSelectors(page)
                
                // PARA CADA BOTÃO DE CONSULTAR, CLICA NO BOTÃO E FAZ O SCRAPE DE SEUS RESPECTIVOS MVAS
                for (const dateNsu of uniqueConsultarSelectors) {

                    const buttonSelector = `a.btn-nsu-tipi[data-nsu="${dateNsu}"]`;
                    await page.click(buttonSelector);

                    try {
                        const mvaDict = await getMVA(page, ncmNumber, estadoOrigem, estadoDestino)
                        mvaList.push(...mvaDict)

                    } catch (error) {

                    } finally {
                        // VOLTAR
                        await page.goBack();
                        await navTimeout(page);
                    }

                }

            } catch (error) {

                try {
                    const mvaDict = await getMVA(page, ncmNumber, estadoOrigem, estadoDestino)
                    mvaList.push(...mvaDict)


                } catch (error) {

                }

            } finally {
                await page.goBack();
                await navTimeout(page);
            }

            return mvaList

        } catch (error) {
        }

    }

    // FILEPATH DO EXCEL
    const {username, password, filePath} = userData

    const MVAs: string[] = []

    // PEGANDO OS NCMS DO EXCEL
    const { jsonNCMs, workbook, worksheet } = await getExcelNCMs(filePath)

    mainWindow.webContents.send('is-loading', true)

    const page = await openBrowser(browser)
    
    // CHECAGEM DE LOGIN
    const isLogged = await loginIOB(page, username, password)

    if (!isLogged) {

        mainWindow.webContents.send('console-messages', 'Problema de autenticação, tente novamente.')

        mainWindow.webContents.send('is-loading', false)
        
        return
    }

    mainWindow.webContents.send('console-messages', 'Login efetuado com sucesso.')

    // SCRAPING CADA NCM DA LISTA DO EXCEL
    for (const ncm of jsonNCMs) {

        console.log(`Scraping ncm: ${ncm.ncmNumber}`)
        mainWindow.webContents.send('console-messages', `Buscando MVAs do NCM ${ncm.ncmNumber}.`)

        let scrapedMVAs = await scrapeMVA(ncm)

        MVAs.push(...scrapedMVAs)

        scrapedMVAs = []
    }

    // PREPARANDO OS MVAS E DESCRIÇÕES PARA O EXCEL
    MVAs.forEach((element, index) => {
        worksheet.getCell(`D${index + 2}`).value = `${element}`
    })

    // FORMATANDO O NOME DO ARQUIVO
    const formattedDate = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');

    mainWindow.webContents.send('console-messages', `Exportando dados em excel...`)

    

    const options = {
        title: 'Salvar Planilha',
        defaultPath: `ncm-${formattedDate}.xlsx`, // Nome do arquivo sugerido
        filters: [
          { name: 'Arquivos Excel', extensions: ['xlsx'] },
        ],
      };

      mainWindow.webContents.send('is-loading', false)


    dialog.showSaveDialog(mainWindow, options).then(result => {
    if (!result.canceled) {
        const filePath = result.filePath;
        workbook.xlsx.writeFile(filePath).then(() => {
        console.log("Programa finalizado.");
        mainWindow.webContents.send('console-messages', `Planilha salva em: ${filePath}`);
        });
    } else {
        mainWindow.webContents.send('console-messages', 'Salvamento cancelado pelo usuário.');
    }
    });

    // SALVANDO ARQUIVO
    await workbook.xlsx.writeFile(`renderer/public/data/ncm-${formattedDate}.xlsx`);

    console.log("Programa finalizado.")

    return


    // #bla > fieldset > div > table > tbody > tr.blockMVA > td.resultMVA.mvaVigente pra pegar MVA
}

// try {
//     await page.waitForSelector("#j_id262 > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > th", { timeout: 3000 })

//     const buttonSelectors = await page.$$eval(
//         'a.btn-nsu-tipi[value="Consultar"]',
//         elements => elements.map(el => el.getAttribute('data-nsu'))
//     );

//


//     await page.click(".btn-nsu-tipi.btNCM")
// } catch (error) {
//
// }

// async function initialSearch(page: Page, ncm) {

//     await navTimeout(page)

//     await page.type("#\\:r7\\:", `${ncm}`);


//     const optionValue = '27'; // Valor da opção desejada (São Paulo)


//     const optionSelector = `li[data-value="${optionValue}"]`;

//     await page.click('#OriginState');
//     await page.click(optionSelector);

//     await navTimeout(page)

//     await page.click('#DestinationState');
//     await page.click(optionSelector);
//     await navTimeout(page)

//     // await page.click('#root > div:nth-child(2) > main > article:nth-child(2) > section > div > form > div._SimulatorsButtons_1paq8_36 > button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1kvsn8')

    

// }








// try {

//     await page.waitForSelector("#j_id193\\:j_id721");
//     await page.click("#j_id193\\:j_id721");

//     await page.waitForSelector("#formBuscaGeralSimulador\\:parametroBusca");
//     await page.type("#formBuscaGeralSimulador\\:parametroBusca", `${ncm}`)

//     const selectSelectorOrigem = '#formBuscaGeralSimulador\\:optEstadoOrigem'; // Escapamos os dois pontos no ID
//     await page.select(selectSelectorOrigem, '22'); // Seleciona a opção com value="27" (São Paulo)


//     const selectSelectorDestino = '#formBuscaGeralSimulador\\:optEstadoDestino'; // Escapamos os dois pontos no ID
//     await page.select(selectSelectorDestino, '22'); // Seleciona a opção com value="27" (São Paulo)

//     await page.waitForSelector("#formBuscaGeralSimulador\\:j_id188");
//     await page.click("#formBuscaGeralSimulador\\:j_id188");

//     https://www.iobsimuladortributario.com.br/pages/coreonline/integracao/modulos.jsf?codProduto=IST&siglaModulo=ICMSSTHOME&tipo=1&codigo=22072020&origem=22&destino=22

// }
// catch (error) {
// }