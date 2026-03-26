const lessons = [
  {
    id: "1",
    title: "Знакомство с компьютером",
    description: "Что такое компьютер, клавиатура, мышь и интернет",
    level: 1,
    xpReward: 50,
    type: "theory",
    content: "Здесь будет яркий текст + картинки + видео (в фронтенде)"
  },
  {
    id: "2",
    title: "Переменные в JavaScript",
    description: "Как хранить информацию: числа, текст, правда/ложь",
    level: 1,
    xpReward: 100,
    type: "practice",
    content: "let name = 'Маша'; console.log(name);"
  },
  {
    id: "3",
    title: "Условные операторы (if)",
    description: "Если ... то ...",
    level: 2,
    xpReward: 120,
    type: "quiz"
  },
  // Добавляй сколько угодно модулей: циклы, функции, массивы, HTML/CSS основы и т.д.
];

module.exports = { lessons };
