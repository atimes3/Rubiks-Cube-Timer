let cube_net = null;
let display = document.getElementById("scramble-display");

scrambler();

// Generates scramble
function scrambler() {
    cube_net = [
        [
            ["W", "W", "W"],
            ["W", "W", "W"],
            ["W", "W", "W"]
        ],
        [
            ["O", "O", "O"],
            ["O", "O", "O"],
            ["O", "O", "O"]
        ],
        [
            ["G", "G", "G"],
            ["G", "G", "G"],
            ["G", "G", "G"]
        ],
        [
            ["R", "R", "R"],
            ["R", "R", "R"],
            ["R", "R", "R"]
        ],
        [
            ["B", "B", "B"],
            ["B", "B", "B"],
            ["B", "B", "B"]
        ],
        [
            ["Y", "Y", "Y"],
            ["Y", "Y", "Y"],
            ["Y", "Y", "Y"]
        ]
    ];

    // [U, L, F, R, B, D]
    // W: White, Y: Yellow, R: Red, O: Orange, G: Green, B: Blue

    let move_notation = [
        ["R", "R2", "R'"],
        ["L", "L2", "L'"],
        ["U", "U2", "U'"],
        ["D", "D2", "D'"],
        ["F", "F2", "F'"],
        ["B", "B2", "B'"]
    ]; // Possible moves

    // Generate scramble length between 20 and 22 moves
    let scramble_length = Math.floor((Math.random() * 3 + 20));

    let scramble = "";

    // Sets dummy values that are equal to each other at first
    let prevprevside = -1;
    let prevside = -1;
    let side = -1;

    // Iterates until move count is equal to desired scramble length
    let move_number = 0;
    while (move_number < scramble_length) {

        // Generates side
        side = Math.floor((Math.random() * 6));

        // Checks if generated side is equal to previous side
        if (prevside == side) {
            continue;
        }
        // Checks if generated side is on the same axis as previous side, and if so, checks if the side before that is the same as generated side
        else if (side % 2 == 0 && prevside == side + 1 && prevprevside == side && prevside != -1) {
            continue;
        } else if (side % 2 == 1 && prevside == side - 1 && prevprevside == side) {
            continue;
        } else {
            prevprevside = prevside;
            prevside = side;

            let direction = Math.floor((Math.random() * 3)); // Generates direction

            // Makes a move on cube display based on generated move
            for (let i = 0; i <= direction; i++) {
                switch (side) {
                    case 0:
                        right();
                        break;
                    case 1:
                        left();
                        break;
                    case 2:
                        up();
                        break;
                    case 3:
                        down();
                        break;
                    case 4:
                        front();
                        break;
                    case 5:
                        back();
                        break;
                }
            }

            // Generates move from array
            let move = move_notation[side][direction];
            scramble += move + " ";

            // Adds scramble to HTML
            let scramble_para = document.getElementById("scramble");
            scramble_para.innerHTML = scramble;

            move_number++;
        }
    }

    let scrambler_button = document.getElementById("scrambler-button");
    scrambler_button.blur();

    // Displays scramble onto cube
    for (let i = 0; i < 6; i++) {
        let face = display.childNodes[(2 * i) + 1]; // (2 * i) + 1 skips whitespace text nodes

        for (let j = 0; j < 3; j++) {
            let row = face.childNodes[(2 * j) + 1];

            for (let k = 0; k < 3; k++) {
                let square = row.childNodes[(2 * k) + 1];
                switch (cube_net[i][j][k]) {
                    case "W":
                        square.style.backgroundColor = "#ffffff";
                        break;
                    case "Y":
                        square.style.backgroundColor = "#ffff00";
                        break;
                    case "R":
                        square.style.backgroundColor = "#ff0000";
                        break;
                    case "O":
                        square.style.backgroundColor = "#ff8000";
                        break;
                    case "G":
                        square.style.backgroundColor = "#00ff00";
                        break;
                    case "B":
                        square.style.backgroundColor = "#0000ff";
                        break;
                }
            }
        }
    }
}

// Functions for moving faces clockwise

function right() {
    // 2D array rotation found at https://stackoverflow.com/a/58668351
    cube_net[3] = cube_net[3][0].map((val, index) => cube_net[3].map(row => row[index]).reverse());

    let temp = [];
    for (let i = 0; i < 3; i++) {
        temp[i] = cube_net[0][i][2]
        cube_net[0][i][2] = cube_net[2][i][2];
        cube_net[2][i][2] = cube_net[5][i][2];
        cube_net[5][i][2] = cube_net[4][2 - i][0];
        cube_net[4][2 - i][0] = temp[i];
    }
}

function left() {
    cube_net[1] = cube_net[1][0].map((val, index) => cube_net[1].map(row => row[index]).reverse());

    let temp = [];
    for (let i = 0; i < 3; i++) {
        temp[i] = cube_net[0][i][0]
        cube_net[0][i][0] = cube_net[4][2 - i][2];
        cube_net[4][2 - i][2] = cube_net[5][i][0];
        cube_net[5][i][0] = cube_net[2][i][0];
        cube_net[2][i][0] = temp[i];
    }
}

function up() {
    cube_net[0] = cube_net[0][0].map((val, index) => cube_net[0].map(row => row[index]).reverse());

    let temp = cube_net[1][0];
    for (let i = 1; i < 4; i++) {
        cube_net[i][0] = cube_net[i + 1][0];
    }
    cube_net[4][0] = temp;
}

function down() {
    cube_net[5] = cube_net[5][0].map((val, index) => cube_net[5].map(row => row[index]).reverse());

    let temp = cube_net[4][2];
    for (let i = 4; i > 1; i--) {
        cube_net[i][2] = cube_net[i - 1][2];
    }
    cube_net[1][2] = temp;
}

function front() {
    cube_net[2] = cube_net[2][0].map((val, index) => cube_net[2].map(row => row[index]).reverse());

    let temp = [];
    for (let i = 0; i < 3; i++) {
        temp[i] = cube_net[0][2][i];
        cube_net[0][2][i] = cube_net[1][2 - i][2];
        cube_net[1][2 - i][2] = cube_net[5][0][2 - i];
        cube_net[5][0][2 - i] = cube_net[3][i][0];
        cube_net[3][i][0] = temp[i];
    }
}

function back() {
    cube_net[4] = cube_net[4][0].map((val, index) => cube_net[4].map(row => row[index]).reverse());

    let temp = [];
    for (let i = 0; i < 3; i++) {
        temp[i] = cube_net[0][0][i];
        cube_net[0][0][i] = cube_net[3][i][2];
        cube_net[3][i][2] = cube_net[5][2][2 - i];
        cube_net[5][2][2 - i] = cube_net[1][2 - i][0];
        cube_net[1][2 - i][0] = temp[i];
    }
}
