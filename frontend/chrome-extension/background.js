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

const getMostCommonPlate = async (message) => {
    const imageUrls = message.imageUrls;
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(imageUrls),
        };
        const response = await fetch(
            `http://localhost:3000/getLicensePlate/`,
            requestOptions
        );
        const licensePlateData = await response.json();
        console.log(licensePlateData);
        return licensePlateData;
    } catch (error) {
        console.error("Unable to retreive license plate from image: ", error);
        return { error: error.message };
    }
};

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.type == "imageUrls") {
        (async () => {
            try {
                const data = await getMostCommonPlate(message);
                console.log("plate: ", data.licensePlate);
            } catch (error) {
                console.error("Error while fetching license plates", error);
            }
        })();
        return true;
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

const getCompanyInfo = async (message) => {
    const businessNumber = message.businessNumber;
    try {
        const response = await fetch("http://localhost:3000/companiesHouse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ companyNumber: businessNumber }),
        });
        const companyInfo = await response.json();
        return companyInfo;
    } catch (error) {
        console.error("Unable to retreive company info: ", error);
        return { error: error.message };
    }
};

chrome.runtime.onMessage.addListener((message, sender, response) => {
    if (message.type == "mapQueryData") {
        (async () => {
            try {
                const data = await getMapReviews(message);
                console.log("bgdata:: ", data.mapReviews);
                chrome.storage.local.set(
                    {
                        mapQueryResults: data,
                    },
                    () => {
                        console.log("Data stored in chrome storage");
                    }
                );
            } catch (error) {
                console.error("Error while fetching map reviews:", error);
                chrome.runtime.sendMessage({
                    type: "mapQueryResults",
                    error: error.message,
                });
            }
        })();
        return true;
    } else if (message.type == "businessNumberData") {
        (async () => {
            try {
                const data = await getCompanyInfo(message);
                console.log("chdata:: ", data.companyInfo);
                chrome.storage.local.set(
                    {
                        companyInfo: data,
                    },
                    () => {
                        console.log("Data stored in chrome storage");
                    }
                );
            } catch (error) {
                console.error("Error while fetching company info:", error);
                chrome.runtime.sendMessage({
                    type: "businessNumberResults",
                    error: error.message,
                });
            }
        })();
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
