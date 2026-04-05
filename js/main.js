function updateScenario(text) {
  document.getElementById("scenario").innerText = text;
}

function setChoices(options) {
  let html = "";
  options.forEach(opt => {
    html += `<button onclick="${opt.action}">${opt.text}</button>`;
  });
  document.getElementById("choices").innerHTML = html;
}

// 🔥 Start Game
function startGame() {
  startTimer(20);

  // Hide start button
  document.getElementById("startBtn").style.display = "none";

  generateDispatch();
}

// 🚨 Dispatch
function generateDispatch() {
  const buildings = [
    "2-story residential",
    "garden apartment",
    "rowhome",
    "commercial building"
  ];

  state.buildingType = buildings[Math.floor(Math.random() * buildings.length)];

  updateScenario(`📻 Dispatch: Engine 10 respond for a structure fire at a ${state.buildingType}.`);

  setChoices([
    { text: "Acknowledge Dispatch", action: "arriveOnScene()" }
  ]);
}

// 🚒 Arrival
function arriveOnScene() {
  startTimer(20);

  const arrivals = [
    "nothing showing",
    "light smoke showing",
    "heavy smoke showing",
    "fire showing"
  ];

  state.arrival = arrivals[Math.floor(Math.random() * arrivals.length)];

  updateScenario(`🚒 You arrive on scene. You see ${state.arrival}.`);

  if (state.arrival === "nothing showing") {

    state.fireLocation = Math.random() < 0.5 ? "basement" : "attic";

    setChoices([
      { text: "Perform 360", action: "perform360()" },
      { text: "Investigate Interior", action: "investigateInterior()" }
    ]);

  } else {

    setChoices([
      { text: "Stretch Line", action: "placeholder()" },
      { text: "Give Size-Up", action: "placeholder()" }
    ]);
  }
}

// 🔍 360
function perform360() {
  startTimer(20);

  updateScenario("You complete a 360. No visible fire outside.");

  setChoices([
    { text: "Investigate Interior", action: "investigateInterior()" }
  ]);
}

// 🏠 Interior investigation
function investigateInterior() {
  startTimer(20);

  updateScenario(`🔥 Fire located in the ${state.fireLocation}! Conditions worsening.`);

  setChoices([
    { text: "Stretch Line", action: "placeholder()" },
    { text: "Back Out", action: "placeholder()" }
  ]);
}

// placeholder
function placeholder() {
  startTimer(20);

  updateScenario("Next phase coming soon...");
}
