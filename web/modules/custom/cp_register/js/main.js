function show_left_menu() {
    var x = document.getElementById("left_bar");
    if (x.style.display === "none") {
        x.style.display = "block";
        x.style.opacity = "1";
    } else {
        x.style.display = "none";
        x.style.opacity = "0";
    }
}
