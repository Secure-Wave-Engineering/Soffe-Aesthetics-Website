var yr = document.getElementById("yr");
if (yr) {
    yr.textContent = new Date().getFullYear();
}


// Section tracker: an underline in the desktop nav follows the section being read.
(function () {
    'use strict';
    var nav = document.querySelector('.nav-links');
    if (!nav) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var bar = document.createElement('span');
    bar.className = 'nav-spy';
    bar.setAttribute('aria-hidden', 'true');
    nav.appendChild(bar);
    var ticking = false;

    function update() {
        ticking = false;
        var line = window.innerHeight * 0.38, current = null;
        sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
        // at the very bottom, the last section counts even if its top never reaches the line
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
            current = sections[sections.length - 1];
        }
        var link = null;
        links.forEach(function (a) {
            var on = !!current && a.getAttribute('href') === '#' + current.id;
            a.classList.toggle('current', on);
            if (on) { link = a; a.setAttribute('aria-current', 'location'); }
            else a.removeAttribute('aria-current');
        });
        if (link) {
            bar.style.width = link.offsetWidth + 'px';
            bar.style.transform = 'translateX(' + link.offsetLeft + 'px)';
            bar.classList.add('on');
        } else {
            bar.classList.remove('on');
        }
    }
    function queue() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    if (document.fonts) document.fonts.ready.then(queue);   // web fonts change link widths
    update();
    // place it instantly on load, then let it slide from here on
    requestAnimationFrame(function () { bar.classList.add('ready'); });
})();