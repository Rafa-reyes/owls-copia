(function () {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    const icon = document.getElementById('themeIcon');

    function syncIcon() {
        const isDark = root.classList.contains('dark');
        icon.className = 'fa-solid ' + (isDark ? 'fa-sun' : 'fa-moon');
        toggleBtn.setAttribute('aria-checked', String(isDark));
    }
    syncIcon();

    toggleBtn.addEventListener('click', () => {
        root.classList.toggle('dark');
        localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
        syncIcon();
    });
});