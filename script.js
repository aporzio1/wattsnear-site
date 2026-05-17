(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-color-scheme: reduce)').matches;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------
  // Theme toggle. Pre-render script in <head> already applied theme.
  // ---------------------------------------------------------------
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('wattsnear-theme', next); } catch (e) {}
    });
  }

  // ---------------------------------------------------------------
  // Mobile nav toggle
  // ---------------------------------------------------------------
  var topbar = document.querySelector('[data-topbar]');
  var navToggle = document.querySelector('.nav-toggle');
  var navMobile = document.getElementById('nav-mobile');
  if (topbar && navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var open = topbar.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navMobile.hidden = !open;
    });
    navMobile.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        topbar.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navMobile.hidden = true;
      }
    });
  }

  // ---------------------------------------------------------------
  // Topbar shrink-on-scroll
  // ---------------------------------------------------------------
  function onScroll() {
    if (!topbar) return;
    if (window.scrollY > 24) topbar.classList.add('is-condensed');
    else topbar.classList.remove('is-condensed');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------------
  // IntersectionObserver fade-in for `.reveal`
  // ---------------------------------------------------------------
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  // ---------------------------------------------------------------
  // FAQ single-open
  // ---------------------------------------------------------------
  var faqList = document.querySelector('[data-faq]');
  if (faqList) {
    faqList.addEventListener('toggle', function (e) {
      var t = e.target;
      if (t.tagName === 'DETAILS' && t.open) {
        faqList.querySelectorAll('details[open]').forEach(function (d) {
          if (d !== t) d.open = false;
        });
      }
    }, true);
  }

  // ---------------------------------------------------------------
  // Screens gallery: arrow-key scroll
  // ---------------------------------------------------------------
  var screens = document.querySelector('.screens-strip');
  if (screens) {
    screens.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        screens.scrollBy({ left: 260, behavior: 'smooth' });
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        screens.scrollBy({ left: -260, behavior: 'smooth' });
        e.preventDefault();
      }
    });
  }

  // ---------------------------------------------------------------
  // Sticky mobile CTA — show after hero, hide near final CTA
  // ---------------------------------------------------------------
  var sticky = document.getElementById('sticky-cta');
  var hero = document.querySelector('.hero');
  var finalCta = document.querySelector('.final-cta');
  if (sticky && hero && finalCta && 'IntersectionObserver' in window) {
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('wattsnear-cta-dismissed') === '1'; } catch (e) {}

    if (!dismissed) {
      sticky.hidden = false;
      var heroVisible = true;
      var finalVisible = false;

      function syncVisibility() {
        var show = !heroVisible && !finalVisible && window.innerWidth <= 760;
        sticky.classList.toggle('is-visible', show);
      }

      var heroIO = new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        syncVisibility();
      }, { rootMargin: '-40% 0px 0px 0px' });
      heroIO.observe(hero);

      var finalIO = new IntersectionObserver(function (entries) {
        finalVisible = entries[0].isIntersecting;
        syncVisibility();
      });
      finalIO.observe(finalCta);

      window.addEventListener('resize', syncVisibility);

      var dismiss = sticky.querySelector('.sticky-cta-dismiss');
      function dismissBar() {
        sticky.classList.remove('is-visible');
        try { sessionStorage.setItem('wattsnear-cta-dismissed', '1'); } catch (e) {}
      }
      dismiss && dismiss.addEventListener('click', dismissBar);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sticky.classList.contains('is-visible')) dismissBar();
      });
    }
  }

  // ---------------------------------------------------------------
  // EV-vs-gas calculator (live)
  // ---------------------------------------------------------------
  var miles = document.getElementById('miles');
  var efficiency = document.getElementById('efficiency');
  var price = document.getElementById('price');
  var gas = document.getElementById('gas');
  if (miles && efficiency && price && gas) {
    var fields = {
      milesValue: document.getElementById('miles-value'),
      efficiencyValue: document.getElementById('efficiency-value'),
      priceValue: document.getElementById('price-value'),
      gasValue: document.getElementById('gas-value'),
      annualCost: document.getElementById('annual-cost'),
      gasEquivalent: document.getElementById('gas-equivalent'),
      savings: document.getElementById('savings')
    };

    var money0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    var money2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

    function updateCalculator() {
      var weeklyMiles = Number(miles.value);
      var milesPerKwh = Number(efficiency.value);
      var electricity = Number(price.value);
      var gasPrice = Number(gas.value);

      var annualMiles = weeklyMiles * 52;
      var annualKwh = milesPerKwh > 0 ? annualMiles / milesPerKwh : 0;
      var annualChargingCost = annualKwh * electricity;
      var annualGasGallons = annualMiles / 28;
      var annualGasCost = annualGasGallons * gasPrice;
      var savings = annualGasCost - annualChargingCost;

      fields.milesValue.textContent = weeklyMiles.toLocaleString();
      fields.efficiencyValue.textContent = milesPerKwh.toFixed(1);
      fields.priceValue.textContent = money2.format(electricity);
      fields.gasValue.textContent = money2.format(gasPrice);
      fields.annualCost.textContent = money0.format(annualChargingCost);
      fields.gasEquivalent.textContent = money0.format(annualGasCost);
      fields.savings.textContent = (savings >= 0 ? '' : '-') + money0.format(Math.abs(savings));
    }

    ['input', 'change'].forEach(function (eventName) {
      miles.addEventListener(eventName, updateCalculator);
      efficiency.addEventListener(eventName, updateCalculator);
      price.addEventListener(eventName, updateCalculator);
      gas.addEventListener(eventName, updateCalculator);
    });
    updateCalculator();
  }
})();
