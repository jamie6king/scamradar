window.onload = () => {
    const form = document.querySelector("form");
    form.onsubmit = submitted.bind(form);
};

function submitted(event) {
    event.preventDefault();
    const registrationNumber = event.target.textInput.value;
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("input").classList.add("hidden");
    document.getElementById("header").classList.add("hidden");
    chrome.runtime.sendMessage({
        type: "registrationNumber",
        registrationNumber: registrationNumber,
    });
    // chrome.action.setPopup({ popup: "popup/results.html" });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const tick = "\u2713";
    const cross = "\u2717";
    if (message.type === "results") {
        sendResponse({ status: "success" });

        const response = message.carReport.reportResults;
        let [year, month, day] = response.motData.motTestDueDate.split("-");
        let newMotDate = `${day}-${month}-${year}`;

        setTimeout(() => {
            document.getElementById("loading").classList.add("hidden");
            document.getElementById("output").classList.remove("hidden");
        }, 1500);

        document.getElementById("make").innerText = response.make;
        if (response.make.slice(0, 4) === "Pass") {
            document.getElementById("make-tick-cross").innerText = tick;
            document.getElementById("make-tick-cross").style.color = "green";
        } else {
            document.getElementById("make-tick-cross").innerText = cross;
            document.getElementById("make-tick-cross").style.color = "#EF233C";
        }

        document.getElementById("model").innerText = response.model;
        if (response.model.slice(0, 4) === "Pass") {
            document.getElementById("model-tick-cross").innerText = tick;
            document.getElementById("model-tick-cross").style.color = "green";
        } else {
            document.getElementById("model-tick-cross").innerText = cross;
            document.getElementById("model-tick-cross").style.color = "#EF233C";
        }

        document.getElementById("colour").innerText = response.colour;
        if (response.colour.slice(0, 4) === "Pass") {
            document.getElementById("colour-tick-cross").innerText = tick;
            document.getElementById("colour-tick-cross").style.color = "green";
        } else {
            document.getElementById("colour-tick-cross").innerText = cross;
            document.getElementById("colour-tick-cross").style.color =
                "#EF233C";
        }

        document.getElementById("fuel-type").innerText = response.fuelType;

        if (response.fuelType.slice(0, 4) === "Pass") {
            document.getElementById("fuel-tick-cross").innerText = tick;
            document.getElementById("fuel-tick-cross").style.color = "green";
        } else {
            document.getElementById("fuel-tick-cross").innerText = cross;
            document.getElementById("fuel-tick-cross").style.color = "#EF233C";
        }
        document.getElementById("registration-date").innerText =
            response.registrationDate;
        if (response.registrationDate.slice(0, 4) === "Pass") {
            document.getElementById("reg-tick-cross").innerText = tick;
            document.getElementById("reg-tick-cross").style.color = "green";
        } else {
            document.getElementById("reg-tick-cross").innerText = cross;
            document.getElementById("reg-tick-cross").style.color = "#EF233C";
        }

        document.getElementById("mileage").innerText = response.mileage;

        if (response.mileage.slice(0, 4) === "Pass") {
            document.getElementById("milage-tick-cross").innerText = tick;
            document.getElementById("milage-tick-cross").style.color = "green";
        } else {
            document.getElementById("milage-tick-cross").innerText = cross;
            document.getElementById("milage-tick-cross").style.color =
                "#EF233C";
        }

        document.getElementById("tax-status").innerText = response.taxStatus;

        if (response.taxStatus.slice(0, 4) === "Pass") {
            document.getElementById("tax-tick-cross").innerText = tick;
            document.getElementById("tax-tick-cross").style.color = "green";
        } else {
            document.getElementById("tax-tick-cross").innerText = cross;
            document.getElementById("tax-tick-cross").style.color = "#EF233C";
        }
        document.getElementById("outstanding-recall").innerText =
            response.hasOutstandingRecall;
        if (response.hasOutstandingRecall.slice(0, 4) === "Pass") {
            document.getElementById("recall-tick-cross").innerText = tick;
            document.getElementById("recall-tick-cross").style.color = "green";
        } else {
            document.getElementById("recall-tick-cross").innerText = cross;
            document.getElementById("recall-tick-cross").style.color =
                "#EF233C";
        }
        // document.getElementById("mot-required").innerText = "MOT Required:\n" + (response.motRequired ? "Yes" : "No");
        document.getElementById("mot-due").innerText = newMotDate;

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
            const relevantReviews = {
                first: mapReviews.mostRelevantReviews[0].description,
                user1: mapReviews.mostRelevantReviews[0].username,
                second: mapReviews.mostRelevantReviews[1].description,
                user2: mapReviews.mostRelevantReviews[1].username,
                third: mapReviews.mostRelevantReviews[2].description,
                user3: mapReviews.mostRelevantReviews[2].username,
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

                document.getElementById("first-review").innerText =
                    relevantReviews.first;
                document.getElementById("username-1").innerText =
                    relevantReviews.user1;
                document.getElementById("second-review").innerText =
                    relevantReviews.second;
                document.getElementById("username-2").innerText =
                    relevantReviews.user2;
                document.getElementById("third-review").innerText =
                    relevantReviews.third;
                document.getElementById("username-3").innerText =
                    relevantReviews.user3;
            } else {
                document.getElementById("noReviewsFound").innerText =
                    result.mapQueryResults.message;
            }
        }
    });
    chrome.storage.local.get(["companyInfo"], (result) => {
        if (result.companyInfo) {
            document.getElementById("businessInfo").innerText =
                JSON.stringify(result);
        }
    });
});
