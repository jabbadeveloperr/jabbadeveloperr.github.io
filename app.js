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
    const pib = (document.getElementById('pib').value || '').trim();
    const address = (document.getElementById('address').value || '').trim();
    const email = (document.getElementById('email').value || '').trim();
    const comment = (document.getElementById('comment').value || '').trim();
    const rawEmails = (document.getElementById('deputy-emails').value || '').trim();
    const emails = rawEmails
      .split(/[\n,;]+/)
      .map(function (e) { return e.trim(); })
      .filter(Boolean);
    const date = new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return { pib, address, email, comment, emails, date };
  }

  function fillTemplate(data) {
    return template
      .replace(/\{\{pib\}\}/g, data.pib)
      .replace(/\{\{address\}\}/g, data.address)
      .replace(/\{\{email\}\}/g, data.email)
      .replace(/\{\{comment\}\}/g, data.comment)
      .replace(/\{\{date\}\}/g, data.date);
  }

  function getSubject(pib) {
    return 'Звернення щодо законопроєкту №14394 від ' + (pib || 'Прізвище Ім\'я');
  }

  function showPreview() {
    const data = getFormData();
    if (!data.pib || !data.email || !data.comment) {
      alert('Заповніть обов\'язкові поля: ПІБ, електронна пошта та персональний коментар.');
      return;
    }
    const body = fillTemplate(data);
    const subject = getSubject(data.pib);

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
    const data = getFormData();
    if (!data.pib || !data.email || !data.comment) {
      alert('Заповніть обов\'язкові поля: ПІБ, електронна пошта та персональний коментар.');
      return;
    }
    if (!data.emails.length) {
      alert('Додайте хоча б одну електронну адресу депутата.');
      return;
    }
    const body = fillTemplate(data);
    const subject = getSubject(data.pib);
    const to = data.emails.map(function (e) { return encodeURIComponent(e); }).join(',');
    const mailto = 'mailto:' + to +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
  }

  function sendViaGmail() {
    if (!window.GOOGLE_CLIENT_ID) {
      alert('Відправка через Gmail не налаштована. Використайте кнопку «Відкрити у поштовому клієнті».');
      return;
    }
    const data = getFormData();
    if (!data.pib || !data.email || !data.comment) {
      alert('Заповніть обов\'язкові поля: ПІБ, електронна пошта та персональний коментар.');
      return;
    }
    if (!data.emails.length) {
      alert('Додайте хоча б одну електронну адресу депутата.');
      return;
    }
    var doSend = function () {
      var token = window.accessToken;
      if (!token) {
        requestGmailToken(function (err) {
          if (err) {
            alert('Помилка авторизації: ' + (err.message || 'невідома'));
            return;
          }
          doSend();
        });
        return;
      }
      var body = fillTemplate(data);
      var subject = getSubject(data.pib);
      var raw = [
      'To: ' + data.emails.join(', '),
      'Subject: ' + subject,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body
      ].join('\r\n');
      var encoded = btoa(unescape(encodeURIComponent(raw)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

      var btn = document.getElementById('send-gmail-btn');
      btn.disabled = true;
      btn.textContent = 'Відправляю…';

      fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + window.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: encoded })
      })
        .then(function (r) {
          if (!r.ok) return r.json().then(function (j) { throw new Error(j.error && j.error.message ? j.error.message : r.statusText); });
          return r.json();
        })
        .then(function () {
          alert('Лист успішно відправлено депутатам.');
        })
        .catch(function (err) {
          alert('Помилка відправки: ' + (err.message || 'невідома помилка'));
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = 'Відправити депутатам (Gmail)';
        });
    };
    doSend();
  }

  function initDeputyEmails() {
    var textarea = document.getElementById('deputy-emails');
    if (textarea && window.DEFAULT_DEPUTY_EMAILS && !textarea.value.trim()) {
      textarea.value = window.DEFAULT_DEPUTY_EMAILS;
    }
  }

  function requestGmailToken(callback) {
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
      callback(new Error('Google OAuth не завантажено'));
      return;
    }
    var tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: window.GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/gmail.send',
      callback: function (tokenResponse) {
        if (tokenResponse && tokenResponse.access_token) {
          window.accessToken = tokenResponse.access_token;
          callback(null);
        } else {
          callback(new Error('Не вдалося отримати доступ'));
        }
      }
    });
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  function initGoogleSignIn() {
    if (!window.GOOGLE_CLIENT_ID) {
      document.getElementById('send-gmail-btn').classList.add('hidden');
      var authSection = document.getElementById('auth-section');
      if (authSection) authSection.classList.add('hidden');
      return;
    }
    if (typeof google === 'undefined' || !google.accounts) {
      setTimeout(initGoogleSignIn, 200);
      return;
    }
    google.accounts.id.initialize({
      client_id: window.GOOGLE_CLIENT_ID,
      callback: function (res) {
        if (res.credential) {
          window.accessToken = null;
          var payload = JSON.parse(atob(res.credential.split('.')[1]));
          document.getElementById('user-name').textContent = 'Увійшов: ' + (payload.name || payload.email);
          document.getElementById('signin-area').classList.add('hidden');
          document.getElementById('signedin-area').classList.remove('hidden');
          document.getElementById('send-gmail-btn').classList.remove('hidden');
        }
      }
    });
    google.accounts.id.renderButton(document.getElementById('google-signin-btn'), {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      locale: 'uk'
    });
  }

  document.getElementById('signout-btn').addEventListener('click', function () {
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }
    window.accessToken = null;
    document.getElementById('signin-area').classList.remove('hidden');
    document.getElementById('signedin-area').classList.add('hidden');
    document.getElementById('send-gmail-btn').classList.add('hidden');
  });

  document.getElementById('preview-btn').addEventListener('click', showPreview);
  document.getElementById('preview-close').addEventListener('click', closePreview);
  document.getElementById('preview-close-backdrop').addEventListener('click', closePreview);
  document.getElementById('send-mailto-btn').addEventListener('click', sendMailto);
  document.getElementById('send-gmail-btn').addEventListener('click', sendViaGmail);

  document.getElementById('preview-modal').addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePreview();
  });

  initDeputyEmails();
  if (window.GOOGLE_CLIENT_ID) {
    initGoogleSignIn();
  }
})();
