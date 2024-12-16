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

        document.getElementById("make").innerText = "Make: " + response.make;
    }
});
