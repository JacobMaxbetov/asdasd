const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { lessons } = require('../data/lessonsData');

let users = []; // тот же массив, что в auth (в реальности — одна БД)

router.get('/me', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

  res.json({
    id: user.id,
    username: user.username,
    level: user.level,
    xp: user.xp,
    completedLessons: user.completedLessons,
    achievements: user.achievements
  });
});

router.post('/complete-lesson', auth, (req, res) => {
  const { lessonId } = req.body;
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

  if (!user.completedLessons.includes(lessonId)) {
    user.completedLessons.push(lessonId);
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      user.xp += lesson.xpReward || 50;

      // Level up логика
      const newLevel = Math.floor(user.xp / 300) + 1;
      if (newLevel > user.level) {
        user.level = newLevel;
        user.achievements.push(`Достиг уровня ${newLevel}! 🏆`);
      }
    }
  }

  res.json({ message: 'Урок завершён!', user: { level: user.level, xp: user.xp } });
});

// Можно добавить /complete-quiz, /add-achievement и т.д.

module.exports = router;
