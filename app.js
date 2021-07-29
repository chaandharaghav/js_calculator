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

inputs.forEach((input) =>
  input.addEventListener("click", function () {
    changeDisplay(input.dataset.value);
  })
);

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

const orderOperators = function (operators) {
  operators.sort(function (a, b) {
    return operatorPrivilages[a] - operatorPrivilages[b];
  });
  console.log(operators);
  return operators;
};

const evaluate = function () {
  const allOperators = findAllOperators();
  console.log(allOperators);
  const orderedOperators = orderOperators(allOperators);
};
