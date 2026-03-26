const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Статические файлы (все HTML страницы)
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Все остальные страницы (кроме API) тоже открывают index.html или свои файлы
app.get(/^\/(?!api).*/, (req, res) => {
  const filePath = path.join(__dirname, 'public', req.path === '/' ? 'index.html' : req.path);
  
  // Если запрашивается .html файл — отдаём его, иначе — index.html
  if (req.path.endsWith('.html')) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// API Роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/progress', require('./routes/progress'));

// Получение списка всех уроков
app.get('/api/lessons', (req, res) => {
  try {
    const { lessons } = require('./data/lessonsData');
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка загрузки уроков' });
  }
});

// Защищённый тестовый маршрут
app.get('/api/protected', require('./middleware/auth'), (req, res) => {
  res.json({ message: 'Доступ разрешён', user: req.user });
});

// 404 для API
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`🌐 Открой в браузере: http://localhost:${PORT}`);
});