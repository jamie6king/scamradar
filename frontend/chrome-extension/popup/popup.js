window.onload = () => {
	const form = document.querySelector("form")
	form.onsubmit = submitted.bind(form)
}

function submitted (event){
	event.preventDefault();
	const registrationNumber = event.target.textInput.value;
	chrome.runtime.sendMessage({ type: "registrationNumber", registrationNumber: registrationNumber });

	alert(event.target.textInput.value)
}
// document.addEventListener('DOMContentLoaded', () => {
//     const button = document.getElementById('formSubmit');
//     button.addEventListener('click', () => {
//         console.log('Button clicked!');
//         // Your function logic here
//     });
// });