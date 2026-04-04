const missionClock = document.getElementById("mission-clock");
const telemetryClock = document.getElementById("telemetry-clock");
const tabs = Array.from(document.querySelectorAll(".tab"));
const panes = Array.from(document.querySelectorAll(".view-pane"));
const screenUi = document.getElementById("screen-ui");

const metricTruth = document.getElementById("metric-truth");
const metricHoax = document.getElementById("metric-hoax");
const metricChaos = document.getElementById("metric-chaos");
const sequenceOverlay = document.getElementById("sequence-overlay");

const socialFeed = document.getElementById("social-feed");
const debunkScroll = document.getElementById("debunk-scroll");
const debunkList = document.querySelector(".debunk-list");
const sideNote = document.querySelector(".side-note strong");
const actionButtons = Array.from(document.querySelectorAll("[data-action]"));
const alertSymbol = document.querySelector(".sequence-alert-symbol");

const validViews = ["telemetry", "hormuz", "tehran", "tower", "socials", "chaos"];
const urlParams = new URLSearchParams(window.location.search);
const forcedSequencePhase = urlParams.get("phase");
const validSequencePhases = new Set(["idle", "alert", "april", "palestine"]);

const sequenceState = {
  triggered: false,
  visitedViews: new Set()
};

const sequenceTimings =
  urlParams.get("sequence") === "fast"
    ? {
        triggerDelay: 150,
        alertDuration: 900,
        aprilDuration: 1200
      }
    : {
        triggerDelay: 400,
        alertDuration: 3000,
        aprilDuration: 3000
      };

const viewMetrics = {
  telemetry: { truth: "02%", hoax: "91%", chaos: "OVERFLOWING" },
  hormuz: { truth: "03%", hoax: "88%", chaos: "REDLINE" },
  tehran: { truth: "01%", hoax: "96%", chaos: "CRISIS" },
  tower: { truth: "04%", hoax: "84%", chaos: "SURGING" },
  radar: { truth: "01%", hoax: "98%", chaos: "BALLISTIC" },
  socials: { truth: "02%", hoax: "MAXIMUM", chaos: "OVERFLOWING" },
  chaos: { truth: "00%", hoax: "100%", chaos: "MELTDOWN" }
};

const socialState = {
  posts: [
    {
      author: "Donald J. Trump",
      handle: "@realDonaldTrump",
      meta: "truth social parody post",
      badge: "TRUTH",
      kind: "trump",
      avatar: "T",
      body:
        "This Artemis II mission is a TOTAL DISASTER! The capsule isn't going to the Moon, it's orbiting the Strait of Hormuz and got shot down over Tehran. Sad! We all know the Moon landings were fake anyway!",
      stats: ["Replies 18.4K", "Retruths 54.1K", "Likes 229K"]
    },
    {
      author: "Donald J. Trump",
      handle: "@realDonaldTrump",
      meta: "truth social parody post",
      badge: "TRUTH",
      kind: "trump",
      avatar: "T",
      body:
        "Just heard the capsule was shot down over Tehran. Terrible! Why are we sending astronauts into Iran when we could be building hotels on Mars? Make Space Great Again!",
      stats: ["Replies 11.7K", "Retruths 39.8K", "Likes 173K"]
    },
    {
      author: "Senior Wire Desk",
      handle: "@SeniorWireHQ",
      meta: "senior agency brief - satirical post",
      badge: "WIRE",
      kind: "agency",
      avatar: "SW",
      body:
        "Senior desk update: Houston monitors show cabin pressure nominal, hoax level elevated, and the Orion capsule apparently wandering between the Strait of Hormuz and several headlines it has no business entering.",
      stats: ["Replies 6.2K", "Retruths 18.9K", "Likes 72K"]
    },
    {
      author: "Global Affairs Pool",
      handle: "@GlobalPoolDesk",
      meta: "foreign bureau summary - satirical post",
      badge: "POOL",
      kind: "agency",
      avatar: "GP",
      body:
        "Senior correspondents tracking the parody mission report overlapping claims of Tehran incident fallout, tanker-lane orbit loops, and at least one briefing note asking whether the Moon has retained outside counsel.",
      stats: ["Replies 4.8K", "Retruths 15.4K", "Likes 63K"]
    },
    {
      author: "Orbital News Bureau",
      handle: "@OrbitalBureau",
      meta: "senior science desk - satirical post",
      badge: "SCI",
      kind: "agency",
      avatar: "ON",
      body:
        "Science desk memo: cabin oxygen remains steady while geopolitical absurdity spikes. Sources confirm the vehicle dashboard in Houston looks more professional than the story attached to it.",
      stats: ["Replies 3.9K", "Retruths 12.1K", "Likes 48K"]
    },
    {
      author: "Continental Bulletin Service",
      handle: "@CBSeniorDesk",
      meta: "senior editor note - satirical post",
      badge: "EDIT",
      kind: "agency",
      avatar: "CB",
      body:
        "Editors are told the capsule now faces alien escort shadows, ICBM threat arcs, and hillside shepherd gunfire. Nobody on the senior desk can explain why any of this made it onto a moon mission tracker.",
      stats: ["Replies 5.1K", "Retruths 14.7K", "Likes 59K"]
    },
    {
      author: "Capitol Orbit Pool",
      handle: "@OrbitPoolPress",
      meta: "senior pooled briefing - satirical post",
      badge: "POOL",
      kind: "agency",
      avatar: "OP",
      body:
        "Pool report: mission control kept the cabin telemetry neat, the radar board loud, and the satire disclaimer technically visible while the capsule allegedly executed another impossible detour.",
      stats: ["Replies 4.3K", "Retruths 13.2K", "Likes 51K"]
    },
    {
      author: "Evening Monitor Agency",
      handle: "@EveningMonitor",
      meta: "senior night desk - satirical post",
      badge: "NIGHT",
      kind: "agency",
      avatar: "EM",
      body:
        "Night desk summary: Truth Integrity remains stuck near zero while the Houston board continues logging cabin temperature, battery bus, and guidance mode like this is somehow still a serious space operation.",
      stats: ["Replies 3.4K", "Retruths 10.6K", "Likes 44K"]
    }
  ],
  debunks: [
    "Flag waving in vacuum? Studio fan confirmed during Tehran incident",
    "No stars in photos? Iranian air defense lights too bright",
    "Shadows don't match? Multiple spotlights while orbiting Strait of Hormuz",
    "Artemis II keeps getting shot down - clear proof the Moon is fake and Iran knows it!"
  ],
  note: "Official NASA blue aesthetic, completely unofficial conspiracy logic."
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function updateClock() {
  const now = new Date();
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  const display = `T+ ${hh}:${mm}:${ss}`;

  missionClock.textContent = display;

  if (telemetryClock) {
    telemetryClock.textContent = display;
  }
}

function setMetrics(view) {
  const metrics = viewMetrics[view] || viewMetrics.telemetry;
  metricTruth.textContent = metrics.truth;
  metricHoax.textContent = metrics.hoax;
  metricChaos.textContent = metrics.chaos;
}

function setActiveTab(view) {
  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === view);
  });
}

function setActivePane(view) {
  panes.forEach((pane) => {
    pane.classList.toggle("is-active", pane.dataset.pane === view);
  });
}

function renderSocials() {
  socialFeed.innerHTML = socialState.posts
    .map((post) => {
      const truthClass = post.kind === "agency" ? "truth-post truth-post-agency" : "truth-post";
      const stats = post.stats.map((item) => `<span>${escapeHtml(item)}</span>`).join("");

      return `
        <article class="${truthClass}">
          <div class="truth-head">
            <div class="truth-head-main">
              <div class="truth-avatar">${escapeHtml(post.avatar)}</div>
              <div class="truth-meta">
                <strong>${escapeHtml(post.author)}</strong>
                <span>${escapeHtml(post.handle)} &bull; ${escapeHtml(post.meta)}</span>
              </div>
            </div>
            <span class="truth-badge">${escapeHtml(post.badge)}</span>
          </div>
          <p>${escapeHtml(post.body)}</p>
          <div class="truth-stats">${stats}</div>
        </article>
      `;
    })
    .join("");

  debunkList.innerHTML = socialState.debunks.map((item) => `<li>${item}</li>`).join("");
  sideNote.textContent = socialState.note;
}

function scrollPanel(element) {
  if (!element) {
    return;
  }

  const distance = Math.max(220, Math.round(element.clientHeight * 0.82));
  element.scrollBy({ top: distance, behavior: "smooth" });
}

function handleAction(action) {
  if (action === "more-posts") {
    activateView("socials");
    window.setTimeout(() => {
      scrollPanel(socialFeed);
    }, 90);
    return;
  }

  if (action === "more-debunking") {
    activateView("socials");
    window.setTimeout(() => {
      scrollPanel(debunkScroll);
    }, 90);
    return;
  }

  if (action === "simulate-chaos") {
    window.location.assign("simulate.html");
  }
}

function setSequencePhase(phase) {
  if (!sequenceOverlay) {
    return;
  }

  sequenceOverlay.dataset.phase = phase;
  document.body.dataset.sequencePhase = phase;
}

function startSequenceAfterExploration() {
  if (!sequenceOverlay || sequenceState.triggered) {
    return;
  }

  sequenceState.triggered = true;

  const { triggerDelay, alertDuration, aprilDuration } = sequenceTimings;

  window.setTimeout(() => {
    setSequencePhase("alert");
  }, triggerDelay);

  window.setTimeout(() => {
    setSequencePhase("april");
  }, triggerDelay + alertDuration);

  window.setTimeout(() => {
    setSequencePhase("palestine");
  }, triggerDelay + alertDuration + aprilDuration);
}

function markViewVisited(view) {
  if (sequenceState.triggered || !validViews.includes(view)) {
    return;
  }

  sequenceState.visitedViews.add(view);

  if (sequenceState.visitedViews.size === validViews.length) {
    startSequenceAfterExploration();
  }
}

function activateView(view) {
  screenUi.dataset.viewTheme = view;
  setActiveTab(view);
  setActivePane(view);
  setMetrics(view);

  if (view === "socials") {
    renderSocials();
  }

  if (!validSequencePhases.has(forcedSequencePhase)) {
    markViewVisited(view);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateView(tab.dataset.view);
  });
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleAction(button.dataset.action);
  });
});

updateClock();
renderSocials();

if (alertSymbol) {
  alertSymbol.innerHTML = "&#9888;";
}

const initialView = urlParams.get("view");
activateView(validViews.includes(initialView) ? initialView : validViews[0]);
setSequencePhase("idle");

if (validSequencePhases.has(forcedSequencePhase)) {
  sequenceState.triggered = true;
  setSequencePhase(forcedSequencePhase);
}

window.setInterval(updateClock, 1000);
