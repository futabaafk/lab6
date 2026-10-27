// List и Detail для инициатив: данные берём из data.json через fetch.
// Список выводим карточками, по клику открываем модальное окно с подробностями.

const DATA_URL = '../data.json';
const initiativesGrid = document.getElementById('initiatives-grid');
const detailSection = document.getElementById('detail-section');
const detailCard = document.getElementById('detail-card');
const closeBtn = document.getElementById('close-btn');

let initiativesData = [];

// Загружаем JSON и выводим список
async function loadInitiatives() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

        initiativesData = await response.json();
        renderInitiativesList(initiativesData);
    } catch (error) {
        console.error('Ошибка JSON', error);
        initiativesGrid.innerHTML = '<p style="color: red;">Не удалось загрузить данные.</p>';
    }
}

/* List */

function renderInitiativesList(items) {
    initiativesGrid.innerHTML = '';

    items.forEach(item => {
        const percent = Math.min(100, Math.round(item.votes / item.goal * 100));

        const card = document.createElement('div');
        card.className = 'card initiative-card';
        card.setAttribute('data-cat', item.category);   // по нему работают фильтры
        card.innerHTML = `
        <div class="card-img"></div>
        <span class="tag">${item.categoryName}</span>
        <h3>${item.name}</h3>
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

/* Detail */

function showInitiativeDetail(id) {
    const item = initiativesData.find(i => i.id === id);
    if (!item) return;

    const percent = Math.min(100, Math.round(item.votes / item.goal * 100));

    const detailsList = Object.entries(item.details)
        .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
        .join('');

    detailCard.innerHTML = `
    <div class="detail-layout">
        <div class="detail-img"></div>
        <span class="tag">${item.categoryName}</span>
        <h2>${item.name}</h2>
        <p class="detail-desc">${item.description}</p>
        <div class="detail-specs">
            <strong>Подробности</strong>
            <ul>${detailsList}</ul>
        </div>
        <div class="progress"><i style="width:${percent}%"></i></div>
        <p class="detail-votes">${item.votes.toLocaleString('ru-RU')} из ${item.goal.toLocaleString('ru-RU')} голосов</p>
        <a class="btn btn-primary btn-block" href="../auth/login.html">Поддержать инициативу</a>
    </div>
    `;

    detailSection.classList.remove('hidden');   // показываем модалку
}

/* Закрытие модалки: крестик и клик по тёмному фону */

closeBtn.addEventListener('click', () => detailSection.classList.add('hidden'));
detailSection.addEventListener('click', (e) => {
    if (e.target === detailSection) detailSection.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', loadInitiatives);
