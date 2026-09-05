/* ============================================================
   Handymannen – Presentation / Digital Signage
   Full-screen auto-running slideshow for big screens.
   Edit SLIDES below to change content. No build step needed.
   ============================================================ */

var IMG = "../img/gallery/";     // gallery photos
var HERO = "../img/main.png";    // craftsman photo

/* ---- Edit your slides here ---- */
var SLIDES = [
  {
    kind: "brand",
    image: HERO,
    logo: "../img/handymannen-logo.png",
    kicker: "Velkommen",
    text: "Profesjonelt håndverk i Oslo, Akershus & Innlandet. Vi utfører oppdrag – fra planlegging til ferdig resultat.",
    align: "center"
  },
  {
    kind: "content",
    image: IMG + "1.jpg",
    kicker: "Våre tjenester",
    title: "Alt innen <span class='accent'>håndverk</span>",
    text: "Én partner for hele prosjektet – små og store oppdrag.",
    align: "center",
    list: ["Oppussing", "Snekkerarbeid", "Bad", "Kjøkken", "Flis", "Maling", "Terrasser", "Reparasjon & utbedring"]
  },
  {
    kind: "content",
    image: HERO,
    kicker: "Fra idé til ferdig",
    title: "Vi tar oss av <span class='accent'>hele</span> prosessen",
    text: "Planlegging, utførelse og oppfølging. Du får ett kontaktpunkt og et ryddig resultat."
  },
  {
    kind: "content",
    image: IMG + "2.jpg",
    kicker: "Oppussing",
    title: "Generell <span class='accent'>oppussing</span>",
    text: "Alt innen generell oppussing – fra planlegging til ferdig resultat."
  },
  {
    kind: "content",
    image: IMG + "3.jpg",
    kicker: "Bad & Kjøkken",
    title: "Våtrom og <span class='accent'>kjøkken</span>",
    text: "Oppussing og utbedring av bad og våtrom, og montering av kjøkken skreddersydd etter ditt behov."
  },
  {
    kind: "content",
    image: IMG + "4.jpg",
    kicker: "Flis & Maling",
    title: "Pent og <span class='accent'>holdbart</span>",
    text: "Flislegging på bad, kjøkken og andre flater. Maling innvendig og utvendig med rene kanter."
  },
  {
    kind: "content",
    image: IMG + "5.jpg",
    kicker: "Terrasser",
    title: "Uteområder <span class='accent'>verdt å bruke</span>",
    text: "Bygging og utbedring av terrasser og plattinger – vi skaper uteområder for hele året."
  },
  {
    kind: "content",
    image: IMG + "6.jpg",
    kicker: "Reparasjon & utbedring",
    title: "Småting kan bli <span class='accent'>store</span> problemer",
    text: "Vi reparerer det som er ødelagt og forebygger større skader – før de blir dyre."
  },
  {
    kind: "stat",
    image: IMG + "7.jpg",
    kicker: "Kvalitet du kan stole på",
    title: "Topprangert",
    stat: "4.8",
    statSub: "av 5 – på Mittanbud",
    text: "Lang erfaring, fornøyde kunder og ryddig håndverk.",
    align: "center"
  },
  {
    kind: "contact",
    image: HERO,
    kicker: "Kontakt oss",
    title: "Be om <span class='accent'>tilbud</span>",
    text: "a.jocys@yahoo.com  ·  +47 46 37 44 77",
    align: "center"
  }
];

/* ============================================================
   Engine
   ============================================================ */
(function () {
  var stage = document.getElementById("stage");
  var loader = document.getElementById("loader");
  var counterEl = document.getElementById("counter");
  var progressBar = document.getElementById("progressBar");
  var autoDelay = 8000;   // ms per slide when playing
  // Simple query-string helper (old webOS browsers have no URLSearchParams).
  function getParam(name) {
    var m = location.search.match(new RegExp("[?&]" + name + "=([^&]*)"));
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  }
  var total = SLIDES.length;
  var playing = getParam("pause") !== "1";
  var current = Math.max(0, Math.min(total - 1, parseInt(getParam("start") || "0", 10) || 0));
  var timer = null;
  var progressTimer = null;

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function build() {
    var frag = document.createDocumentFragment();
    SLIDES.forEach(function (s, i) {
      var el = document.createElement("div");
      el.className = "slide" + (s.kind === "brand" ? " slide--brand" : "") + (s.align === "center" ? " slide__align--center" : (s.align === "right" ? " slide__align--right" : ""));
      el.setAttribute("data-index", i);

      var bg = document.createElement("div");
      bg.className = "slide__bg";
      bg.style.backgroundImage = "url('" + s.image + "')";
      el.appendChild(bg);

      var shade = document.createElement("div");
      shade.className = "slide__shade";
      el.appendChild(shade);

      var content = document.createElement("div");
      content.className = "slide__content";

      if (s.kind === "brand") {
        if (s.logo) {
          var logo = document.createElement("img");
          logo.className = "slide__logo";
          logo.src = s.logo;
          logo.alt = "Handymannen";
          content.appendChild(logo);
        }
        if (s.kicker) content.appendChild(kick(s.kicker));
        if (s.title) content.appendChild(head(s.title));
        if (s.text) content.appendChild(para(s.text));
      } else if (s.kind === "stat") {
        if (s.kicker) content.appendChild(kick(s.kicker));
        if (s.title) content.appendChild(head(s.title));
        if (s.stat) {
          var st = document.createElement("div");
          st.className = "slide__stat";
          st.innerHTML = esc(s.stat);
          content.appendChild(st);
        }
        if (s.statSub) {
          var ss = document.createElement("div");
          ss.className = "slide__stat-sub";
          ss.innerHTML = esc(s.statSub);
          content.appendChild(ss);
        }
        if (s.text) content.appendChild(para(s.text));
      } else if (s.kind === "contact") {
        if (s.kicker) content.appendChild(kick(s.kicker));
        if (s.title) content.appendChild(head(s.title));
        if (s.text) content.appendChild(para(s.text));
      } else {
        if (s.kicker) content.appendChild(kick(s.kicker));
        if (s.title) content.appendChild(head(s.title));
        if (s.text) content.appendChild(para(s.text));
        if (s.list && s.list.length) {
          var list = document.createElement("div");
          list.className = "slide__list";
          s.list.forEach(function (item) {
            var chip = document.createElement("span");
            chip.className = "slide__chip";
            chip.innerHTML = esc(item);
            list.appendChild(chip);
          });
          content.appendChild(list);
        }
      }

      el.appendChild(content);
      frag.appendChild(el);
    });
    stage.appendChild(frag);
  }

  function kick(t) { var e = document.createElement("div"); e.className = "slide__kicker"; e.innerHTML = esc(t); return e; }
  function head(t) { var e = document.createElement("h2"); e.className = "slide__title"; e.innerHTML = t; return e; }
  function para(t) { var e = document.createElement("p"); e.className = "slide__text"; e.innerHTML = esc(t); return e; }

  /* Preload images so no flash on big screens.
     Reveal the FIRST slide as soon as its own image is ready (old TV browsers
     are slow / low-memory — don't make them wait for every frame). */
  function preload() {
    var imgs = [];
    SLIDES.forEach(function (s) { imgs.push(s.image); if (s.logo) imgs.push(s.logo); });

    var priority = SLIDES[current];
    var prioritySrcs = [];
    if (priority && priority.image) prioritySrcs.push(priority.image);
    if (priority && priority.logo) prioritySrcs.push(priority.logo);

    var shown = false;
    function reveal() {
      if (shown) return;
      shown = true;
      loader.className = "loader is-hidden";
      show(current);
    }

    function load(src, cb) {
      var img = new Image();
      img.onload = img.onerror = cb;
      img.src = src;
    }

    // Load the current slide's image first, then reveal.
    prioritySrcs.forEach(function (src) { load(src, reveal); });
    if (!prioritySrcs.length) reveal();

    // Silently preload the rest (smooth transitions) without blocking the first slide.
    imgs.forEach(function (src) {
      var isPriority = false;
      for (var p = 0; p < prioritySrcs.length; p++) {
        if (prioritySrcs[p] === src) { isPriority = true; break; }
      }
      if (!isPriority) load(src, function () {});
    });
  }

  function show(i) {
    var slides = stage.children;
    if (!slides.length) return;
    current = (i + total) % total;
    for (var x = 0; x < slides.length; x++) {
      slides[x].className = slides[x].className.replace(/ is-active/g, "");
    }
    slides[current].className += " is-active";
    counterEl.textContent = (current + 1) + " / " + total;
    updateProgress();
  }

  function updateProgress() {
    clearInterval(progressTimer);
    if (!playing) { progressBar.style.width = "0"; return; }
    progressBar.style.width = "0";
    var start = Date.now();
    progressTimer = setInterval(function () {
      var pct = Math.min((Date.now() - start) / autoDelay * 100, 100);
      progressBar.style.width = pct + "%";
    }, 40);
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  function play() {
    if (playing) return;
    playing = true;
    document.getElementById("playPause").innerHTML = "&#10074;&#10074;";
    tickTimer();
    updateProgress();
  }
  function pause() {
    playing = false;
    document.getElementById("playPause").innerHTML = "&#9654;";
    clearInterval(timer);
    clearInterval(progressTimer);
    progressBar.style.width = "0";
  }
  function togglePlay() { playing ? pause() : play(); }

  function tickTimer() {
    clearInterval(timer);
    timer = setInterval(function () { if (playing) next(); }, autoDelay);
  }

  function goFullscreen() {
    var d = document.documentElement;
    if (!document.fullscreenElement) {
      (d.requestFullscreen || d.webkitRequestFullscreen || d.msRequestFullscreen).call(d);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen).call(document);
    }
  }

  /* Nav wiring */
  document.getElementById("next").onclick = function () { next(); tickTimer(); };
  document.getElementById("prev").onclick = function () { prev(); tickTimer(); };
  document.getElementById("playPause").onclick = togglePlay;
  document.getElementById("fullscreen").onclick = goFullscreen;

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); tickTimer(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); tickTimer(); }
    else if (e.key === "f" || e.key === "F") goFullscreen();
    else if (e.key === "p" || e.key === "P") togglePlay();
  });

  /* Click sides / swipe */
  var touchX = null;
  document.getElementById("stage").addEventListener("click", function (e) {
    var w = window.innerWidth;
    if (e.clientX > w * 0.6) { next(); tickTimer(); }
    else if (e.clientX < w * 0.4) { prev(); tickTimer(); }
  });
  document.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); tickTimer(); }
    touchX = null;
  }, { passive: true });

  /* Idle: re-start timer after manual nav */
  function resetTimer() { clearTimeout(timer); timer = setTimeout(resetTimer, 1); }

  function init() {
    build();
    preload();
    if (playing) tickTimer();
    /* Set initial play/pause icon to match state */
    if (!playing) {
      var btn = document.getElementById("playPause");
      if (btn) btn.innerHTML = "&#9654;";
    }
  }

  init();
})();
