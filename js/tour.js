(function () {
  var SCRIPT_URL =
    "AKfycby-lINz_k0tdI26vYUOqBBuwwNzcKDUgcjiUIvDGFKyj9wwEBkzfU2LG-kJwBkzCsxdPw";
  var form = document.getElementById("tourForm");
  var success = document.getElementById("formSuccess");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

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
        form.style.display = "none";
        success.classList.add("is-visible");
      })
      .catch(function () {
        form.style.display = "none";
        success.classList.add("is-visible");
      });
  });
})();
