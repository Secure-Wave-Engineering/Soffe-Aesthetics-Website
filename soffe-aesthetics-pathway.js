// Pathway draw: the BHRT steps light up in order and the connector line draws as you scroll.
(function () {
    'use strict';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    Array.prototype.forEach.call(document.querySelectorAll('.pathway'), function (pathway) {
        var steps = Array.prototype.slice.call(pathway.querySelectorAll('.step'));
        if (steps.length < 2) return;
        var ticking = false;

        // 0 when the list's top reaches 78% down the screen, 1 when its bottom does
        function progress() {
            var r = pathway.getBoundingClientRect(), vh = window.innerHeight;
            return clamp((vh * 0.78 - r.top) / Math.max(r.height, vh * 0.4));
        }
        function draw(p) {
            var seg = p * (steps.length - 1);
            steps.forEach(function (s, i) {
                s.style.setProperty('--f', clamp(seg - i).toFixed(3));   // how much of this step's line is drawn
                s.classList.toggle('lit', i === 0 ? p > 0.02 : seg >= i - 0.001);
            });
        }
        function queue() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () { ticking = false; draw(progress()); });
        }

        // measure before switching the effect on, so steps that start lit don't flicker
        var p0 = progress();
        pathway.classList.add('drawing');
        draw(p0);
        window.addEventListener('scroll', queue, { passive: true });
        window.addEventListener('resize', queue);
    });
})();