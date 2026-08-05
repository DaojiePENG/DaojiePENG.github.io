const delays = [0, 10, 20, 40];

const results = {
  openvla: {
    spatial: [84.6, 6.8, 0.2, 0.0],
    object: [71.2, 1.2, 0.0, 0.0],
    goal: [77.0, 2.2, 0.0, 0.0],
    long: [56.2, 5.2, 0.0, 0.0]
  },
  oft: {
    spatial: [98.4, 10.6, 0.0, 0.0],
    object: [98.6, 3.6, 0.0, 0.0],
    goal: [97.2, 26.2, 4.0, 0.0],
    long: [93.4, 8.4, 1.4, 0.0]
  },
  univla: {
    spatial: [96.0, 27.4, 0.4, 0.0],
    object: [96.6, 34.8, 2.6, 0.0],
    goal: [94.6, 48.2, 21.8, 3.0],
    long: [93.2, 35.0, 2.2, 0.5]
  },
  vlash: {
    spatial: [97.3, 60.0, 5.0, 0.0],
    object: [99.6, 62.8, 8.2, 0.4],
    goal: [96.7, 56.8, 28.2, 6.4],
    long: [93.5, 45.6, 9.2, 0.0]
  },
  cloudedge: {
    spatial: [97.9, 93.6, 89.6, 76.4],
    object: [97.8, 94.4, 92.1, 75.6],
    goal: [96.5, 92.9, 90.9, 78.0],
    long: [91.7, 83.2, 78.1, 63.8]
  }
};

const suiteNames = {
  average: "all suites",
  spatial: "Spatial",
  object: "Object",
  goal: "Goal",
  long: "Long"
};

function valueFor(method, suite, delayIndex) {
  if (suite !== "average") {
    return results[method][suite][delayIndex];
  }

  const suites = ["spatial", "object", "goal", "long"];
  const total = suites.reduce((sum, currentSuite) => sum + results[method][currentSuite][delayIndex], 0);
  return total / suites.length;
}

function replaceIcon(button, iconName) {
  const existingIcon = button.querySelector("svg");
  if (existingIcon) {
    existingIcon.outerHTML = `<i data-lucide="${iconName}" aria-hidden="true"></i>`;
  }
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }

  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = [...document.querySelectorAll("[data-nav] a")];

  const closeNavigation = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-open");
    replaceIcon(navToggle, "menu");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("nav-open", isOpen);
    replaceIcon(navToggle, isOpen ? "x" : "menu");
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNavigation));

  const desktopNavigation = window.matchMedia("(min-width: 781px)");
  desktopNavigation.addEventListener("change", (event) => {
    if (event.matches) closeNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNavigation();
      navToggle.focus();
    }
  });

  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  observedSections.forEach((section) => navObserver.observe(section));

  const slider = document.querySelector("#delay-slider");
  const output = document.querySelector("[data-delay-output]");
  const summary = document.querySelector("[data-result-summary]");
  const status = document.querySelector("[data-window-status]");
  const suiteButtons = [...document.querySelectorAll("[data-suite]")];
  const chartRows = [...document.querySelectorAll("[data-method]")];
  let activeSuite = "average";

  const renderChart = () => {
    const delayIndex = Number(slider.value);
    const delay = delays[delayIndex];
    output.innerHTML = `<em>d</em><sub>max</sub> = ${delay} steps`;
    slider.setAttribute("aria-valuetext", `${delay} steps`);

    const values = {};
    chartRows.forEach((row) => {
      const method = row.dataset.method;
      const value = valueFor(method, activeSuite, delayIndex);
      values[method] = value;
      row.querySelector(".bar-fill").style.width = `${value}%`;
      row.querySelector(".bar-value").textContent = `${value.toFixed(1)}%`;
    });

    const baselineValues = [values.vlash, values.univla, values.oft, values.openvla];
    const bestBaseline = Math.max(...baselineValues);
    const gap = values.cloudedge - bestBaseline;
    const comparison = gap >= 0 ? "over" : "behind";
    summary.innerHTML = `<strong>${gap >= 0 ? "+" : ""}${gap.toFixed(1)} points</strong> ${comparison} the best baseline at ${delay} steps in ${suiteNames[activeSuite]}.`;

    const beyondWindow = delay > 20;
    status.textContent = beyondWindow ? "Beyond the training window" : "Within the training window";
    status.classList.toggle("is-beyond", beyondWindow);
  };

  slider.addEventListener("input", renderChart);
  suiteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeSuite = button.dataset.suite;
      suiteButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      renderChart();
    });
  });
  renderChart();

  const copyButton = document.querySelector("[data-copy-bibtex]");
  const bibtex = document.querySelector("#bibtex");

  copyButton.addEventListener("click", async () => {
    const citation = bibtex.textContent.trim();
    try {
      await navigator.clipboard.writeText(citation);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(bibtex);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
    }

    copyButton.querySelector("span").textContent = "Copied";
    replaceIcon(copyButton, "check");
    window.setTimeout(() => {
      copyButton.querySelector("span").textContent = "Copy";
      replaceIcon(copyButton, "copy");
    }, 1800);
  });

  const dialog = document.querySelector("[data-image-dialog]");
  const dialogImage = document.querySelector("[data-dialog-image]");
  const dialogClose = document.querySelector("[data-dialog-close]");
  let zoomTrigger = null;

  document.querySelectorAll("[data-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      zoomTrigger = button;
      dialogImage.src = button.dataset.zoom;
      const figureImage = button.closest("figure").querySelector("img");
      dialogImage.alt = figureImage.alt;
      dialog.showModal();
    });
  });

  const closeDialog = () => {
    dialog.close();
    if (zoomTrigger) zoomTrigger.focus();
  };

  dialogClose.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.querySelector("[data-year]").textContent = new Date().getFullYear();
});
