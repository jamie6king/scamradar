let acc1 = document.getElementsByClassName("reviews-accordion");
let j;
console.log("test click!!");

for (j = 0; j < acc.length; j++) {
    acc1[j].addEventListener("click", function () {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}
