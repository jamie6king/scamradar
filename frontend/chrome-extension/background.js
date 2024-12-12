chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === "install") {
        chrome.storage.local.set({
            apiSuggestions: ["tabs", "storage", "scripting"],
        });
    }
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

const extensions = "https://www.ebay.co.uk/";

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(extensions)) {
        const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
        const nextState = prevState === "ON" ? "OFF" : "ON";

        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });
        if (nextState == "ON") {
            console.log("execute script");
            await chrome.scripting.executeScript({
                files: ["scripts/content.js"],
                target: { tabId: tab.id },
            });
        } else if (nextState == "OFF") {
            chrome.tabs.reload(tab.id);
            console.log("Sniffer OFF");
        }
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "scrapedData") {
        console.log("Data:", request);
        sendResponse({ status: "Scraped Data received" });
        return true;
    }
});
