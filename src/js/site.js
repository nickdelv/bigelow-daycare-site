/* =============================================
   BIGELOW COOPERATIVE — SITE JS
   Shared interactions across all pages
   ============================================= */

/* --- Mark current page and init nav (header rendered at build time) --- */
function markCurrentPage() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href").split("#")[0];
    if (href === path) a.setAttribute("aria-current", "page");
  });
}

/* --- Mobile nav hamburger --- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when a link is clicked
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", false);
    })
  );
}

markCurrentPage();
initNav();

(function () {
  const track = document.getElementById("tTrack");
  if (!track) return;

  const gap = 20;
  const scrollAmount = () =>
    track.querySelector(".testimonial-card").offsetWidth + gap;

  document
    .getElementById("tPrev")
    ?.addEventListener("click", () =>
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" })
    );

  document
    .getElementById("tNext")
    ?.addEventListener("click", () =>
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" })
    );
})();

/* --- FAQ accordion --- */
(function () {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");
      // Close all
      document
        .querySelectorAll(".faq-item.is-open")
        .forEach((i) => i.classList.remove("is-open"));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add("is-open");
    });
  });
})();

/* --- Programs page: classroom schedule tabs --- */
(function () {
  const tabBtns = document.querySelectorAll(".tab-btn");
  if (!tabBtns.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      tabBtns.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      document
        .querySelectorAll(".tab-panel")
        .forEach((p) => p.classList.remove("is-active"));

      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      document.getElementById("tab-" + target).classList.add("is-active");
    });
  });
})();
