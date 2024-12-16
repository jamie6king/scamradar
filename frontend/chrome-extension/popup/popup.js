window.onload = () => {
	const form = document.querySelector("form")
	form.onsubmit = submitted.bind(form)
}

function submitted (event){
	event.preventDefault();
	const registrationNumber = event.target.textInput.value;
	chrome.runtime.sendMessage({ type: "registrationNumber", registrationNumber: registrationNumber });
	// chrome.action.setPopup({ popup: "popup/results.html" });
}

document.addEventListener("click", function () {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(message)  
			if (message.type === "results") {
            console.log(message.carReport);
            sendResponse({ status: "success" });
        }
    });
});
