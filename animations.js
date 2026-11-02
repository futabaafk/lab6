// Анимации на событиях. JS только добавляет и убирает классы,
// сами анимации описаны в style.css (@keyframes).
//
// События: click, mouseenter, scroll, focus (и submit в script.js)

/* 1. click: нажали на карточку инициативы, она "прижимается" */
document.addEventListener('click', function (e) {
    const card = e.target.closest('.initiative-card');   // карточки создаёт initiatives.js, поэтому ловим клик на документе
    if (card) card.classList.add('pop');
});

/* 2. mouseenter: навели мышь на карточку или блок статистики */
document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
        card.classList.add('glow');
    });
});

document.querySelectorAll('.stat').forEach(function (stat) {
    stat.addEventListener('mouseenter', function () {
        stat.classList.add('bounce');
    });
});

/* 3. scroll: блоки плавно появляются, когда до них доскроллили */
const revealItems = document.querySelectorAll('.section-head, .card, .stat, .vote-card, .list-row, .faq-item, .cta, .timeline li');
revealItems.forEach(function (item) {
    item.classList.add('reveal');                          // сначала прячем
});

function showOnScroll() {
    revealItems.forEach(function (item) {
        if (!item.classList.contains('reveal')) return;    // уже появился
        const top = item.getBoundingClientRect().top;
        if (top < window.innerHeight - 60) {
            item.classList.add('visible');                 // потом показываем
        }
    });
}
window.addEventListener('scroll', showOnScroll);
showOnScroll();                                            // те, что видно сразу при открытии страницы

/* 4. focus: клик в поле формы, вокруг поля расходится волна */
document.querySelectorAll('.input, .textarea, .select').forEach(function (input) {
    input.addEventListener('focus', function () {
        input.classList.add('wave');
    });
});

/* Когда анимация закончилась, убираем класс, чтобы её можно было запустить снова */
const animClasses = ['pop', 'glow', 'bounce', 'wave', 'shake'];
document.addEventListener('animationend', function (e) {
    animClasses.forEach(function (name) {
        e.target.classList.remove(name);
    });
    const stat = e.target.closest('.bounce');              // у статистики анимируется число внутри, а класс стоит на блоке
    if (stat) stat.classList.remove('bounce');
    if (e.animationName === 'fadeUp') {                    // блок уже появился, анимация появления больше не нужна
        e.target.classList.remove('reveal', 'visible');    // иначе она мешала бы свечению и "прижатию"
    }
});
