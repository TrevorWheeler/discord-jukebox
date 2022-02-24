import puppeteer, { Browser } from "puppeteer";

let instance: Browser | null = null;
export default async () => {
  if (!instance) {
    instance = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
    });
  }
  return instance;
};
