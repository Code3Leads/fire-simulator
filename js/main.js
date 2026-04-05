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
      { text: "Nozzleman", action: "chooseRole('nozzle')" },
      { text: "Backup Firefighter", action: "chooseRole('backup')" }
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

// Roles
function chooseRole(role) {
  startTimer(20);

  state.role = role;

  updateScenario(`You are assigned as ${role}.`);

  if (role === "nozzle") {
    showNozzleOptions();
  } else {
    showBackupOptions();
  }
}

function showNozzleOptions() {
  setChoices([
    {text: "Advance Line", action: "advanceLine()" },
    {text: "Flow Water", action: "flowWater()"},
    {text: "Cool Overhead", action: "coolOverhead()"}
  ]);
}

function showBackupOptions() {
  setChoices([
    {text: "Force Door", action: "forceDoor()" },
    {text: "Search", action: "search()" },
    {text: "Assist Line", action: "assistLine()"}
  ]);
}

function advanceLine() {
  startTimer(20);

  if(state.fireIntensity > 6) {
    state.heatLevel += 2;
    updateScenario("Heavy fire pushing back. Advancement difficult.");
  } else {
    state.fireIntensity -= 2;
    state.waterOnFire = true;
    updateScenario(" Good knockdown. Fire darkening.")
  }

  nextTurn();
}

function flowWater() {
  startTimer(20);

  state.waterOnFire = true;
  state.fireIntensity -= 3;

  updateScenario("Water applied. Fire conditions improving.");

  nextTurn();
}

function coolOverhead() {
  startTimer(20);

  state.heatLevel -= 2;

  updateScenario("Cooling overhead. Heat reduced.");

  nextTurn();
}

function forceDoor() {
  startTimer(20);

  updateScenario ("Door forced. Entry gained.");

  nextTurn();
}

function search() {
  startTimer(20);

  if (Math.random() < 0.5) {
    updateScenario("🧑 Victim found!");
  } else {
    updateScenario("No victim found. Continue search.");
  }

  nextTurn();
}

function assistLine() {
  startTimer(20);

  state.fireIntensity -= 1;

  updateScenario("Backing up nozzle. Fire attack improving.");

  nextTurn();
}

function nextTurn() {
  state.timeElapsed++;

  // Fire grows over time
  state.fireIntensity += 1;
  state.heatLevel += 1;

  checkConditions();

  // Return correct role options
  if (state.role === "nozzle") {
    showNozzleOptions();
  } else {
    showBackupOptions();
  }
}

function checkConditions() {
  if (state.heatLevel >= 10 && !state.waterOnFire) {
    updateScenario("🔥 Flashover imminent!");
  }
  if (state.fireIntensity >= 10) {
    updateScenario("🔥 Fire rapidly intensifying!");
  }
}
