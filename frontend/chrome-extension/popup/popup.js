window.onload = () => {
	const form = document.querySelector("form")
	form.onsubmit = submitted.bind(form)
}

function submitted (event){
	event.preventDefault();
	const registrationNumber = event.target.textInput.value;
	chrome.runtime.sendMessage({ type: "registrationNumber", registrationNumber: registrationNumber });
}

const showReviews = () => {
	const button = document.getElementById("expandReviews")
	button.addEventListener('click', () => {
		chrome.runtime.sendMessage({ type: "showReviews" }, (response) => {
			console.log("hello")
		})
	})
}

document.addEventListener('DOMContentLoaded', showReviews);