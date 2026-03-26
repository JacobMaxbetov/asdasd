const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
let users = []; // потом заменишь на БД

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Имя пользователя и пароль обязательны' });
  }

  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Пользователь уже существует' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    username,
    email: email || `${username}@kids.com`,
    password: hashedPassword,
    level: 1,
    xp: 0,
    completedLessons: [],
    completedQuizzes: [],
    achievements: [],
    createdAt: new Date()
  };

  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'Регистрация прошла успешно! 🎉',
    token,
    user: { id: newUser.id, username: newUser.username, level: 1, xp: 0 }
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Добро пожаловать обратно! 🚀',
    token,
    user: { id: user.id, username: user.username, level: user.level, xp: user.xp }
  });
});

module.exports = router;