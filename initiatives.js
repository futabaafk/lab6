// CRUD для инициатив.
// Create: кнопка "Добавить инициативу"
// Read:   список карточек и окно с подробностями
// Update: кнопка "Изменить" в окне с подробностями
// Delete: кнопка "Удалить" в окне с подробностями
// Данные хранятся через storage.js (localStorage, первый раз берутся из data.json).

const initiativesGrid = document.getElementById('initiatives-grid');
const detailSection = document.getElementById('detail-section');
const detailCard = document.getElementById('detail-card');
const closeBtn = document.getElementById('close-btn');
const addBtn = document.getElementById('add-btn');
const resetBtn = document.getElementById('reset-btn');

let initiativesData = [];

// Загружаем данные и выводим список
async function loadInitiatives() {
    try {
        initiativesData = await getInitiatives();
        renderInitiativesList(initiativesData);
    } catch (error) {
        console.error('Ошибка JSON', error);
        initiativesGrid.innerHTML = '<p style="color: red;">Не удалось загрузить данные.</p>';
    }
}

/* READ: список */

function renderInitiativesList(items) {
    initiativesGrid.innerHTML = '';

    if (items.length === 0) {
        initiativesGrid.innerHTML = '<p class="muted">Инициатив пока нет. Нажмите «Добавить инициативу».</p>';
        return;
    }

    items.forEach(item => {
        const percent = Math.min(100, Math.round(item.votes / item.goal * 100));

        const card = document.createElement('div');
        card.className = 'card initiative-card';
        card.setAttribute('data-cat', item.category);   // по нему работают фильтры
        card.innerHTML = `
        <div class="card-img"></div>
        <span class="tag">${esc(item.categoryName)}</span>
        <h3>${esc(item.name)}</h3>
        <div class="progress"><i style="width:${percent}%"></i></div>
        <div class="card-foot">
            <span class="meta">${item.votes.toLocaleString('ru-RU')} / ${item.goal.toLocaleString('ru-RU')}</span>
            <span class="btn btn-ghost btn-sm">Подробнее</span>
        </div>
        `;
        card.addEventListener('click', () => showInitiativeDetail(item.id));
        initiativesGrid.appendChild(card);
    });
}

/* READ: подробности */

function showInitiativeDetail(id) {
    const item = initiativesData.find(i => i.id === id);
    if (!item) return;

    const percent = Math.min(100, Math.round(item.votes / item.goal * 100));

    const detailsList = Object.entries(item.details)
        .map(([key, value]) => `<li><strong>${esc(key)}:</strong> ${esc(value)}</li>`)
        .join('');

    detailCard.innerHTML = `
    <div class="detail-layout">
        <div class="detail-img"></div>
        <span class="tag">${esc(item.categoryName)}</span>
        <h2>${esc(item.name)}</h2>
        <p class="detail-desc">${esc(item.description)}</p>
        <div class="detail-specs">
            <strong>Подробности</strong>
            <ul>${detailsList}</ul>
        </div>
        <div class="progress"><i style="width:${percent}%"></i></div>
        <p class="detail-votes">${item.votes.toLocaleString('ru-RU')} из ${item.goal.toLocaleString('ru-RU')} голосов</p>
        <a class="btn btn-primary btn-block" href="../auth/login.html">Поддержать инициативу</a>
        <div class="detail-actions">
            <button class="btn btn-ghost" type="button" id="edit-btn">Изменить</button>
            <button class="btn btn-danger" type="button" id="delete-btn">Удалить</button>
        </div>
    </div>
    `;

    document.getElementById('edit-btn').addEventListener('click', () => showForm(item.id));
    document.getElementById('delete-btn').addEventListener('click', () => deleteInitiative(item.id));

    detailSection.classList.remove('hidden');   // показываем модалку
}

/* CREATE и UPDATE: одна и та же форма.
   showForm()   - пустая форма, добавляем новую инициативу
   showForm(id) - форма с данными, меняем существующую */

function showForm(id) {
    const item = id ? initiativesData.find(i => i.id === id) : null;

    const options = Object.entries(categoryNames)
        .map(([key, name]) => `<option value="${key}" ${item && item.category === key ? 'selected' : ''}>${name}</option>`)
        .join('');

    detailCard.innerHTML = `
    <form class="form" id="initiative-form" novalidate style="margin-top:0">
        <h2>${item ? 'Изменить инициативу' : 'Новая инициатива'}</h2>
        <div class="field"><label for="f-name">Название</label>
            <input class="input" id="f-name" name="name" value="${item ? esc(item.name) : ''}" placeholder="Например: Освещение парковой аллеи"></div>
        <div class="row">
            <div class="field"><label for="f-cat">Категория</label>
                <select class="select" id="f-cat" name="category">${options}</select></div>
            <div class="field"><label for="f-district">Район</label>
                <input class="input" id="f-district" name="district" value="${item ? esc(item.details['Район']) : ''}" placeholder="Название района"></div>
        </div>
        <div class="field"><label for="f-desc">Описание</label>
            <textarea class="textarea" id="f-desc" name="description" placeholder="Что нужно сделать и почему?">${item ? esc(item.description) : ''}</textarea></div>
        <div class="row">
            <div class="field"><label for="f-goal">Нужно голосов</label>
                <input class="input" id="f-goal" name="goal" type="number" min="100" value="${item ? item.goal : 4000}"></div>
            <div class="field"><label for="f-author">Автор</label>
                <input class="input" id="f-author" name="author" value="${item ? esc(item.details['Автор']) : ''}" placeholder="Ваше имя"></div>
        </div>
        <div class="form-msg"></div>
        <div class="detail-actions">
            <button class="btn btn-primary" type="submit">Сохранить</button>
            <button class="btn btn-ghost" type="button" id="cancel-btn">Отмена</button>
        </div>
    </form>
    `;

    const form = document.getElementById('initiative-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveForm(form, item);
    });
    document.getElementById('cancel-btn').addEventListener('click', () => {
        if (item) showInitiativeDetail(item.id);     // при изменении возвращаемся к подробностям
        else detailSection.classList.add('hidden');  // при добавлении просто закрываем
    });

    detailSection.classList.remove('hidden');
}

function saveForm(form, item) {
    const f = form.elements;
    const values = {
        name: f['name'].value,
        category: f['category'].value,
        district: f['district'].value,
        description: f['description'].value,
        goal: f['goal'].value,
        author: f['author'].value
    };

    const error = validateInitiative(values);
    if (error) {
        const msg = form.querySelector('.form-msg');
        msg.className = 'form-msg error';
        msg.textContent = error;
        return;
    }

    if (item) {
        // UPDATE: меняем поля существующей инициативы, голоса и остальное не трогаем
        item.name = values.name.trim();
        item.category = values.category;
        item.categoryName = categoryNames[values.category];
        item.description = values.description.trim();
        item.goal = Number(values.goal);
        item.details['Район'] = values.district.trim() || 'Не указан';
        item.details['Автор'] = values.author.trim() || 'Аноним';
        saveInitiatives(initiativesData);
        renderInitiativesList(initiativesData);
        showInitiativeDetail(item.id);
    } else {
        // CREATE: добавляем новую в конец списка
        initiativesData.push(buildInitiative(initiativesData, values));
        saveInitiatives(initiativesData);
        renderInitiativesList(initiativesData);
        detailSection.classList.add('hidden');
    }
}

/* DELETE */

function deleteInitiative(id) {
    if (!confirm('Удалить эту инициативу?')) return;

    initiativesData = initiativesData.filter(i => i.id !== id);
    saveInitiatives(initiativesData);
    renderInitiativesList(initiativesData);
    detailSection.classList.add('hidden');
}

/* Кнопки на странице и закрытие модалки */

addBtn.addEventListener('click', () => showForm());

resetBtn.addEventListener('click', async () => {
    if (!confirm('Вернуть данные из data.json? Все ваши изменения пропадут.')) return;
    resetInitiatives();
    await loadInitiatives();
});

closeBtn.addEventListener('click', () => detailSection.classList.add('hidden'));
detailSection.addEventListener('click', (e) => {
    if (e.target === detailSection) detailSection.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', loadInitiatives);
