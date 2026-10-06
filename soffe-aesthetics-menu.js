(function () {
    'use strict';
    /* ---- Mobile menu ---- */
    var menu = document.getElementById('menu'), openBtn = document.getElementById('navToggle'),
        closeBtn = document.getElementById('menuClose'), lastFocus = null;
    function openMenu() {
        lastFocus = document.activeElement; menu.classList.add('open'); menu.setAttribute('aria-hidden', 'false');
        openBtn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; var f = menu.querySelector('a,button'); if (f) f.focus();
    }
    function closeMenu() {
        menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true');
        openBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus();
    }
    if (openBtn) openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu(); });


})();