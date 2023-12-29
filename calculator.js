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

const operationButtons = document.querySelector('.operation-buttons');
const displayText = document.querySelector('.display-text');
let displayContent = displayText.textContent;
operationButtons.addEventListener('click', (buttonClicked) => {
    let selectedSymbol = buttonClicked.target;
    displayText.textContent = displayContent.concat('', String(selectedSymbol.id));
    displayContent = displayText.textContent;
});

//Apply operations once

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

//Create a function that takes a long string of operations and return a single operation to do.
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

//Operate now on second priority operations
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

function applyOperationsAll(equationString) {
    let equationArray = equationString.split('');
    while (equationArray.includes('*') || equationArray.includes('/')) {
        equationString = applyFirstOperations(equationString);
        equationArray = equationString.split('');
    }
    while (equationArray.slice(1).includes('+') || equationArray.slice(1).includes('-')) {
        equationString = applySecondOperations(equationString);
        equationArray = equationString.split('');
    }

    return equationString
}