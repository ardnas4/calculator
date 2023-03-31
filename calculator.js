// select the screen
const screen = document.querySelector('.screen');

let current = '', operands = [], operator = '', answer = 0;

// Function to take in operands
// turn key presses into digits
document.querySelectorAll('.number').forEach(a => a.addEventListener('click', logDigit));

function logDigit(e) {
    // Check if equals was pressed, clears operands
    if (pressedEquals && !operator) {
        clearNumbers();
        pressedEquals = false;
    }

    // Clear highlighted operator on next key press
    removeActiveOperator();

    // Include decimal
    if (e.target.value == '.' && current.indexOf('.') >= 0) {
        return;
    }

    // Cancel if too long    
    if (screen.offsetWidth >= 300) {
        return;
    }

    // update the screen with the user's input
    updateScreen(current);

    // turn digits into operands
    current += e.target.value;

    // if first entry is a decimal it is 0.1 by default
    if (current == '.') {
        current = '0.';
    }

    // reupdate the screen
    updateScreen(current);
}

function updateScreen(text) {
    let screenText = text;
    screen.innerText = screenText;
}

// set listeners on operators
const operatorKeys = document.querySelectorAll('.operator');
operatorKeys.forEach(a => a.addEventListener('click', setOperator));

// turns pressed key into operator
function setOperator(e) {
    // if there is no 2nd operand, don't do anything
    if (!current && current != '0' && !operands.length) {
        return;
    }

    // set the 2nd operand
    setNumbers();

    // if we have at least 2 operands, we can perform operations
    if (operands.length >= 2) {
        operate(e);
    }

    // get the operator 
    operator = e.target.value;
    console.log(operator)

    // highlight active operator
    removeActiveOperator();

    e.target.classList.add('active-operator');
}

// remove the highlight for operator 
function removeActiveOperator() {
    operatorKeys.forEach(a => a.classList.remove('active-operator'));
}

// setting operands
function setNumbers() {
    // check if the 2nd operator is valid. If not, don't do anything
    if (!current && current != '0') return;

    // add number to list
    operands.push(parseFloat(current));

    // reset the current number
    current = '';
}

// empty the list of operands
function clearNumbers() {
    operands = [];
}

// when the user pushes "=", it is time to evaluate the expression!
document.querySelector('.equals').addEventListener('click', operate);

// upon startup, we assume that nothing has to be evaluated until "=" is pushed
let pressedEquals = false;

// performs operation based on operator
function operate(e) {
    // if there are not at least 2 operands, don't do anything
    if (operands.length < 2) {
        return;
    }

    // otherwise, push the 2nd operand 
    setNumbers();

    // depending on the operator, perform the correct operation
    switch (operator) {
        // addition
        case '+':
            answer = add(operands);
            break;

        // subtraction
        case '-':
            answer = subtract(operands);
            break;

        // multiplication
        case '*':
            answer = multiply(operands);
            break;

        // division
        case '/':
            // if 2nd operand is 0, you can't divide by 0. Let the user know wassup
            if (operands[1] == 0) {
                updateScreen('Invalid');

                // after a second, clear the screen
                return setTimeout(allClear, 1000);
            }

            // otherwise, perform the division
            answer = divide(operands);
            break;

        // no operator. Tell the user
        default:
            updateScreen('Invalid');

            // after a second, clear the screen
            return setTimeout(allClear, 1000);
    }

    // set answer as new number 1
    current = answer;

    // now that we have the answer, display it on the screen
    updateScreen(current);

    // clean up data
    clearNumbers();
    setNumbers();
    current = '';

    // equal button got pushed
    if (e.target.value == 'equals') {
        pressedEquals = true;
        operator = null;
    }
}

// addition
function add(numbers) {
    let x = numbers[0], y = numbers[1];

    return x + y;
}

// subtraction
function subtract(numbers) {
    let x = numbers[0], y = numbers[1];

    return x - y;
}

// multiplication
function multiply(numbers) {
    let x = numbers[0], y = numbers[1];

    return x * y;
}

// division
function divide(numbers) {
    let x = numbers[0], y = numbers[1];

    return x / y;
}

// allows the user to /= 100
document.querySelector('.module').addEventListener('click', module);
function module() {
    // if there is nothing to divide, don't do anything
    if (!current) {
        return;
    }

    // otherwise, perform the operation
    current /= 100;

    // update the screen with the answer
    updateScreen(current);
}

// sqrt => math sqrt on current number
document.querySelector('.sqrt').addEventListener('click', sqrt);
function sqrt() {
    // if there is nothing to divide, don't do anything
    if (!current) {
        return;
    }
    
    current = Math.sqrt(current);
    updateScreen(current);
}

// listens for delete
document.querySelector('.delete').addEventListener('click', backspace);

// removes the number at the end of the screen
function backspace() {
    current = current.slice(0, -1);
    if (!current)  return updateScreen('0');
    updateScreen(current);
}

// listens for all-clear button
document.querySelector('.all-clear').addEventListener('click', allClear);

// clears out everything 
function allClear() {
    current = '';
    updateScreen('0');
    clearNumbers();
    operator = null;
    removeActiveOperator();
}