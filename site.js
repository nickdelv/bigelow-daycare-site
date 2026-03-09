/* =============================================
   BIGELOW COOPERATIVE — SITE JS
   Shared interactions across all pages
   ============================================= */

/* --- Shared component injection --- */
(function () {
  function injectComponent(selector, file, callback) {
    const el = document.querySelector(selector);
    if (!el) return;
    fetch(file)
      .then((r) => r.text())
      .then((html) => {
        el.innerHTML = html;
        if (callback) callback();
      });
  }

  // Mark the current page link as active
  function markCurrentPage() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = a.getAttribute("href").split("#")[0];
      if (href === path) a.setAttribute("aria-current", "page");
    });
  }

  injectComponent("#site-nav-placeholder", "nav.html", function () {
    markCurrentPage();
    initNav();
  });

  injectComponent("#site-footer-placeholder", "footer.html");
})();

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
    }),
  );
}

/* --- Tour / contact form --- */
(function () {
  const form = document.getElementById("tourForm");
  const success = document.getElementById("formSuccess");
  const btn = document.getElementById("submitBtn");
  if (!form) return;

  // TODO: Replace with deployed Google Apps Script URL
  const ENDPOINT = "";

  function showError(input, msg) {
    input.classList.add("is-invalid");
    const existing = input.parentElement.querySelector(".error-msg");
    if (!existing) {
      const err = document.createElement("p");
      err.className = "error-msg";
      err.textContent = msg;
      input.parentElement.appendChild(err);
    }
  }

  function clearError(input) {
    input.classList.remove("is-invalid");
    const err = input.parentElement.querySelector(".error-msg");
    if (err) err.remove();
  }

  function validate() {
    let valid = true;
    const name = form.querySelector("#parentName");
    const email = form.querySelector("#email");
    const age = form.querySelector("#childAge");

    clearError(name);
    clearError(email);
    clearError(age);

    if (!name.value.trim()) {
      showError(name, "Please enter your name.");
      valid = false;
    }
    if (!email.value.trim()) {
      showError(email, "Please enter your email address.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      valid = false;
    }
    if (!age.value) {
      showError(age, "Please select an age range.");
      valid = false;
    }

    return valid;
  }

  // Clear errors on input
  form
    .querySelectorAll("input, select")
    .forEach((el) => el.addEventListener("input", () => clearError(el)));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    btn.disabled = true;
    btn.textContent = "Sending…";

    const data = new FormData(form);
    const days = [...form.querySelectorAll('input[name="days"]:checked')]
      .map((cb) => cb.value)
      .join(", ");
    data.set("days", days);

    try {
      if (ENDPOINT) {
        await fetch(ENDPOINT, { method: "POST", body: data });
      }
      form.closest(".tour-form-section").style.display = "none";
      success.classList.add("is-visible");
      success.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      btn.disabled = false;
      btn.textContent = "Send request";
      alert(
        "Something went wrong. Please try again or call us at 617-623-5400.",
      );
    }
  });
})();

(function () {
  const track = document.getElementById("tTrack");
  if (!track) return;

  const gap = 20;
  const scrollAmount = () =>
    track.querySelector(".testimonial-card").offsetWidth + gap;

  document
    .getElementById("tPrev")
    ?.addEventListener("click", () =>
      track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }),
    );

  document
    .getElementById("tNext")
    ?.addEventListener("click", () =>
      track.scrollBy({ left: scrollAmount(), behavior: "smooth" }),
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
