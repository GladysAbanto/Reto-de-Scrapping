import { $, $$ } from '../utils/selectors';
import { waitForElement } from '../utils/waitForElement';
import { selectors } from './scrapper.config';

const { main } = selectors;

async function resolveIsReadyList() {
    await waitForElement(main.listUl);
}

async function scrapUrls() {
    await waitForElement(main.listItemRef);
    const mainUrl = $(main.listUl);
    const urls = [];

    $$(main.listItemRef, mainUrl).forEach(element => {
        urls.push(element.href.split('?')[0]);
    })

    const port = chrome.runtime.connect({ name: 'scrapUrls' });
    port.postMessage({ urls });
}

async function startInit() {
    await resolveIsReadyList();
    await scrapUrls();
}

startInit();

