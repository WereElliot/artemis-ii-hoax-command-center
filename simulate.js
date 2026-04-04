const scene = document.getElementById("scene");
const stageLabel = document.getElementById("stage-label");
const sceneBanner = document.getElementById("scene-banner");
const simStatus = document.getElementById("sim-status");
const successOdds = document.getElementById("success-odds");
const alienState = document.getElementById("alien-state");
const resultChip = document.getElementById("result-chip");
const outcomeBadge = document.getElementById("outcome-badge");
const outcomeCopy = document.getElementById("outcome-copy");
const eventLog = document.getElementById("event-log");

const metricFuel = document.getElementById("metric-fuel");
const metricHull = document.getElementById("metric-hull");
const metricGuidance = document.getElementById("metric-guidance");
const metricHostility = document.getElementById("metric-hostility");
const metricDust = document.getElementById("metric-dust");
const metricVector = document.getElementById("metric-vector");

const rerunButton = document.getElementById("rerun-button");
const autoButton = document.getElementById("auto-button");
const tehranButton = document.getElementById("tehran-button");

const stageLabels = {
  approach: "APPROACH VECTOR",
  engage: "ALIEN INTERCEPT",
  correction: "TRAJECTORY CORRECTION",
  touchdown: "TOUCHDOWN COMMIT",
  success: "SUCCESSFUL LANDING",
  failure: "LANDING FAILURE"
};

const stageCopy = {
  approach: "ORION DESCENDING TOWARD THE LUNAR SURFACE UNDER ACTIVE ALIEN OBSERVATION.",
  engage: "ALIEN SHIPS HAVE OPENED FIRE ON THE LANDING CORRIDOR. HOUSTON IS PRETENDING THIS IS NORMAL.",
  correction: "THRUSTERS FIRING HARD WHILE GUIDANCE DODGES LASER SWEEPS AND MOON DUST WAKE.",
  touchdown: "FINAL DESCENT UNDERWAY. ONE LAST BURST OF THRUST AND ONE LAST ALIEN ARGUMENT.",
  success: "TOUCHDOWN CONFIRMED. ALIENS LOST THE LANDING ZONE AND HOUSTON CLAIMS THIS WAS ALWAYS THE PLAN.",
  failure: "LANDING FAILURE. THE MOON WON THE ARGUMENT, THE ALIENS KEPT SHOOTING, AND HOUSTON NEEDS A NEW REPORT."
};

const oddsCopy = ["41% STABLE", "46% DOABLE", "52% NERVOUSLY POSSIBLE", "58% BETTER THAN EXPECTED"];
const successOutcomes = [
  "Touchdown confirmed after the alien skiffs ran out of angle and Houston stopped overreacting.",
  "The lander survived the firefight, kissed the regolith, and immediately declared a satirical victory lap.",
  "Despite moon dust, laser fire, and terrible odds, the capsule planted itself on the surface in one piece."
];
const failureOutcomes = [
  "The lander clipped the dust plume, took a hard alien hit, and skidded sideways before touchdown.",
  "Guidance briefly stabilized the vehicle, then the escort swarm ruined the landing burn.",
  "Houston called it recoverable right up until the lander bounced, rolled, and lost the descent corridor."
];

const approachLogs = [
  "Houston aligned the lander with lunar south-pole approach markers and ignored the alien echoes.",
  "Descent computer locked onto the landing ellipse while mission control argued about whether the threat board was satire.",
  "The lander crossed the final orbital seam and the moon surface finally filled the viewport."
];
const engageLogs = [
  "Alien skiffs peeled off the ridge and started strafing the descent corridor.",
  "A green beam crossed the flight path and forced Houston into a very dramatic guidance correction.",
  "Escort craft swarmed the lander from the right flank and lit up the telemetry board."
];
const correctionLogs = [
  "Thrusters overperformed just enough to drag the lander back over the target ellipse.",
  "Guidance kicked into panic trim and held the nose steady through drifting laser scatter.",
  "Houston called for a manual correction while the alien swarm argued over who gets the landing site."
];
const touchdownLogs = [
  "Dust plume rose across the landing zone as the capsule committed to final descent.",
  "Landing legs reached for the surface while the moon reflected laser fire back into the haze.",
  "The descent rate dropped sharply and the final hover began over the target crater shelf."
];
const successLogs = [
  "Touchdown sensors went green and the alien formation scattered beyond the ridge line.",
  "Houston logged a successful landing and quietly deleted the phrase alien territorial dispute from the report.",
  "Cabin systems stayed intact and the lander settled into the regolith under a very offended moonlight."
];
const failureLogs = [
  "Touchdown sensors never stabilized and the lander lost the surface under the dust bloom.",
  "The landing zone vanished behind smoke, glare, and alien fire as the vehicle tipped off vector.",
  "Houston marked the run as unrecoverable and requested another parody attempt."
];

let timers = [];
let autoMode = false;
let autoTimer = null;
let runToken = 0;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(items) {
  return items[randomInt(0, items.length - 1)];
}

function clearTimers() {
  timers.forEach((timer) => window.clearTimeout(timer));
  timers = [];
}

function schedule(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  timers.push(timer);
}

function makeTimestamp() {
  const now = new Date();
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  return `[${hh}:${mm}:${ss} Z]`;
}

function logEvent(message) {
  const item = document.createElement("li");
  item.textContent = `${makeTimestamp()} ${message}`;
  eventLog.prepend(item);
}

function setStage(stage) {
  scene.dataset.stage = stage;
  stageLabel.textContent = stageLabels[stage];
  sceneBanner.textContent = stageCopy[stage];
}

function setMetrics(values) {
  metricFuel.textContent = values.fuel;
  metricHull.textContent = values.hull;
  metricGuidance.textContent = values.guidance;
  metricHostility.textContent = values.hostility;
  metricDust.textContent = values.dust;
  metricVector.textContent = values.vector;
}

function setOutcome(success) {
  if (success) {
    scene.dataset.outcome = "success";
    simStatus.textContent = "TOUCHDOWN CONFIRMED";
    alienState.textContent = "DRIVEN OFF";
    resultChip.textContent = "SUCCESS";
    outcomeBadge.textContent = "SUCCESSFUL TOUCHDOWN";
    outcomeCopy.textContent = pick(successOutcomes);
    return;
  }

  scene.dataset.outcome = "failure";
  simStatus.textContent = "LANDING FAILURE";
  alienState.textContent = "OVERWHELMING";
  resultChip.textContent = "FAILURE";
  outcomeBadge.textContent = "FAILED DESCENT";
  outcomeCopy.textContent = pick(failureOutcomes);
}

function runSimulation() {
  runToken += 1;
  const token = runToken;
  const success = Math.random() >= 0.48;

  clearTimers();
  eventLog.innerHTML = "";

  scene.dataset.outcome = "pending";
  successOdds.textContent = pick(oddsCopy);
  resultChip.textContent = "PENDING";
  simStatus.textContent = "RUNNING DESCENT";
  alienState.textContent = "ACTIVE";
  outcomeBadge.textContent = "PENDING DESCENT";
  outcomeCopy.textContent =
    "Houston is attempting a controlled lunar touchdown while alien ships keep buzzing the landing corridor.";

  setStage("approach");
  setMetrics({
    fuel: `${randomInt(72, 90)}%`,
    hull: `${randomInt(88, 98)}%`,
    guidance: "AUTO HOLD",
    hostility: "TRACKING",
    dust: "LOW",
    vector: "STABLE"
  });
  logEvent(pick(approachLogs));

  schedule(() => {
    if (token !== runToken) {
      return;
    }

    setStage("engage");
    setMetrics({
      fuel: `${randomInt(58, 79)}%`,
      hull: `${randomInt(72, 91)}%`,
      guidance: "EVADE LOCK",
      hostility: "SPIKING",
      dust: "LOW",
      vector: "DRIFTING"
    });
    logEvent(pick(engageLogs));
  }, 1700);

  schedule(() => {
    if (token !== runToken) {
      return;
    }

    setStage("correction");
    setMetrics({
      fuel: `${randomInt(41, 64)}%`,
      hull: `${randomInt(61, 85)}%`,
      guidance: "MANUAL TRIM",
      hostility: "SEVERE",
      dust: "RISING",
      vector: "RECOVERING"
    });
    logEvent(pick(correctionLogs));
  }, 3500);

  schedule(() => {
    if (token !== runToken) {
      return;
    }

    setStage("touchdown");
    setMetrics({
      fuel: `${randomInt(22, 48)}%`,
      hull: `${randomInt(44, 78)}%`,
      guidance: "LANDING COMMIT",
      hostility: "MAXIMUM",
      dust: "HEAVY",
      vector: success ? "ALIGNED" : "UNSTABLE"
    });
    logEvent(pick(touchdownLogs));
  }, 5200);

  schedule(() => {
    if (token !== runToken) {
      return;
    }

    setStage(success ? "success" : "failure");
    setMetrics({
      fuel: `${randomInt(8, 28)}%`,
      hull: success ? `${randomInt(52, 74)}%` : `${randomInt(12, 39)}%`,
      guidance: success ? "SURFACE SAFE" : "LOST CONTROL",
      hostility: success ? "RETREATING" : "DOMINANT",
      dust: success ? "SETTLING" : "BLINDING",
      vector: success ? "LOCKED" : "BROKEN"
    });
    setOutcome(success);
    logEvent(pick(success ? successLogs : failureLogs));
  }, 7100);
}

function toggleAutoMode() {
  autoMode = !autoMode;
  autoButton.setAttribute("aria-pressed", autoMode ? "true" : "false");
  autoButton.querySelector("strong").textContent = autoMode ? "ON" : "OFF";

  if (autoMode) {
    runSimulation();
    autoTimer = window.setInterval(runSimulation, 11000);
    return;
  }

  if (autoTimer) {
    window.clearInterval(autoTimer);
    autoTimer = null;
  }
}

rerunButton.addEventListener("click", () => {
  runSimulation();
});

autoButton.addEventListener("click", () => {
  toggleAutoMode();
});

tehranButton.addEventListener("click", () => {
  window.location.assign("index.html?view=tehran");
});

runSimulation();
