document.addEventListener('DOMContentLoaded', () => {
  const themeToggleButton = document.querySelector('#theme-toggle-btn');
  const htmlElement = document.documentElement;

  function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // expires in days
      document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  function applyTheme() {
      const themeFromCookie = getCookie('theme');
      if (themeFromCookie) {
          htmlElement.setAttribute('data-bs-theme', themeFromCookie);
      } else {
          htmlElement.setAttribute('data-bs-theme', 'light');
      }
  }

  applyTheme();

  themeToggleButton.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-bs-theme');

      if (currentTheme === 'dark') {
          htmlElement.setAttribute('data-bs-theme', 'light');
          setCookie('theme', 'light', 30);
      } else {
          htmlElement.setAttribute('data-bs-theme', 'dark');
          setCookie('theme', 'dark', 30);
      }
  });
});
