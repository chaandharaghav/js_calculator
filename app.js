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

let userExpression = "0";

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

  // if a minus comes after multiplication or division, allow
  if (operatorValues.includes(currentValue) && operatorValues.includes(input)) {
    if (!((currentValue === "*" || currentValue === "/") && input === "-")) {
      return "";
    }
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
