(() => {
  // src/utils/selectors.js
  var $ = (selector, node = document) => node.querySelector(selector);
  var $$ = (selector, node = document) => [...node.querySelectorAll(selector)];

  // src/utils/waitForElement.js
  var waitForElement = (selector) => new Promise((res, rej) => {
    const intervalId = setInterval(() => {
      if ($(selector)) {
        clearInterval(intervalId);
        res($(selector));
      }
    }, 10);
    setTimeout(() => {
      rej();
    }, 5500);
  });

  // src/scripts/scrapper.config.js
  var selectors = {
    main: {
      listUl: "main ul",
      listItemRef: "li .mb1 a",
      profileImg: ".pv-top-card-profile-picture__image",
      contactInfoA: "#top-card-text-details-contact-info",
      contacInfoS: ".section-info",
      generalContainer: (idRef) => `#${idRef} ~ .pvs-list__outer-container > ul >li >div`
    }
  };

  // src/scripts/scrapper.js
  var { main } = selectors;
  async function resolveIsReadyList() {
    await waitForElement(main.listUl);
  }
  async function scrapUrls() {
    await waitForElement(main.listItemRef);
    const mainUrl = $(main.listUl);
    const urls = [];
    $$(main.listItemRef, mainUrl).forEach((element) => {
      urls.push(element.href.split("?")[0]);
    });
    const port = chrome.runtime.connect({ name: "scrapUrls" });
    port.postMessage({ urls });
  }
  async function startInit() {
    await resolveIsReadyList();
    await scrapUrls();
  }
  startInit();
})();
