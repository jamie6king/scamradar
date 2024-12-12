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

async function SendEbayCarData(body) {
	const requestOptions = {
	  method: "POST",
	  headers: {
		"Content-Type": "application/json",
	  },
	  body: JSON.stringify(body),
	};
  
	const response = await fetch("http://localhost:3000/car", requestOptions);
  
	if (response.status !== 200) {
		console.log(await response.json())
	  throw new Error("Unable to send Ebay car data");
	}
  
	return response;
  }
  

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == "scrapedData") {
        console.log("Data:", message);

		
        SendEbayCarData({registrationNumber: message.scrapedData.registrationNumber, 
			vehicleData: message.scrapedData.vehicleData})
            .then((response) => {
                console.log("Car data sent successfully", response);
                sendResponse({ success: true, data: response });
            })
            .catch((error) => {
                console.error("Error sending data:", error);
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }
});

