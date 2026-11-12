/* Shared theme on every page; only the theme preference is stored. */
(function () {
  const KEY = 'medasym-ramen-theme';
  function getTheme() { try { return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'; } catch (_) { return 'light'; } }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      button.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    });
  }
  applyTheme(getTheme());
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getTheme());
    document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (_) { /* still switch theme */ }
      applyTheme(next);
    }));
  });
})();
