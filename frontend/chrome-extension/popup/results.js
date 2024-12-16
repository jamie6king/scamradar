console.log("Results Script Loaded");

document.addEventListener("click", function () {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log(message)
        if (message.type === "results") {
            console.log(message.carReport);
            sendResponse({ status: "success" });
        }
    });
});