(() => {
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)');
  let choice;
  try { choice = localStorage.getItem('vocal-paper-theme'); } catch {}
  function apply(theme) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    const button = document.getElementById('theme');
    if (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.textContent = dark ? '☀ Light' : '☾ Dark';
      button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    document.querySelector('meta[name="theme-color"]').content = dark ? '#1c1b18' : '#f7f7f2';
  }
  apply(choice === 'dark' || choice === 'light' ? choice : system.matches ? 'dark' : 'light');
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.getElementById('theme').addEventListener('click', () => {
      choice = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(choice);
      try { localStorage.setItem('vocal-paper-theme', choice); } catch {}
    });
  });
  system.addEventListener('change', () => { if (!choice) apply(system.matches ? 'dark' : 'light'); });
})();
