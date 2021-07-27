const buttons = document.querySelectorAll("#inputPane  div:not(#numberPane)");
console.log(buttons);

const removeTransition = function (e) {
  if (e.propertyName !== "transform") return;
  e.target.classList.remove("clicked");
};

let clickSound = document.querySelector("audio");

for (let button of buttons) {
  const audio = new Audio("click.wav");

  button.addEventListener("click", function () {
    audio.play();
    audio.currentTime = 0;
    button.classList.add("clicked");
  });

  button.addEventListener("transitionend", removeTransition);
}
