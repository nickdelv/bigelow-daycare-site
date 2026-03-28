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

  // ── SCHEDULE DAY TOGGLES ─────────────────────────
  var DAYS = [
    { id: "mon", abbr: "Mon" },
    { id: "tue", abbr: "Tue" },
    { id: "wed", abbr: "Wed" },
    { id: "thu", abbr: "Thu" },
    { id: "fri", abbr: "Fri" },
  ];

  DAYS.forEach(function (day) {
    var cb = document.getElementById("day-" + day.id);
    var row = cb.closest(".schedule-day-row");
    var radios = row.querySelectorAll('input[type="radio"]');

    cb.addEventListener("change", function () {
      if (this.checked) {
        row.classList.add("is-active");
        radios.forEach(function (r) {
          r.disabled = false;
        });
        // Default to 5:30
        row.querySelector('input[value="5:30"]').checked = true;
      } else {
        row.classList.remove("is-active");
        radios.forEach(function (r) {
          r.disabled = true;
          r.checked = false;
        });
      }
    });
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

  var scheduleDaysGroup = document.getElementById("scheduleDaysGroup");
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
  form.querySelectorAll(".schedule-day-cb").forEach(function (cb) {
    cb.addEventListener("change", function () {
      clearGroupError(scheduleDaysGroup);
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
    var p1Cell = form.querySelector("#p1Cell");
    var p1Email = form.querySelector("#p1Email");

    // Clear all errors
    [
      childName,
      childDob,
      homeAddress,
      homeCity,
      homeZip,
      p1Name,
      p1Cell,
      p1Email,
    ].forEach(clearError);
    clearGroupError(scheduleDaysGroup);
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
    if (!p1Cell.value.trim()) {
      showError(p1Cell, "Please enter a cell phone number.");
      if (!firstErrorEl) firstErrorEl = p1Cell;
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

    var checkedDays = Array.from(
      form.querySelectorAll(".schedule-day-cb:checked"),
    );
    if (checkedDays.length === 0) {
      showGroupError(scheduleDaysGroup, "Please select at least one day.");
      if (!firstErrorEl) firstErrorEl = scheduleDaysGroup;
      valid = false;
    } else if (checkedDays.length < 5) {
      var checkedIds = checkedDays.map(function (cb) {
        return cb.id;
      });
      if (
        checkedIds.indexOf("day-mon") === -1 &&
        checkedIds.indexOf("day-fri") === -1
      ) {
        showGroupError(
          scheduleDaysGroup,
          "Schedules of fewer than 5 days must include a Monday or Friday.",
        );
        if (!firstErrorEl) firstErrorEl = scheduleDaysGroup;
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

    // Build schedule string: "Mon (5:30), Wed (3:30), Fri (5:30)"
    var schedParts = [];
    DAYS.forEach(function (day) {
      var cb = document.getElementById("day-" + day.id);
      if (cb.checked) {
        var timeRadio = form.querySelector(
          'input[name="time-' + day.id + '"]:checked',
        );
        schedParts.push(
          day.abbr + " (" + (timeRadio ? timeRadio.value : "") + ")",
        );
      }
    });
    document.getElementById("schedule-hidden").value = schedParts.join(", ");

    // Disable raw schedule inputs so FormData doesn't include them
    form
      .querySelectorAll(
        ".schedule-day-cb, .schedule-day-row input[type='radio']",
      )
      .forEach(function (el) {
        el.disabled = true;
      });

    // Consolidate referral checkboxes into hidden field, then disable
    var referralChecked = Array.from(
      document.querySelectorAll('input[name="referral"]:checked'),
    ).map(function (cb) {
      return cb.value;
    });
    document.getElementById("referral-hidden").value =
      referralChecked.join(", ");
    document.querySelectorAll('input[name="referral"]').forEach(function (cb) {
      cb.disabled = true;
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
