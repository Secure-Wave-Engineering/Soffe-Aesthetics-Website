// Results: before/after carousels (one per treatment) + treatment tabs.
// Native scroll-snap does the swiping; arrows, dots and keys just call scrollTo.
// "See before & after" links on service cards (data-results-tab) open the matching tab.
(function () {
    'use strict';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- carousels ---- */
    function initCarousel(panel) {
        var car = panel.querySelector('.carousel');
        if (!car) return null;
        var vp = car.querySelector('.carousel-viewport');
        var slides = Array.prototype.slice.call(car.querySelectorAll('.slide'));
        var prev = car.querySelector('.car-btn.prev'), next = car.querySelector('.car-btn.next');
        var dotsWrap = panel.querySelector('.dots'), live = panel.querySelector('[aria-live]');
        var n = slides.length, stops = 1, timer;

        function perView() {
            var w = slides[0] ? slides[0].offsetWidth : 0;
            return w ? Math.max(1, Math.round(vp.clientWidth / w)) : 1;
        }
        function current() {
            var sl = vp.scrollLeft, best = 0, bd = Infinity;
            slides.forEach(function (s, k) {
                var d = Math.abs(s.offsetLeft - sl);
                if (d < bd) { bd = d; best = k; }
            });
            if (vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2) best = stops - 1; // pinned to the end
            return Math.min(best, stops - 1);
        }
        function go(k) {
            k = Math.max(0, Math.min(stops - 1, k));
            vp.scrollTo({ left: slides[k].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
        }
        function buildDots() {
            stops = Math.max(1, n - perView() + 1);
            dotsWrap.innerHTML = '';
            for (var i = 0; i < stops; i++) {
                (function (idx) {
                    var d = document.createElement('button');
                    d.type = 'button';
                    d.setAttribute('aria-label', 'Go to result ' + (idx + 1));
                    d.addEventListener('click', function () { go(idx); });
                    dotsWrap.appendChild(d);
                })(i);
            }
            dotsWrap.hidden = stops < 2;
        }
        function sync() {
            var k = current(), pv = perView();
            Array.prototype.forEach.call(dotsWrap.children, function (d, idx) {
                d.setAttribute('aria-current', String(idx === k));
            });
            slides.forEach(function (s, idx) { s.setAttribute('aria-hidden', String(idx < k || idx >= k + pv)); });
            if (prev) prev.disabled = k === 0;
            if (next) next.disabled = k >= stops - 1;
            if (live) live.textContent = 'Result ' + (k + 1) + ' of ' + n;
        }
        function refresh() { buildDots(); sync(); }

        if (prev) prev.addEventListener('click', function () { go(current() - 1); });
        if (next) next.addEventListener('click', function () { go(current() + 1); });
        car.setAttribute('tabindex', '0');
        car.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
        });
        vp.addEventListener('scroll', function () { clearTimeout(timer); timer = setTimeout(sync, 80); }, { passive: true });
        window.addEventListener('resize', refresh);
        return refresh;
    }

    var refreshers = {};
    document.querySelectorAll('#results .res-panel').forEach(function (panel) {
        refreshers[panel.id] = initCarousel(panel);
    });

    /* ---- treatment tabs ---- */
    var tabs = Array.prototype.slice.call(document.querySelectorAll('#results [role="tab"]'));
    function select(tab, focus) {
        tabs.forEach(function (t) {
            var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
            t.setAttribute('aria-selected', String(on));
            t.tabIndex = on ? 0 : -1;
            panel.hidden = !on;
        });
        var r = refreshers[tab.getAttribute('aria-controls')];
        if (r) r(); // panel was hidden, so measure it now that it's visible
        if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { select(tab); });
        tab.addEventListener('keydown', function (e) {
            var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
            if (k === undefined) return;
            e.preventDefault();
            select(tabs[(k + tabs.length) % tabs.length], true);
        });
    });
    var start = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
    if (start) select(start);

    /* ---- service-card links open the matching tab ---- */
    document.querySelectorAll('[data-results-tab]').forEach(function (a) {
        a.addEventListener('click', function () {
            var t = document.getElementById('rt-' + a.getAttribute('data-results-tab'));
            if (t) select(t);
        });
    });
})();
