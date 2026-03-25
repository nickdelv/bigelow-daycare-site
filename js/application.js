(function () {
  var SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby-lINz_k0tdI26vYUOqBBuwwNzcKDUgcjiUIvDGFKyj9wwEBkzfU2LG-kJwBkzCsxdPw/exec";

  var form = document.getElementById("applicationForm");
  var success = document.getElementById("formSuccess");

  if (!form) return;

  // ── APPLICATION DATE ─────────────────────────────
  document.getElementById("applicationDate").value =
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // ── "OTHER" REFERRAL REVEAL ──────────────────────
  document
    .getElementById("referralOther")
    .addEventListener("change", function () {
      document.getElementById("referralOtherDetail").style.display = this
        .checked
        ? ""
        : "none";
    });

  // ── SUBMIT ───────────────────────────────────────
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot
    if (document.getElementById("website").value) return;

    // Native validation for required fields
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Days group validation — at least one 1st-choice day required
    var days1checked = document.querySelectorAll('input[name="days1"]:checked');
    if (days1checked.length === 0) {
      var firstDays1 = form.querySelector('input[name="days1"]');
      firstDays1.setCustomValidity("Please select at least one preferred day.");
      form.reportValidity();
      firstDays1.setCustomValidity("");
      return;
    }

    // Consolidate checkbox groups into hidden fields, then disable
    // the raw checkboxes so FormData doesn't double-submit them
    [
      { name: "days1", hiddenId: "days1-hidden" },
      { name: "days2", hiddenId: "days2-hidden" },
      { name: "days3", hiddenId: "days3-hidden" },
      { name: "referral", hiddenId: "referral-hidden" },
    ].forEach(function (group) {
      var checked = Array.from(
        document.querySelectorAll('input[name="' + group.name + '"]:checked'),
      ).map(function (cb) {
        return cb.value;
      });

      document.getElementById(group.hiddenId).value = checked.join(", ");

      document
        .querySelectorAll('input[name="' + group.name + '"]')
        .forEach(function (cb) {
          cb.disabled = true;
        });
    });

    var btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.textContent = "Submitting…";

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then(function () {
        form.closest(".app-form-section").style.display = "none";
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(function () {
        form.closest(".app-form-section").style.display = "none";
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "start" });
      });
  });
})();
