/* ============================================================
   Handymannen Jocys – script.js
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Auto year in footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function closeNav() {
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", function () {
    const open = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });

  // Close menu on outside click / escape
  document.addEventListener("click", function (e) {
    if (
      navLinks.classList.contains("is-open") &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeNav();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach(function (el) {
    // Slight stagger based on sibling index within a group
    const idx = Array.from(el.parentElement.children).indexOf(el);
    el.style.transitionDelay = (idx % 4) * 90 + "ms";
  });

  const revealObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = decimals > 0
        ? value.toFixed(decimals).replace(".", ",")
        : Math.round(value).toLocaleString("nb-NO");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll(".count");
  const countObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach(function (c) { countObserver.observe(c); });

  /* ---------- Rating bars animate fill when visible ---------- */
  const bars = document.querySelectorAll(".bar__trk i");
  const barObserver = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute("style").match(/--w:\s*([\d.]+)%/)[1] + "%";
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  // Reset bars to 0 so the animation plays on reveal
  bars.forEach(function (b) {
    const w = b.getAttribute("style").match(/--w:\s*([\d.]+)%/)[1];
    b.style.width = "0%";
    b.dataset.w = w;
    barObserver.observe(b);
  });

  /* ---------- Sticky nav shadow on scroll ---------- */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      nav.style.boxShadow = "0 6px 30px rgba(20,26,46,.08)";
    } else {
      nav.style.boxShadow = "none";
    }
  }, { passive: true });

  /* ---------- Contact = mailto (no form/backend) ---------- */
  // Kontakt går direkte via mailto:a.jocys@yahoo.com – ingen skjema.
})();
