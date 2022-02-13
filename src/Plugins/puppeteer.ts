import { Browser } from "puppeteer";
import { launch } from "puppeteer-stream";

let instance: Browser | null = null;
module.exports.getBrowserInstance = async function () {
  if (!instance) {
    instance = await launch({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
  }
  return instance;
};
