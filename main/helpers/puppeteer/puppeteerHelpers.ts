import { Page } from "puppeteer";
import { PuppeteerResult } from "../types/generalTypes";
import { timeoutDelay } from "../converters/timeOutDelay";
import PCR from "puppeteer-chromium-resolver";


export async function searchInput(page:Page, inputText:string) {
   const inputSearch = 'input#txtBusca';
   await page.waitForSelector(inputSearch);
   await page.type(inputSearch, inputText);
   await timeoutDelay(2);
}

export async function closeBrowser(browser) {
   try {
      await browser.close();
   } catch (error) {
   }
}

export async function startPuppeteer(headless: boolean): Promise<PuppeteerResult> {

   const options = {};
   const stats = await PCR(options);

   const browser = await stats.puppeteer.launch({
      headless: false,
      args: [
         "--no-sandbox",
         "--disable-gpu",
         '--disable-web-security',
         `--window-size=${80},${500}`,
      ],
      executablePath: stats.executablePath
   }).catch(function (error) {
   });

   const page = await browser.newPage();
   await page.setViewport({
      width: 720,
      height: 920,
   });

   console.log('tudo ok com o pupa')
   await page.setBypassCSP(true)

   return { page, browser }
}