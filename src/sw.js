var URLS = [];
var index = 0;
var data = [];

chrome.runtime.onConnect.addListener(port => {

    if (port.name === 'scrapValue') {
        port.onMessage.addListener(async message => {
            const { tab, textBoxValue } = message;

            resetDataVars();

            chrome.tabs.update(tab.id, { url: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(textBoxValue)}`, active: true }, function (tab1) {

                // add listener so callback executes only if page loaded. otherwise calls instantly
                var listener = function (tabId, changeInfo, tab) {

                    if (tabId == tab1.id && changeInfo.status === 'complete') {
                        // remove listener, so only run once
                        chrome.tabs.onUpdated.removeListener(listener);
                        // do stuff
                        console.log("Si lo hace wii");
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['./scripts/scrapper.js']
                        })
                    }
                }
                chrome.tabs.onUpdated.addListener(listener);
            });
        })
    }

    // Obtenemos los urls
    if (port.name === 'scrapUrls') {
        port.onMessage.addListener(async message => {
            const { urls } = message;
            console.log("URLS", urls);
            URLS = urls;

            getDataProfile(URLS[index]);
        })
    }

    //Obtenemos los datos por cada perfil

    if (port.name === 'scrapData') {
        port.onMessage.addListener(message => {
            const { name, arrayExperience } = message;
            data.push({ name, arrayExperience, url: URLS[index] });
            index = index + 1;
            if (index < URLS.length) {
                getDataProfile(URLS[index]);
            } else {
                saveDataProfile(data);
            }
        })
    }
})

function getDataProfile(url) {
    chrome.tabs.query({ active: true }, function (tabs) {
        chrome.tabs.update(tabs[0].id, { url: url, active: true }, function (tab1) {

            // add listener so callback executes only if page loaded. otherwise calls instantly
            var listener = async function (tabId, changeInfo, tab) {

                if (tabId == tab1.id && changeInfo.status === 'complete') {
                    // remove listener, so only run once
                    chrome.tabs.onUpdated.removeListener(listener);
                    // do stuff
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id, allFrames: true },
                        files: ['./scripts/scrapperProfile.js']
                    })
                }
            }
            chrome.tabs.onUpdated.addListener(listener);
        });
    })
}

function resetDataVars() {
    URLS = [];
    index = 0;
}

function saveDataProfile(data) {
    var _myArray = JSON.stringify(data);
    chrome.storage.local.set({ "DATA_PROFILES_LINKEDIN": _myArray }, function () {
        console.log('Value is set to ' + _myArray);
    });
}