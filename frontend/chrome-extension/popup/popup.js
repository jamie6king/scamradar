window.onload = () => {
	const form = document.querySelector("form")
	form.onsubmit = submitted.bind(form)
}

function submitted (event){
	event.preventDefault();
	const registrationNumber = event.target.textInput.value;
	chrome.runtime.sendMessage({ type: "registrationNumber", registrationNumber: registrationNumber });
}
