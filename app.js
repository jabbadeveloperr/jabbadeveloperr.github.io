(function () {
  'use strict';

  const template = `Народним депутатам та депутаткам України

Громадянин/громадянка України

ПІБ: {{pib}}
Адреса: {{address}}
Електронна пошта: {{email}}

Шановні народні депутати та депутатки!

Прошу вас не підтримувати проєкт Цивільного кодексу України (реєстраційний номер №14394) від 22.01.2026.

Ми живемо у демократичній правовій державі, де права людини – це цінність і головний орієнтир нашого розвитку. Ми обрали цей шлях ще у 2013 році під час Революції Гідності, ми підтримали свій вибір і зараз, у боротьбі проти однієї з найбільш авторитарних держав у світі.

Саме тому вважаю цей законопроєкт неприйнятним для прийняття: він унеможливлює визнання судом факту існування сімейних відносин між людьми однієї статі, що одночасно закриває єдиний юридичний шлях, який дозволяє партнер(к)ам хоч якось захистити свої права в окремих випадках.

Більше того, проєкт повністю ігнорує зобов'язання, які Україна вже мала би виконати в межах вступу до ЄС, оскільки в ньому відсутні положення, які дозволили б людям однієї статі реєструвати свої стосунки.

Попри заявлену «європейську модернізацію», проєкт у нинішній редакції суперечить європейським стандартам і порушує зобов'язання України, які ми як держава взяли на себе в межах вступу до ЄС. А саме, пропоновані зміни до Цивільного кодексу суперечать:

— Європейській конвенції з прав людини;
— практиці Європейського суду з прав людини (зокрема кейс Maymulakhin and Markiv v. Ukraine);
— переговорним вимогам ЄС у межах розділу 23 щодо судової влади та основоположних прав;
— затвердженій Дорожній карті у сфері верховенства права;
— позиціям Європейської комісії та Європейського парламенту (зокрема Резолюції від 9 вересня 2025 року щодо звітів Єврокомісії за 2023–2024 роки про Україну);
— Копенгагенським критеріям вступу до ЄС, до яких належить захист прав людини і які є обов'язковими для держав-кандидатів.

Це не просто стагнація у сфері прав людини чи відсутність прогресу на євроінтеграційному шляху, а фактичний відкат у правовій площині, який викликає серйозне занепокоєння щодо руху України за так званим «грузинським сценарієм» — декларування європейського курсу при одночасному ухваленні законодавства, що суперечить цінностям та праву ЄС.

Зважаючи на це, прошу вас:
— зупинити просування проєкту Цивільного кодексу в нинішній редакції;
— підтримувати проєкт Цивільного кодексу лише після того, як його положення повною мірою відповідатимуть євроінтеграційним зобов'язанням України.

{{comment}}

З повагою,

{{pib}}

Дата: {{date}}`;

  function getFormData() {
    var pib = (document.getElementById('pib').value || '').trim();
    var address = (document.getElementById('address').value || '').trim();
    var email = (document.getElementById('email').value || '').trim();
    var comment = (document.getElementById('comment').value || '').trim();
    var rawEmails = (document.getElementById('deputy-emails').value || '').trim();
    var emails = rawEmails
      .split(/[\n,;]+/)
      .map(function (e) { return e.trim(); })
      .filter(Boolean);
    var date = new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return { pib: pib, address: address, email: email, comment: comment, emails: emails, date: date };
  }

  function fillTemplate(data) {
    return template
      .replace(/\{\{pib\}\}/g, data.pib)
      .replace(/\{\{address\}\}/g, data.address)
      .replace(/\{\{email\}\}/g, data.email)
      .replace(/\{\{comment\}\}/g, data.comment)
      .replace(/\{\{date\}\}/g, data.date);
  }

  function getLetterBody() {
    return (document.getElementById('letter-body').value || '').trim();
  }

  function getSubject(pib) {
    return 'Звернення щодо законопроєкту №14394 від ' + (pib || 'Прізвище Ім\'я');
  }

  function fillTemplateClick() {
    var data = getFormData();
    if (!data.pib || !data.email) {
      alert('Заповніть хоча б ПІБ та електронну пошту перед заповненням шаблону.');
      return;
    }
    document.getElementById('letter-body').value = fillTemplate(data);
  }

  function showPreview() {
    var data = getFormData();
    var body = getLetterBody();
    if (!body) {
      alert('Заповніть текст заяви (натисніть «Заповнити шаблон» або введіть текст самостійно).');
      return;
    }
    var subject = getSubject(data.pib);

    document.getElementById('preview-to').textContent = data.emails.length ? data.emails.join(', ') : '(список пошт порожній)';
    document.getElementById('preview-subject').textContent = subject;
    document.getElementById('preview-body').innerHTML = body.replace(/\n/g, '<br>');

    document.getElementById('preview-modal').classList.remove('hidden');
    document.getElementById('preview-modal').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePreview() {
    document.getElementById('preview-modal').classList.add('hidden');
    document.getElementById('preview-modal').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function sendMailto() {
    var data = getFormData();
    var body = getLetterBody();
    if (!body) {
      alert('Заповніть текст заяви перед відправкою.');
      return;
    }
    if (!data.emails.length) {
      alert('Додайте хоча б одну електронну адресу депутата.');
      return;
    }
    var subject = getSubject(data.pib);
    var to = data.emails.map(function (e) { return encodeURIComponent(e); }).join(',');
    var mailto = 'mailto:' + to +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
  }

  function initDeputyEmails() {
    var textarea = document.getElementById('deputy-emails');
    if (textarea && window.DEFAULT_DEPUTY_EMAILS && !textarea.value.trim()) {
      textarea.value = window.DEFAULT_DEPUTY_EMAILS;
    }
  }

  document.getElementById('fill-template-btn').addEventListener('click', fillTemplateClick);
  document.getElementById('preview-btn').addEventListener('click', showPreview);
  document.getElementById('preview-close').addEventListener('click', closePreview);
  document.getElementById('preview-close-backdrop').addEventListener('click', closePreview);
  document.getElementById('send-mailto-btn').addEventListener('click', sendMailto);

  document.getElementById('preview-modal').addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePreview();
  });

  initDeputyEmails();
})();
