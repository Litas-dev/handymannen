/* ============================================================
   Handymannen – script.js
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Compatibility: old webOS TV browsers have no IntersectionObserver ----------
     Simulate it so reveal animations, counters and rating bars fire immediately
     instead of staying hidden forever on old TV browsers. */
  if (!("IntersectionObserver" in window)) {
    window.IntersectionObserver = function (cb) {
      this.observe = function (el) { cb([{ isIntersecting: true, target: el }], this); };
      this.unobserve = function () {};
      this.disconnect = function () {};
    };
  }

  /* ---------- Compatibility: old webOS has no NodeList.forEach ---------- */
  if (typeof NodeList !== "undefined" && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  if (typeof HTMLCollection !== "undefined" && !HTMLCollection.prototype.forEach) {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
  }

  /* ---------- Auto year in footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Load editable text from content.json ---------- */
  if (typeof fetch === "function") {
    fetch("content.json")
    .then(function (r) { return r.json(); })
    .then(function (content) {
      document.querySelectorAll("[data-content]").forEach(function (el) {
        var key = el.getAttribute("data-content");
        if (content[key]) el.innerHTML = content[key];
      });
      var mTitle = document.querySelector("title");
      if (content.meta_title) mTitle.textContent = content.meta_title;
      var mDesc = document.querySelector('meta[name="description"]');
      if (content.meta_description) mDesc.setAttribute("content", content.meta_description);
      window.GALLERY_LB_CAPTION = content.gallery_lb_caption || "Resultat fra prosjekt";
      // Update lightbox captions on gallery thumbnails too.
      document.querySelectorAll("#galleryGrid .gal img").forEach(function (img) {
        img.alt = window.GALLERY_LB_CAPTION;
      });
    })
    .catch(function () { /* keep default text if content.json missing */ });
  }

  /* ---------- Photo gallery (auto-filled from gallery-data.js) ---------- */
  var galleryGrid = document.getElementById("galleryGrid");
  if (galleryGrid && window.GALLERY_IMAGES) {
    window.GALLERY_IMAGES.forEach(function (src) {
      var fig = document.createElement("figure");
      fig.className = "gal";
      fig.setAttribute("data-reveal", "zoom");

      var img = document.createElement("img");
      img.src = src;
      img.alt = "Resultat fra prosjekt";
      img.loading = "lazy";
      fig.appendChild(img);

      galleryGrid.appendChild(fig);
    });
  }

  /* ---------- Fill "about" work image with a random gallery photo ---------- */
  var aboutWork = document.getElementById("aboutWork");
  if (aboutWork && window.GALLERY_IMAGES && window.GALLERY_IMAGES.length) {
    var pick = window.GALLERY_IMAGES[Math.floor(Math.random() * window.GALLERY_IMAGES.length)];
    aboutWork.src = pick;
    aboutWork.alt = "Bilde av utført arbeid";
  }

  /* ---------- Full-screen image lightbox ---------- */
  function buildLightbox() {
    var images = [].slice.call(document.querySelectorAll("#galleryGrid .gal img"));
    if (!images.length) return;

    // Lightbox structure
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Bildevisning");
    box.innerHTML = [
      '<button class="lb__close" aria-label="Lukk">✕</button>',
      '<button class="lb__nav lb__prev" aria-label="Forrige">‹</button>',
      '<figure class="lb__stage">',
      '  <img class="lb__img" alt="" />',
      '  <figcaption class="lb__cap"></figcaption>',
      '</figure>',
      '<button class="lb__nav lb__next" aria-label="Neste">›</button>',
      '<div class="lb__count"></div>'
    ].join("");

    document.body.appendChild(box);

    var imgEl = box.querySelector(".lb__img");
    var capEl = box.querySelector(".lb__cap");
    var countEl = box.querySelector(".lb__count");
    var index = 0;

    function show(i) {
      index = (i + images.length) % images.length;
      var src = images[index].src;
      var cap = images[index].getAttribute("alt") || "";
      imgEl.src = src;
      imgEl.alt = cap;
      capEl.textContent = cap;
      countEl.textContent = (index + 1) + " / " + images.length;
    }

    function open(i) {
      show(i);
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    // Click thumbnail to open
    images.forEach(function (img, i) {
      img.parentElement.style.cursor = "zoom-in";
      img.addEventListener("click", function (e) {
        e.stopPropagation();
        open(i);
      });
    });

    box.addEventListener("click", function (e) {
      if (e.target === box) close(); // click backdrop to close
    });
    box.querySelector(".lb__close").addEventListener("click", close);
    box.querySelector(".lb__prev").addEventListener("click", function () { show(index - 1); });
    box.querySelector(".lb__next").addEventListener("click", function () { show(index + 1); });

    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });

    // Touch / swipe support
    var startX = 0;
    box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  if (document.getElementById("galleryGrid")) {
    buildLightbox();
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function closeNav() {
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("is-open");
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
  var revealEls = document.querySelectorAll("[data-reveal]");
  revealEls.forEach(function (el) {
    // Slight stagger based on sibling index within a group
    var idx = [].slice.call(el.parentElement.children).indexOf(el);
    el.style.transitionDelay = (idx % 4) * 90 + "ms";
  });

  var revealObserver = new IntersectionObserver(
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
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
    var duration = 1600;
    var start = performance.now();

    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      var value = target * eased;
      el.textContent = decimals > 0
        ? value.toFixed(decimals).replace(".", ",")
        : Math.round(value).toLocaleString("nb-NO");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll(".count");
  var countObserver = new IntersectionObserver(
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
  var bars = document.querySelectorAll(".bar__trk i");
  var barObserver = new IntersectionObserver(
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
    var w = b.getAttribute("style").match(/--w:\s*([\d.]+)%/)[1];
    b.style.width = "0%";
    b.dataset.w = w;
    barObserver.observe(b);
  });

  /* ---------- Sticky nav shadow on scroll ---------- */
  var nav = document.getElementById("nav");
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
