/* =========================================================
   Dr. [Your Name] — Homeopathy Clinic
   Vanilla JS, no dependencies. Each block is independent —
   safe to delete a whole block if you remove that feature.
   ========================================================= */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Mobile nav ---------- */
  (function mobileNav() {
    var toggle = document.getElementById("navToggle");
    var panel = document.getElementById("mobileNav");
    if (!toggle || !panel) return;

    function closeNav() {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
    function openNav() {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  })();

  /* ---------- Scroll reveal ---------- */
  (function scrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* ---------- Animated counters ---------- */
  (function counters() {
    var nodes = document.querySelectorAll(".counter-value[data-count-to]");
    if (!nodes.length) return;

    function animateCount(el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var suffix = el.getAttribute("data-suffix") || "";

      if (prefersReducedMotion) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }

      var duration = 1400;
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
        var value = target * eased;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(animateCount);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    nodes.forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* ---------- Testimonial carousel ---------- */
  (function carousel() {
    var track = document.getElementById("storiesCarousel");
    var prevBtn = document.getElementById("storiesPrev");
    var nextBtn = document.getElementById("storiesNext");
    var dotsWrap = document.getElementById("storiesDots");
    if (!track || !dotsWrap) return;

    var cards = Array.prototype.slice.call(track.children);
    if (!cards.length) return;

    /* build dots */
    cards.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Go to story " + (i + 1));
      dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
      dot.addEventListener("click", function () {
        cards[i].scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          inline: "start",
          block: "nearest",
        });
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function scrollByCard(direction) {
      var cardWidth = cards[0].getBoundingClientRect().width + 20; /* gap */
      track.scrollBy({
        left: direction * cardWidth,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { scrollByCard(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { scrollByCard(1); });

    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") scrollByCard(1);
      if (e.key === "ArrowLeft") scrollByCard(-1);
    });

    /* sync active dot with scroll position */
    var syncTimeout;
    track.addEventListener("scroll", function () {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(function () {
        var trackLeft = track.getBoundingClientRect().left;
        var closestIndex = 0;
        var closestDist = Infinity;
        cards.forEach(function (card, i) {
          var dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
          }
        });
        dots.forEach(function (dot, i) {
          dot.setAttribute("aria-selected", i === closestIndex ? "true" : "false");
        });
      }, 100);
    });
  })();

  /* ---------- Footer year ---------- */
  (function footerYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  })();
})();
