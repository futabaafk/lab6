// Хранилище для CRUD.
// Браузер не умеет записывать в файл data.json, поэтому при первом запуске
// копируем данные из data.json в localStorage, а дальше работаем только с ним.

const DATA_URL = '../data.json';
const STORAGE_KEY = 'initiatives';

const categoryNames = {
    yard: 'Благоустройство',
    transport: 'Транспорт',
    eco: 'Экология',
    social: 'Социальная сфера'
};

// READ: получить все инициативы
async function getInitiatives() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);            // уже есть свои данные

    const response = await fetch(DATA_URL);         // первый запуск: берём из data.json
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    const data = await response.json();
    saveInitiatives(data);
    return data;
}

// Сохранить весь список (после добавления, изменения или удаления)
function saveInitiatives(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Вернуть данные к исходным из data.json
function resetInitiatives() {
    localStorage.removeItem(STORAGE_KEY);
}

// Новый id = самый большой id + 1
function newId(items) {
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

// Защита от html в тексте, который вводит пользователь
function esc(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Проверка полей формы, возвращает текст ошибки или пустую строку
function validateInitiative(v) {
    if (v.name.trim().length < 5) return 'Название: минимум 5 символов.';
    if (v.description.trim().length < 10) return 'Описание: минимум 10 символов.';
    if (!(Number(v.goal) >= 100)) return 'Нужно голосов: число не меньше 100.';
    return '';
}

// CREATE: собрать новую инициативу из значений формы
function buildInitiative(items, v) {
    return {
        id: newId(items),
        name: v.name.trim(),
        category: v.category,
        categoryName: categoryNames[v.category],
        votes: 0,
        goal: Number(v.goal),
        description: v.description.trim(),
        details: {
            'Автор': v.author.trim() || 'Аноним',
            'Район': v.district.trim() || 'Не указан',
            'Опубликовано': new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
            'Статус': 'Сбор голосов',
            'Осталось': '30 дней'
        }
    };
}
