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
        console.log(await response.json());
        throw new Error("Unable to send Ebay car data");
    }

    return response;
}

let registrationNumber = "";
let vehicleData = "";

chrome.action.setPopup({ popup: "popup/test.html" });

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == "registrationNumber") {
        registrationNumber = message.registrationNumber;
        sendVehicleData();
        return true;
    } else if (message.type == "scrapedData") {
        chrome.action.setPopup({ popup: "popup/popup.html" });
        vehicleData = message.scrapedData.vehicleData;
    } else if (message.type == "wrongCategory") {
        chrome.action.setPopup({ popup: "popup/test.html" });
    }
});

function sendVehicleData() {
    SendEbayCarData({
        registrationNumber: registrationNumber,
        vehicleData: vehicleData,
    })
        .then((response) => {
            console.log("Car data sent successfully", response);
            return response.json();
        })
        .then((jsonResponse) => {
            console.log(jsonResponse);
            // chrome.action.setPopup({ popup: "popup/results.html" });
            chrome.runtime.sendMessage({
                type: "results",
                carReport: jsonResponse,
            });
        })
        .catch((error) => {
            console.error("Error sending data:", error);
        });

    return true;
}
