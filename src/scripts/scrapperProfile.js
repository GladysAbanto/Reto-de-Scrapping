import axios from 'axios';
import { autoScroll } from '../utils/autoScroll';
import { $, $$ } from '../utils/selectors';
import { waitForElement } from '../utils/waitForElement';
import { selectors } from './scrapper.config';

const { main } = selectors;

async function resolveIsReady() {
    await waitForElement(main.profileImg);
    await autoScroll();
}

async function scrap() {
    await waitForElement(main.contactInfoA);

    const cookies = {};
    document.cookie.split(';').forEach(completeCookie => {
        const [key, value] = completeCookie.split('=');
        cookies[key.trim()] = value.replace(/"/g, '');
    })

    /*const response = await axios.get('https://www.linkedin.com/voyager/api/identity/profiles/andreina-nathaly-rodriguez-martinez/profileContactInfo',
        {
            headers: {
                'csrf-token': cookies.JSESSIONID
            }
        });*/
    const name = $('h1').textContent;

    const arrayExperience = [];
    $$(main.generalContainer('experience')).forEach((e) => {
        arrayExperience.push($('span[aria-hidden="true"]', e).textContent);
    });

    const port = chrome.runtime.connect({ name: 'scrapData' });
    port.postMessage({ name, arrayExperience });
}

async function start() {
    await resolveIsReady();
    await scrap();
}

start();