"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

const page = { // Описание работы нашего объекта
  menu: document.querySelector(".menu__list"),
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

function rerenderMenu(activeHabbit) {
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
      element.addEventListener("click", () => rerender(habbit.id));
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
  
}

function rerender(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  rerenderMenu(activeHabbit);
  renderHead(activeHabbit);
}

/**
 * INIT
 */
(() => {
  loadData();
  rerender(habbits[0].id);
})();

// Переменная которая хранит ID активной вкладки
// Обработчие событий на каждую меняющий активный ID
