window.onload = () => {
    const form = document.querySelector("form");
    form.onsubmit = submitted.bind(form);
};

function submitted(event) {
    event.preventDefault();
    const registrationNumber = event.target.textInput.value;
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

        document.getElementById("input").classList.add("hidden");
        document.getElementById("output").classList.remove("hidden");

        document.getElementById("make").innerText = "Make:\n" + response.make;
        document.getElementById("model").innerText = "Model:\n" + response.model;
        document.getElementById("colour").innerText = "Colour:\n" + response.colour;
        document.getElementById("fuel-type").innerText = "Fuel Type:\n" + response.fuelType;
        document.getElementById("registration-date").innerText = "Registration Date:\n" + response.registrationDate;
        document.getElementById("mileage").innerText = "Mileage:\n" + response.mileage;
        document.getElementById("tax-status").innerText = "Tax Status:\n" + response.taxStatus;
        document.getElementById("outstanding-recall").innerText = "Outstanding Recalls:\n" + response.hasOutstandingRecall;
				// document.getElementById("mot-required").innerText = "MOT Required:\n" + (response.motRequired ? "Yes" : "No");
        document.getElementById("mot-due").innerText = "MOT Due Date:\n" + response.motTestDueDate;
        // document.getElementById("mot-data").innerText = "MOT Failures:\n" + response.motFailures.map((failure) => failure);
    }
});
