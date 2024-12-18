window.onload = () => {
    const form = document.querySelector("form");
    form.onsubmit = submitted.bind(form);
};

function submitted(event) {
    event.preventDefault();
    const registrationNumber = event.target.textInput.value;
    document.getElementById("loading").classList.remove("hidden");
    chrome.runtime.sendMessage({
        type: "registrationNumber",
        registrationNumber: registrationNumber,
    });
    // chrome.action.setPopup({ popup: "popup/results.html" });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "results") {
        sendResponse({ status: "success" });

        const response = message.carReport.reportResults;
        let [year, month, day] = response.motData.motTestDueDate.split("-");
        let newMotDate = `${day}-${month}-${year}`;

        document.getElementById("loading").classList.add("hidden");
        document.getElementById("input").classList.add("hidden");
        document.getElementById("output").classList.remove("hidden");

        document.getElementById("make").innerText = 
            "Make:\n" + response.make;
        document.getElementById("model").innerText =
            "Model:\n" + response.model;
        document.getElementById("colour").innerText =
            "Colour:\n" + response.colour;
        document.getElementById("fuel-type").innerText =
            "Fuel Type:\n" + response.fuelType;
        document.getElementById("registration-date").innerText =
            "Registration Date:\n" + response.registrationDate;
        document.getElementById("mileage").innerText =
            "Mileage:\n" + response.mileage;
        document.getElementById("tax-status").innerText =
            "Tax Status:\n" + response.taxStatus;
        document.getElementById("outstanding-recall").innerText =
            "Outstanding Recalls:\n" + response.hasOutstandingRecall;
        // document.getElementById("mot-required").innerText = "MOT Required:\n" + (response.motRequired ? "Yes" : "No");
        document.getElementById("mot-due").innerText =
            "MOT Due Date:\n" + newMotDate;
        // document.getElementById("mot-data").innerText = "MOT Failures:\n" + response.motFailures.map((failure) => failure);
    }
});


document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["mapQueryResults", "mapQueryError"], (result) => {
        if(result.mapQueryResults) {
            console.log("Received results", result.mapQueryResults)
            const mapReviews = result.mapQueryResults.mapReviews
            if(mapReviews) {
                document.getElementById("businessName").innerText = "Business Name:\n" + mapReviews.businessName;
                document.getElementById("businessAddress").innerText = "Business Address:\n" + mapReviews.businessAddress;
                document.getElementById("reviewsCount").innerText = "Number of reviews:\n" + mapReviews.reviewsCount;
                document.getElementById("averageRating").innerText = "Avg. rating:\n" + mapReviews.averageRating;
                document.getElementById("ratingSummary").innerText = "Rating summary:\n" + mapReviews.ratingSummary;
                document.getElementById("mostRelevantReviews").innerText = "User reviews sample:\n" + mapReviews.mostRevantReviews;
                // chrome.storage.local.remove(['mapQueryResults']);
            } else {
                document.getElementById("noReviewsFound").innerText = result.mapQueryResults.message;
            }
        }
    })
})

