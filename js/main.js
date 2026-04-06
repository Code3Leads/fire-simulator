// =============================
// 🔥 FIRE SIMULATOR (PHASE SYSTEM)
// =============================

// ---------- UI ----------
function updateScenario(text) {
  const el = document.getElementById("scenario");

  const entry = document.createElement("div");
  entry.style.marginBottom = "6px";
  entry.innerText = text;

  el.appendChild(entry);

  if (el.children.length > 8) {
    el.removeChild(el.firstChild);
  }
}

function setChoices(options) {
  let html = "";
  options.forEach(opt => {
    html += `<button onclick="${opt.action}">${opt.text}</button>`;
  });
  document.getElementById("choices").innerHTML = html;
}

// ---------- START ----------
function startGame() {
  startTimer(20);
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("scenario").innerHTML = "";

  state.phase = "fire_attack";
  state.gameOver = false;
  state.mayday = false;

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

  updateScenario(`📻 Dispatch: Engine 10 to a ${state.buildingType}.`);
  updateScenario("📻 Reported: possible occupants trapped.");

  setChoices([
    { text: "Acknowledge Dispatch", action: "arriveOnScene()" }
  ]);
}

// ---------- ARRIVAL ----------
function arriveOnScene() {
  startTimer(20);

  state.arrival = "fire showing";

  updateScenario("🚒 Arrival: Fire showing from structure.");

  setChoices([
    { text: "Nozzleman", action: "chooseRole('nozzle')" },
    { text: "Backup Firefighter", action: "chooseRole('backup')" },
    { text: "Officer (Command)", action: "chooseRole('officer')" }
  ]);
}

// ---------- ROLE ----------
function chooseRole(role) {
  startTimer(20);

  state.role = role;

  if (role === "nozzle" || role === "backup") {
    updateScenario("👉 Objective: Get water on the fire.");
  } else {
    updateScenario("👉 Objective: Command and accountability.");
  }

  nextTurn();
}

// =============================
// 🔥 OPTIONS BASED ON PHASE
// =============================
function showNozzleOptions() {

  if (state.phase === "fire_attack") {
    setChoices([
      { text: "Advance Line", action: "advanceLine()" },
      { text: "Flow Water", action: "flowWater()" },
      { text: "Cool Overhead", action: "coolOverhead()" }
    ]);
  }

  else if (state.phase === "knockdown") {
    setChoices([
      { text: "Hit Remaining Fire", action: "finishFire()" },
      { text: "Check for Extension", action: "checkExtension()" }
    ]);
  }

  else if (state.phase === "needs_vent") {
    setChoices([
      { text: "Request Ventilation", action: "requestVent()" },
      { text: "Continue Interior Push", action: "advanceLine()" }
    ]);
  }
}

function showBackupOptions() {
  setChoices([
    { text: "Search", action: "search()" },
    { text: "Assist Line", action: "assistLine()" },
    { text: "Force Door", action: "forceDoor()" }
  ]);
}

function showOfficerOptions() {
  setChoices([
    { text: "Establish Command", action: "establishCommand()" },
    { text: "Activate RIT", action: "activateRIT()" },
    { text: "Call PAR", action: "callPAR()" }
  ]);
}

// =============================
// 🔥 ACTIONS
// =============================
function advanceLine() {
  startTimer(20);

  updateScenario("🔥 Advancing hose line into structure.");

  nextTurn();
}

function flowWater() {
  startTimer(20);

  state.waterOnFire = true;
  state.fireIntensity -= 5;

  if (state.fireIntensity <= 3) {
    state.phase = "knockdown";

    updateScenario("💧 Water on the fire — knockdown achieved.");
    updateScenario("👨‍🚒 Backup moving in to overhaul.");
  } else {
    updateScenario("💧 Water applied — fire darkening.");
  }

  nextTurn();
}

function coolOverhead() {
  startTimer(20);

  state.heatLevel -= 3;

  updateScenario("❄️ Heat reduced.");
  updateScenario("🌫️ Visibility still low.");

  state.phase = "needs_vent";

  nextTurn();
}

// ---------- BACKUP ----------
function search() {
  startTimer(20);

  if (Math.random() < 0.5) {
    updateScenario("👤 Victim found!");
    triggerMayday();
  } else {
    updateScenario("🔍 Search clear.");
  }

  nextTurn();
}

function assistLine() {
  startTimer(20);

  state.fireIntensity -= 2;

  updateScenario("🤝 Assisting nozzle.");

  nextTurn();
}

function forceDoor() {
  startTimer(20);

  state.fireIntensity += 1;

  updateScenario("🚪 Door forced — air feeding fire!");

  nextTurn();
}

// =============================
// 🎖 OFFICER
// =============================
function establishCommand() {
  updateScenario("🎖 Command established.");
  nextTurn();
}

function activateRIT() {
  state.ritActive = true;
  updateScenario("🚒 RIT established.");
  nextTurn();
}

function callPAR() {
  if (state.mayday) {
    updateScenario("🚨 PAR FAILED — firefighter missing!");
  } else {
    updateScenario("📻 PAR complete.");
  }
  nextTurn();
}

// =============================
// 🚨 MAYDAY
// =============================
function triggerMayday() {
  if (state.mayday || state.gameOver) return;

  state.mayday = true;

  updateScenario("🚨 MAYDAY MAYDAY MAYDAY 🚨");
  updateScenario("📻 Give LUNAR report NOW!");

  showLUNARPrompt();
}

function showLUNARPrompt() {
  document.getElementById("choices").innerHTML = `
    <div>
      <h3>LUNAR REPORT</h3>
      <button onclick="submitLUNAR()">Transmit LUNAR</button>
    </div>
  `;
}

function submitLUNAR() {
  updateScenario("📻 LUNAR transmitted.");

  if (Math.random() < 0.6) {
    updateScenario("🚒 Firefighter rescued!");
    endGame("WIN");
  } else {
    updateScenario("❌ Rescue failed.");
    endGame("LOSS");
  }
}

// =============================
// 🔥 PHASE ACTIONS
// =============================
function finishFire() {
  updateScenario("💧 Remaining fire knocked.");
  updateScenario("🔥 Fire extinguished.");

  endGame("WIN");
}

function checkExtension() {
  if (Math.random() < 0.4) {
    updateScenario("🔥 Fire found in wall!");
    state.phase = "fire_attack";
    nextTurn();
  } else {
    updateScenario("✅ No extension found.");
    updateScenario("💧 Overhaul complete.");
    endGame("WIN");
  }
}

function requestVent() {
  updateScenario("📻 Ventilation requested.");
  updateScenario("💨 Visibility improving.");

  state.phase = "fire_attack";
  nextTurn();
}

// =============================
// 🔁 LOOP
// =============================
function nextTurn() {
  if (state.gameOver) return;

  state.timeElapsed++;

  state.fireIntensity += 2;
  state.heatLevel += 2;

  if (!state.waterOnFire && state.phase === "fire_attack") {
    updateScenario("⚠️ Fire unchecked — worsening.");
  }

  state.waterOnFire = false;

  checkConditions();

  if (state.gameOver) return;

  if (state.role === "nozzle") {
    showNozzleOptions();
  } else if (state.role === "backup") {
    showBackupOptions();
  } else {
    showOfficerOptions();
  }
}

// =============================
// 🔥 CONDITIONS
// =============================
function checkConditions() {

  if (state.heatLevel >= 10 && !state.mayday) {
    triggerMayday();
    return;
  }

  if (state.heatLevel >= 15) {
    updateScenario("🔥 STRUCTURAL COLLAPSE!");
    endGame("LOSS");
  }
}

// =============================
// 🏁 END GAME
// =============================
function endGame(result) {
  state.gameOver = true;

  clearInterval(timer);

  if (result === "WIN") {
    updateScenario("🏁 SCENARIO COMPLETE — SUCCESS");
  } else {
    updateScenario("🏁 SCENARIO COMPLETE — LOSS");
  }

  document.getElementById("choices").innerHTML = `
    <button onclick="location.reload()">Restart</button>
  `;
}
