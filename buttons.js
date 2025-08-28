let inspection_button = document.getElementById("inspection-toggle");
let stackmat_button = document.getElementById("stackmat-toggle");
let display_button = document.getElementById("display-toggle");

// Toggles inspection
function inspection_toggle() {
    inspection = !inspection;

    if (inspection) {
        inspection_button.innerHTML = "Inspection: ON";
        inspection_button.style.backgroundColor = "#abffab";
    }
    else {
        inspection_button.innerHTML = "Inspection: OFF";
        inspection_button.style.backgroundColor = "#ffffff";
    }

    inspection_button.blur();
}

// Toggles stackmat
function stackmat_toggle() {
    stackmat = !stackmat;

    if (stackmat) {
        stackmat_button.innerHTML = "Stackmat: ON";
        stackmat_button.style.backgroundColor = "#abffab";
    }
    else {
        stackmat_button.innerHTML = "Stackmat: OFF";
        stackmat_button.style.backgroundColor = "#ffffff";
    }

    stackmat_button.blur();
}

// Toggle scramble display
function display_toggle() {
    scramble_display = !scramble_display;
    
    if (scramble_display) {
        display_button.innerHTML = "Scramble Display: ON";
        display_button.style.backgroundColor = "#abffab";
        display.style.visibility = "visible";
    }
    else {
        display_button.innerHTML = "Scramble Display: OFF";
        display_button.style.backgroundColor = "#ffffff";
        display.style.visibility = "hidden";
    }

    display_button.blur();
}