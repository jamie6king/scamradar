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

// chrome.action.setPopup({ popup: "popup/test.html" });

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

const getMapReviews = async (message) => {
    const companyName = message.mapQueryData.companyName;
    const companyPostcode = message.mapQueryData.companyPostcode;
    try {
        const response = await fetch(
            `http://localhost:3000/mapReview/${companyName}/${companyPostcode}`
        );
        const mapReviewData = await response.json();
        return mapReviewData;
    } catch (error) {
        console.error("Unable to retreive reviews: ", error);
        return { error: error.message };
    }
};

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.type == "mapQueryData") {
        (async () => {
            try {
                const data = await getMapReviews(message);
                console.log("bgdata:: ", data.mapReviews);
                chrome.storage.local.set({ 
                    mapQueryResults: data 
                }, () => {
                    console.log("Data stored in chrome storage");
                });
            } catch (error) {
                console.error("Error while fetching map reviews:", error);
                chrome.runtime.sendMessage({
                    type: "mapQueryResults",
                    error: error.message,
                });
            }
        })();
        return true;
    }
});

function sendVehicleData() {
    let registrationDate;
    try {
        registrationDate = vehicleData["Date of 1st Registration"].substring(
            0,
            4
        );
    } catch {}

    const formattedData = {
        make: vehicleData["Manufacturer"] || undefined,
        model: vehicleData["Model"] || undefined,
        colour: vehicleData["Exterior Colour"] || undefined,
        fuelType: vehicleData["Fuel Type"] || undefined,
        registrationDate: registrationDate || vehicleData["Year"] || undefined,
        mileage: vehicleData["Mileage"] || undefined,
        transmission: vehicleData["Transmission"] || undefined,
    };

    SendEbayCarData({
        registrationNumber: registrationNumber,
        vehicleData: formattedData,
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
