// BHRT treatment-route tabs. Tap/click selects; arrow keys, Home and End move between tabs.
// Without this script all panels show stacked, so no content is lost.
(function () {
    document.querySelectorAll('.routes').forEach(function (root) {
        var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
        if (!tabs.length) return;

        function select(tab, focus) {
            tabs.forEach(function (t) {
                var on = t === tab;
                t.setAttribute('aria-selected', on);
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
            });
            if (focus) tab.focus();
        }

        tabs.forEach(function (tab, i) {
            tab.addEventListener('click', function () { select(tab); });
            tab.addEventListener('keydown', function (e) {
                var n = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
                if (n === undefined) return;
                e.preventDefault();
                select(tabs[(n + tabs.length) % tabs.length], true);
            });
        });

        root.classList.add('tabs-ready');
        select(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]);
    });
})();