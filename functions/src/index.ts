import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from "firebase-functions";

import puppeteer from 'puppeteer';

initializeApp({ projectId: 'filiplindqvist-com-ea66d' });

const db = getFirestore();

export const lunch = functions.region('europe-west1').pubsub.schedule("0 * * * *")
  .onRun(async (event) => {
    functions.logger.info("Started");

    await main()

    functions.logger.info("Done");
  });

export async function main() {
  const items = await drivan();

  await db.collection('bastad-lunch').doc('drivan').set({ name: 'Drivan', items })
}


export async function drivan(): Promise<string[] | null> {
  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1080, height: 1024 } });
  const page = await browser.newPage();

  await page.goto("https://apps.wixrestaurants.com/?" +
    "type=wixmenus.client&pageId=fgi7o&" +
    "compId=TPASection_jgadbm7m&" +
    "viewerCompId=TPASection_jgadbm7m&" +
    "siteRevision=258&" +
    "viewMode=site&" +
    "deviceType=desktop&" +
    "locale=sv&" +
    "regionalLanguage=sv&" +
    "width=1080&" +
    "height=1024&" +
    "instance=hz-iCM5IYJmgpvlOYFjNwSfLHAVHUCA6mxyfXhSCQHM.eyJpbnN0YW5jZUlkIjoiZmMyNDUyMjMtZGI2Yy00YjA0LTk2MmYtMmQ3YWIzMWViY2FhIiwiYXBwRGVmSWQiOiIxM2MxNDAyYy0yN2YyLWQ0YWItNzQ2My1lZTdjODllMDc1NzgiLCJtZXRhU2l0ZUlkIjoiNzNiNDIzODctZTM1ZS00YTRiLWIzMTUtZjI1Njc2OTExNjViIiwic2lnbkRhdGUiOiIyMDIzLTA0LTAzVDA3OjM1OjQ3LjU4NloiLCJ2ZW5kb3JQcm9kdWN0SWQiOiJXaXhSZXN0VW5saW1pdGVkIiwiZGVtb01vZGUiOmZhbHNlLCJhaWQiOiIzMDk1NWMwYS0yNzc0LTQxNzQtYTg4Mi02OWU3YTJkMmY1NDAiLCJiaVRva2VuIjoiOGY5MDcxYTQtMzgzMi0wMTRmLTI1M2EtZGYyY2M1OGZhYWYxIiwic2l0ZU93bmVySWQiOiI3M2I2MTk0Zi1hNzZhLTQwMGMtOTI3Mi0xYzJiZTZjYjNmZDQifQ&" +
    "commonConfig=%7B%22brand%22%3A%22wix%22%2C%22bsi%22%3A%22f5c9b102-8e5f-460f-89dd-102423c8629c%7C1%22%2C%22BSI%22%3A%22f5c9b102-8e5f-460f-89dd-102423c8629c%7C1%22%7D&" +
    "currentRoute=.%2Fmeny&" +
    "target=_top&" +
    "section-url=https%3A%2F%2Fwww.restaurangdrivan.com%2Fmeny%2F&" +
    "vsi=b3d3a9e7-5768-4056-867e-e0b39ff80409");

  // Get ul menu element
  const menu = await page.waitForSelector('[aria-label="Veckans meny"] ul li ul', { timeout: 30000 });
  if (menu) {
    // Find all li-elements and evaluate the innerText
    const items = await menu.$$eval('li', li => li.map(e => e.innerText)) as string[]

    await browser.close()

    for (const itm of items) {
      console.log(itm);
    }

    return items
  } else {
    console.log("Menu not found");
    await browser.close()
    return null;
  }
}
