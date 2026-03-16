(function () {
  var SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby-lINz_k0tdI26vYUOqBBuwwNzcKDUgcjiUIvDGFKyj9wwEBkzfU2LG-kJwBkzCsxdPw/exec";
  var form = document.getElementById("tourForm");
  var success = document.getElementById("formSuccess");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

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
      })
      .catch(function () {
        form.closest(".tour-form-section").style.display = "none";
        success.classList.add("is-visible");
      });
  });
})();
