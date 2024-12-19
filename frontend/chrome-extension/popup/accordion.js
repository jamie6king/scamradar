function openInfo(evt, tabName) {
    let i, tabContent, tabLinks;

    // Hide all tab contents
    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Remove 'active' class from all buttons
    tabLinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    // Show the clicked tab content
    document.getElementById(tabName).style.display = "block";

    // Add 'active' class to the clicked button
    evt.currentTarget.classList.add("active");
}

// Add event listeners to each tab button

let tabButtons = document.querySelectorAll(".tablinks");
tabButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
        let tabName = event.currentTarget.getAttribute("data-tab");
        openInfo(event, tabName);
    });
});

// Automatically click the first tab on page load
tabButtons[0].click(); // Simulate clicking the first tab
