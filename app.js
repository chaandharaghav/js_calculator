const buttons = document.querySelectorAll("#inputPane  div:not(#numberPane)");
console.log(buttons);

const removeTransition = function (e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("clicked");
};

for (let button of buttons) {
  button.addEventListener("click", function () {
    button.classList.add("clicked");
  });

  button.addEventListener("transitionend", removeTransition);
}
