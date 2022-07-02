(() => {
  // src/sw.js
  var URLS = [];
  var index = 0;
  var data = [];
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "scrapValue") {
      port.onMessage.addListener(async (message) => {
        const { tab, textBoxValue } = message;
        resetDataVars();
        chrome.tabs.update(tab.id, { url: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(textBoxValue)}`, active: true }, function(tab1) {
          var listener = function(tabId, changeInfo, tab2) {
            if (tabId == tab1.id && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              console.log("Si lo hace wii");
              chrome.scripting.executeScript({
                target: { tabId: tab2.id },
                files: ["./scripts/scrapper.js"]
              });
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
        });
      });
    }
    if (port.name === "scrapUrls") {
      port.onMessage.addListener(async (message) => {
        const { urls } = message;
        console.log("URLS", urls);
        URLS = urls;
        getDataProfile(URLS[index]);
      });
    }
    if (port.name === "scrapData") {
      port.onMessage.addListener((message) => {
        const { name, arrayExperience } = message;
        data.push({ name, arrayExperience, url: URLS[index] });
        index = index + 1;
        if (index < URLS.length) {
          getDataProfile(URLS[index]);
        } else {
          saveDataProfile(data);
        }
      });
    }
  });
  function getDataProfile(url) {
    chrome.tabs.query({ active: true }, function(tabs) {
      chrome.tabs.update(tabs[0].id, { url, active: true }, function(tab1) {
        var listener = async function(tabId, changeInfo, tab) {
          if (tabId == tab1.id && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript({
              target: { tabId: tab.id, allFrames: true },
              files: ["./scripts/scrapperProfile.js"]
            });
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
      });
    });
  }
  function resetDataVars() {
    URLS = [];
    index = 0;
  }
  function saveDataProfile(data2) {
    var _myArray = JSON.stringify(data2);
    chrome.storage.local.set({ "DATA_PROFILES_LINKEDIN": _myArray }, function() {
      console.log("Value is set to " + _myArray);
    });
  }
})();
