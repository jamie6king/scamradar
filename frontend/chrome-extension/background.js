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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == "registrationNumber") {
        registrationNumber = message.registrationNumber;
        sendVehicleData();
        return true;
    } else if (message.type == "scrapedData") {
        vehicleData = message.scrapedData.vehicleData;
    }
});

function sendVehicleData() {
    SendEbayCarData({
        registrationNumber: registrationNumber,
        vehicleData: vehicleData,
    })
        .then((response) => {
            console.log("Car data sent successfully", response);
        })
        .catch((error) => {
            console.error("Error sending data:", error);
        });

    return true;
}
