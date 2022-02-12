const puppeteer = require("puppeteer");
import SpotifyWebApi from "spotify-web-api-node";
import { launch } from "puppeteer-stream";

export default async function initChrome() {
  const browser = await launch({
    headless: false,
    defaultViewport: null,
    args: ["--font-render-hinting=medium"],
  });
  return browser;
}
