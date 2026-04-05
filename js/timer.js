let timeLeft = 20;
let timer;

function startTimer(seconds = 20) {
  clearInterval(timer);

  timeLeft = seconds;
  document.getElementById("timer").innerText = "Time: " + timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = "Time: " + timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      updateScenario("⏰ Time’s up! You hesitated too long.");
      document.getElementById("choices").innerHTML = "";
    }
  }, 1000);
}
