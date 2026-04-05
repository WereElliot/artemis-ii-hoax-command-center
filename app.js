const missionClock = document.getElementById("mission-clock");
const telemetryClock = document.getElementById("telemetry-clock");
const tabs = Array.from(document.querySelectorAll(".tab"));
const panes = Array.from(document.querySelectorAll(".view-pane"));
const screenUi = document.getElementById("screen-ui");
const tabsRail = document.querySelector(".tabs");
const socialSubtabs = Array.from(document.querySelectorAll(".socials-subtab"));
const socialSubviews = Array.from(document.querySelectorAll(".socials-subview"));
const socialSubtabsRail = document.querySelector(".socials-subtabs");

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
const validSocialPanes = ["truths", "fools", "simulate"];
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
  posts: buildSocialPosts(),
  debunks: [
    "Flag waving in vacuum? Studio fan confirmed during Tehran incident",
    "No stars in photos? Iranian air defense lights too bright",
    "Shadows don't match? Multiple spotlights while orbiting Strait of Hormuz",
    "Artemis II keeps getting shot down - clear proof the Moon is fake and Iran knows it!"
  ],
  note: "Official NASA blue aesthetic, completely unofficial conspiracy logic."
};
const socialsUiState = {
  activePane: validSocialPanes.includes(urlParams.get("social")) ? urlParams.get("social") : "truths"
};

function buildSocialPosts() {
  const sources = [
    {
      author: "Donald J. Trump (Parody)",
      handle: "@realDonaldTrump_satire",
      meta: "clearly labeled parody account",
      badge: "TRUTH",
      kind: "trump",
      avatar: "T",
      openings: [
        "This Artemis II thing is a total mess.",
        "Nobody told me a moon capsule could spend this much time in traffic.",
        "The so-called mission experts are doing a terrible job.",
        "I have seen many launches. This one has too many detours.",
        "Houston keeps pretending this is normal. It is not normal."
      ],
      closers: [
        "Sad!",
        "Very unfair to the Moon.",
        "Total disaster management.",
        "Everybody knows it.",
        "Make Space Great Again."
      ]
    },
    {
      author: "Elon Musk (Parody)",
      handle: "@elon_satire",
      meta: "clearly labeled parody account",
      badge: "X-POST",
      kind: "agency",
      avatar: "E",
      openings: [
        "Strong view: this would have been resolved by a software rollback.",
        "Recommend a rapid product rethink for the capsule routing stack.",
        "Honestly the mission needs fewer conspiracy panels and more version control.",
        "The guidance UI has vibes, but the trajectory logic is still cursed.",
        "If the capsule keeps orbiting shipping lanes, that is technically a logistics startup."
      ],
      closers: [
        "Needs patch notes.",
        "Probably just a scaling issue.",
        "Extremely debug-able.",
        "I would ship a hotfix.",
        "Many such cases."
      ]
    },
    {
      author: "Seyed Abbas Araghchi (Parody)",
      handle: "@seyedabbasaraghchi_parody",
      meta: "real public figure name, clearly labeled parody",
      badge: "MFA",
      kind: "diplomatic",
      avatar: "AA",
      openings: [
        "Foreign ministry note, entirely satirical:",
        "Diplomatic observation, in obvious parody form:",
        "For the avoidance of doubt, this is a parody post:",
        "Ministerial clarification, written for a joke dashboard:",
        "Statement for the blue-glow record:"
      ],
      closers: [
        "This is not an actual statement.",
        "Please read the parody label before starting an incident room.",
        "No moon capsule should require this much diplomatic paperwork.",
        "The Moon remains outside normal consular procedure.",
        "Respectfully, the dashboard has become the crisis."
      ]
    },
    {
      author: "Iranian Foreign Ministry Media Desk (Parody)",
      handle: "@iran_mfa_desk_parody",
      meta: "clearly labeled parody account",
      badge: "DESK",
      kind: "agency",
      avatar: "MD",
      openings: [
        "Foreign ministry desk note:",
        "Media guidance this evening:",
        "Consular update, entirely satirical:",
        "Diplomatic clarification:",
        "Statement draft number fourteen:"
      ],
      closers: [
        "Please stop cc'ing the embassy on moon traffic.",
        "No further comment until the capsule files customs forms.",
        "Our interns are exhausted.",
        "Legal review remains ongoing.",
        "Respectfully, this is not how orbital planning works."
      ]
    },
  ];

  const scenarios = [
    "The capsule is still circling the Strait of Hormuz like it missed three exits and a very important briefing.",
    "Mission control keeps logging normal cabin pressure while the story itself has completely depressurized.",
    "Every dashboard in Houston looks professional right up until the diplomatic subplot starts talking.",
    "Regional tension graphics are now somehow sharing screen space with a moon mission disclaimer.",
    "The Tehran incident tab keeps generating more paperwork than thrust.",
    "Radar still shows escort triangles, tanker clutter, and one very confused public affairs team.",
    "The vehicle keeps doing dramatic holding patterns while the narrative refuses to land.",
    "Truth Integrity remains near zero but the font treatment is admittedly strong.",
    "The capsule appears to be avoiding the Moon in favor of maximum geopolitical theatre.",
    "Houston says the cabin is nominal and the satire engine says otherwise.",
    "The flight path now looks like somebody drew foreign policy with a glow stick.",
    "Mission planners are once again asking why embassy desks are in a lunar mission loop.",
    "The radar wall is full, the legal queue is full, and the Moon is still waiting.",
    "The social feed is moving faster than the capsule and neither one is especially reassuring.",
    "Guidance software would like everyone to stop calling a detour a strategy."
  ];

  const punchlines = [
    "The fries budget appears better funded than the flight plan.",
    "At this point the disclaimer should get its own command console.",
    "Nobody can explain why the radar is louder than the rocket.",
    "This is now ninety percent dashboard and ten percent trajectory.",
    "The interns have started filing orbital complaints.",
    "Even the scanlines look skeptical.",
    "The mission clock is moving, but confidence is not.",
    "There are now more tabs than explanations.",
    "Somebody keeps calling this a soft landing for public relations.",
    "The capsule has become the busiest tourist in the control room."
  ];

  const statsSeed = [
    ["Replies 18.4K", "Retruths 54.1K", "Likes 229K"],
    ["Replies 11.7K", "Retruths 39.8K", "Likes 173K"],
    ["Replies 7.1K", "Retruths 22.4K", "Likes 91K"],
    ["Replies 5.6K", "Retruths 18.2K", "Likes 74K"],
    ["Replies 3.9K", "Retruths 12.8K", "Likes 53K"]
  ];

  const timeSeed = ["2m", "5m", "9m", "14m", "22m", "31m", "45m", "1h", "2h", "3h"];
  const publishedSeed = [
    "8:14 PM • Apr 5, 2026 • Truth Social parody feed",
    "8:31 PM • Apr 5, 2026 • Houston satire desk",
    "8:42 PM • Apr 5, 2026 • Mission control joke wire",
    "9:05 PM • Apr 5, 2026 • Geopolitical comedy monitor",
    "9:27 PM • Apr 5, 2026 • Orbital rumor terminal"
  ];
  const actions = ["Reply", "Retruth", "Like", "Share"];

  const posts = [];

  sources.forEach((source, sourceIndex) => {
    for (let i = 0; i < 15; i += 1) {
      const scenario = scenarios[(i + sourceIndex * 3) % scenarios.length];
      const punchline = punchlines[(i * 2 + sourceIndex) % punchlines.length];
      const stats = statsSeed[(i + sourceIndex) % statsSeed.length];

      posts.push({
        author: source.author,
        handle: source.handle,
        meta: source.meta,
        badge: source.badge,
        kind: source.kind,
        avatar: source.avatar,
        body: `${source.openings[i % source.openings.length]} ${scenario} ${punchline} ${source.closers[i % source.closers.length]}`,
        stats,
        time: timeSeed[(i + sourceIndex * 2) % timeSeed.length],
        published: publishedSeed[(i + sourceIndex) % publishedSeed.length],
        actions
      });
    }
  });

  return posts;
}

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

function centerNodeInRail(node, rail, instant = false) {
  if (!node || !rail) {
    return;
  }

  if (rail.scrollWidth <= rail.clientWidth + 4) {
    return;
  }

  const railRect = rail.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const maxLeft = rail.scrollWidth - rail.clientWidth;
  const currentLeft = rail.scrollLeft;
  const targetLeft = Math.max(
    0,
    Math.min(maxLeft, currentLeft + (nodeRect.left - railRect.left) - railRect.width / 2 + nodeRect.width / 2)
  );

  rail.scrollTo({ left: targetLeft, behavior: instant ? "auto" : "smooth" });
}

function syncActiveTabIntoView(view, instant = false) {
  const activeTab = tabs.find((tab) => tab.dataset.view === view);
  window.requestAnimationFrame(() => {
    centerNodeInRail(activeTab, tabsRail, instant);
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
      const truthClass = [
        "truth-post",
        post.kind === "agency" ? "truth-post-agency" : "",
        post.kind === "trump" ? "truth-post-trump" : "",
        post.kind === "diplomatic" ? "truth-post-diplomatic" : ""
      ]
        .filter(Boolean)
        .join(" ");
      const stats = post.stats.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
      const actions = post.actions.map((item) => `<span>${escapeHtml(item)}</span>`).join("");

      return `
        <article class="${truthClass}">
          <div class="truth-head">
            <div class="truth-head-main">
              <div class="truth-avatar">${escapeHtml(post.avatar)}</div>
              <div class="truth-meta">
                <div class="truth-name-row">
                  <strong>${escapeHtml(post.author)}</strong>
                  <span class="truth-verified">PARODY</span>
                </div>
                <span>${escapeHtml(post.handle)} &bull; ${escapeHtml(post.meta)}</span>
              </div>
            </div>
            <div class="truth-post-aside">
              <span class="truth-badge">${escapeHtml(post.badge)}</span>
              <span class="truth-time">${escapeHtml(post.time)}</span>
            </div>
          </div>
          <p>${escapeHtml(post.body)}</p>
          <div class="truth-published">${escapeHtml(post.published)}</div>
          <div class="truth-divider"></div>
          <div class="truth-stats">${stats}</div>
          <div class="truth-actions">${actions}</div>
        </article>
      `;
    })
    .join("");

  debunkList.innerHTML = socialState.debunks.map((item) => `<li>${item}</li>`).join("");
  sideNote.textContent = socialState.note;
}

function setActiveSocialPane(pane, options = {}) {
  const { instant = false } = options;
  const nextPane = validSocialPanes.includes(pane) ? pane : "truths";

  socialsUiState.activePane = nextPane;

  socialSubtabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.socialTab === nextPane);
  });

  socialSubviews.forEach((view) => {
    view.classList.toggle("is-active", view.dataset.socialPane === nextPane);
  });

  const activeSocialTab = socialSubtabs.find((tab) => tab.dataset.socialTab === nextPane);
  window.requestAnimationFrame(() => {
    centerNodeInRail(activeSocialTab, socialSubtabsRail, instant);
  });
}

function scrollPanel(element) {
  if (!element) {
    return;
  }

  const canScrollX = element.scrollWidth - element.clientWidth > 24;
  const canScrollY = element.scrollHeight - element.clientHeight > 24;

  if (canScrollX && (!canScrollY || window.matchMedia("(max-width: 760px)").matches)) {
    const distance = Math.max(220, Math.round(element.clientWidth * 0.82));
    element.scrollBy({ left: distance, behavior: "smooth" });
    return;
  }

  const distance = Math.max(220, Math.round(element.clientHeight * 0.82));
  element.scrollBy({ top: distance, behavior: "smooth" });
}

function handleAction(action) {
  if (action === "more-posts") {
    activateView("socials");
    setActiveSocialPane("truths");
    window.setTimeout(() => {
      scrollPanel(socialFeed);
    }, 90);
    return;
  }

  if (action === "more-debunking") {
    activateView("socials");
    setActiveSocialPane("fools");
    window.setTimeout(() => {
      scrollPanel(debunkScroll);
    }, 90);
    return;
  }

  if (action === "simulate-chaos") {
    activateView("socials");
    setActiveSocialPane("simulate");
    return;
  }

  if (action === "launch-simulation") {
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

function activateView(view, options = {}) {
  const { instant = false } = options;

  screenUi.dataset.viewTheme = view;
  setActiveTab(view);
  syncActiveTabIntoView(view, instant);
  setActivePane(view);
  setMetrics(view);

  if (view === "socials") {
    renderSocials();
    setActiveSocialPane(socialsUiState.activePane, { instant });
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

socialSubtabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveSocialPane(tab.dataset.socialTab);
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
activateView(validViews.includes(initialView) ? initialView : validViews[0], { instant: true });
setSequencePhase("idle");

if (validSequencePhases.has(forcedSequencePhase)) {
  sequenceState.triggered = true;
  setSequencePhase(forcedSequencePhase);
}

window.addEventListener("resize", () => {
  const activeTab = tabs.find((tab) => tab.classList.contains("is-active"));
  const activeSocialTab = socialSubtabs.find((tab) => tab.classList.contains("is-active"));

  if (activeTab) {
    syncActiveTabIntoView(activeTab.dataset.view, true);
  }

  centerNodeInRail(activeSocialTab, socialSubtabsRail, true);
});

window.addEventListener("load", () => {
  const activeTab = tabs.find((tab) => tab.classList.contains("is-active"));
  const activeSocialTab = socialSubtabs.find((tab) => tab.classList.contains("is-active"));

  if (activeTab) {
    syncActiveTabIntoView(activeTab.dataset.view, true);
  }

  centerNodeInRail(activeSocialTab, socialSubtabsRail, true);
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    const activeTab = tabs.find((tab) => tab.classList.contains("is-active"));
    const activeSocialTab = socialSubtabs.find((tab) => tab.classList.contains("is-active"));

    if (activeTab) {
      syncActiveTabIntoView(activeTab.dataset.view, true);
    }

    centerNodeInRail(activeSocialTab, socialSubtabsRail, true);
  });
}

window.setInterval(updateClock, 1000);
