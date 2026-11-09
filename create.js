// CREATE на странице "Предложить инициативу".
// Берём значения из формы, проверяем, сохраняем и переходим к списку.
// Функции getInitiatives, saveInitiatives, validateInitiative, buildInitiative лежат в storage.js

const createForm = document.getElementById('create-form');
const createMsg = createForm.querySelector('.form-msg');

createForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const f = createForm.elements;

    // проблема и решение склеиваем в одно описание
    let description = f['problem'].value.trim();
    if (f['solution'].value.trim()) {
        description += '\n\nРешение: ' + f['solution'].value.trim();
    }

    const values = {
        name: f['title'].value,
        category: f['category'].value,
        district: f['district'].value,
        description: description,
        goal: f['goal'].value,
        author: f['author'].value
    };

    const error = validateInitiative(values);
    if (error) {
        createMsg.className = 'form-msg error';
        createMsg.textContent = error;
        return;
    }

    try {
        const items = await getInitiatives();
        items.push(buildInitiative(items, values));
        saveInitiatives(items);
        location.href = 'initiatives.html';          // показываем обновлённый список
    } catch (error) {
        createMsg.className = 'form-msg error';
        createMsg.textContent = 'Не удалось сохранить, попробуйте ещё раз.';
    }
});
