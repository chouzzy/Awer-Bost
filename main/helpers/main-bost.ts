// // index.js

// // O inicio do programa está em main.html

// import puppeteer from 'puppeteer';

// import exceljs from 'exceljs'
// import { format } from 'date-fns';

// export default async function MainBost(uploadedFilePath: string) {


//     const filePath = uploadedFilePath

//     async function timeoutDelay(seconds: number) {
//         setTimeout(async () => {
//         }, seconds * 1000)
//     }

//     async function acceptCookies(page) {
//         const acceptCookieButton = '#onetrust-reject-all-handler';
//         await page.waitForSelector(acceptCookieButton);
//         await page.click(acceptCookieButton);
//         await timeoutDelay(3);
//     }

//     async function searchInput(page, inputText) {
//         const inputSearch = 'input#txtBusca';
//         await page.waitForSelector(inputSearch);
//         await page.type(inputSearch, inputText);
//         await timeoutDelay(2);
//     }

//     async function closeBrowser(browser) {
//         try {
//             await browser.close();
//         } catch (error) {
//             console.error('Error closing browser:', error);
//         }
//     }

//     async function getExcelNCMs(worksheet: exceljs.Worksheet) {

//         // LER OS NCMS DA PLANILHA E RETORNAR NO ARRAY
//         const jsonNCMs: exceljs.CellValue[] | { [key: string]: exceljs.CellValue; } = []

//         worksheet.eachRow(function (row, rowNumber) {

//             if (rowNumber > 1) {
//                 jsonNCMs.push(JSON.stringify(row.values[1]))

//             }
//         });

//         // Retornar o JSON
//         return jsonNCMs;
//     }
//     async function writeData(worksheet: exceljs.Worksheet, workbook: exceljs.Workbook, iobData: string[]) {

//         // SALVANDO DADOS IOB NA PLANILHA NA COLUNA B

//         iobData.forEach((element, index) => {
//             worksheet.getCell(`B${index + 2}`).value = element
//         })

//         const formattedDate = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');

//         await workbook.xlsx.writeFile(`renderer/public/data/ncm-${formattedDate}.xlsx`);

//         return
//     }

//     const workbook = new exceljs.Workbook();
//     await workbook.xlsx.readFile(filePath);

//     // // Acessar a primeira planilha
//     // const worksheet = workbook.worksheets[0];

//     // const jsonNCMs = await getExcelNCMs(worksheet)

//     // console.log('jsonNCMs')
//     // console.log(jsonNCMs)

//     // await writeData(worksheet, workbook, ['a', 'b', 'c'])

//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();

//     await page.goto('https://www.iobonline.com.br/index/login');

//     // await acceptCookies(page);

//     // await page.waitForSelector('input#txtLogin');
//     console.log('before timeout')
//     await page.type('input#txtLogin', 'iob.6543750');
//     await page.type('input#txtPassword', '98721894');
//     setTimeout(async () => {
//         await page.keyboard.press('Enter')
//     },2000)
//     // await timeoutDelay(5)
//     // console.log('after 1 enter')
//     // // await page.click('button.default-btn.light-green-btn');
//     // console.log('after 1 tab')
//     // await timeoutDelay(1)
//     // await page.keyboard.press('Enter')
//     // console.log('after 2 enter')
//     // // await page.keyboard.press('Enter')
//     // // await page.click('button.default-btn.light-green-btn.send-login');
//     // console.log('inputado')

//     // await page.waitForSelector('button.default-btn.light-green-btn.send-login');
//     // await timeoutDelay(3);
//     // await timeoutDelay(3)

//     // try {
//     //     await page.waitForSelector('span.default-btn.light-green-btn');
//     //     await page.click('span.default-btn.light-green-btn');
//     // } catch (error) { }

//     // await timeoutDelay(5);
//     // await searchInput(page, jsonNCMs[0]);

//     // await page.type('select.choice', 'SP');
//     // await page.click('button.button.bg-primary.font-button');

//     // await timeoutDelay(15);

//     // await closeBrowser(browser);
// }
