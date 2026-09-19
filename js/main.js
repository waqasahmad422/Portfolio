/* ==========================================================================
   Waqas Ahmad Shah — Portfolio
   1 Helpers · 2 Section navigation · 3 Mobile menu · 4 Theme & accent
   5 Typing effect · 6 Small content bits · 7 Project filter · 8 Contact form
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- 1. Helpers ------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // localStorage can throw (private mode, blocked cookies) — never let it break the page.
  const store = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* ignore */ }
    },
  };

  /* ---------- 2. Section navigation ------------------------------------- */
  const SITE_NAME = "Waqas Ahmad Shah";
  const sections = $$(".section");
  const navLinks = $$(".nav a");
  let current = sections.find((s) => s.classList.contains("active")) || sections[0];
  let backTimer = 0;

  const headingOf = (section) => $("h2", section);
  sections.forEach((s) => headingOf(s)?.setAttribute("tabindex", "-1"));

  // Staggered reveal: give each animated block its position (--i) within its panel.
  // Keep this list in sync with the ".section.active :is(...)" rule in style.css.
  const STAGGER =
    ".home-info > *, .portrait, .section-title, .sub-heading, .about-intro, .info-list > div, .about-cols .btn, " +
    ".skill, .learning, .timeline, .service-card, .filters, .project, .contact-heading, .contact-sub, " +
    ".contact-info > div, .field, .form-footer, .copyright";
  sections.forEach((s) => $$(STAGGER, s).forEach((el, i) => el.style.setProperty("--i", i)));

  // Thin progress bar showing how far the open panel is scrolled
  const progress = $(".scroll-progress span");
  const updateProgress = () => {
    const max = current.scrollHeight - current.clientHeight;
    progress.style.setProperty("--p", max > 0 ? (current.scrollTop / max).toFixed(3) : 0);
  };
  sections.forEach((s) =>
    s.addEventListener("scroll", () => { if (s === current) requestAnimationFrame(updateProgress); }, { passive: true })
  );

  // Skill percentages count up alongside their bars
  function countUp(section) {
    $$(".skill", section).forEach((skill) => {
      const out = $(".skill-head span:last-child", skill);
      const target = Number($(".skill-bar", skill).getAttribute("aria-valuenow"));
      cancelAnimationFrame(out._raf);
      if (reduceMotion.matches) { out.textContent = target + "%"; return; }
      out.textContent = "0%";
      const start = performance.now() + 350;
      const tick = (t) => {
        const k = Math.min(Math.max((t - start) / 1100, 0), 1);
        out.textContent = Math.round((1 - Math.pow(1 - k, 3)) * target) + "%";
        if (k < 1) out._raf = requestAnimationFrame(tick);
      };
      out._raf = requestAnimationFrame(tick);
    });
  }

  function showSection(id, { focus = true } = {}) {
    const next = sections.find((s) => s.id === id);
    if (!next) return;
    if (next === current) {
      closeMenu();
      return;
    }

    // The section we leave slides underneath the incoming one, then is hidden.
    clearTimeout(backTimer);
    sections.forEach((s) => s.classList.remove("back-section"));
    const previous = current;
    // direction of travel drives the transition (down the menu = 1, up = -1)
    root.style.setProperty("--dir", sections.indexOf(next) > sections.indexOf(previous) ? "1" : "-1");
    previous.classList.remove("active");
    previous.classList.add("back-section");
    backTimer = setTimeout(() => previous.classList.remove("back-section"), reduceMotion.matches ? 0 : 700);

    next.classList.add("active");
    next.scrollTop = 0;
    current = next;
    updateProgress();
    if (id === "about") countUp(next);

    navLinks.forEach((a) => {
      const on = a.hash === "#" + id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    document.title = id === "home" ? `${SITE_NAME} — Frontend Web Developer` : `${next.dataset.title} — ${SITE_NAME}`;
    // Move focus to the section heading: it is announced by screen readers and shows a small ring, not a panel-wide one.
    if (focus) headingOf(next)?.focus({ preventScroll: true });
    closeMenu();
  }

  // Any in-page link that points at a section (nav, "See my work", "Hire me", logo…)
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = link.hash.slice(1);
    if (!sections.some((s) => s.id === id)) return;
    e.preventDefault();
    if (location.hash !== "#" + id) history.pushState(null, "", "#" + id);
    showSection(id);
  });

  // Back/forward buttons and manually edited URLs
  // Browsers focus the element matching the URL fragment (here: the whole panel), which draws a
  // panel-sized focus ring. After routing, hand that focus to the heading (or drop it on first load).
  const routeFromHash = ({ focus = true } = {}) => {
    showSection(location.hash.slice(1) || "home", { focus });
    setTimeout(() => {
      if (document.activeElement !== current) return;
      if (focus) headingOf(current)?.focus({ preventScroll: true });
      else current.blur();
    }, 0);
  };
  window.addEventListener("popstate", () => routeFromHash());
  window.addEventListener("hashchange", () => routeFromHash());
  if (location.hash && location.hash !== "#home") routeFromHash({ focus: false });
  // The fragment focus on a fresh page load lands after the script above runs, so clear it once more.
  window.addEventListener("load", () => setTimeout(() => {
    if (document.activeElement?.classList.contains("section")) document.activeElement.blur();
  }, 0));

  /* ---------- 3. Mobile menu -------------------------------------------- */
  const menuBtn = $(".nav-toggler");
  const isMobileLayout = () => window.matchMedia("(max-width: 1199px)").matches;

  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  function closeMenu() {
    if (document.body.classList.contains("nav-open")) setMenu(false);
  }
  menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
  // Tapping the dimmed page while the menu is open closes it
  $(".scrim").addEventListener("click", closeMenu);
  window.addEventListener("resize", () => { if (!isMobileLayout()) closeMenu(); });

  /* ---------- 4. Theme & accent ----------------------------------------- */
  const switcher = $("#switcher");
  const settingsBtn = $("#settings-toggle");
  const themeBtn = $("#theme-toggle");
  const swatches = $$(".swatch");
  const themeColorMeta = $('meta[name="theme-color"]');

  function syncThemeUI() {
    const dark = root.dataset.theme === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeColorMeta.content = dark ? "#151515" : "#f2f2fc";
  }
  function syncSwatches() {
    const skin = root.dataset.skin || "orange";
    swatches.forEach((s) => s.setAttribute("aria-checked", String(s.dataset.skin === skin)));
  }
  themeBtn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    store.set("theme", root.dataset.theme);
    syncThemeUI();
  });
  swatches.forEach((s) =>
    s.addEventListener("click", () => {
      root.dataset.skin = s.dataset.skin;
      store.set("skin", s.dataset.skin);
      syncSwatches();
    })
  );
  function setSwitcher(open) {
    switcher.classList.toggle("is-open", open);
    settingsBtn.setAttribute("aria-expanded", String(open));
  }
  settingsBtn.addEventListener("click", () => setSwitcher(!switcher.classList.contains("is-open")));
  document.addEventListener("click", (e) => {
    if (!switcher.contains(e.target)) setSwitcher(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (switcher.classList.contains("is-open")) { setSwitcher(false); settingsBtn.focus(); }
    else if (document.body.classList.contains("nav-open")) { closeMenu(); menuBtn.focus(); }
  });
  // Follow the OS setting until the visitor makes their own choice
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (store.get("theme")) return;
    root.dataset.theme = e.matches ? "dark" : "light";
    syncThemeUI();
  });
  syncThemeUI();
  syncSwatches();

  /* ---------- 5. Typing effect ------------------------------------------ */
  const typingEl = $(".typing");
  if (typingEl && !reduceMotion.matches) {
    const roles = JSON.parse(typingEl.dataset.roles);
    let role = 0;
    let chars = roles[0].length;
    let deleting = true;
    const step = () => {
      const word = roles[role];
      typingEl.textContent = word.slice(0, chars);
      let delay = deleting ? 55 : 95;
      if (!deleting && chars === word.length) { deleting = true; delay = 1600; }
      else if (deleting && chars === 0) { deleting = false; role = (role + 1) % roles.length; delay = 350; }
      else chars += deleting ? -1 : 1;
      setTimeout(step, delay);
    };
    setTimeout(step, 1800); // let the first role sit for a moment
  }

  /* ---------- 6. Small content bits ------------------------------------- */
  // Age stays correct without editing the HTML every birthday.
  const BIRTH = { year: 2003, month: 5, day: 1 }; // month is 0-based → 1 June 2003
  const today = new Date();
  let age = today.getFullYear() - BIRTH.year;
  if (today < new Date(today.getFullYear(), BIRTH.month, BIRTH.day)) age -= 1;
  $$("[data-age]").forEach((el) => (el.textContent = String(age)));
  $$("[data-year]").forEach((el) => (el.textContent = String(today.getFullYear())));

  /* ---------- 7. Project filter ----------------------------------------- */
  const filterBtns = $$(".filter");
  const projects = $$(".project");
  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      projects.forEach((p) => { p.hidden = !(f === "all" || p.dataset.category === f); });
      // replay the entrance so the grid re-flows smoothly
      projects.filter((p) => !p.hidden).forEach((p, i) => {
        p.style.setProperty("--i", i);
        p.style.animation = "none";
        void p.offsetWidth;
        p.style.animation = "";
      });
    })
  );

  /* ---------- 7b. Image fade-in & hero parallax ------------------------- */
  $$(".project-media img").forEach((img) => {
    const done = () => img.classList.add("is-loaded");
    if (img.complete) done();
    else { img.addEventListener("load", done, { once: true }); img.addEventListener("error", done, { once: true }); }
  });

  const home = $("#home");
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion.matches) {
    let raf = 0;
    const setPointer = (x, y) => { home.style.setProperty("--px", x); home.style.setProperty("--py", y); };
    home.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = home.getBoundingClientRect();
        setPointer(((e.clientX - r.left) / r.width - 0.5).toFixed(3), ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    });
    home.addEventListener("pointerleave", () => setPointer(0, 0));
  }

  /* ---------- 8. Contact form -------------------------------------------- */
  // Two modes:
  //  • data-endpoint="https://formspree.io/f/xxxx" (or Web3Forms etc.) → sends in the background.
  //  • empty (default) → opens the visitor's email app with the message filled in.
  const form = $("#contact-form");
  const statusEl = $("#form-status");
  const setStatus = (msg, state = "") => {
    statusEl.textContent = msg;
    statusEl.dataset.state = state;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (data.get("_gotcha")) return; // bot filled the hidden field

    const submitBtn = $('button[type="submit"]', form);
    const endpoint = form.dataset.endpoint.trim();

    if (endpoint) {
      submitBtn.disabled = true;
      setStatus("Sending…");
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus("Thanks! Your message is on its way.", "success");
      } catch {
        setStatus(`Couldn't send your message. Please email ${form.dataset.email} instead.`, "error");
      } finally {
        submitBtn.disabled = false;
      }
      return;
    }

    const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;
    const href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(data.get("subject"))}&body=${encodeURIComponent(body)}`;
    setStatus("Opening your email app…", "success");
    window.location.href = href;
  });
})();
