// Stores current times
let times = [];

// HTML Elements
let timetext = document.getElementById("timer");
let scramble_and_button = document.getElementById("scramble-and-buttons");
let ao5text = document.getElementById("ao5");
let stats_table = document.getElementById("stats-table");

// Toggleable values
let inspection = true;
let stackmat = true;
let scramble_display = false;

// Current state of timer
let state = "idle";

// Interval/timeout variables
let timer = null;
let inspection_interval = null;
let stackmat_timeout = null;
let stackmat_down_long_enough = false;

let button_pressed = false;
let time = null;

document.addEventListener("keydown", function (event) {
    // Only triggers if button is not pressed down already (prevents repeats from holding)
    if (!button_pressed) {
        button_pressed = true;

        // Stops timer once key is down
        if (state == "running") {
            clearInterval(timer);
            timetext.style.color = "#00abff";
        }
        
        // Starts stackmat if idle and inspection isn't on or during inspection
        else if (stackmat && event.key === " ") {
            if ((state == "idle" && !inspection) || (state == "inspection")) {
                state = "stackmat";
                timetext.style.color = "#ff0000";

                stackmat_timeout = setTimeout(function () {
                    timetext.style.color = "#00ff00";
                    stackmat_down_long_enough = true;
                }, 550)
            }
        }
    }
})

document.addEventListener("keyup", function (event) {
    button_pressed = false;

    if (state == "idle" && event.key === " ") {
        // Starts inspection
        if (inspection) {
            state = "inspection";

            scramble_and_button.style.visibility = "hidden";
            ao5text.style.visibility = "hidden";
            stats_table.style.visibility = "hidden";
            display.style.visibility = "hidden";

            timetext.innerHTML = 15;
            timetext.style.color = "#ffffff";

            inspection_interval = setInterval(function () {
                let inspection_time = Number(timetext.innerHTML);
                inspection_time--;
                timetext.innerHTML = inspection_time;
            }, 1000)
        }

        // Starts timer if no inspection
        else {
            start_timer();
        }
    }
    
    // Starts timer during inspection
    else if (state == "inspection" && event.key === " ") {
        start_timer();
    }

    else if (state == "stackmat" && event.key === " ") {
        // Clears stackmat timeout
        clearTimeout(stackmat_timeout);

        // Checks if stackmat was held down long enough
        if (stackmat_down_long_enough) {
            // Starts timer if so
            stackmat_down_long_enough = false;
            start_timer();
        }
        else {
            // Resets timer to original state if not
            if (inspection) {
                state = "inspection";
                timetext.style.color = "#ffffff";
            }
            else {
                state = "idle";
                timetext.style.color = "#00abff";
            }
        }
    }

    // Sets timer to idle and saves times after key is up
    else if (state == "running") {
        // Obtains time to assign it to JSON and pushes it to array
        let time_value = timetext.innerHTML;
        time.time = Number(time_value);
        times.push(time);

        append_time_to_table(time);
        ao5_calc();

        // Sets timer and elements to visible if required
        state = "idle";
        scramble_and_button.style.visibility = "visible";
        ao5text.style.visibility = "visible";
        stats_table.style.visibility = "visible";

        if (scramble_display) {
            display.style.visibility = "visible";
        }

        scrambler();
    }
})

// Starts timer
function start_timer() {
    // Gets scramble to use in JSON
    let scramble = document.getElementById("scramble").innerHTML;

    // Determines status of time for JSON data depending on inspection time taken
    let status = "OK";
    if (inspection) {
        let inspection_remaining = Number(document.getElementById("timer").innerHTML);
        if (inspection_remaining <= -2) {
            status = "DNF";
        } 
        else if (inspection_remaining <= 0) {
            status = "+2";
        }
    }
    
    // Creates JSON for time
    time = {"time": null, "scramble": scramble, "status": status};

    // Resets timer and turns it on
    state = "running";
    clearInterval(inspection_interval);
    timetext.style.color = "#ffffff";
    timetext.innerHTML = "0.00";

    let starting_time = new Date();
    timer = setInterval(function () {
        scramble_and_button.style.visibility = "hidden";
        ao5text.style.visibility = "hidden";
        stats_table.style.visibility = "hidden";
        display.style.visibility = "hidden";

        // Increments timer
        let current_time = new Date();
        current_time = ((current_time - starting_time) / 1000).toFixed(2);
        timetext.innerHTML = current_time;
    }, 10);
}

// Creates table of times (can be used in stopping timer or loading times from user)
function append_time_to_table(time) {
    // Creates row
    let stats = document.getElementById("stats");
    let row = stats.insertRow(0);

    // Inserts time into cell
    let timecell = row.insertCell();
    if (time.status == "OK") {
        timecell.innerHTML = `${time.time.toFixed(2)}`;
    }
    else if (time.status == "+2") {
        timecell.innerHTML = `${(time.time + 2).toFixed(2)}+`;
    }
    else if (time.status == "DNF") {
        timecell.innerHTML = `DNF`;
    }

    // Inserts scramble into cell
    let scramblecell = row.insertCell();
    scramblecell.innerHTML = `${time.scramble}`;

    // Inserts +2 (i === 0), DNF (i === 1) and delete (i === 2) buttons into cell
    for (let i = 0; i < 3; i++) {
        let cell = row.insertCell();
        let button = document.createElement("button");
        let text = null;
        
        if (i === 0) {
            text = document.createTextNode("+2");
            button.className = "+2";
            
            if (time.status == "+2") {
                button.style.backgroundColor = "#abffab";
                console.log("+2 happened")
            }
        }
        else if (i === 1) {
            text = document.createTextNode("DNF");
            button.className = "DNF";

            if (time.status == "DNF") {
                button.style.backgroundColor = "#abffab";
                console.log("DNF happened")
            }
        }
        else if (i === 2) {
            text = document.createTextNode("Delete");
            button.className = "delete";
        }

        button.onclick = function() {
            // Changes time and status upon button click
            let row_num = this.parentElement.parentElement.rowIndex;
            let selected_time = times[times.length - row_num];

            if (this.className == "+2") {
                if (selected_time.status != "+2") {
                    selected_time.status = "+2";
                    stats_table.rows[row_num].cells[0].innerHTML = `${(selected_time.time + 2).toFixed(2)}+`;

                    this.style.backgroundColor = "#abffab";
                    stats_table.rows[row_num].cells[3].childNodes[0].style.backgroundColor = "#ffffff";
                }
                else {
                    selected_time.status = "OK";
                    stats_table.rows[row_num].cells[0].innerHTML = selected_time.time;

                    this.style.backgroundColor = "#ffffff";
                }
            }
            else if (this.className == "DNF") {
                if (selected_time.status != "DNF") {
                    selected_time.status = "DNF";
                    stats_table.rows[row_num].cells[0].innerHTML = "DNF";

                    this.style.backgroundColor = "#abffab";
                    stats_table.rows[row_num].cells[2].childNodes[0].style.backgroundColor = "#ffffff";
                }
                else {
                    selected_time.status = "OK";
                    stats_table.rows[row_num].cells[0].innerHTML = selected_time.time;

                    this.style.backgroundColor = "#ffffff";
                }
            }

            // Deletes time
            else if (this.className == "delete") {
                stats_table.deleteRow(row_num);
                times.splice(times.length - row_num, 1);
            }

            ao5_calc();
            this.blur();
        }
        button.appendChild(text);
        cell.appendChild(button);
    }
}

// Calculate olympic average of 5 solves
function ao5_calc() {
    // Leaves average of 5 blank if 5 solves are not done
    if (times.length < 5) {
        ao5text.innerHTML = "Average of 5: -";
        return;
    }

    let ao5times = [];

    // Adds actual value of valid times to last 5 times
    for (let i = times.length - 1; i > times.length - 6; i--) {
        if (times[i].status == "DNF") {
            continue;
        }
        else if (times[i].status == "+2") {
            ao5times.push(times[i].time + 2);
        }
        else if (times[i].status == "OK") {
            ao5times.push(times[i].time);
        }
    }

    // If 3 or less non-DNF solves, ao5 is DNF
    if (ao5times.length <= 3) {
        ao5text.innerHTML = "Average of 5: DNF";
        return;
    }
    // If no solves are DNFed, max can be calculated and removed from array, otherwise leave max out as it will be DNF
    else if (ao5times.length == 5) {
        max = Math.max.apply(null, ao5times);
        ao5times.splice(ao5times.indexOf(max), 1);
    }

    // Calculate min of solve and remove from array
    min = Math.min.apply(null, ao5times);
    ao5times.splice(ao5times.indexOf(min), 1);

    // Mean calculation of counting 3 solves
    let sum = 0;
    for (let i = 0; i < ao5times.length; i++) {
        sum += ao5times[i];
    }

    ao5 = sum / 3;
    ao5text.innerHTML = `Average of 5: ${ao5.toFixed(2)}`;
}