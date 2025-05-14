// public/script.js

// Предустановленные темы
const themes = {
  default: {
    primary: '#212529',
    secondary: '#0d6efd'
  },
  green: {
    primary: '#198754',
    secondary: '#ca9905fe'
  },
  purple: {
    primary: '#6f42c1',
    secondary: '#fd7e14'
  },
  dark: {
    primary: '#343a40',
    secondary: '#adb5bd'
  }
};

// Загрузка дефолтных стилей
const defaultStyles = {
  primary: getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color')
    .trim(),
  secondary: getComputedStyle(document.documentElement)
    .getPropertyValue('--secondary-color')
    .trim(),
  font: getComputedStyle(document.documentElement)
    .getPropertyValue('--font-family')
    .trim()
};

// Функция определения контрастного текста
function getContrastColor(hex) {
  let r = parseInt(hex.slice(1,3), 16);
  let g = parseInt(hex.slice(3,5), 16);
  let b = parseInt(hex.slice(5,7), 16);
  return (r*0.299 + g*0.587 + b*0.114) > 186 ? '#000000' : '#ffffff';
}

// Применение темы
function applyTheme(primaryColor, secondaryColor) {
  // Устанавливаем цвета
  document.documentElement.style.setProperty('--primary-color', primaryColor);
  document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  
  // Определяем цвет текста
  const textColor = getContrastColor(primaryColor);
  document.documentElement.style.setProperty('--text-color', textColor);
  
  // Обновляем инпуты
  if(document.getElementById('primaryColor')) {
    document.getElementById('primaryColor').value = primaryColor;
    document.getElementById('secondaryColor').value = secondaryColor;
  }
}

// Инициализация тем
function initThemes() {
  // Проверяем сохраненную тему
  const savedTheme = localStorage.getItem('app-theme');
  const customPrimary = localStorage.getItem('custom-primary');
  const customSecondary = localStorage.getItem('custom-secondary');

  if(savedTheme && themes[savedTheme]) {
    const theme = themes[savedTheme];
    applyTheme(theme.primary, theme.secondary);
    document.querySelector(`[data-theme="${savedTheme}"]`).classList.add('active');
  } else if(customPrimary && customSecondary) {
    applyTheme(customPrimary, customSecondary);
  } else {
    applyTheme(defaultStyles.primary, defaultStyles.secondary);
  }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация шрифтов
  applyFont();
  // Инициализация тем
  initThemes();


  // Обработчик выбора предустановленной темы
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const themeName = opt.dataset.theme;
      const theme = themes[themeName];
      
      // Удаляем выделение с других тем
      document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      
      // Применяем тему
      applyTheme(theme.primary, theme.secondary);
      localStorage.setItem('app-theme', themeName);
      localStorage.removeItem('custom-primary');
      localStorage.removeItem('custom-secondary');
    });
  });

  // Сохранение кастомной темы
  document.getElementById('saveTheme')?.addEventListener('click', (e) => {
    e.preventDefault();
    const primary = document.getElementById('primaryColor').value;
    const secondary = document.getElementById('secondaryColor').value;
    
    applyTheme(primary, secondary);
    localStorage.setItem('custom-primary', primary);
    localStorage.setItem('custom-secondary', secondary);
    localStorage.removeItem('app-theme');
    document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
    alert('Тема сохранена!');
  });

  // Сброс темы
  document.getElementById('resetTheme')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('app-theme');
    localStorage.removeItem('custom-primary');
    localStorage.removeItem('custom-secondary');
    initThemes();
    alert('Тема сброшена!');
  });

  // Сохранение шрифта
  document.getElementById('saveFont')?.addEventListener('click', (e) => {
    e.preventDefault();
    const font = document.getElementById('fontFamily').value;
    localStorage.setItem('fontFamily', font);
    applyFont();
    alert('Шрифт сохранен!');
  });

  // Сброс шрифта
  document.getElementById('resetFont')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('fontFamily');
    applyFont();
    alert('Шрифт сброшен!');
  });
});

// Применение шрифта
function applyFont() {
  const savedFont = localStorage.getItem('fontFamily') || defaultStyles.font;
  document.documentElement.style.setProperty('--font-family', savedFont);
  if(document.getElementById('fontFamily')) {
    document.getElementById('fontFamily').value = savedFont;
  }
}