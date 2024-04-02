// index.js

// O inicio do programa está em main.html

import puppeteer from 'puppeteer';

import exceljs from 'exceljs'
import { format } from 'date-fns';

export default async function MainBost2(uploadedFilePath: string) {


    const filePath = uploadedFilePath

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.iobonline.com.br/index/login');

    // await acceptCookies(page);

    // await page.waitForSelector('input#txtLogin');
    console.log('before timeout')
    await page.type('input#txtLogin', 'iob.6543750');
    await page.type('input#txtPassword', '98721894');
    setTimeout(async () => {
        await page.keyboard.press('Enter')
    },2000)
    // await timeoutDelay(5)
    // console.log('after 1 enter')
    // // await page.click('button.default-btn.light-green-btn');
    // console.log('after 1 tab')
    // await timeoutDelay(1)
    // await page.keyboard.press('Enter')
    // console.log('after 2 enter')
    // // await page.keyboard.press('Enter')
    // // await page.click('button.default-btn.light-green-btn.send-login');
    // console.log('inputado')

    // await page.waitForSelector('button.default-btn.light-green-btn.send-login');
    // await timeoutDelay(3);
    // await timeoutDelay(3)

    // try {
    //     await page.waitForSelector('span.default-btn.light-green-btn');
    //     await page.click('span.default-btn.light-green-btn');
    // } catch (error) { }

    // await timeoutDelay(5);
    // await searchInput(page, jsonNCMs[0]);

    // await page.type('select.choice', 'SP');
    // await page.click('button.button.bg-primary.font-button');

    // await timeoutDelay(15);

    // await closeBrowser(browser);
}
