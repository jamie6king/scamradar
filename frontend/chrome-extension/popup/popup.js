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
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("input").classList.add("hidden");
        document.getElementById("output").classList.remove("hidden");

        document.getElementById("make").innerText = "Make:\n" + response.make;
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
            "MOT Due Date:\n" + response.motTestDueDate;
        // document.getElementById("mot-data").innerText = "MOT Failures:\n" + response.motFailures.map((failure) => failure);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["mapQueryResults", "mapQueryError"], (result) => {
        if (result.mapQueryResults) {
            console.log("Received results", result.mapQueryResults);
            const mapReviews = result.mapQueryResults.mapReviews;
            const reviewWidths = {
                fiveStarWidth:
                    (mapReviews.ratingSummary[4].amount /
                        mapReviews.reviewsCount) *
                    100,
                fourStarWidth:
                    (mapReviews.ratingSummary[3].amount /
                        mapReviews.reviewsCount) *
                    100,
                threeStarWidth:
                    (mapReviews.ratingSummary[2].amount /
                        mapReviews.reviewsCount) *
                    100,
                twoStarWidth:
                    (mapReviews.ratingSummary[1].amount /
                        mapReviews.reviewsCount) *
                    100,
                oneStarWidth:
                    (mapReviews.ratingSummary[0].amount /
                        mapReviews.reviewsCount) *
                    100,
            };
            if (mapReviews) {
                document.getElementById("businessName").innerText =
                    "Business Name:\n" + mapReviews.businessName;
                document.getElementById("businessAddress").innerText =
                    "Business Address:\n" + mapReviews.businessAddress;
                document.getElementById("reviewsCount").innerText =
                    mapReviews.reviewsCount + " reviews";
                document.getElementById("averageRating").innerText =
                    mapReviews.averageRating;

                document.getElementById(
                    "five-stars"
                ).style.width = `${reviewWidths.fiveStarWidth}%`;
                document.getElementById(
                    "four-stars"
                ).style.width = `${reviewWidths.fourStarWidth}%`;
                document.getElementById(
                    "three-stars"
                ).style.width = `${reviewWidths.threeStarWidth}%`;
                document.getElementById(
                    "two-stars"
                ).style.width = `${reviewWidths.twoStarWidth}%`;
                document.getElementById(
                    "one-stars"
                ).style.width = `${reviewWidths.oneStarWidth}%`;

                document.getElementById("mostRelevantReviews").innerText =
                    "User reviews sample:\n" + mapReviews.mostRelevantReviews;
                // chrome.storage.local.remove(['mapQueryResults']);
            } else {
                document.getElementById("noReviewsFound").innerText =
                    result.mapQueryResults.message;
            }
        }
    });
});
