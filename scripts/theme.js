// Theme handling
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Check for saved theme preference or use the system preference
const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply the theme
const setTheme = (theme) => {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
};

// Update the theme toggle icon
const updateThemeIcon = (theme) => {
  themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
};

// Toggle between light and dark themes
const toggleTheme = () => {
  const currentTheme = htmlEl.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
};

// Initialize theme
setTheme(getPreferredTheme());

// Add event listener to theme toggle button
themeToggle.addEventListener('click', toggleTheme);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) { // Only auto switch if user hasn't manually set a preference
    setTheme(e.matches ? 'dark' : 'light');
  }
});