(function () {
  var SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby-lINz_k0tdI26vYUOqBBuwwNzcKDUgcjiUIvDGFKyj9wwEBkzfU2LG-kJwBkzCsxdPw/exec";

  var form = document.getElementById("tourForm");
  var success = document.getElementById("formSuccess");

  if (!form) return;

  // ── VALIDATION HELPERS ───────────────────────────
  function showError(input, msg) {
    input.classList.add("is-invalid");
    if (!input.parentElement.querySelector(".error-msg")) {
      var err = document.createElement("p");
      err.className = "error-msg";
      err.textContent = msg;
      input.parentElement.appendChild(err);
    }
  }

  function clearError(input) {
    input.classList.remove("is-invalid");
    var err = input.parentElement.querySelector(".error-msg");
    if (err) err.remove();
  }

  // Clear errors on input
  form.querySelectorAll("input, select").forEach(function (el) {
    el.addEventListener("input", function () {
      clearError(el);
    });
  });

  function validate() {
    var valid = true;
    var firstErrorEl = null;

    var name = form.querySelector("#parentName");
    var email = form.querySelector("#email");
    var age = form.querySelector("#childAge");

    clearError(name);
    clearError(email);
    clearError(age);

    if (!name.value.trim()) {
      showError(name, "Please enter your name.");
      if (!firstErrorEl) firstErrorEl = name;
      valid = false;
    }
    if (!email.value.trim()) {
      showError(email, "Please enter your email address.");
      if (!firstErrorEl) firstErrorEl = email;
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      if (!firstErrorEl) firstErrorEl = email;
      valid = false;
    }
    if (!age.value) {
      showError(age, "Please select an age range.");
      if (!firstErrorEl) firstErrorEl = age;
      valid = false;
    }

    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return valid;
  }

  // ── SUBMIT ───────────────────────────────────────
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot
    if (document.getElementById("website").value) return;

    if (!validate()) return;

    var checked = Array.from(
      document.querySelectorAll('input[type="checkbox"][name="days"]:checked'),
    ).map(function (cb) {
      return cb.value;
    });
    document.getElementById("days-hidden").value = checked.join(", ");

    document
      .querySelectorAll('input[type="checkbox"][name="days"]')
      .forEach(function (cb) {
        cb.disabled = true;
      });

    var btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.textContent = "Sending…";

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then(function () {
        form.closest(".tour-form-section").style.display = "none";
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(function () {
        form.closest(".tour-form-section").style.display = "none";
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "start" });
      });
  });
})();
