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
      {text: "Officer (Command)", action: "chooseRole('officer')}
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
  } else if(role === "backup") {
    showBackupOptions();
  } else {
    showOfficerOptions();
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

function showOfficerOptions() {
  setChoices([
    { text: "Establish Command", action: "establichCommand()" },
    { text: "Give Size-up", action: "giveSizeUp()" },
    { text: "Activate RIT", action: "activateRIT()" },
    { text: "Call PAR", action: "callPAR()" }
    { text: "Evacuate Structure", action: "evacuate()" }
  ]);
}

function establishCommand() {
  startTimer(20);
  updateScenario("🎖️ command established. You are in command.");
  nextTurn();
}

function giveSizeUp() {
  startTimer(20);
  updateScenario(`Heavy ${state.arrival} from a ${state.buildingType}. Working fire.`);
  nextTurn();
}

function activateRIT() {
  startTimer(20);
  state.ritActive = true;
  updateScenario("🚒 RIT Team established.");
  nextTurn();
}

function callPAR() {
  startTimer(20);

  if (state.mayday) {
    updateScenario(" 🚨PAR NOT COMPLETE - firefighter missing!");
  } else {
    updateScenario("✅ All members accounted for.");
  }
  nextTurn();
}

function evacuate() {
  startTimer(20);
  updateScenario("🚨 Emergency evacuation ordered!");
  nextTurn();
}

function triggerMayday() {
  state.mayday = true;
  updateScenario("🚨 MAYDAY MAYDAY MAYDAY🚨");
  triggerDangerMode();

  if (state.ritActive) {
    deployRIT();
  } else {
    updateScenario("⚠️ No RIT team assigned! Rescue delayed!");
  }

  showLunarPrompt();
}

function deployRIT() {
  updateScenario("🚒 RIT entering structure for rescue!");
}

function showLUNARPrompt() {
  document.getElementById("choices").innerHTML =
    <div style="margin-top:10px;">
      <h3>MAYDAY - LUNAR</h3>
      <input placeholder="Location"><br><br>
      <input placeholder="Unit"><br><br>
      <input placeholder="Name"><br><br>
      <input placeholder="Assignment"><br><br>
      <imput placeholder="Resources"><br><br>
      <button onclick="submitLUNAR()">Transmit</button>
    </div>
   ;
}

function submitLUNAR () {
  updateScenario("📻 LUNAR transmitted. RIT responding.");
}

function triggerDangerMode() {
  startTimer(10); // faster timer 
  document.body.style.backgroundColor = "#7f1d1d";

  setTimeout(() => {
    document.body.style.backgroundColor = "#020617";
  }, 500);
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
    triggerDangerMode();
  }
  if (state.fireIntensity >= 12 && !state.mayday) {
    updateScenario("🔥 Fire rapidly intensifying!");
    triggerMayday();
  }
}
