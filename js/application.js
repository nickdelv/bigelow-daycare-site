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

  // ── DATE PICKER — open on click anywhere in field ─
  var dobInput = document.getElementById("childDob");
  dobInput.addEventListener("click", function () {
    try {
      this.showPicker();
    } catch (e) {}
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

  function showGroupError(groupEl, msg) {
    if (!groupEl.querySelector(".error-msg")) {
      var err = document.createElement("p");
      err.className = "error-msg";
      err.textContent = msg;
      groupEl.appendChild(err);
    }
  }

  function clearGroupError(groupEl) {
    var err = groupEl.querySelector(".error-msg");
    if (err) err.remove();
  }

  var days1Group = form
    .querySelector('input[name="days1"]')
    .closest(".form-group");
  var paymentGroup = form
    .querySelector('input[name="paymentType"]')
    .closest(".form-group");

  // Clear errors on input/change
  form
    .querySelectorAll(
      "input:not([type='checkbox']):not([type='radio']), select, textarea",
    )
    .forEach(function (el) {
      el.addEventListener("input", function () {
        clearError(el);
      });
    });
  form.querySelectorAll('input[name="days1"]').forEach(function (cb) {
    cb.addEventListener("change", function () {
      clearGroupError(days1Group);
    });
  });
  form.querySelectorAll('input[name="paymentType"]').forEach(function (r) {
    r.addEventListener("change", function () {
      clearGroupError(paymentGroup);
    });
  });

  // ── VALIDATE ─────────────────────────────────────
  function validate() {
    var valid = true;
    var firstErrorEl = null;

    var childName = form.querySelector("#childName");
    var childDob = form.querySelector("#childDob");
    var homeAddress = form.querySelector("#homeAddress");
    var homeCity = form.querySelector("#homeCity");
    var homeZip = form.querySelector("#homeZip");
    var p1Name = form.querySelector("#p1Name");
    var p1Email = form.querySelector("#p1Email");

    // Clear all errors
    [
      childName,
      childDob,
      homeAddress,
      homeCity,
      homeZip,
      p1Name,
      p1Email,
    ].forEach(clearError);
    clearGroupError(days1Group);
    clearGroupError(paymentGroup);

    if (!childName.value.trim()) {
      showError(childName, "Please enter the child's full name.");
      if (!firstErrorEl) firstErrorEl = childName;
      valid = false;
    }
    if (!childDob.value) {
      showError(childDob, "Please enter the child's date of birth.");
      if (!firstErrorEl) firstErrorEl = childDob;
      valid = false;
    }
    if (!homeAddress.value.trim()) {
      showError(homeAddress, "Please enter a home address.");
      if (!firstErrorEl) firstErrorEl = homeAddress;
      valid = false;
    }
    if (!homeCity.value.trim()) {
      showError(homeCity, "Please enter a city.");
      if (!firstErrorEl) firstErrorEl = homeCity;
      valid = false;
    }
    if (!homeZip.value.trim()) {
      showError(homeZip, "Please enter a zip code.");
      if (!firstErrorEl) firstErrorEl = homeZip;
      valid = false;
    }
    if (!p1Name.value.trim()) {
      showError(p1Name, "Please enter a name.");
      if (!firstErrorEl) firstErrorEl = p1Name;
      valid = false;
    }
    if (!p1Email.value.trim()) {
      showError(p1Email, "Please enter an email address.");
      if (!firstErrorEl) firstErrorEl = p1Email;
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p1Email.value.trim())) {
      showError(p1Email, "Please enter a valid email address.");
      if (!firstErrorEl) firstErrorEl = p1Email;
      valid = false;
    }

    if (!form.querySelector('input[name="paymentType"]:checked')) {
      showGroupError(paymentGroup, "Please select a payment type.");
      if (!firstErrorEl) firstErrorEl = paymentGroup;
      valid = false;
    }

    var days1checked = form.querySelectorAll('input[name="days1"]:checked');
    if (days1checked.length === 0) {
      showGroupError(days1Group, "Please select at least one preferred day.");
      if (!firstErrorEl) firstErrorEl = days1Group;
      valid = false;
    } else if (days1checked.length < 5) {
      var days1values = Array.from(days1checked).map(function (cb) {
        return cb.value;
      });
      if (
        days1values.indexOf("Monday") === -1 &&
        days1values.indexOf("Friday") === -1
      ) {
        showGroupError(
          days1Group,
          "Schedules of fewer than 5 days must include a Monday or Friday.",
        );
        if (!firstErrorEl) firstErrorEl = days1Group;
        valid = false;
      }
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
