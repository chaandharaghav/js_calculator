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

// numbers + operators
const inputs = [...numbers, ...operators];

const calculator = {
  expression: "",
};

const changeDisplay = function (input) {
  const lastIndex = calculator.expression.length - 1;
  const lastElement = calculator.expression[lastIndex];

  // first operator can only be negative sign or decimal point
  if (lastIndex === -1) {
    if (operatorValues.includes(input) && input !== "-") {
      return "";
    }
  }

  // an operator is not allowed if - is input previously
  if (lastIndex === 0) {
    if (
      operatorValues.includes(input) &&
      calculator.expression[lastIndex - 1] === "-"
    ) {
      return "";
    }
  }

  // if incoming value and last given input are both operators, remove
  // last given operator
  if (operatorValues.includes(lastElement) && operatorValues.includes(input)) {
    calculator.expression = calculator.expression.substring(0, lastIndex);
  }

  calculator.expression += input;
  expression.innerText = calculator.expression;
};

const expression = document.querySelector("#expression");

inputs.forEach((input) =>
  input.addEventListener("click", function () {
    changeDisplay(input.dataset.value);
  })
);
