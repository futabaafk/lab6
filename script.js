// Проверка полей формы регулярными выражениями: ФИО, телефон, почта.
// Подключается только на страницах с формами. Больше JS на сайте нет.

// Регулярные выражения
var reWord  = /^[А-Яа-яЁёӨөҮүҢңA-Za-z-]{2,30}$/;                                       // имя или фамилия (одно слово)
var reFio   = /^[А-Яа-яЁёӨөҮүҢңA-Za-z-]{2,30}( [А-Яа-яЁёӨөҮүҢңA-Za-z-]{2,30}){1,2}$/;    // ФИО: 2-3 слова через пробел
var rePhone = /^(\+996|0)[0-9]{9}$/;                                                   // +996555123456 или 0555123456
var reEmail = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;                        // name@mail.com

// Поля, которые проверяем: [имя поля в форме, регулярка, сообщение об ошибке]
var fields = [
  ['first',    reWord,  'Имя: только буквы, от 2 до 30 символов.'],
  ['last',     reWord,  'Фамилия: только буквы, от 2 до 30 символов.'],
  ['name',     reWord,  'Имя: только буквы, от 2 до 30 символов.'],
  ['fullname', reFio,   'ФИО: введите фамилию и имя (можно с отчеством) через пробел, только буквы.'],
  ['phone',    rePhone, 'Телефон: например +996555123456 или 0555123456.'],
  ['email',    reEmail, 'Почта: введите адрес в формате name@mail.com.']
];

// Вызывается при отправке формы: onsubmit="return checkForm(this)"
function checkForm(form) {
  var msg = form.querySelector('.form-msg');

  for (var i = 0; i < fields.length; i++) {
    var input = form.elements[fields[i][0]];
    if (!input) continue;                         // в этой форме такого поля нет

    var value = input.value.trim();
    if (fields[i][0] === 'phone') {
      value = value.replace(/[ ()-]/g, '');       // убираем пробелы, скобки и дефисы
    }

    if (!fields[i][1].test(value)) {
      msg.className = 'form-msg error';
      msg.textContent = fields[i][2];
      input.focus();
      return false;                               // форму не отправляем
    }
  }

  msg.className = 'form-msg ok';
  msg.textContent = 'Всё верно!';

  var next = form.getAttribute('action');
  if (next) {
    location.href = next;                         // переходим на страницу из action
  } else {
    form.reset();
  }
  return false;
}