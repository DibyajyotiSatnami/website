// Bright Smile Dental Clinic — site scripts
document.addEventListener("DOMContentLoaded", function () {
  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      toggle.classList.toggle("active");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("active");
      });
    });
  }

  /* Highlight active nav link based on current page */
  var current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");

    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* Back to top button */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Footer year */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Appointment / contact form validation (front-end only, no backend wired up) */
  var form = document.querySelector("#appointment-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        var group = field.closest(".form-group");
        var value = field.value.trim();
        var fieldValid = value.length > 0;

        if (field.type === "email" && value) {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        if (field.type === "tel" && value) {
          fieldValid = /^[0-9+\-\s()]{7,}$/.test(value);
        }

        if (group) {
          group.classList.toggle("has-error", !fieldValid);
        }
        if (!fieldValid) {
          valid = false;
        }
      });

      var successBox = form.querySelector(".form-success");

      if (valid) {
        form.reset();
        if (successBox) {
          successBox.classList.add("show");
          setTimeout(function () {
            successBox.classList.remove("show");
          }, 6000);
        }
      }
    });

    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("input", function () {
        var group = field.closest(".form-group");
        if (group) {
          group.classList.remove("has-error");
        }
      });
    });
  }
});
