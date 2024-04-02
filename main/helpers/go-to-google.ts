import puppeteer from "puppeteer";


export default async function goToGoogle() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://www.google.com.br');
        setTimeout(async () => {
            await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        }, 5000)
}