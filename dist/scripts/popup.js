(() => {
  // src/scripts/popup.js
  function myAction(tab, value) {
    const port = chrome.runtime.connect({ name: "scrapValue" });
    port.postMessage({
      tab,
      textBoxValue: value
    });
  }
  function documentEvents() {
    document.getElementById("ok_btn").addEventListener("click", async () => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      let input = document.getElementById("name_textbox");
      myAction(tab, input.value);
    });
  }
  documentEvents();
})();
