const demos = [
      { id: "01", group: "Agreeing", variant: "High Five", sim: "01_agreeing_high_five.mp4", real: "01_real_agreeing_high_five.mp4" },
      { id: "02", group: "Agreeing", variant: "Nod + Fists", sim: "02_agreeing_nod_fist.mp4", real: "02_real_agreeing_nod_fist.mp4" },
      { id: "03", group: "Agreeing", variant: "Thumbs Up", sim: "03_agreeing_thumbs_up.mp4", real: "03_real_agreeing_thumbs_up.mp4" },
      { id: "04", group: "Comforting", variant: "Hand-Head", sim: "04_comforting_hand_head.mp4", real: "04_real_comforting_hand_head.mp4" },
      { id: "05", group: "Comforting", variant: "Hand to Heart", sim: "05_comforting_hand_to_heart.mp4", real: "05_real_comforting_hand_to_heart.mp4" },
      { id: "06", group: "Comforting", variant: "Heart (Both)", sim: "06_comforting_heart_both.mp4", real: "06_real_comforting_heart_both.mp4" },
      { id: "07", group: "Comforting", variant: "Hug", sim: "07_comforting_hug.mp4", real: "07_real_comforting_hug.mp4" },
      { id: "08", group: "Comforting", variant: "Offering", sim: "08_comforting_offering.mp4", real: "08_real_comforting_offering.mp4" },
      { id: "09", group: "Doubting", variant: "Chin Stroke", sim: "09_doubting_chin_stroke.mp4", real: "09_real_doubting_chin_stroke.mp4" },
      { id: "10", group: "Doubting", variant: "Head Stroke", sim: "10_doubting_head_stroke.mp4", real: "10_real_doubting_head_stroke.mp4" },
      { id: "11", group: "Doubting", variant: "Shrug", sim: "11_doubting_shrug.mp4", real: "11_real_doubting_shrug.mp4" },
      { id: "12", group: "Emphasizing", variant: "Beat Down", sim: "12_emphasizing_beat_down.mp4", real: "12_real_emphasizing_beat_down.mp4" },
      { id: "13", group: "Emphasizing", variant: "Clap", sim: "13_emphasizing_clap.mp4", real: "13_real_emphasizing_clap.mp4" },
      { id: "14", group: "Emphasizing", variant: "Hands Up", sim: "14_emphasizing_hands_up.mp4", real: "14_real_emphasizing_hands_up.mp4" },
      { id: "15", group: "Emphasizing", variant: "Open Palms Up", sim: "15_emphasizing_open_palm_up.mp4", real: "15_real_emphasizing_open_palm_up.mp4" },
      { id: "16", group: "Neutral", variant: "Release", sim: "16_neutral_release.mp4", real: "16_real_neutral_release.mp4" },
      { id: "17", group: "Neutral", variant: "Release Lower", sim: "17_neutral_release_lower.mp4", real: "17_real_neutral_release_lower.mp4" },
      { id: "18", group: "Pointing", variant: "Point Left", sim: "18_pointing_point_left.mp4", real: "18_real_pointing_point_left.mp4" },
      { id: "19", group: "Pointing", variant: "Point Right", sim: "19_pointing_point_right.mp4", real: "19_real_pointing_point_right.mp4" },
      { id: "20", group: "Pointing", variant: "Point Up-Right", sim: "20_pointing_point_up_right.mp4", real: "20_real_pointing_point_up_right.mp4" },
      { id: "21", group: "Pointing", variant: "Right Hand Up", sim: "21_pointing_right_hand_up.mp4", real: "21_real_pointing_right_hand_up.mp4" },
      { id: "22", group: "Rejecting", variant: "Cross Reject", sim: "22_rejecting_cross_reject.mp4", real: "22_real_rejecting_cross_reject.mp4" },
      { id: "23", group: "Rejecting", variant: "Push Away", sim: "23_rejecting_push_away.mp4", real: "23_real_rejecting_push_away.mp4" },
      { id: "24", group: "Rejecting", variant: "Reject Push", sim: "24_rejecting_reject_push.mp4", real: "24_real_rejecting_reject_push.mp4" },
      { id: "25", group: "Rejecting", variant: "X-ray", sim: "25_rejecting_x_ray.mp4", real: "25_real_rejecting_x_ray.mp4" },
      { id: "26", group: "Welcoming", variant: "Face Wave", sim: "26_welcoming_face_wave.mp4", real: "26_real_welcoming_face_wave.mp4" },
      { id: "27", group: "Welcoming", variant: "Open Arms", sim: "27_welcoming_open_arms.mp4", real: "27_real_welcoming_open_arms.mp4" },
      { id: "28", group: "Welcoming", variant: "Shake Hand", sim: "28_welcoming_shake_hand.mp4", real: "28_real_welcoming_shake_hand.mp4" },
      { id: "29", group: "Welcoming", variant: "Wave High", sim: "29_welcoming_wave_high.mp4", real: "29_real_welcoming_wave_high.mp4" }
    ];

    const groups = ["All", ...Array.from(new Set(demos.map((demo) => demo.group)))];
    const filters = document.getElementById("filters");
    const grid = document.getElementById("demoGrid");
    const autoplayToggle = document.getElementById("autoplayToggle");
    let demoAutoplay = false;

    function renderFilters(active = "All") {
      filters.innerHTML = groups.map((group) => `
        <button class="filter-btn ${group === active ? "active" : ""}" type="button" data-filter="${group}">
          <i class="fas ${group === "All" ? "fa-layer-group" : "fa-circle"}"></i>${group}
        </button>
      `).join("");
    }

    function renderDemos(active = "All") {
      const visible = active === "All" ? demos : demos.filter((demo) => demo.group === active);
      grid.innerHTML = visible.map((demo) => `
        <article class="demo-card">
          <div class="demo-top">
            <div>
              <p>${demo.group}</p>
              <h3>${demo.variant}</h3>
            </div>
            <span>Demo ${demo.id}</span>
          </div>
          <div class="paired-videos">
            <div class="video-pane">
              <div class="video-label">Simulation</div>
              <video controls loop preload="metadata" playsinline>
                <source src="./static/videos/sim/${demo.sim}" type="video/mp4">
              </video>
            </div>
            <div class="video-pane">
              <div class="video-label">Real Robot</div>
              <video controls loop preload="metadata" playsinline>
                <source src="./static/videos/real/${demo.real}" type="video/mp4">
              </video>
            </div>
          </div>
        </article>
      `).join("");
      syncDemoAutoplay(grid);
    }

    function updateAutoplayButton() {
      autoplayToggle.classList.toggle("active", demoAutoplay);
      autoplayToggle.setAttribute("aria-pressed", String(demoAutoplay));
      autoplayToggle.innerHTML = demoAutoplay
        ? "<i class=\"fas fa-pause\"></i><span>Autoplay On</span>"
        : "<i class=\"fas fa-play\"></i><span>Autoplay Off</span>";
    }

    function syncDemoAutoplay(scope = document) {
      if (!scope) return;
      scope.querySelectorAll("video").forEach((video) => {
        video.loop = true;
        if (demoAutoplay) {
          video.muted = true;
          const playPromise = video.play();
          if (playPromise) {
            playPromise.catch(() => {});
          }
        } else if (!video.paused) {
          video.pause();
        }
      });
    }

    autoplayToggle.addEventListener("click", () => {
      demoAutoplay = !demoAutoplay;
      updateAutoplayButton();
      syncDemoAutoplay(document.querySelector(".featured-grid"));
      syncDemoAutoplay(grid);
    });

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      const active = button.dataset.filter;
      renderFilters(active);
      renderDemos(active);
    });

    renderFilters();
    renderDemos();
    updateAutoplayButton();
    syncDemoAutoplay(document.querySelector(".featured-grid"));

    /* ---------- figure lightbox ---------- */
    const dialog = document.getElementById("figDialog");
    const dialogImg = document.getElementById("figDialogImg");
    const dialogCap = document.getElementById("figDialogCap");
    const dialogClose = document.getElementById("figDialogClose");

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-lightbox]");
      if (!trigger || !dialog) return;
      const card = trigger.closest(".fig-card");
      const caption = card ? card.querySelector(".fig-cap") : null;
      dialogImg.src = trigger.currentSrc || trigger.src;
      dialogImg.alt = trigger.alt || "";
      dialogCap.textContent = caption ? caption.innerText.trim() : (trigger.alt || "");
      if (typeof dialog.showModal === "function") dialog.showModal();
    });

    if (dialogClose) {
      dialogClose.addEventListener("click", () => dialog.close());
    }
    if (dialog) {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    }

    /* ---------- BibTeX copy ---------- */
    const copyBtn = document.getElementById("copyBibtex");
    const bibtexEl = document.getElementById("bibtex");
    if (copyBtn && bibtexEl) {
      copyBtn.addEventListener("click", async () => {
        const text = bibtexEl.textContent.trim();
        try {
          await navigator.clipboard.writeText(text);
        } catch (err) {
          const range = document.createRange();
          range.selectNodeContents(bibtexEl);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          document.execCommand("copy");
          selection.removeAllRanges();
        }
        copyBtn.classList.add("copied");
        copyBtn.innerHTML = "<i class=\"fas fa-check\"></i><span>Copied</span>";
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          copyBtn.innerHTML = "<i class=\"far fa-copy\"></i><span>Copy</span>";
        }, 1800);
      });
    }

    /* ---------- scroll entrance (IO fallback for scroll-driven CSS) ---------- */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("vis");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(".fade-up").forEach((element) => observer.observe(element));

    /* ---------- active nav highlight ---------- */
    const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
    const sectionMap = navLinks
      .map((link) => {
        const id = link.getAttribute("href");
        return id && id.startsWith("#") ? { link, el: document.querySelector(id) } : null;
      })
      .filter((item) => item && item.el);

    if (sectionMap.length) {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const item = sectionMap.find((s) => s.el === entry.target);
          if (!item) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active"));
            item.link.classList.add("active");
          }
        });
      }, { rootMargin: "-35% 0px -55% 0px" });
      sectionMap.forEach((item) => navObserver.observe(item.el));
    }
