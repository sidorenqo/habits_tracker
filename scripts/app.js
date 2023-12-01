"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

const page = {
  // Описание работы нашего приложенния
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPersent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  content: {
    daysContainer: document.getElementById("days"),
    nextDay: document.querySelector(".habbit__day"),
  },
  popup: {
    index: document.getElementById("add-habbit_popup"),
    iconField: document.querySelector('.popup__form input[name="icon"]'),
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

function togglePopup() {
  if (page.popup.index.classList.contains("cover_hidden")) {
    page.popup.index.classList.remove("cover_hidden");
  } else {
    page.popup.index.classList.add("cover_hidden");
  }
}

function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = "";
  }
}

function validateAndGetFormData(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove("error");
    if (!fieldValue) {
      form[field].classList.add("error");
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}

/**
 * RENDER
 */

function renderMenu(activeHabbit) {
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
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPersent.innerText = progress.toFixed(0) + "%";
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function renderContent(activeHabbit) {
  page.content.daysContainer.innerHTML = "";
  for (const index in activeHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = `<div class="habbit__day">День ${
      Number(index) + 1
    }</div>
						<div class="habbit__comment">${activeHabbit.days[index].comment}</div>
						<button class="habbit__delete" onclick='deleteDay(${index})'>
            <img src="images/delete.svg" alt="Удалить день ${index + 1}">
            </button>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function render(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  document.location.replace(document.location.pathname + "#" + activeHabbitId);
  renderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderContent(activeHabbit);
}

/**
 * Работа с днями
 */

function addDays(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ["comment"]);
  if (!data) {
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });
  resetForm(event.target, ["comment"]);
  render(globalActiveHabbitId);
  saveData();
}

function deleteDay(index) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      habbit.days.splice(index, 1);
      return {
        ...habbit,
        days: habbit.days,
      };
    }
    return habbit;
  });
  render(globalActiveHabbitId);
  saveData();
}

/**
 * Работа с добавлением привычек
 */

function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector(".icon.icon_active");
  activeIcon.classList.remove("icon_active");
  context.classList.add("icon_active");
}

function addHabbit(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ["name", "icon", "target"]);
  if (!data) {
    return;
  }
  const maxId = habbits.reduce(
    (acc, habbit) => (acc > habbit.id ? acc : habbit.id),
    0
  );
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: [],
  });
  resetForm(event.target, ["name"], ["target"]);
  togglePopup();
  saveData();
  render(maxId + 1);
}

/**
 * INIT
 */
(() => {
  loadData();
  const hashId = Number(document.location.hash.replace("#", ""));
  const urlHabbit = habbits.find((habbit) => habbit.id == hashId);
  if (urlHabbit) {
    render(urlHabbit.id);
  } else {
    render(habbits[0].id);
  }
})();
