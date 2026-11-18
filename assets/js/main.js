/* Statquil Technologies, site behaviour. No dependencies. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var trigger = document.querySelector(".menu-trigger");
  var menuItem = trigger ? trigger.closest(".has-menu") : null;
  var closeMenu = function () {
    if (!trigger || !menuItem) return;
    menuItem.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  };

  if (trigger && menuItem) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      var open = menuItem.classList.toggle("open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (event) {
      if (!menuItem.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  var toggle = document.querySelector(".menu-toggle");
  var panel = document.getElementById("mobile-panel");

  function setMobileMenu(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.classList.toggle("is-open", open);
    document.body.classList.toggle("no-scroll", open);
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      setMobileMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileMenu(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        setMobileMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1020) setMobileMenu(false);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealTargets = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll("[data-copy]").forEach(function (button) {
    var original = button.innerHTML;
    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy") || "";
      var done = function () {
        button.textContent = "Copied";
        window.setTimeout(function () {
          button.innerHTML = original;
        }, 2200);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          window.prompt("Copy the email address:", text);
        });
      } else {
        window.prompt("Copy the email address:", text);
      }
    });
  });

  var form = document.getElementById("enquiry-form");
  var status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var value = function (key) {
        return String(data.get(key) || "").trim();
      };
      var name = value("name");
      var company = value("company");
      var email = value("email");
      var phone = value("phone");
      var interest = value("interest");
      var message = value("message");
      var subject = "Website enquiry: " + interest + (company ? " / " + company : "");
      var body = [
        "Name: " + name,
        "Company: " + (company || "Not provided"),
        "Email: " + email,
        "Phone: " + (phone || "Not provided"),
        "Topic: " + interest,
        "",
        message,
        "",
        "Sent from statquil.com",
      ].join("\n");
      var href =
        "mailto:contact@statquil.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
      if (status) {
        status.textContent =
          "Opening your email application. If nothing happens, write to contact@statquil.com.";
      }
      window.location.href = href;
    });

    form.addEventListener("input", function () {
      if (status) status.textContent = "";
    });
  }
})();
