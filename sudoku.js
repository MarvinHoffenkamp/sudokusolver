//implementatie van de backtracking sudoku algoritme. zie https://en.wikipedia.org/wiki/Sudoku_solving_algorithms
/*
Het brute force algoritme gaat de lege cellen van de puzzel af en vult deze aan met een getal van 1 tot 9.
Wanneer een getal niet voldoet aan de regels van het sudoku spel, wordt het getal in de cel verhoogd met 1. 
Als dit niet lukt (en 1 tot 9 niet in de desbetreffende cel past) wordt het getal weer op 0 gezet en wordt de vorige cel opnieuw gecontroleerd en opgehoogd.
Het algoritme wordt herhaald tot de puzzel (en dus alle 81 cellen) is ingevuld.
*/


//initialize variables
let board = [];
let sudokuBoard = [];

//log functie, schrijft naar een HTML element met id logger
function log(message) {
    document.getElementById('logger').innerText += "\n" + message ;
}

/*
recursively test all possible numbers for a given cell until
the puzzle is solved.
*/
function get_possible_number(index) {

    //if the index is greater than 80, the puzzle is solved
    if (index >= sudokuBoard.length) {
        return true;
    } else if (sudokuBoard[index] != 0) {
        //if the cell is not empty, skip it
        return get_possible_number(index + 1);
    }

    //test all possible numbers for the given cell
    for (var i = 1; i <= 9; i++) {
        if (check_valid(i, Math.floor(index / 9), index % 9)) {
            sudokuBoard[index] = i;
            if (get_possible_number(index + 1)) {
                return true;
            }
        }
    }

    sudokuBoard[index] = 0;
    return false;
}

/*
check if the number is a legal candidate
for the given cell (by Sudoku rules).
*/
function check_valid(number, row, column) {
    for (var i = 0; i < 9; i++) {

        //calculate the index of the cell in the box
        var b_index = ((Math.floor(row / 3) * 3) + Math.floor(i / 3)) * 9 + (Math.floor(column / 3) * 3) + (i % 3);

        //check if the number is already in the row (first check), column (second check) or box (third check)
        if (number == sudokuBoard[(row * 9) + i] ||
            number == sudokuBoard[column + (i * 9)] ||
            number == sudokuBoard[b_index]) {
            return false;
        }
    }
    return true;
}

function solve() {
    log("Getting numbers from input fields...")
    var puzzle = parseInputs();

    log("Solving puzzle...")
    sudokuBoard = puzzle.split('').map(function (i) { 
        return isNaN(i) ? 0 : +i 
    });

    if (puzzle.length !== 81) {
        log('Puzzle is not valid.');
    }

    return !get_possible_number(0) ? log('No solution found.') : populateFields(sudokuBoard);
}

/*
function responsible for parsing the input fields and returning a string of 81 numbers to be solved by the algorithm
*/
function parseInputs() {
    var inputs = document.getElementsByName('sudokuArray[]');

    let givens = 0;
    for(let input of inputs) {
        if (input.value == "") {
            board.push(0);
        } else if (/[1-9]/.test(input.value)){
            board.push(input.value);
            givens++;
        } else {
            log("Invalid input: " + input.value + " is not a number between 1 and 9");
            throw new Error("Invalid input: " + input.value + " is not a number between 1 and 9");
        }
    }

    if (givens < 17) {
        log("Not enough givens to solve the puzzle. Please enter at least 17 givens.");
        throw new Error("Not enough givens to solve the puzzle. Please enter at least 17 givens.");
    }

    return board.join('');
}

/*
function responsible for populating the input fields with the solution
*/
function populateFields(puzzle) {
    var inputs = document.getElementsByName('sudokuArray[]');

    for(var i = 0; i < inputs.length; i++) {
        inputs[i].value = puzzle[i];
    }

    log("Puzzle solved!");
}