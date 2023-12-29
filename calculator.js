function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

let firstNumberChoice = 0;
let secondNumberChoice = 0;
let operandChoice = "";

function operate(firstNumber, operator, secondNumber) {
    if (operator === "+") {
        return add(firstNumber, secondNumber);
    } else if (operator === "-") {
        return subtract(firstNumber, secondNumber);
    } else if (operator === "*") {
        return multiply(firstNumber, secondNumber);
    } else if (operator === "/") {
        return divide(firstNumber, secondNumber);
    }
}

//Define operations
function applyOperationOnce(operationString) {
    //Transform the simple operation string into a simple operation array
    let operationArray = operationString.split('');

    //Determine the operator and get it's index
    let arrayOperator = operationArray.filter(symbol => symbol == '+' || symbol == '-' || symbol == '*' || symbol == '/').join('');
    let arrayOperatorIndex = operationArray.indexOf(arrayOperator);

    //Determine left side and right side of the equation
    let leftSide = Number(operationArray.slice(0, arrayOperatorIndex).join(''));
    let rightSide = Number(operationArray.slice(arrayOperatorIndex + 1).join(''));

    return operate(leftSide, arrayOperator, rightSide);
}

//Executes first priority operations ("*", "/") in order
function applyFirstOperations(operationString) {
    let operationArray = operationString.split('');

    //Gets the first of first priority operators ("*" or "/")
    let firstArrayOperator = operationArray.filter(symbol => symbol == '*' || symbol == '/')[0];
    let arrayOperatorIndex = operationArray.indexOf(firstArrayOperator);
    
    //Get whatever is right or left of the operation array and slice it at the closest operator
    let rightOperationArray = operationArray.slice(arrayOperatorIndex + 1);
    let nextArrayOperator = rightOperationArray.filter(symbol => symbol == '+' || symbol == '-' || symbol == '*' || symbol == '/')[0];
    let nextArrayOperatorIndex = rightOperationArray.indexOf(nextArrayOperator);

    //Fixes the issue of there being no next array operator, returning an index of -1
    let rightSideOperation = 0
    if (nextArrayOperatorIndex == -1) {
        rightSideOperation = Number(rightOperationArray.slice(0).join(''));
    } else {
        rightSideOperation = Number(rightOperationArray.slice(0, nextArrayOperatorIndex).join(''));
    }

    let leftOperationArray = operationArray.slice(0, arrayOperatorIndex);
    let previousArrayOperator = leftOperationArray.filter(symbol => symbol == '+' || symbol == '-' || symbol == '*' || symbol == '/').reverse()[0];
    let previousArrayOperatorIndex = leftOperationArray.lastIndexOf(previousArrayOperator);
    let leftSideOperation = Number(leftOperationArray.slice(previousArrayOperatorIndex + 1).join(''));

    //Get operation result
    let operationResult = operate(leftSideOperation, firstArrayOperator, rightSideOperation);

    //Round the operation result if needed
    
    if (!Number.isInteger(operationResult)) {
        operationResult = Math.round(operationResult * 100) / 100;
    }

    //Get first index and last index containing the expression (it's coordinates in the equation)
    let subOperationStart = arrayOperatorIndex - leftSideOperation.toString().length;
    let subOperationLength = leftSideOperation.toString().length + rightSideOperation.toString().length + 1;

    //Replace original operation by result
    operationArray.splice(subOperationStart, subOperationLength, operationResult);
    return operationArray.join('');
}

//Executes second priority operations ("+", "-") in order
function applySecondOperations(operationString) {
    let operationArray = operationString.split('');
    //Make adjustments so negative number markers ("-") are not read as operators
    let adjustedOperationArray = operationArray.slice(1);

    //Gets the first of second priority operators ("*" or "/")
    let firstArrayOperator = adjustedOperationArray.filter(symbol => symbol == '+' || symbol == '-')[0];
    let arrayOperatorIndex = adjustedOperationArray.indexOf(firstArrayOperator) + 1;

    //Get whatever is right or left of the operation array and slice it at the closest operator
    let rightOperationArray = operationArray.slice(arrayOperatorIndex + 1);
    let nextArrayOperator = rightOperationArray.filter(symbol => symbol == '+' || symbol == '-')[0];
    let nextArrayOperatorIndex = rightOperationArray.indexOf(nextArrayOperator);

    //Fixes the issue of there being no next array operator, returning an index of -1
    let rightSideOperation = 0
    if (nextArrayOperatorIndex == -1) {
        rightSideOperation = Number(rightOperationArray.slice(0).join(''));
    } else {
        rightSideOperation = Number(rightOperationArray.slice(0, nextArrayOperatorIndex).join(''));
    }

    let leftSideOperation = Number(operationArray.slice(0, arrayOperatorIndex).join(''));

    //Get operation result
    let operationResult = operate(leftSideOperation, firstArrayOperator, rightSideOperation);

    //Round the operation result if needed
    if (!Number.isInteger(operationResult)) {
        operationResult = Math.round(operationResult * 100) / 100;
    }

    //Get first index and last index containing the expression (it's coordinates in the equation)
    let subOperationStart = arrayOperatorIndex - leftSideOperation.toString().length;
    let subOperationLength = leftSideOperation.toString().length + rightSideOperation.toString().length + 1;

    //Replace original operation by result
    operationArray.splice(subOperationStart, subOperationLength, operationResult);
    return operationArray.join('');
}

//Apply a chain of operations
function applyOperationsAll(equationString) {
    let equationArray = equationString.split('');
    //Verifies if string ends with an operator. If so, returns invalid.
    let firstArraySymbol = equationArray[0];
    let lastArraySymbol = equationArray.slice().reverse()[0];
    if (lastArraySymbol == '*' || 
        lastArraySymbol == '/' || 
        lastArraySymbol == '+' || 
        lastArraySymbol == '-' ||
        firstArraySymbol == '*' ||
        firstArraySymbol == '/' ||
        firstArraySymbol == '+') {
        return "Invalid!"
    } else {
        while (equationArray.includes('*') || equationArray.includes('/')) {
            equationString = applyFirstOperations(equationString);
            equationArray = equationString.split('');
        }
        while (equationArray.slice(1).includes('+') || equationArray.slice(1).includes('-')) {
            equationString = applySecondOperations(equationString);
            equationArray = equationString.split('');
        }
        if (equationString == "Infinity" || equationString == "-Infinity" || equationString == "NaN") {
            return "Careful! The fabric of the universe might rip apa-";
        } else {
            return equationString;
        }
    }
}

//Store last button pressed
/*
let lastButtonPressed = "";
const operatorButtons = document.querySelector('.buttons');
operatorButtons.addEventListener('click', (buttonClicked) => {
    let whichButtonClicked = buttonClicked.target;
    lastButtonPressed = whichButtonClicked.id;
    buttonPressHistory[0] = buttonPressHistory[1];
    buttonPressHistory[1] = whichButtonClicked.id;
    if (isOperator(buttonPressHistory[1]) && isOperator(buttonPressHistory[0])) {
        console.log('No, dont!');
    }
});
*/
function isOperator(string) {
    return string === '*' || string === '/' || string === '+' || string === '-';
}

//Populate the display with user's input
const operationButtons = document.querySelector('.operation-buttons');
const displayText = document.querySelector('.display-text');
let displayContent = displayText.textContent;
let lastSymbol = '';
operationButtons.addEventListener('click', (buttonClicked) => {
    lastSymbol = displayContent.split('').slice().reverse('')[0];
    console.log(lastSymbol);
    let selectedSymbol = buttonClicked.target;
    if (!(isOperator(selectedSymbol.id) && isOperator(lastSymbol))) {
        displayText.textContent = displayContent.concat('', String(selectedSymbol.id));
        displayContent = displayText.textContent;
    }
});

//Gets result of user's input
const equalButton = document.querySelector('#equals');
equalButton.addEventListener('click', () => {
    displayText.textContent = applyOperationsAll(displayContent);
    displayContent = '';
});

//Clear screen
const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', () => {
    displayText.textContent = '';
    displayContent = displayText.textContent;
});

//Delete previous input symbols
const delButton = document.querySelector('#delete');
delButton.addEventListener('click', () => {
    displayText.textContent = displayContent.split('').slice(0, -1).join('');
    displayContent = displayText.textContent;
});


//Tasks
//- Make it impossible to have two operators in a row
//Make it invalid if entry starts with an operator (except to indicate negative numbers)
