(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const closeNavigation = () => {
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("nav-open");
  };

  navToggle?.addEventListener("click", () => {
    const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
    nav?.classList.toggle("is-open", willOpen);
    navToggle.setAttribute("aria-expanded", String(willOpen));
    navToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("nav-open", willOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNavigation));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 880) closeNavigation();
  });
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const demoVideos = document.querySelectorAll("[data-demo-video]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.42 },
    );
    demoVideos.forEach((video) => videoObserver.observe(video));
  }

  const sectionById = new Map(
    navLinks
      .map((link) => {
        const section = document.querySelector(link.getAttribute("href"));
        return section ? [section.id, link] : null;
      })
      .filter(Boolean),
  );

  if ("IntersectionObserver" in window && sectionById.size) {
    const visibleSections = new Map();
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio);
          else visibleSections.delete(entry.target.id);
        });

        if (!visibleSections.size) return;
        const activeId = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0][0];
        navLinks.forEach((link) => link.classList.toggle("is-active", link === sectionById.get(activeId)));
      },
      { rootMargin: "-18% 0px -60%", threshold: [0.05, 0.2, 0.5] },
    );
    sectionById.forEach((_, id) => sectionObserver.observe(document.getElementById(id)));
  }

  const copyButton = document.querySelector("[data-copy-citation]");
  const citation = document.querySelector("#bibtex code");

  copyButton?.addEventListener("click", async () => {
    if (!citation) return;
    const originalLabel = copyButton.textContent;

    try {
      await navigator.clipboard.writeText(citation.textContent.trim());
      copyButton.textContent = "Copied";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citation);
      selection.removeAllRanges();
      selection.addRange(range);
      copyButton.textContent = "Selected";
    }

    window.setTimeout(() => {
      copyButton.textContent = originalLabel;
    }, 1800);
  });

  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxCaption = lightbox?.querySelector("p");
  const closeLightbox = lightbox?.querySelector("[data-lightbox-close]");

  document.querySelectorAll("[data-figure]").forEach((figure) => {
    const trigger = figure.querySelector(".figure-open");
    const image = figure.querySelector("img");
    const caption = figure.querySelector("figcaption");

    trigger?.addEventListener("click", () => {
      if (!lightbox || !lightboxImage || !image) return;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = caption?.textContent.trim() || image.alt;
      lightbox.showModal();
      document.body.style.overflow = "hidden";
    });
  });

  const dismissLightbox = () => {
    if (!lightbox?.open) return;
    lightbox.close();
    document.body.style.overflow = "";
  };

  closeLightbox?.addEventListener("click", dismissLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) dismissLightbox();
  });
  lightbox?.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
})();
