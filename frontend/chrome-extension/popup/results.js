console.log("Results Script Loaded")
document.addEventListener("DOMContentLoaded", function() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "results") {
      console.log(message.carReport);
      sendResponse({ status: "success" });
    }
  });
});