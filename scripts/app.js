"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

const page = {
  // Описание работы нашего объекта
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPersent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
};

/**
 * Получаем данные от пользователя
 */

function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY); //Получаем строку
  const habbitArray = JSON.parse(habbitsString); // Парсим стрингу в массив
  // Делаем проверку что передаем массив
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

/**
 * Хранение данных
 */

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}
/**
 * RENDER
 */

function renderMenu(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      //Создание
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", habbit.id);
      element.classList.add("menu__item");
      element.addEventListener("click", () => render(habbit.id));
      element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}"></img>`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add("menu__item_active");
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("menu__item_active");
    } else {
      existed.classList.remove("menu__item_active");
    }
  }
}

function renderHead(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPersent.innerText = progress.toFixed(0) + '%'
  page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
}

function render(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  renderMenu(activeHabbit);
  renderHead(activeHabbit);
}

/**
 * INIT
 */
(() => {
  loadData();
  render(habbits[0].id);
})();

// Переменная которая хранит ID активной вкладки
// Обработчие событий на каждую меняющий активный ID
