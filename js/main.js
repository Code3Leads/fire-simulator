// =============================
// 🔥 FIRE SIMULATOR ENGINE (POLISHED)
// =============================

// ---------- UI ----------
function updateScenario(text) {
  const el = document.getElementById("scenario");

  const entry = document.createElement("div");
  entry.style.marginBottom = "8px";
  entry.innerText = text;

  el.appendChild(entry);
}

function setChoices(options) {
  let html = "";
  options.forEach(opt => {
    html += `<button onclick="${opt.action}">${opt.text}</button>`;
  });
  document.getElementById("choices").innerHTML = html;
}

// ---------- GAME START ----------
function startGame() {
  startTimer(20);
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("scenario").innerHTML = "";

  generateDispatch();
}

// ---------- DISPATCH ----------
function generateDispatch() {
  const buildings = [
    "2-story residential",
    "garden apartment",
    "rowhome",
    "commercial building"
  ];

  state.buildingType = buildings[Math.floor(Math.random() * buildings.length)];

  updateScenario(`📻 Dispatch: Engine 10 respond to a ${state.buildingType}.`);
  updateScenario("📻 Reported: possible occupants trapped.");

  setChoices([
    { text: "Acknowledge Dispatch", action: "arriveOnScene()" }
  ]);
}

// ---------- ARRIVAL ----------
function arriveOnScene() {
  startTimer(20);

  const arrivals = [
    "nothing showing",
    "light smoke showing",
    "heavy smoke showing",
    "fire showing"
  ];

  state.arrival = arrivals[Math.floor(Math.random() * arrivals.length)];

  updateScenario(`🚒 Arrival: ${state.arrival}`);

  if (state.arrival === "nothing showing") {
    state.fireLocation = Math.random() < 0.5 ? "basement" : "attic";

    setChoices([
      { text: "Perform 360", action: "perform360()" },
      { text: "Investigate Interior", action: "investigateInterior()" }
    ]);
  } else {
    setChoices([
      { text: "Nozzleman", action: "chooseRole('nozzle')" },
      { text: "Backup Firefighter", action: "chooseRole('backup')" },
      { text: "Officer (Command)", action: "chooseRole('officer')" }
    ]);
  }
}

// ---------- 360 ----------
function perform360() {
  startTimer(20);

  updateScenario("🔍 360 complete. No visible fire.");

  setChoices([
    { text: "Investigate Interior", action: "investigateInterior()" }
  ]);
}

// ---------- INTERIOR ----------
function investigateInterior() {
  startTimer(20);

  updateScenario(`🔥 Fire located in the ${state.fireLocation}!`);

  setChoices([
    { text: "Nozzleman", action: "chooseRole('nozzle')" },
    { text: "Backup Firefighter", action: "chooseRole('backup')" },
    { text: "Officer (Command)", action: "chooseRole('officer')" }
  ]);
}

// =============================
// 🔥 ROLE SYSTEM
// =============================
function chooseRole(role) {
  startTimer(20);

  state.role = role;

  updateScenario(`👨‍🚒 Role Assigned: ${role.toUpperCase()}`);

  nextTurn();
}

// ---------- OPTIONS ----------
function showNozzleOptions() {
  setChoices([
    { text: "Advance Line", action: "advanceLine()" },
    { text: "Flow Water", action: "flowWater()" },
    { text: "Cool Overhead", action: "coolOverhead()" }
  ]);
}

function showBackupOptions() {
  setChoices([
    { text: "Force Door", action: "forceDoor()" },
    { text: "Search", action: "search()" },
    { text: "Assist Line", action: "assistLine()" }
  ]);
}

function showOfficerOptions() {
  setChoices([
    { text: "Establish Command", action: "establishCommand()" },
    { text: "Give Size-Up", action: "giveSizeUp()" },
    { text: "Activate RIT", action: "activateRIT()" },
    { text: "Call PAR", action: "callPAR()" },
    { text: "Evacuate Structure", action: "evacuate()" }
  ]);
}

// =============================
// 🔥 FIREFIGHTER ACTIONS
// =============================
function advanceLine() {
  startTimer(20);

  if (state.fireIntensity > 6) {
    state.heatLevel += 2;
    updateScenario("🔥 Heavy fire pushing back!");
  } else {
    state.fireIntensity -= 3;
    state.waterOnFire = true;
    updateScenario("💧 Advancing line — progress made.");
  }

  nextTurn();
}

function flowWater() {
  startTimer(20);

  state.waterOnFire = true;
  state.fireIntensity -= 5;
  state.heatLevel -= 2;

  updateScenario("💧 Strong water application — fire knocked back!");

  nextTurn();
}

function coolOverhead() {
  startTimer(20);

  state.heatLevel -= 3;

  updateScenario("❄️ Cooling overhead.");

  nextTurn();
}

// ---------- BACKUP ----------
function forceDoor() {
  startTimer(20);

  state.fireIntensity += 1;

  updateScenario("🚪 Door forced — air feeding fire!");

  nextTurn();
}

function search() {
  startTimer(20);

  if (Math.random() < 0.5) {
    updateScenario("👤 Victim found!");
  } else {
    updateScenario("🔍 Search clear.");
  }

  nextTurn();
}

function assistLine() {
  startTimer(20);

  state.fireIntensity -= 2;

  updateScenario("🤝 Assisting nozzle — fire improving.");

  nextTurn();
}

// =============================
// 🎖 OFFICER
// =============================
function establishCommand() {
  startTimer(20);
  updateScenario("🎖 Command established.");
  nextTurn();
}

function giveSizeUp() {
  startTimer(20);
  updateScenario(`📻 Size-Up: ${state.arrival} from a ${state.buildingType}.`);
  nextTurn();
}

function activateRIT() {
  startTimer(20);
  state.ritActive = true;
  updateScenario("🚒 RIT established.");
  nextTurn();
}

function callPAR() {
  startTimer(20);

  if (state.mayday) {
    updateScenario("🚨 PAR FAILED — missing firefighter!");
  } else {
    updateScenario("📻 PAR complete.");
  }

  nextTurn();
}

function evacuate() {
  startTimer(20);
  updateScenario("🚨 Evacuation ordered!");
  nextTurn();
}

// =============================
// 🚨 MAYDAY
// =============================
function triggerMayday() {
  state.mayday = true;

  updateScenario("🚨 MAYDAY MAYDAY MAYDAY 🚨");

  triggerDangerMode();

  if (state.ritActive) {
    updateScenario("🚒 RIT DEPLOYING!");
  } else {
    updateScenario("❌ NO RIT — RESCUE DELAYED!");
  }

  showLUNARPrompt();
}

function showLUNARPrompt() {
  document.getElementById("choices").innerHTML = `
    <div>
      <h3>MAYDAY – LUNAR</h3>
      <input placeholder="Location"><br><br>
      <input placeholder="Unit"><br><br>
      <input placeholder="Name"><br><br>
      <input placeholder="Assignment"><br><br>
      <input placeholder="Resources"><br><br>
      <button onclick="submitLUNAR()">Transmit</button>
    </div>
  `;
}

function submitLUNAR() {
  updateScenario("📻 LUNAR transmitted.");
}

// ---------- DANGER ----------
function triggerDangerMode() {
  startTimer(10);

  document.body.style.backgroundColor = "#7f1d1d";

  setTimeout(() => {
    document.body.style.backgroundColor = "#020617";
  }, 400);
}

// =============================
// 🔁 GAME LOOP
// =============================
function nextTurn() {
  state.timeElapsed++;

  // reset water each turn
  state.waterOnFire = false;

  // fire growth
  state.fireIntensity += 2;
  state.heatLevel += 2;

  if (!state.waterOnFire) {
    state.fireIntensity += 1;
    updateScenario("⚠️ Fire unchecked — conditions worsening.");
  }

  // random escalation
  if (Math.random() < 0.3) {
    state.heatLevel += 1;
    updateScenario("🔥 Sudden fire growth!");
  }

  updateScenario(`📊 Status → Fire: ${state.fireIntensity} | Heat: ${state.heatLevel}`);

  checkConditions();

  if (state.role === "nozzle") {
    showNozzleOptions();
  } else if (state.role === "backup") {
    showBackupOptions();
  } else {
    showOfficerOptions();
  }
}

// ---------- CONDITIONS ----------
function checkConditions() {

  if (state.heatLevel >= 8 && !state.waterOnFire) {
    updateScenario("⚠️ Flashover imminent!");
    triggerDangerMode();
  }

  if (state.heatLevel >= 12 && !state.mayday) {
    triggerMayday();
  }

  if (state.fireIntensity >= 10) {
    updateScenario("🔥 Fire intensifying rapidly!");
  }
}
