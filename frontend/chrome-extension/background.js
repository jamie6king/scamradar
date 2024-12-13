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
        registrationDate: registrationDate || undefined,
    };

    SendEbayCarData({
        registrationNumber: registrationNumber,
        vehicleData: formattedData,
    })
        .then((response) => {
            console.log("Car data sent successfully", response);
        })
        .catch((error) => {
            console.error("Error sending data:", error);
        });

    return true;
}
