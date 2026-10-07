/* ==========================================================================
   baldip.com — app.js
   Renders everything from window.SITE_DATA (data.js). No framework, no build.
   ========================================================================== */
(function () {
  "use strict";

  const D = window.SITE_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pad = (n) => String(n).padStart(2, "0");

  const store = {
    get(area, k) { try { return window[area].getItem(k); } catch (e) { return null; } },
    set(area, k, v) { try { window[area].setItem(k, v); } catch (e) {} },
  };

  /* ---------------------------------------------------------------------
     Portrait: shows assets/headshot.jpg, falls back to initials if missing.
     --------------------------------------------------------------------- */
  function renderPortraits() {
    $$("[data-portrait]").forEach((el) => {
      el.innerHTML = `<span class="portrait__initials" aria-hidden="true">${esc(D.profile.initials)}</span>`;
      const img = new Image();
      img.alt = D.profile.headshotAlt;
      img.decoding = "async";
      img.onload = () => { el.innerHTML = ""; el.appendChild(img); };
      img.onerror = () => { el.setAttribute("role", "img"); el.setAttribute("aria-label", D.profile.headshotAlt + " (placeholder initials)"); };
      img.src = D.profile.headshot;
    });
  }

  /* ---------------------------------------------------------------------
     PASSWORD GATE
     NOTE: This is a cosmetic gate, NOT real security. All content ships to
     the browser and anyone can read it in the page source or data.js.
     It only keeps casual visitors on the landing screen. Never put
     anything confidential on this site.
     --------------------------------------------------------------------- */
  async function sha256Hex(text) {
    const bytes = new TextEncoder().encode(text);
    if (window.crypto && window.crypto.subtle) {
      const buf = await window.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    return sha256Fallback(bytes); // for rare non-secure contexts (e.g. some http:// LAN previews)
  }

  // Minimal SHA-256, used only when crypto.subtle is unavailable.
  function sha256Fallback(bytes) {
    const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const l = bytes.length, withPad = new Uint8Array(((l + 9 + 63) >> 6) << 6);
    withPad.set(bytes); withPad[l] = 0x80;
    const dv = new DataView(withPad.buffer);
    dv.setUint32(withPad.length - 4, l * 8); dv.setUint32(withPad.length - 8, Math.floor(l / 0x20000000));
    const w = new Uint32Array(64), r = (x, n) => (x >>> n) | (x << (32 - n));
    for (let o = 0; o < withPad.length; o += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(o + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = r(w[i-15],7) ^ r(w[i-15],18) ^ (w[i-15] >>> 3), s1 = r(w[i-2],17) ^ r(w[i-2],19) ^ (w[i-2] >>> 10);
        w[i] = (w[i-16] + s0 + w[i-7] + s1) | 0;
      }
      let [a,b,c,d,e,f,g,h] = H;
      for (let i = 0; i < 64; i++) {
        const t1 = (h + (r(e,6) ^ r(e,11) ^ r(e,25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
        const t2 = ((r(a,2) ^ r(a,13) ^ r(a,22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      [a,b,c,d,e,f,g,h].forEach((v, i) => { H[i] = (H[i] + v) | 0; });
    }
    return H.map((v) => (v >>> 0).toString(16).padStart(8, "0")).join("");
  }

  function initGate() {
    const gate = $("#gate"), form = $("#gate-form"), input = $("#gate-pass"), msg = $("#gate-msg");
    $("[data-tagline]").textContent = D.profile.tagline;

    if (store.get("sessionStorage", "unlocked") === "1") { showSite(false); return; }
    input.focus();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ok = (await sha256Hex(input.value)) === D.profile.passwordHash;
      if (!ok) {
        msg.textContent = input.value ? "That password didn't match. Try again." : "Enter the password to continue.";
        form.classList.remove("is-wrong"); void form.offsetWidth; form.classList.add("is-wrong");
        input.select();
        return;
      }
      msg.textContent = "Welcome.";
      store.set("sessionStorage", "unlocked", "1");
      if (reduceMotion.matches) { showSite(false); return; }
      gate.classList.add("is-leaving");
      showSite(true);
      gate.addEventListener("animationend", () => { document.documentElement.classList.add("is-unlocked"); }, { once: true });
    });
  }

  function showSite(animate) {
    const site = $("#site");
    site.hidden = false;
    if (animate) site.classList.add("is-arriving");
    else document.documentElement.classList.add("is-unlocked");
    route();
    $("#main").focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------------------
     RENDERING
     --------------------------------------------------------------------- */
  const paras = (arr) => (arr || []).map((p) => `<p>${esc(p)}</p>`).join("");

  function renderStory() {
    const chapters = D.chapters;
    $("#view-story").innerHTML = `
      <div class="container">
        <header class="hero">
          <p class="hero__kicker">${esc(D.profile.role)}, ${esc(D.profile.location)}</p>
          <h1 class="hero__title">${esc(D.profile.name)}</h1>
          <p class="hero__intro">A technical seller who builds things and runs businesses. Here's the route so far, in ${chapters.length} chapters.</p>
        </header>

        <section class="timeline" aria-labelledby="timeline-title">
          <div class="timeline__head">
            <h2 id="timeline-title">Milestones</h2>
            <p>Select a milestone to see more.</p>
          </div>
          <ol class="timeline__track" role="list">
            ${D.timeline.map((m, i) => `
              <li class="milestone">
                <button class="milestone__btn" type="button" aria-expanded="false" aria-controls="ms-${i}">
                  <span class="milestone__when">${esc(m.when)}</span>
                  <span class="milestone__title">${esc(m.title)}</span>
                  <span class="milestone__track">${esc(m.track)}</span>
                </button>
                <div class="milestone__card" id="ms-${i}"><div><p>${esc(m.detail)}</p></div></div>
              </li>`).join("")}
          </ol>
        </section>

        <div class="story">
          <nav class="chapter-nav" aria-label="Chapters">
            <h2>Chapters</h2>
            <ol>
              ${chapters.map((c, i) => `<li><a href="#story/${esc(c.id)}" data-chapter="${esc(c.id)}"><span>${pad(i + 1)}</span>${esc(c.title)}</a></li>`).join("")}
            </ol>
          </nav>
          <div class="route" id="route">
            <div class="route__line" aria-hidden="true"></div>
            <div class="route__fill" id="route-fill" aria-hidden="true"></div>
            ${chapters.map((c, i) => `
              <article class="chapter" id="ch-${esc(c.id)}" aria-labelledby="ch-${esc(c.id)}-title">
                <span class="chapter__stop" aria-hidden="true"></span>
                <div class="reveal">
                  <p class="chapter__num">Chapter ${pad(i + 1)}</p>
                  <h2 class="chapter__title" id="ch-${esc(c.id)}-title">${esc(c.title)}</h2>
                  <p class="chapter__lede">${esc(c.lede)}</p>
                  <div class="chapter__body">${paras(c.body)}</div>
                  ${c.cta ? `<a class="btn btn--accent" href="${esc(c.cta.href)}">${esc(c.cta.label)}</a>` : ""}
                </div>
              </article>`).join("")}
          </div>
        </div>
      </div>`;

    $$(".milestone__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        btn.parentElement.classList.toggle("is-open", open);
      });
    });
  }

  function renderAbout() {
    const p = D.profile;
    $("#view-about").innerHTML = `
      <div class="container page">
        <h1 class="page__title">About</h1>
        <div class="about-intro">
          <div class="portrait portrait--lg" data-portrait></div>
          <div class="about-intro__bio">
            ${paras(p.bio)}
            <p class="about-intro__meta">${esc(p.role)}. Based in ${esc(p.location)}.</p>
          </div>
        </div>

        <section aria-labelledby="work-title">
          <h2 class="section-title" id="work-title">What I do</h2>
          <div class="filters" role="group" aria-label="Filter by area">
            <button class="chip" type="button" data-filter="all" aria-pressed="true">All</button>
            ${D.filters.map((f) => `<button class="chip" type="button" data-filter="${esc(f)}" aria-pressed="false">${esc(f)}</button>`).join("")}
          </div>
          <p class="sr-only" id="work-count" aria-live="polite"></p>
          <ul class="work" id="work-list"></ul>
        </section>

        <section aria-labelledby="skills-title">
          <h2 class="section-title" id="skills-title">Expertise</h2>
          <div class="skills">
            ${D.skills.map((s) => `
              <div class="skill">
                <h3>${esc(s.name)}</h3>
                <div class="meter" role="img" aria-label="${esc(s.name)}: ${s.level} out of 5">
                  ${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= s.level ? "on" : ""}"></i>`).join("")}
                </div>
                <p>${esc(s.note)}</p>
              </div>`).join("")}
          </div>
        </section>
      </div>`;

    const list = $("#work-list"), count = $("#work-count");
    const draw = (filter) => {
      const items = D.work.filter((w) => filter === "all" || w.tags.includes(filter));
      list.innerHTML = items.length ? items.map((w) => `
        <li class="work__item${reduceMotion.matches ? "" : " is-entering"}">
          <h3>${w.link ? `<a href="${esc(w.link)}" target="_blank" rel="noopener">${esc(w.title)}</a>` : esc(w.title)}</h3>
          <p>${esc(w.text)}</p>
          <div class="work__tags">${w.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        </li>`).join("") : `<li class="work__empty">Nothing here yet.</li>`;
      count.textContent = `Showing ${items.length} ${items.length === 1 ? "item" : "items"}`;
    };
    $$(".chip", $("#view-about")).forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".chip", $("#view-about")).forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
        draw(chip.dataset.filter);
      });
    });
    draw("all");
  }

  function renderContact() {
    const c = D.contact;
    const emailReady = c.email && !c.email.startsWith("[");
    $("#view-contact").innerHTML = `
      <div class="container page">
        <h1 class="page__title">Let's talk</h1>
        <div class="contact">
          <div>
            <p class="contact__lede">Whether it's a data problem, a deal, a venture, or Sikh Hoops, the fastest way to reach me is below.</p>
            <div class="contact__actions">
              <a class="btn btn--accent" href="${esc(c.linkedin)}" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.6 4.77 6V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.75Z"/></svg>
                Connect on LinkedIn</a>
              <a class="btn" href="mailto:${esc(c.email)}"${emailReady ? "" : ' aria-disabled="true"'}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 6h18v12H3zM3 7l9 6 9-6"/></svg>
                Email me</a>
              <a class="btn" href="${esc(c.resume)}" download>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>
                Download résumé (PDF)</a>
            </div>
          </div>

          <form class="form" id="contact-form" novalidate>
            <h2 class="section-title">Send a message</h2>
            <label>Name <input name="name" type="text" autocomplete="name" required></label>
            <label>Email <input name="email" type="email" autocomplete="email" required></label>
            <label>Message <textarea name="message" required></textarea></label>
            <input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
            <button class="btn btn--accent" type="submit">Send message</button>
            <p class="form__status" id="form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </div>`;

    /* Formspree setup:
       1. Create a free account at https://formspree.io and add a new form.
       2. Its endpoint looks like https://formspree.io/f/abcdwxyz.
       3. Put "abcdwxyz" in data.js → contact.formspreeId.
       Submissions are then emailed to the address on your Formspree account. */
    const form = $("#contact-form"), status = $("#form-status");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form__status";
      if (!form.checkValidity()) {
        status.classList.add("is-error");
        status.textContent = "Add your name, a valid email, and a message.";
        form.querySelector(":invalid").focus();
        return;
      }
      if (!c.formspreeId || c.formspreeId.startsWith("[")) {
        status.classList.add("is-error");
        status.textContent = "The form isn't connected yet. Use LinkedIn or email for now.";
        return;
      }
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true; status.textContent = "Sending…";
      try {
        const res = await fetch(`https://formspree.io/f/${encodeURIComponent(c.formspreeId)}`, {
          method: "POST", body: new FormData(form), headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.textContent = "Message sent. I'll get back to you soon.";
      } catch (err) {
        status.classList.add("is-error");
        status.textContent = "The message didn't send. Check your connection, or use LinkedIn or email instead.";
      } finally { btn.disabled = false; }
    });
  }

  /* ---------------------------------------------------------------------
     ROUTER (hash-based: #story, #about, #contact, #story/<chapter-id>)
     --------------------------------------------------------------------- */
  const ROUTES = ["story", "about", "contact"];
  let currentView = null;

  function route() {
    if ($("#site").hidden) return;
    const [view, sub] = (location.hash.replace(/^#\/?/, "") || "story").split("/");
    const name = ROUTES.includes(view) ? view : "story";
    const changed = name !== currentView;
    currentView = name;

    $$(".view").forEach((v) => { v.hidden = v.dataset.view !== name; });
    $$("[data-route]").forEach((a) => {
      if (a.dataset.route === name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    document.title = (name === "story" ? "" : name[0].toUpperCase() + name.slice(1) + " — ") + "Baldip-Robin Singh";

    if (name === "story" && sub) {
      const target = $("#ch-" + CSS.escape(sub));
      if (target) { target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" }); return onScroll(); }
    }
    if (changed) { window.scrollTo(0, 0); $("#main").focus({ preventScroll: true }); }
    onScroll();
  }

  /* ---------------------------------------------------------------------
     SCROLL: progress bar, route fill, chapter reveal + active chapter
     --------------------------------------------------------------------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - innerHeight;
      $("#progress-bar").style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";

      if (currentView !== "story") return;
      const routeEl = $("#route"), fill = $("#route-fill");
      if (routeEl && fill) {
        const r = routeEl.getBoundingClientRect();
        const travelled = Math.min(Math.max(innerHeight * 0.55 - r.top, 0), r.height);
        fill.style.height = travelled + "px";
      }
      // Light up every stop the reader has passed, even after a fast jump.
      $$(".chapter").forEach((ch) => {
        if (ch.getBoundingClientRect().top < innerHeight * 0.85) {
          ch.classList.add("is-visited");
          $(".reveal", ch).classList.add("is-in");
        }
      });
    });
  }

  function initObservers() {
    const chapters = $$(".chapter");
    if (!("IntersectionObserver" in window)) {
      chapters.forEach((c) => { c.classList.add("is-visited"); $(".reveal", c).classList.add("is-in"); });
      return;
    }
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); en.target.closest(".chapter").classList.add("is-visited"); revealIO.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -15% 0px", threshold: 0.1 });
    $$(".reveal").forEach((el) => revealIO.observe(el));

    const links = $$(".chapter-nav a");
    const activeIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id.replace(/^ch-/, "");
        links.forEach((a) => {
          const on = a.dataset.chapter === id;
          if (on) { a.setAttribute("aria-current", "step"); a.scrollIntoView({ block: "nearest", inline: "nearest" }); }
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    chapters.forEach((c) => activeIO.observe(c));
  }

  /* ---------------------------------------------------------------------
     THEME
     --------------------------------------------------------------------- */
  function initTheme() {
    const btn = $("#theme-toggle"), root = document.documentElement;
    const sync = () => {
      const dark = root.getAttribute("data-theme") !== "light";
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      $('meta[name="theme-color"]').setAttribute("content", dark ? "#0f1b2d" : "#eef1f4");
    };
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      store.set("localStorage", "theme", next);
      sync();
    });
    sync();
  }

  /* ---------------------------------------------------------------------
     BOOT
     --------------------------------------------------------------------- */
  if (!reduceMotion.matches) document.documentElement.classList.add("js-motion");
  renderStory();
  renderAbout();
  renderContact();
  renderPortraits();
  initTheme();
  initObservers();
  window.addEventListener("hashchange", route);
  window.addEventListener("scroll", onScroll, { passive: true });
  const setNavH = () => document.documentElement.style.setProperty("--nav-h", $("#nav").offsetHeight + "px");
  window.addEventListener("resize", () => { setNavH(); onScroll(); });
  new MutationObserver(setNavH).observe($("#site"), { attributes: true, attributeFilter: ["hidden"] });
  initGate();
})();
