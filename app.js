const buttons = document.querySelectorAll("#inputPane  div:not(#numberPane)");

// Common button functions
const removeTransition = function (e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("clicked");
};

for (let button of buttons) {
  const audio = new Audio("click.wav");

  button.addEventListener("click", function () {
    audio.play();
    audio.currentTime = 0;
    button.classList.add("clicked");
  });

  button.addEventListener("transitionend", removeTransition);
}

// numbers
const numbers = document.querySelectorAll(".numbers");
const numberValues = [...numbers].map((number) => number.dataset.value);

//operators
const operators = document.querySelectorAll(".operators");
const operatorValues = [...operators].map((number) => number.dataset.value);

// dot
const dot = document.querySelector("#dot");

// numbers + operators
const inputs = [...numbers, ...operators, dot];

let userExpression = "0";

const findPrevOperator = function (index) {
  index = index ?? userExpression.length - 1;
  for (let i = index - 1; i > -1; i--) {
    if (
      operatorValues.includes(userExpression[i]) &&
      !operatorValues.includes(userExpression[i - 1])
    ) {
      return i;
    }
  }
  return 0;
};
const findNextOperator = function (index) {
  index = index ?? 0;
  for (let i = index + 1; i < userExpression.length - 1; i++) {
    if (
      operatorValues.includes(userExpression[i]) &&
      !operatorValues.includes(userExpression[i - 1])
    ) {
      return i;
    }
  }
  return userExpression.length;
};

const prevDotExists = function () {
  for (
    let i = userExpression.length;
    i > findPrevOperator(userExpression.length);
    i--
  ) {
    if (userExpression[i] === ".") {
      return true;
    }
  }
  return false;
};

let twoOperatorsPresent = false;
const changeDisplay = function (input) {
  const currentIndex = userExpression.length - 1;
  const currentValue = userExpression[currentIndex];

  // if a number or minus comes as first input, replace userExpression with it
  if (currentIndex === 0 && currentValue === "0") {
    if (numberValues.includes(input) || input === "-") {
      userExpression = "";
    }
  }

  // if a minus comes after multiplication or division or percent, allow,
  // similarly allow if minus or multiplication comes after percent, allow
  if (operatorValues.includes(currentValue) && operatorValues.includes(input)) {
    if (currentValue === "%") {
      if (operatorValues.includes(input) && ["/", "+", "%"].includes(input)) {
        return "";
      }
    } else if (
      !(
        (currentValue === "*" ||
          currentValue === "/" ||
          currentValue === "%") &&
        input === "-"
      )
    ) {
      return "";
    }
  }

  // if a number/dot comes after percent, automatically add multiplication
  if (currentValue === "%" && [...numberValues, "."].includes(input)) {
    userExpression += "*";
  }

  // if previous dot exists, don't allow another

  if (prevDotExists() && input === ".") {
    return "";
  }

  userExpression += input;
  expression.innerText = userExpression;
};

const expression = document.querySelector("#expression");
const result = document.querySelector("#result");

inputs.forEach((input) =>
  input.addEventListener("click", function () {
    changeDisplay(input.dataset.value);
  })
);

// clear function
const clear = function () {
  result.innerText = "";
  expression.innerText = "0";
  userExpression = "0";
};

const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", clear);

//backspace function
const del = function () {
  expression.innerText = userExpression.slice(0, userExpression.length - 1);
  userExpression = expression.innerText;
};

const delBtn = document.querySelector("#backspace");
delBtn.addEventListener("click", del);

// find all operators not followed by a minus sign
const findAllOperators = function () {
  let operators = [];
  for (let i = 1; i < userExpression.length - 1; i++) {
    let currentElement = userExpression[i];
    if (
      operatorValues.includes(currentElement) &&
      !operatorValues.includes(userExpression[i - 1])
    ) {
      operators.push(currentElement);
    }
  }
  return operators;
};

const operatorPrivilages = {
  "%": 1,
  "/": 2,
  "*": 3,
  "+": 4,
  "-": 5,
};

// order operators based on their priorities
const orderOperators = function (operators) {
  operators.sort(function (a, b) {
    return operatorPrivilages[a] - operatorPrivilages[b];
  });
  return operators;
};

// returns first number
const findFirstInput = function (index) {
  let prevOperator = findPrevOperator(index);
  if (prevOperator !== 0) {
    prevOperator++;
  }
  return userExpression.slice(prevOperator, index);
};

// returns second number
const findSecondInput = function (index) {
  let nextOperator = findNextOperator(index);
  if (nextOperator === userExpression.length) {
    if (operatorValues.includes(userExpression[userExpression.length - 1])) {
      nextOperator--;
    }
  }
  return userExpression.slice(index + 1, nextOperator);
};

const divide = function (a, b) {
  return a / b;
};
const multiply = function (a, b) {
  return a * b;
};
const subtract = function (a, b) {
  return a - b;
};
const add = function (a, b) {
  return a + b;
};

const findResult = function (first, second, current) {
  let result = 0;

  first = parseFloat(first);
  second = parseFloat(second);
  switch (userExpression[current]) {
    case "%":
      result = multiply(first / 100, second);
      break;
    case "/":
      result = divide(first, second);
      break;
    case "*":
      result = multiply(first, second);
      break;
    case "+":
      result = add(first, second);
      break;
    case "-":
      result = subtract(first, second);
      break;
  }
  return result;
};

const evaluate = function () {
  const allOperators = findAllOperators();
  const orderedOperators = orderOperators(allOperators);

  for (let operator of orderedOperators) {
    const current = userExpression.lastIndexOf(operator);
    let first = findFirstInput(current);
    let second = findSecondInput(current);

    console.log(`${first}${userExpression[current]}${second}`);

    console.log("Result: " + findResult(first, second, current));

    userExpression = userExpression.replace(
      `${first}${userExpression[current]}${second}`,
      `${findResult(first, second, current)}`
    );
  }
};

const equals = document.querySelector("#equals");

equals.addEventListener("click", function () {
  evaluate();
  result.innerText = userExpression;
});
