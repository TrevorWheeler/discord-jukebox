/// <reference types="node" />
import {
  LaunchOptions,
  Browser,
  Page,
  BrowserLaunchArgumentOptions,
  BrowserConnectOptions,
} from "puppeteer";
import { Readable, ReadableOptions } from "stream";
export declare class Stream extends Readable {
  private page;
  constructor(page: Page, options?: ReadableOptions);
  _read(): void;
  destroy(): Promise<void>;
}
declare module "puppeteer" {
  interface Page {
    index: number;
    getStream(opts: getStreamOptions): Promise<Stream>;
  }
}
