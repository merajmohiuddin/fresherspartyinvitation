/* ============ EDIT YOUR EVENT DETAILS HERE ============ */
const CONFIG = {
  collegeName: "Vidya Dayini College of Information Technology & Management",
  eventDate: "2026-11-14T00:00:00+05:30", // countdown target (IST)
  dateText: "14 November 2026",
  time: "9:00 AM onwards",
  venue: "Vidya Dayini College of Information Technology & Management",
  galleryImages: [
    { src: "assets/images/gallery/poster.jpg", alt: "Freshers party poster" },
    { src: "assets/images/gallery/food.jpg", alt: "Biryani and spices" },
    { src: "assets/images/gallery/games.jpg", alt: "Party games" },
    { src: "assets/images/gallery/dance.jpg", alt: "Students dancing with hands up" },
    { src: "assets/images/gallery/mr-ms-fresher.jpg", alt: "Mr. and Ms. Fresher 2026 holding trophies" }
  ]
};
/* ======================================================= */

const $ = s => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = matchMedia("(max-width: 700px)").matches;
gsap.registerPlugin(ScrollTrigger);

/* Fill event details */
document.querySelectorAll("[data-cfg]").forEach(el => {
  if (CONFIG[el.dataset.cfg]) { const t = CONFIG[el.dataset.cfg]; el.textContent = t; if (el.dataset.cfg === "venue") { const b = document.createElement("strong"); b.textContent = t; el.textContent = ""; el.append(b); } }
});

/* ---------- Music ---------- */
const audio = $("#audio"), musicBtn = $("#musicBtn"), viz = $("#viz"), vol = $("#vol");
audio.volume = +vol.value;
const PLAY = "M8 5v14l11-7z", PAUSE = "M6 5h4v14H6zm8 0h4v14h-4z";
function setPlaying(on) {
  viz.classList.toggle("on", on);
  musicBtn.setAttribute("aria-pressed", on);
  musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  $("#musicIcon").setAttribute("d", on ? PAUSE : PLAY);
}
async function playMusic() {
  try { await audio.play(); setPlaying(true); }
  catch { setPlaying(false); console.warn("Music file missing or blocked: add assets/music/piano.mp3"); }
}
musicBtn.addEventListener("click", () => audio.paused ? playMusic() : (audio.pause(), setPlaying(false)));
vol.addEventListener("input", () => gsap.to(audio, { volume: +vol.value, duration: .25 }));

/* ---------- Envelope opening ---------- */
const env = $("#envelope");
let opened = false;
env.addEventListener("click", () => {
  if (opened) return; opened = true;
  playMusic(); // started by the visitor's click
  const envelopeScale = gsap.getProperty(env, "scale");
  const done = () => {
    $("#intro").remove(); document.body.classList.remove("locked");
    $("#site").removeAttribute("aria-hidden");
  };
  env.classList.add("open");
  gsap.set(env, { scale: envelopeScale });
  startSite();
  if (reduce) { gsap.set("#site", { opacity: 1 }); return done(); }
  gsap.timeline({ onComplete: done, defaults: { ease: "power2.inOut" } })
    .to(env, { scale: 1.12, duration: .6, ease: "power2.out" })
    .to(env, { scale: .96, duration: .6 }, "<.6")
    .to(env, { scale: 1, duration: .5 })
    .to(".env-seal", { scale: 1.3, opacity: 0, duration: .8 }, "-=.3")
    .to(".env-flap", { rotationX: 180, duration: 1.5, ease: "power2.inOut" }, "-=.1")
    .set(".env-flap", { zIndex: 1 })
    .to(".env-card", { y: "-62%", duration: 1.5, ease: "power2.inOut" }, "-=.55")
    .to(".intro-college,.intro-invite,.intro-hint", { opacity: 0, duration: 1, ease: "power1.inOut" }, "-=.7")
    .to(".env-card", { scale: 2.6, duration: 1.7, ease: "power2.in" }, "+=.2")
    .to("#intro", { opacity: 0, duration: 1.3, ease: "power1.inOut" }, "-=.85")
    .to("#site", { opacity: 1, duration: 1.5, ease: "power1.inOut" }, "<")
    .add(() => heroTl && heroTl.play(), "<.35");
});

/* ---------- Site animations ---------- */
let heroTl = null;
function startSite() {
  const h1 = $(".hero h1");
  // split letters for the cinematic reveal
  h1.setAttribute("aria-label", h1.textContent.trim());
  h1.innerHTML = [...h1.textContent].map(c => c === " " ? " " : `<span class="ch">${c}</span>`).join("");
  h1.querySelectorAll(".ch").forEach((c, i) => { if (i >= 8) c.style.color = "var(--gold)"; });
  if (reduce) return;
  heroTl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } })
    .from(".welcome-to", { y: 12, opacity: 0, duration: 1.2 })
    .from(".hero .ch", { y: 20, opacity: 0, stagger: .07, duration: 1.3 })
    .from(".hero .college", { y: 12, opacity: 0, duration: 1.3 })
    .from(".tagline,.hero .btn", { y: 12, opacity: 0, stagger: .2, duration: 1.2 })
    .from(".scroll-cue", { opacity: 0, duration: 1.2 });

  gsap.utils.toArray("section:not(.hero) > *").forEach(el =>
    gsap.from(el, { y: 20, opacity: 0, duration: 1.2, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true } }));

  if (!mobile) gsap.utils.toArray("[data-parallax]").forEach(el =>
    gsap.to(el, { yPercent: 25, ease: "none", scrollTrigger: { trigger: ".hero", scrub: true } }));

  // Countdown number intro
  ScrollTrigger.create({ trigger: "#countdown", start: "top 80%", once: true, onEnter: () =>
    ["d", "h", "m", "s"].forEach(k => {
      const o = { v: 0 }, el = $("#cd-" + k);
      gsap.to(o, { v: +el.dataset.v || 0, duration: 1.4, ease: "power2.out", onUpdate: () => el.textContent = String(Math.round(o.v)).padStart(2, "0") });
    }) });

  if (!mobile) {
    // Magnetic buttons
    document.querySelectorAll(".magnetic").forEach(b => {
      b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3 }); });
      b.addEventListener("pointerleave", () => gsap.to(b, { x: 0, y: 0, duration: .5, ease: "elastic.out(1,.5)" }));
    });
    // Subtle 3D tilt
    document.querySelectorAll(".tilt").forEach(c => {
      c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect();
        gsap.to(c, { rotationY: ((e.clientX - r.left) / r.width - .5) * 10, rotationX: -((e.clientY - r.top) / r.height - .5) * 10, transformPerspective: 700, duration: .3 }); });
      c.addEventListener("pointerleave", () => gsap.to(c, { rotationX: 0, rotationY: 0, duration: .5 }));
    });
  }
}

/* ---------- Countdown ---------- */
const target = new Date(CONFIG.eventDate).getTime();
let countStarted = false;
function tick() {
  let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
  for (const k in v) { const el = $("#cd-" + k); el.dataset.v = v[k]; if (countStarted || reduce) el.textContent = String(v[k]).padStart(2, "0"); }
  $("#cd-done").hidden = target > Date.now();
}
tick(); setInterval(tick, 1000);
ScrollTrigger.create({ trigger: "#countdown", start: "top 80%", once: true, onEnter: () => setTimeout(() => countStarted = true, 1500) });

/* ---------- Gallery ---------- */
let gi = 0; const gimg = $("#galImg");
gimg.src = CONFIG.galleryImages[gi].src;
gimg.alt = CONFIG.galleryImages[gi].alt;
$("#galCount").textContent = `${gi + 1} / ${CONFIG.galleryImages.length}`;
function showPhoto(n) {
  gi = (n + CONFIG.galleryImages.length) % CONFIG.galleryImages.length;
  const swap = () => { gimg.src = CONFIG.galleryImages[gi].src; gimg.alt = CONFIG.galleryImages[gi].alt;
    $("#galCount").textContent = `${gi + 1} / ${CONFIG.galleryImages.length}`;
    if (!reduce) gsap.fromTo(gimg, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: .7 }); };
  reduce ? swap() : gsap.to(gimg, { opacity: 0, duration: .25, onComplete: swap });
}
$("#galPrev").onclick = () => showPhoto(gi - 1);
$("#galNext").onclick = () => showPhoto(gi + 1);
let tx = null; const gal = $(".gal");
gal.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
gal.addEventListener("touchend", e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 40) showPhoto(gi + (dx < 0 ? 1 : -1)); });

/* ---------- Golden particles (lightweight canvas) ---------- */
(function () {
  if (reduce) return;
  const cv = $("#particles"), ctx = cv.getContext("2d");
  const N = mobile ? 22 : 50; let w, h, ps = [];
  const size = () => { w = cv.width = innerWidth; h = cv.height = innerHeight; };
  size(); addEventListener("resize", size);
  for (let i = 0; i < N; i++) ps.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .4, v: Math.random() * .3 + .1, a: Math.random() * .5 + .2 });
  let on = true; document.addEventListener("visibilitychange", () => { on = !document.hidden; if (on) draw(); });
  function draw() {
    if (!on) return; ctx.clearRect(0, 0, w, h);
    for (const p of ps) { p.y -= p.v; if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      ctx.fillStyle = `rgba(212,182,118,${p.a})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
    requestAnimationFrame(draw);
  } draw();
})();
