"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

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

(() => {
  loadData();
})();
