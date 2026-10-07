const homeworkDb = firebase.firestore();
    const schedule = {
      even: [
        { day: 'Понедельник', date: '1 день', lessons: [
          ['08:30 — 10:00', 'Нет пары', '', ''],
          ['10:15 — 11:45', 'У Физика', 'доц. Широких Т. В.', '521'],
          ['12:00 — 13:30', 'ЛК Водоподготовка на АЭС', 'доц. Любова Т. С.', '529'],
          ['14:00 — 15:30', 'У Водоподготовка на АЭС', 'доц. Любова Т. С.', '529']
        ]},
        { day: 'Вторник', date: '2 день', lessons: [
          ['08:30 — 10:00', 'ЛК Общественная проектная работа «Обучение служением»', 'доц. Нагорная А. Г.', 'А 1'],
          ['10:15 — 11:45', 'У Информационные технологии', 'асс. Овсянникова А. С.', 'А 304'],
          ['12:00 — 13:30', 'У Высшая математика', 'ст. пр. Волкова Ю. Е.', '405'],
          ['14:00 — 15:30', 'Нет пары', '', '']
        ]},
        { day: 'Среда', date: '3 день', lessons: [
          ['08:30 — 10:00', 'ЛК Высшая математика', 'проф. Бобков В. И.', '402'],
          ['10:15 — 11:45', 'ЛК Физическая культура и спорт', 'доц. Соколова Т. М.', 'А 4'],
          ['12:00 — 13:30', 'Нет пары', '', ''],
          ['14:00 — 15:30', 'Нет пары', '', '']
        ]},
        { day: 'Четверг', date: '4 день', lessons: [
          ['08:30 — 10:00', 'У Основы российской государственности', 'ст. пр. Чиков С. С.', '227'],
          ['10:15 — 11:45', 'У Общественная проектная работа «Обучение служением»', 'доц. Нагорная А. Г.', '518'],
          ['12:00 — 13:30', 'ЛК Информационные технологии', 'доц. Кабанова М. А.', '425'],
          ['14:00 — 15:30', 'Элективные курсы по физической культуре и спорту', '', '']
        ]},
        { day: 'Пятница', date: '5 день', lessons: [
          ['08:30 — 10:00', 'ЛБ Инженерная и компьютерная графика', 'доц. Гончарова И. А.', 'Б 209'],
          ['10:15 — 11:45', 'ЛК Инженерная и компьютерная графика', 'доц. Гончарова И. А.', '402'],
          ['12:00 — 13:30', 'Элективные курсы по физической культуре и спорту', '', ''],
          ['14:00 — 15:30', 'Нет пары', '', '']
        ]}
      ],
      odd: [
        { day: 'Понедельник', date: '1 день', lessons: [['08:30 — 10:00', 'ЛК Информационные технологии', 'асс. Овсянникова А. С. · 1 пгр. 3,7,11,15 н. · 2 пгр. 5,9,13,17 н. · 1 и 2 пара', 'А 304'], ['10:15 — 11:45', 'ЛБ Информационные технологии', 'асс. Овсянникова А. С.', 'А 304'], ['12:00 — 13:30', 'У Высшая математика', 'ст. пр. Волкова Ю. Е.', '406'], ['14:00 — 15:30', 'У Общественная проектная работа «Обучение служением»', 'доц. Нагорная А. Г.', '518']]},
        { day: 'Вторник', date: '2 день', lessons: [['08:30 — 10:00', 'ЛК Инженерная и компьютерная графика', 'доц. Гончарова И. А.', '509'], ['10:15 — 11:45', 'У Физика', 'доц. Широких Т. В.', '520'], ['12:00 — 13:30', 'ЛБ Физика', 'доц. Широких Т. В.', 'А 219'], ['14:00 — 15:30', 'Нет пары', '', '']]},
        { day: 'Среда', date: '3 день', lessons: [['08:30 — 10:00', 'ЛК Высшая математика', 'проф. Бобков В. И.', '402'], ['10:15 — 11:45', 'ЛК Физика', 'доц. Широких Т. В.', '402'], ['12:00 — 13:30', 'ЛБ Инженерная и компьютерная графика', 'доц. Гончарова И. А.', '506'], ['14:00 — 15:30', 'Нет пары', '', '']]},
        { day: 'Четверг', date: '4 день', lessons: [['08:30 — 10:00', 'Нет пары', '', ''], ['10:15 — 11:45', 'ЛК Основы российской государственности', 'ст. пр. Чиков С. С.', 'А 1'], ['12:00 — 13:30', 'ЛК Информационные технологии', 'доц. Кабанова М. А.', '425'], ['14:00 — 15:30', 'Элективные курсы по физической культуре и спорту', '', '']]},
        { day: 'Пятница', date: '5 день', lessons: [['08:30 — 10:00', 'У Иностранный язык', 'ст. пр. Близнюк О. А.', '406'], ['10:15 — 11:45', 'У Основы российской государственности', 'ст. пр. Чиков С. С.', 'Б 105'], ['12:00 — 13:30', 'Элективные курсы по физической культуре и спорту', '', ''], ['14:00 — 15:30', 'Нет пары', '', '']]}
      ]
    };
    const homeworkSubjects = [...new Set(Object.values(schedule).flat().flatMap(day => day.lessons
      .map(([, subject]) => subject.replace(/^(ЛК|ЛБ|У)\s+/, ''))
      .filter(subject => subject && subject !== 'Нет пары')))]
      .sort((first, second) => first.localeCompare(second, 'ru'));
    document.querySelector('#homework-subject').innerHTML = homeworkSubjects
      .map(subject => `<option value="${subject}">${subject}</option>`).join('');
    const homeworkList = document.querySelector('#homework-list');
    const homeworkStatus = document.querySelector('#homework-status');
    let latestHomeworkSnapshot = null;
    const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[character]));
    function homeworkState(dateString) {
      const dueDate = new Date(`${dateString}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((dueDate - today) / 86400000);
      if (daysLeft < 0) return { className: 'gray', label: 'Срок уже прошёл' };
      if (daysLeft <= 1) return { className: 'red', label: daysLeft === 0 ? 'Сдать сегодня' : 'Сдать завтра' };
      if (daysLeft <= 7) return { className: 'yellow', label: `Осталось ${daysLeft} дн.` };
      return { className: 'green', label: `Осталось ${daysLeft} дн.` };
    }
    function renderHomework(snapshot) {
      latestHomeworkSnapshot = snapshot;
      const homework = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const canDelete = ['creator', 'admin'].includes(window.portalSession?.role);
      homeworkList.innerHTML = homework.length ? homework.map(item => {
        const state = homeworkState(item.dueDate);
        return `<article class="homework-card ${state.className}">
          <span class="traffic-light" aria-label="${state.label}"></span>
          <div><h3>${escapeHtml(item.subject)}</h3><p>${escapeHtml(item.title)}</p>
          <time datetime="${escapeHtml(item.dueDate)}">${new Date(`${item.dueDate}T00:00:00`).toLocaleDateString('ru-RU')} · ${state.label}</time>
          ${canDelete ? `<button class="homework-delete" type="button" data-homework-id="${escapeHtml(item.id)}">Удалить</button>` : ''}</div>
        </article>`;
      }).join('') : '<div class="subtle">Пока заданий нет. Добавьте первое.</div>';
    }
    homeworkList.addEventListener('click', async event => {
      const deleteButton = event.target.closest('[data-homework-id]');
      if (!deleteButton || !['creator', 'admin'].includes(window.portalSession?.role)) return;
      const homeworkId = deleteButton.dataset.homeworkId;
      if (!window.confirm('Удалить это домашнее задание?')) return;
      deleteButton.disabled = true;
      try {
        await homeworkDb.collection('homework').doc(homeworkId).delete();
        homeworkStatus.textContent = 'Задание удалено.';
      } catch (error) {
        deleteButton.disabled = false;
        homeworkStatus.textContent = 'Не удалось удалить задание. Убедитесь, что ваша роль — администратор или создатель, и проверьте правила Firestore.';
        console.error('Не удалось удалить домашнее задание:', error);
      }
    });
    let stopHomeworkListener = null;
    function subscribeToHomework() {
      if (stopHomeworkListener) return;
      stopHomeworkListener = homeworkDb.collection('homework').orderBy('dueDate').onSnapshot(renderHomework, error => {
        homeworkStatus.textContent = 'Не удалось загрузить общую доску. Проверьте настройки Firestore.';
        console.error('Не удалось загрузить домашние задания:', error);
        stopHomeworkListener = null;
      });
    }
    window.addEventListener('portal-authenticated', subscribeToHomework);
    window.addEventListener('portal-role-changed', () => {
      if (latestHomeworkSnapshot) renderHomework(latestHomeworkSnapshot);
    });
    window.addEventListener('portal-signed-out', () => {
      if (!stopHomeworkListener) return;
      stopHomeworkListener();
      stopHomeworkListener = null;
    });
    if (document.body.classList.contains('is-authenticated')) subscribeToHomework();

    const membersList = document.querySelector('#members-list');
    const membersStatus = document.querySelector('#members-status');
    const roleLabels = {
      creator: 'Создатель',
      admin: 'Администратор',
      moderator: 'Модератор',
      member: 'Участник'
    };
    const creatorUid = 'joCInK8h1odw5hnknvtNk8gOeoC2';
    const assignableRoles = ['member', 'moderator', 'admin'];
    let stopMembersListener = null;
    let latestMembersSnapshot = null;

    function memberPresence(data, now) {
      const seenAt = data.lastSeen?.toDate?.().getTime() || 0;
      const isConnected = data.online === true && now - seenAt <= 90 * 1000;
      if (!isConnected) return { status: 'offline', label: 'Не в сети', sortOrder: 2 };
      const activeAt = data.lastActivityAt?.toDate?.().getTime() || 0;
      if (now - activeAt > 2 * 60 * 1000) return { status: 'idle', label: 'Неактивен на сайте', sortOrder: 1 };
      return { status: 'online', label: 'В сети', sortOrder: 0 };
    }

    function renderMembers(snapshot) {
      latestMembersSnapshot = snapshot;
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const now = Date.now();
      users.sort((first, second) => {
        const firstPresence = memberPresence(first, now);
        const secondPresence = memberPresence(second, now);
        return firstPresence.sortOrder - secondPresence.sortOrder
          || String(first.nickname || '').localeCompare(String(second.nickname || ''), 'ru');
      });
      membersList.replaceChildren();
      if (!users.length) {
        membersStatus.textContent = 'Пока никто не зарегистрировался.';
        return;
      }
      membersStatus.textContent = `${users.length} ${users.length === 1 ? 'участник' : users.length < 5 ? 'участника' : 'участников'} зарегистрировано. Зелёный — активен, жёлтый — сайт открыт без активности, серый — не в сети.`;

      users.forEach(user => {
        const presence = memberPresence(user, now);
        const role = roleLabels[user.role] ? user.role : 'member';
        const card = document.createElement('article');
        card.className = `member-card presence-${presence.status}`;
        card.dataset.userId = user.id;

        const indicator = document.createElement('i');
        indicator.className = `presence-indicator ${presence.status}`;
        indicator.setAttribute('aria-label', presence.label);

        const info = document.createElement('div');
        info.className = 'member-info';
        const name = document.createElement('span');
        name.className = 'member-name';
        name.textContent = user.nickname || 'Участник';
        const status = document.createElement('span');
        status.className = 'member-status';
        status.textContent = presence.label;
        info.append(name, status);
        card.append(indicator, info);

        if (window.portalSession?.role === 'creator' && user.id !== creatorUid) {
          const roleSelect = document.createElement('select');
          roleSelect.className = 'member-role-select';
          roleSelect.setAttribute('aria-label', `Роль пользователя ${user.nickname || 'Участник'}`);
          assignableRoles.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = roleLabels[value];
            roleSelect.appendChild(option);
          });
          roleSelect.value = assignableRoles.includes(role) ? role : 'member';
          roleSelect.addEventListener('change', async () => {
            roleSelect.disabled = true;
            membersStatus.textContent = `Сохраняем роль пользователя ${user.nickname || 'Участник'}…`;
            try {
              await homeworkDb.collection('users').doc(user.id).update({
                role: roleSelect.value,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              });
            } catch (error) {
              console.error('Не удалось изменить роль пользователя:', error);
              membersStatus.textContent = 'Не удалось изменить роль. Проверьте, что вы вошли как Создатель, и опубликуйте свежие правила Firestore.';
              roleSelect.disabled = false;
              roleSelect.value = assignableRoles.includes(role) ? role : 'member';
            }
          });
          card.appendChild(roleSelect);
        } else {
          const roleBadge = document.createElement('span');
          roleBadge.className = 'member-role';
          roleBadge.textContent = roleLabels[role];
          card.appendChild(roleBadge);
        }
        membersList.appendChild(card);
      });
    }

    function refreshMemberPresence() {
      if (!latestMembersSnapshot) return;
      const now = Date.now();
      latestMembersSnapshot.docs.forEach(doc => {
        const presence = memberPresence(doc.data(), now);
        const card = membersList.querySelector(`[data-user-id="${CSS.escape(doc.id)}"]`);
        if (!card) return;
        card.classList.remove('presence-online', 'presence-idle', 'presence-offline');
        card.classList.add(`presence-${presence.status}`);
        const indicator = card.querySelector('.presence-indicator');
        indicator.classList.remove('online', 'idle', 'offline');
        indicator.classList.add(presence.status);
        indicator.setAttribute('aria-label', presence.label);
        card.querySelector('.member-status').textContent = presence.label;
      });
    }

    function subscribeToMembers() {
      if (stopMembersListener) return;
      membersStatus.textContent = 'Загружаем список участников…';
      stopMembersListener = homeworkDb.collection('users').onSnapshot(renderMembers, error => {
        console.error('Не удалось загрузить участников:', error);
        membersStatus.textContent = 'Не удалось загрузить участников. Проверьте правила чтения пользователей в Firestore.';
        stopMembersListener = null;
      });
    }

    window.addEventListener('portal-authenticated', subscribeToMembers);
    window.addEventListener('portal-role-changed', () => {
      if (latestMembersSnapshot) renderMembers(latestMembersSnapshot);
    });
    window.addEventListener('portal-signed-out', () => {
      if (stopMembersListener) stopMembersListener();
      stopMembersListener = null;
      membersList.replaceChildren();
      membersStatus.textContent = 'Войдите, чтобы увидеть список участников.';
    });
    if (document.body.classList.contains('is-authenticated')) subscribeToMembers();
    setInterval(refreshMemberPresence, 30000);

    document.querySelector('#homework-form').addEventListener('submit', async event => {
      event.preventDefault();
      const subject = document.querySelector('#homework-subject').value;
      const titleInput = document.querySelector('#homework-title');
      const dateInput = document.querySelector('#homework-date');
      homeworkStatus.textContent = 'Добавление задания…';
      try {
        await homeworkDb.collection('homework').add({
          subject,
          title: titleInput.value.trim(),
          dueDate: dateInput.value,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: window.portalSession.user.uid
        });
        titleInput.value = '';
        dateInput.value = '';
        homeworkStatus.textContent = 'Задание добавлено на общую доску.';
      } catch (error) {
        homeworkStatus.textContent = 'Не удалось добавить задание. Проверьте правила Firestore.';
        console.error('Не удалось добавить домашнее задание:', error);
      }
    });
    const grid = document.querySelector('#schedule-grid');
    const todayLessons = document.querySelector('#today-lessons');
    const scheduleNow = document.querySelector('#schedule-now');
    const scheduleFinished = document.querySelector('#schedule-finished');
    const fullSchedule = document.querySelector('#full-schedule');
    const scheduleHeading = document.querySelector('#schedule-heading');
    const scheduleDate = document.querySelector('#schedule-date');
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const evenWeekAnchor = Date.UTC(2026, 9, 5);
    function getWeekType(date) {
      const monday = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
      const dayOffset = (new Date(monday).getUTCDay() + 6) % 7;
      const currentWeekMonday = monday - dayOffset * 86400000;
      const weeksFromAnchor = Math.floor((currentWeekMonday - evenWeekAnchor) / (7 * 86400000));
      return weeksFromAnchor % 2 === 0 ? 'even' : 'odd';
    }
    let selectedWeek = getWeekType(new Date());
    let observedCurrentWeek = selectedWeek;
    let renderedTodayState = '';

    function renderWeek(week) {
      grid.innerHTML = schedule[week].map(({ day, date, lessons }) => `
        <article class="day"><div class="day-title"><strong>${day}</strong><span>${date}</span></div>
          ${lessons.map(([time, subject, teacher, room]) => `<div class="lesson"><div class="time">${time}</div>${subject === 'Нет пары' ? '<div class="empty">Нет пары</div>' : `<div class="subject">${subject}</div>${teacher ? `<div class="teacher">${teacher}</div>` : ''}${room ? `<span class="room">${room}</span>` : ''}`}</div>`).join('')}
        </article>`).join('');
    }
    function clockTime(date) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    function countdown(target, now) {
      const totalSeconds = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');
    }
    function scheduledTime(date, timeText) {
      const [hours, minutes] = timeText.split(':').map(Number);
      const result = new Date(date);
      result.setHours(hours, minutes, 0, 0);
      return result;
    }
    function refreshScheduleCountdowns(now) {
      todayLessons.querySelectorAll('[data-countdown-target]').forEach(timer => {
        timer.textContent = countdown(new Date(Number(timer.dataset.countdownTarget)), now);
      });
      const currentTime = scheduleNow.querySelector('[data-current-time]');
      if (currentTime) currentTime.textContent = `Текущее время ${clockTime(now)}`;
    }
    function renderToday(now = new Date()) {
      const weekday = now.getDay();
      const dayName = dayNames[weekday];
      const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      scheduleHeading.textContent = weekday === 0 || weekday === 6 ? 'Сегодня занятий нет' : 'Сегодня';
      scheduleDate.textContent = now.toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });

      if (weekday === 0 || weekday === 6) {
        const stateKey = `${dateKey}:weekend`;
        if (stateKey === renderedTodayState) return;
        renderedTodayState = stateKey;
        scheduleFinished.hidden = true;
        todayLessons.replaceChildren();
        scheduleNow.className = 'schedule-now schedule-now-weekend';
        scheduleNow.innerHTML = '<span class="schedule-now-kicker">Выходной</span><strong>Сегодня занятий нет</strong><span>Отдыхайте и набирайтесь сил!</span>';
        return;
      }

      const currentWeek = getWeekType(now);
      const day = schedule[currentWeek].find(item => item.day === dayName);
      if (!day) {
        const stateKey = `${dateKey}:missing:${currentWeek}`;
        if (stateKey === renderedTodayState) return;
        renderedTodayState = stateKey;
        scheduleFinished.hidden = true;
        todayLessons.replaceChildren();
        scheduleNow.className = 'schedule-now schedule-now-empty';
        scheduleNow.innerHTML = '<strong>Расписание на сегодня не найдено</strong>';
        return;
      }

      const entries = day.lessons.map(([timeRange, subject, teacher, room]) => {
        const [startText, endText] = timeRange.split(' — ');
        return {
          timeRange,
          subject,
          teacher,
          room,
          start: scheduledTime(now, startText),
          end: scheduledTime(now, endText),
          isEmpty: subject === 'Нет пары'
        };
      });
      const actualLessons = entries.filter(entry => !entry.isEmpty);
      const activeLesson = actualLessons.find(entry => now >= entry.start && now < entry.end);
      const nextLesson = actualLessons.find(entry => entry.start > now);
      const previousLesson = [...actualLessons].reverse().find(entry => entry.end <= now);
      const isBreak = !activeLesson && Boolean(previousLesson && nextLesson);
      const currentState = activeLesson
        ? `active:${actualLessons.indexOf(activeLesson)}`
        : nextLesson
          ? `${isBreak ? 'break' : 'upcoming'}:${actualLessons.indexOf(nextLesson)}`
          : 'finished';
      const stateKey = `${dateKey}:${currentWeek}:${currentState}`;
      if (stateKey === renderedTodayState) {
        refreshScheduleCountdowns(now);
        return;
      }
      renderedTodayState = stateKey;
      scheduleFinished.hidden = Boolean(activeLesson || nextLesson);
      todayLessons.replaceChildren();

      if (!activeLesson && !nextLesson) {
        scheduleNow.className = 'schedule-now schedule-now-finished';
        scheduleNow.innerHTML = `<span class="schedule-now-kicker">На сегодня</span><strong>Пары закончились</strong><span data-current-time>Текущее время ${clockTime(now)}</span>`;
      } else if (activeLesson) {
        scheduleNow.className = 'schedule-now schedule-now-active';
        scheduleNow.innerHTML = `<span class="schedule-now-kicker">Сейчас идёт пара</span><strong>${escapeHtml(activeLesson.subject.replace(/^(ЛК|ЛБ|У)\s+/, ''))}</strong><span>До конца пары</span><time data-countdown-target="${activeLesson.end.getTime()}">${countdown(activeLesson.end, now)}</time><small>Закончится в ${activeLesson.end.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</small>`;
      } else if (previousLesson && now >= previousLesson.end) {
        scheduleNow.className = 'schedule-now schedule-now-break';
        scheduleNow.innerHTML = `<span class="schedule-now-kicker">Перемена</span><strong>До следующей пары</strong><time data-countdown-target="${nextLesson.start.getTime()}">${countdown(nextLesson.start, now)}</time><small>Начало в ${nextLesson.start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</small>`;
      } else {
        scheduleNow.className = 'schedule-now schedule-now-upcoming';
        scheduleNow.innerHTML = `<span class="schedule-now-kicker">Следующая пара</span><strong>${escapeHtml(nextLesson.subject.replace(/^(ЛК|ЛБ|У)\s+/, ''))}</strong><span>До начала</span><time data-countdown-target="${nextLesson.start.getTime()}">${countdown(nextLesson.start, now)}</time><small>Начало в ${nextLesson.start.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</small>`;
      }

      entries.forEach(entry => {
        const card = document.createElement('article');
        let stateClass = 'upcoming';
        let stateLabel = 'Дальше по расписанию';
        if (entry.isEmpty) {
          stateClass = 'empty';
          stateLabel = 'Нет пары';
        } else if (activeLesson === entry) {
          stateClass = 'active';
          stateLabel = 'Идёт сейчас';
        } else if (entry.end <= now) {
          stateClass = 'finished';
          stateLabel = 'Пара закончилась';
        } else if (nextLesson === entry) {
          stateClass = 'next';
          stateLabel = 'Следующая пара';
        }
        card.className = `today-lesson ${stateClass}`;

        const time = document.createElement('span');
        time.className = 'today-lesson-time';
        time.textContent = entry.timeRange;
        const content = document.createElement('div');
        content.className = 'today-lesson-content';
        const subject = document.createElement('strong');
        subject.textContent = entry.subject.replace(/^(ЛК|ЛБ|У)\s+/, '');
        const details = document.createElement('span');
        details.className = 'today-lesson-details';
        details.textContent = [entry.teacher, entry.room ? `Ауд. ${entry.room}` : ''].filter(Boolean).join(' · ');
        const status = document.createElement('span');
        status.className = 'today-lesson-status';
        status.textContent = stateLabel;
        content.append(subject, details, status);
        card.append(time, content);

        if (!entry.isEmpty && (activeLesson === entry || nextLesson === entry)) {
          const timer = document.createElement('span');
          timer.className = 'today-lesson-countdown';
          timer.dataset.countdownTarget = String((activeLesson === entry ? entry.end : entry.start).getTime());
          timer.textContent = countdown(activeLesson === entry ? entry.end : entry.start, now);
          card.appendChild(timer);
        }
        todayLessons.appendChild(card);
      });
    }

    renderWeek(selectedWeek);
    document.querySelectorAll('[data-week]').forEach(button => {
      button.classList.toggle('active', button.dataset.week === selectedWeek);
    });
    renderToday();
    document.querySelector('#toggle-full-schedule').addEventListener('click', event => {
      const showFull = fullSchedule.hidden;
      fullSchedule.hidden = !showFull;
      event.currentTarget.setAttribute('aria-expanded', String(showFull));
      event.currentTarget.textContent = showFull ? 'Скрыть полное расписание' : 'Полное расписание';
      if (showFull) fullSchedule.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.querySelectorAll('[data-week]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-week]').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      selectedWeek = button.dataset.week;
      renderWeek(selectedWeek);
    }));
    setInterval(() => {
      const now = new Date();
      const currentWeek = getWeekType(now);
      if (currentWeek !== observedCurrentWeek) {
        observedCurrentWeek = currentWeek;
        selectedWeek = currentWeek;
        renderWeek(selectedWeek);
        document.querySelectorAll('[data-week]').forEach(button => {
          button.classList.toggle('active', button.dataset.week === selectedWeek);
        });
      }
      renderToday(now);
      refreshScheduleCountdowns(now);
    }, 1000);
    const students = [
      'Богданов Иван Максимович', 'Денисов Александр Евгеньевич', 'Елисеев Сергей Владимирович',
      'Зайцев Кирилл Александрович', 'Зайцев Никита Александрович', 'Калачёв Егор Семёнович',
      'Каменьков Вячеслав Владиславович', 'Канабеев Даниил Александрович', 'Кирпа Мария Григорьевна',
      'Климова Милена Витальевна', 'Ковалев Степан Сергеевич', 'Кривкин Иван Дмитриевич',
      'Купреева Полина Сергеевна', 'Ларченков Валерий Валерьевич', 'Максимова Евгения Андреевна',
      'Молодьков Данила Иванович', 'Никитин Даниил Иванович', 'Носенков Владислав Владимирович',
      'Окунева Виктория Сергеевна', 'Орлова Милана Олеговна', 'Пархомец Дмитрий Александрович',
      'Петрушина Мария Михайловна', 'Пожилов Александр Дмитриевич', 'Скутенков Владислав Дмитриевич',
      'Спацкий Фёдор Андреевич', 'Филенкова Ксения Александровна'
    ];
    document.querySelector('#student-list').innerHTML = students.map(name => `<li>${name}</li>`).join('');
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const dutyByMonth = {};
    let studentIndex = 0;
    for (let date = new Date(2026, 8, 1); date <= new Date(2027, 6, 1); date.setDate(date.getDate() + 1)) {
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!dutyByMonth[key]) dutyByMonth[key] = { title: `${monthNames[date.getMonth()]} ${date.getFullYear()}`, rows: [] };
      dutyByMonth[key].rows.push({ date: new Date(date), student: students[studentIndex % students.length] });
      studentIndex++;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    document.querySelector('#duty-months').innerHTML = Object.values(dutyByMonth).map(month => `
      <section class="month"><h4>${month.title}</h4>${month.rows.map(row => {
        const isToday = row.date.getTime() === today.getTime();
        return `<div class="duty-row${isToday ? ' today' : ''}"><time>${String(row.date.getDate()).padStart(2, '0')}.${String(row.date.getMonth() + 1).padStart(2, '0')}</time><span>${isToday ? '<i class="duty-dot" aria-label="Дежурство сегодня"></i>' : ''}${row.student}</span></div>`;
      }).join('')}</section>
    `).join('');
    const menu = document.querySelector('#site-menu');
    const menuToggle = document.querySelector('#menu-toggle');
    menuToggle.addEventListener('click', () => {
      const isOpen = !menu.hidden;
      menu.hidden = isOpen;
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) document.querySelector('#menu-close').focus();
    });
    document.querySelector('#menu-close').addEventListener('click', () => {
      menu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    });
    document.addEventListener('click', event => {
      if (!menu.hidden && !event.target.closest('.menu-wrap')) {
        menu.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) {
        menu.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
    document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.tab);
      if (!target) return;
      document.querySelectorAll('.tab').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === button.dataset.tab);
      });
      document.querySelectorAll('.panel').forEach(item => item.classList.remove('active'));
      target.classList.add('active');
      menu.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
      if (button.dataset.tab === 'statistics') void window.loadLeaderboard();
    }));
    const imageModal = document.querySelector('#image-modal');
    const modalImage = imageModal.querySelector('img');
    function closeImageModal() {
      imageModal.classList.remove('open');
      modalImage.removeAttribute('src');
    }
    document.querySelectorAll('.photo-carousel img').forEach(image => image.addEventListener('click', () => {
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      imageModal.classList.add('open');
    }));
    imageModal.addEventListener('click', event => {
      if (event.target === imageModal || event.target.closest('.modal-close')) closeImageModal();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeImageModal();
    });
    document.querySelectorAll('.fullscreen-button').forEach(button => button.addEventListener('click', async () => {
      const video = button.parentElement.querySelector('video');
      if (video.requestFullscreen) await video.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    }));
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
      const track = carousel.querySelector('.media-track');
      const slides = [...carousel.querySelectorAll('.media-tile')];
      const dots = carousel.querySelector('.carousel-dots');
      let current = 0;
      dots.innerHTML = slides.map((_, index) => `<button class="carousel-dot${index === 0 ? ' active' : ''}" type="button" aria-label="Открыть элемент ${index + 1}"></button>`).join('');
      const dotButtons = [...dots.children];
      function showSlide(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dotButtons.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === current));
        slides.forEach((slide, slideIndex) => {
          const video = slide.querySelector('video');
          if (video && slideIndex !== current) video.pause();
        });
      }
      carousel.querySelector('.previous').addEventListener('click', () => showSlide(current - 1));
      carousel.querySelector('.next').addEventListener('click', () => showSlide(current + 1));
      dotButtons.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
      let touchStartX = 0;
      carousel.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
      carousel.addEventListener('touchend', event => {
        const distance = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(distance) > 45) showSlide(current + (distance < 0 ? 1 : -1));
      }, { passive: true });
    });

    const helpWidget = document.querySelector('#help-widget');
    const helpPanel = document.querySelector('#help-panel');
    const helpLauncher = document.querySelector('#help-launcher');
    const feedbackForm = document.querySelector('#feedback-form');
    const feedbackMessage = document.querySelector('#feedback-message');
    const feedbackStatus = document.querySelector('#feedback-status');
    const feedbackSubmit = document.querySelector('#feedback-submit');
    const chatMessages = document.querySelector('#chat-messages');
    const chatLoadOlder = document.querySelector('#chat-load-older');
    const chatTypingIndicator = document.querySelector('#chat-typing-indicator');
    const chatForm = document.querySelector('#chat-form');
    const chatMessage = document.querySelector('#chat-message');
    const chatStatus = document.querySelector('#chat-status');
    const chatSubmit = document.querySelector('#chat-submit');
    const feedbackInbox = document.querySelector('#feedback-inbox-list');
    const feedbackInboxStatus = document.querySelector('#feedback-inbox-status');
    const feedbackFilter = document.querySelector('#feedback-filter');
    const feedbackInboxButton = document.querySelector('#open-feedback-inbox');
    const chatFullscreenToggle = document.querySelector('#chat-fullscreen-toggle');
    let feedbackType = '';
    let stopChatListener = null;
    let stopChatMuteListener = null;
    let stopChatTypingListener = null;
    let stopFeedbackListener = null;
    let chatSending = false;
    let loadingOlderMessages = false;
    let hasMoreChatHistory = false;
    let chatHistoryCursor = null;
    let olderChatDocs = [];
    let latestChatDocs = [];
    let latestFeedbackDocs = [];
    let chatMuteRecords = new Map();
    let typingRecords = new Map();
    let typingWriteTimer = 0;
    let typingExpiryTimer = 0;
    let lastTypingWriteAt = 0;
    let typingWriteInProgress = false;
    let typingNickname = '';

    function hasFeedbackAccess() {
      return ['creator', 'admin'].includes(window.portalSession?.role);
    }

    function canModerateChat() {
      return ['creator', 'admin', 'moderator'].includes(window.portalSession?.role);
    }

    function updateModerationAccess() {
      feedbackInboxButton.hidden = !hasFeedbackAccess();
      if (!hasFeedbackAccess() && !document.querySelector('#feedback-inbox').hidden) {
        setHelpView('help-options');
      }
      if (!canModerateChat()) {
        document.querySelectorAll('.chat-message-tools').forEach(tools => tools.remove());
      } else if (latestChatDocs.length && !document.querySelector('#help-chat').hidden) {
        renderChatMessages(latestChatDocs);
      }
    }

    function updateOwnMuteStatus() {
      const user = window.portalSession?.user;
      if (!user) return;
      const until = activeMuteFor(user.uid);
      chatMessage.disabled = Boolean(until);
      chatSubmit.disabled = Boolean(until) || chatSending;
      if (until) {
        chatStatus.textContent = `Вы временно не можете писать в чат до ${until.toLocaleString('ru-RU', {
          hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
        })}.`;
        chatStatus.className = 'help-status error muted';
      } else if (chatStatus.classList.contains('muted')) {
        chatStatus.textContent = 'Enter — отправить, Shift+Enter — новая строка.';
        chatStatus.className = 'help-status';
      }
    }

    function formatChatTimestamp(timestamp) {
      if (!timestamp?.toDate) return 'Только что';
      return timestamp.toDate().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    function activeMuteFor(uid) {
      const mutedUntil = chatMuteRecords.get(uid)?.mutedUntil?.toDate?.();
      return mutedUntil && mutedUntil.getTime() > Date.now() ? mutedUntil : null;
    }

    function appendModerationTools(article, item) {
      const ownMessage = item.uid === window.portalSession.user.uid;
      const canModerateTarget = canModerateChat() && !ownMessage
        && item.uid !== 'joCInK8h1odw5hnknvtNk8gOeoC2';
      if (!ownMessage && !canModerateTarget) return;
      const tools = document.createElement('div');
      tools.className = 'chat-message-tools';
      if (canModerateTarget) {
        const muteUntil = activeMuteFor(item.uid);
        const muteButton = document.createElement('button');
        if (muteUntil) {
          muteButton.type = 'button';
          muteButton.className = 'chat-unmute-user';
          muteButton.dataset.chatAction = 'unmute';
          muteButton.dataset.uid = item.uid;
          muteButton.dataset.nickname = item.nickname || 'Участник';
          muteButton.textContent = 'Снять мут';
          const expiry = document.createElement('span');
          expiry.className = 'chat-mute-expiry';
          expiry.textContent = `до ${muteUntil.toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}`;
          tools.append(muteButton, expiry);
        } else {
          const duration = document.createElement('select');
          duration.className = 'chat-mute-duration';
          duration.setAttribute('aria-label', `Срок мута для ${item.nickname || 'участника'}`);
          [
            ['5', '5 минут'], ['15', '15 минут'], ['60', '1 час'],
            ['1440', '1 день'], ['10080', '7 дней']
          ].forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            duration.appendChild(option);
          });
          muteButton.type = 'button';
          muteButton.dataset.chatAction = 'mute';
          muteButton.dataset.uid = item.uid;
          muteButton.dataset.nickname = item.nickname || 'Участник';
          muteButton.textContent = 'Мут';
          tools.append(duration, muteButton);
        }
      }

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'chat-delete-message';
      deleteButton.dataset.chatAction = 'delete';
      deleteButton.dataset.messageId = item.id;
      deleteButton.textContent = ownMessage ? 'Удалить своё сообщение' : 'Удалить';
      tools.appendChild(deleteButton);
      article.appendChild(tools);
    }

    function setHelpView(view) {
      document.querySelectorAll('.help-view').forEach(item => {
        item.hidden = item.id !== view;
      });
      if (view !== 'help-chat') exitChatFullscreen();
      if (view === 'help-chat') startChatListener();
      else stopChatSubscription();
      if (view === 'feedback-inbox') startFeedbackListener();
      else stopFeedbackSubscription();
      if (view === 'help-feedback') feedbackMessage.focus();
      if (view === 'help-chat') chatMessage.focus();
    }

    function setChatFullscreen(expanded) {
      helpWidget.classList.toggle('chat-fullscreen', expanded);
      document.body.classList.toggle('chat-fullscreen-open', expanded);
      chatFullscreenToggle.setAttribute('aria-pressed', String(expanded));
      chatFullscreenToggle.setAttribute(
        'aria-label',
        expanded ? 'Свернуть чат' : 'Открыть чат на весь экран'
      );
      chatFullscreenToggle.textContent = expanded ? '↙' : '⛶';
    }

    function exitChatFullscreen() {
      setChatFullscreen(false);
    }

    function stopFeedbackSubscription() {
      if (stopFeedbackListener) stopFeedbackListener();
      stopFeedbackListener = null;
    }

    function renderFeedbackInbox() {
      const typeFilter = feedbackFilter.value;
      const entries = latestFeedbackDocs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => typeFilter === 'all' || item.type === typeFilter);
      feedbackInbox.replaceChildren();
      if (!entries.length) {
        feedbackInboxStatus.textContent = typeFilter === 'all'
          ? 'Обращений пока нет.'
          : 'В этой категории обращений пока нет.';
        feedbackInboxStatus.className = 'help-status';
        return;
      }
      feedbackInboxStatus.textContent = `Показано обращений: ${entries.length}`;
      feedbackInboxStatus.className = 'help-status';
      entries.forEach(item => {
        const entry = document.createElement('article');
        entry.className = 'feedback-entry';
        const heading = document.createElement('div');
        heading.className = 'feedback-entry-heading';
        const type = document.createElement('strong');
        type.textContent = item.type === 'complaint' ? 'Жалоба по сайту' : 'Предложение по улучшению';
        const createdAt = document.createElement('time');
        const date = item.createdAt?.toDate?.();
        if (date) {
          createdAt.dateTime = date.toISOString();
          createdAt.textContent = formatChatTimestamp(item.createdAt);
        } else {
          createdAt.textContent = 'Время не указано';
        }
        heading.append(type, createdAt);
        const author = document.createElement('p');
        author.className = 'feedback-entry-author';
        author.textContent = `От: ${item.nickname || 'Участник'}`;
        const message = document.createElement('p');
        message.className = 'feedback-entry-message';
        message.textContent = item.message || '';
        const deleteButton = document.createElement('button');
        deleteButton.className = 'feedback-entry-delete';
        deleteButton.type = 'button';
        deleteButton.dataset.feedbackId = item.id;
        deleteButton.textContent = 'Удалить обращение';
        entry.append(heading, author, message, deleteButton);
        feedbackInbox.appendChild(entry);
      });
    }

    function startFeedbackListener() {
      if (stopFeedbackListener || !hasFeedbackAccess()
        || !window.portalSession?.user) return;
      feedbackInboxStatus.textContent = 'Загрузка обращений…';
      feedbackInboxStatus.className = 'help-status';
      stopFeedbackListener = window.portalSession.db.collection('siteFeedback')
        .orderBy('createdAt', 'desc').limit(100)
        .onSnapshot(snapshot => {
          latestFeedbackDocs = snapshot.docs;
          renderFeedbackInbox();
        }, error => {
          console.error('Не удалось загрузить обращения:', error);
          feedbackInboxStatus.textContent = error.code === 'permission-denied'
            ? 'Просматривать обращения могут только создатель и админ.'
            : 'Не удалось загрузить обращения. Проверьте подключение и правила Firestore.';
          feedbackInboxStatus.className = 'help-status error';
          stopFeedbackSubscription();
        });
    }

    function stopChatSubscription() {
      if (stopChatListener) stopChatListener();
      stopChatListener = null;
      if (stopChatMuteListener) stopChatMuteListener();
      stopChatMuteListener = null;
      if (stopChatTypingListener) stopChatTypingListener();
      stopChatTypingListener = null;
      if (typingWriteTimer) clearTimeout(typingWriteTimer);
      if (typingExpiryTimer) clearInterval(typingExpiryTimer);
      typingWriteTimer = 0;
      typingExpiryTimer = 0;
      typingRecords.clear();
      updateTypingIndicator();
      void clearOwnTypingStatus();
    }

    async function clearOwnTypingStatus() {
      const user = window.portalSession?.user;
      if (!user) return;
      try {
        await window.portalSession.db.collection('chatTyping').doc(user.uid).delete();
      } catch (error) {
        if (error.code !== 'permission-denied' && error.code !== 'not-found') {
          console.error('Не удалось убрать статус набора текста:', error);
        }
      }
    }

    function updateTypingIndicator() {
      const now = Date.now();
      const names = [...new Set([...typingRecords.values()]
        .filter(record => record.uid !== window.portalSession?.user?.uid
          && record.expiresAt?.toDate?.().getTime() > now)
        .map(record => record.nickname)
        .filter(Boolean))];
      chatTypingIndicator.textContent = names.length > 1
        ? 'Несколько человек печатает сообщение…'
        : names.length === 1
          ? `${names[0]} печатает сообщение…`
          : '';
    }

    async function writeTypingStatus() {
      const user = window.portalSession?.user;
      if (!user || !chatMessage.value.trim() || typingWriteInProgress
        || document.querySelector('#help-chat').hidden || activeMuteFor(user.uid)) return;
      typingWriteInProgress = true;
      try {
        if (!typingNickname) {
          const profile = await window.portalSession.db.collection('users').doc(user.uid).get();
          typingNickname = profile.data()?.nickname || '';
        }
        if (!typingNickname) return;
        await window.portalSession.db.collection('chatTyping').doc(user.uid).set({
          uid: user.uid,
          nickname: typingNickname,
          expiresAt: firebase.firestore.Timestamp.fromDate(new Date(Date.now() + 10000))
        });
        lastTypingWriteAt = Date.now();
      } catch (error) {
        console.error('Не удалось обновить статус набора текста:', error);
      } finally {
        typingWriteInProgress = false;
      }
    }

    function scheduleTypingStatus() {
      if (!chatMessage.value.trim()) {
        if (typingWriteTimer) clearTimeout(typingWriteTimer);
        typingWriteTimer = 0;
        void clearOwnTypingStatus();
        return;
      }
      if (typingWriteTimer) clearTimeout(typingWriteTimer);
      const wait = Math.max(500, 3000 - (Date.now() - lastTypingWriteAt));
      typingWriteTimer = setTimeout(() => {
        typingWriteTimer = 0;
        void writeTypingStatus();
      }, wait);
    }

    function renderChatMessages(latestDocs, preserveScroll = false) {
      const previousHeight = chatMessages.scrollHeight;
      const previousTop = chatMessages.scrollTop;
      const wasNearBottom = previousHeight - previousTop - chatMessages.clientHeight < 70;
      const documents = new Map([...olderChatDocs, ...latestDocs].map(doc => [doc.id, doc]));
      const messages = [...documents.values()].sort((first, second) => {
        const firstTime = first.data().createdAt?.toMillis?.() || 0;
        const secondTime = second.data().createdAt?.toMillis?.() || 0;
        return firstTime - secondTime;
      });
      chatMessages.replaceChildren();
      if (!messages.length) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'chat-placeholder';
        emptyMessage.textContent = 'Чат пока пуст. Напишите первое сообщение!';
        chatMessages.appendChild(emptyMessage);
      }
      messages.forEach(doc => {
        const item = { id: doc.id, ...doc.data() };
        const article = document.createElement('article');
        article.className = `chat-message${item.uid === window.portalSession.user.uid ? ' mine' : ''}`;
        const meta = document.createElement('div');
        meta.className = 'chat-message-meta';
        const sender = document.createElement('strong');
        sender.textContent = item.nickname || 'Участник';
        const time = document.createElement('time');
        const timestamp = item.createdAt?.toDate?.();
        if (timestamp) {
          time.dateTime = timestamp.toISOString();
          time.textContent = timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        } else {
          time.textContent = 'Отправляется…';
        }
        const text = document.createElement('p');
        text.className = 'chat-message-text';
        text.textContent = item.text || '';
        meta.append(sender, time);
        article.append(meta, text);
        appendModerationTools(article, item);
        chatMessages.appendChild(article);
      });
      chatLoadOlder.hidden = !hasMoreChatHistory;
      if (preserveScroll) chatMessages.scrollTop = previousTop + chatMessages.scrollHeight - previousHeight;
      else if (wasNearBottom) chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function startChatListener() {
      if (stopChatListener || !window.portalSession?.user) return;
      chatMessages.innerHTML = '<p class="chat-placeholder">Загружаем сообщения…</p>';
      stopChatListener = window.portalSession.db.collection('chatMessages')
        .orderBy('createdAt', 'asc').limitToLast(50)
        .onSnapshot(snapshot => {
          if (!olderChatDocs.length) {
            chatHistoryCursor = snapshot.docs[0] || null;
            hasMoreChatHistory = snapshot.docs.length === 50;
          }
          latestChatDocs = snapshot.docs;
          renderChatMessages(latestChatDocs);
        }, error => {
          console.error('Не удалось загрузить сообщения чата:', error);
          chatMessages.innerHTML = '<p class="chat-placeholder">Не удалось загрузить чат. Проверьте подключение и правила Firestore.</p>';
          stopChatSubscription();
        });
      stopChatMuteListener = window.portalSession.db.collection('chatMutes').onSnapshot(snapshot => {
        chatMuteRecords = new Map(snapshot.docs.map(doc => [doc.id, doc.data()]));
        renderChatMessages(latestChatDocs);
          updateOwnMuteStatus();
      }, error => {
        console.error('Не удалось загрузить список блокировок чата:', error);
        chatStatus.textContent = 'Не удалось загрузить статусы ограничений чата.';
        chatStatus.className = 'help-status error';
      });
      stopChatTypingListener = window.portalSession.db.collection('chatTyping').onSnapshot(snapshot => {
        typingRecords = new Map(snapshot.docs.map(doc => [doc.id, doc.data()]));
        updateTypingIndicator();
      }, error => {
        console.error('Не удалось загрузить индикаторы набора текста:', error);
      });
      typingExpiryTimer = setInterval(() => {
        updateTypingIndicator();
        updateOwnMuteStatus();
      }, 1000);
    }
    chatLoadOlder.addEventListener('click', async () => {
      if (!chatHistoryCursor || loadingOlderMessages || !window.portalSession?.user) return;
      loadingOlderMessages = true;
      chatLoadOlder.disabled = true;
      chatLoadOlder.textContent = 'Загружаем…';
      try {
        const olderSnapshot = await window.portalSession.db.collection('chatMessages')
          .orderBy('createdAt', 'asc').endBefore(chatHistoryCursor).limitToLast(50).get();
        olderChatDocs = [...olderSnapshot.docs, ...olderChatDocs];
        if (olderSnapshot.docs.length) chatHistoryCursor = olderSnapshot.docs[0];
        hasMoreChatHistory = olderSnapshot.docs.length === 50;
        renderChatMessages(latestChatDocs, true);
      } catch (error) {
        console.error('Не удалось загрузить предыдущие сообщения:', error);
        chatStatus.textContent = 'Не удалось загрузить историю. Проверьте подключение и правила Firestore.';
        chatStatus.className = 'help-status error';
      } finally {
        loadingOlderMessages = false;
        chatLoadOlder.disabled = false;
        chatLoadOlder.textContent = 'Показать предыдущие сообщения';
      }
    });

    helpLauncher.addEventListener('click', () => {
      const open = helpPanel.hidden;
      helpPanel.hidden = !open;
      helpLauncher.setAttribute('aria-expanded', String(open));
      if (open) {
        const activeView = document.querySelector('.help-view:not([hidden])');
        if (!activeView) setHelpView('help-options');
        else if (activeView.id === 'help-chat') startChatListener();
      }
      if (!open) stopChatSubscription();
    });
    document.querySelector('#help-close').addEventListener('click', () => {
      helpPanel.hidden = true;
      exitChatFullscreen();
      helpLauncher.setAttribute('aria-expanded', 'false');
      stopChatSubscription();
      stopFeedbackSubscription();
      helpLauncher.focus();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !helpPanel.hidden) {
        if (helpWidget.classList.contains('chat-fullscreen')) {
          exitChatFullscreen();
          return;
        }
        helpPanel.hidden = true;
        helpLauncher.setAttribute('aria-expanded', 'false');
        stopChatSubscription();
        stopFeedbackSubscription();
        helpLauncher.focus();
      }
    });
    document.querySelectorAll('[data-help-view]').forEach(button => button.addEventListener('click', () => {
      const view = button.dataset.helpView;
      if (view === 'chat') {
        setHelpView('help-chat');
      } else if (view === 'feedback-inbox') {
        if (!hasFeedbackAccess()) {
          feedbackInboxStatus.textContent = 'Просматривать обращения могут только создатель и админ.';
          feedbackInboxStatus.className = 'help-status error';
          return;
        }
        setHelpView('feedback-inbox');
      } else {
        feedbackType = view;
        document.querySelector('#feedback-heading').textContent = view === 'suggestion'
          ? 'Предложение по улучшению'
          : 'Жалоба по сайту';
        feedbackStatus.textContent = '';
        feedbackStatus.className = 'help-status';
        feedbackMessage.value = '';
        setHelpView('help-feedback');
      }
    }));
    document.querySelectorAll('[data-help-back]').forEach(button => button.addEventListener('click', () => {
      setHelpView('help-options');
    }));
    feedbackInboxButton.hidden = !hasFeedbackAccess();
    chatFullscreenToggle.addEventListener('click', () => {
      setChatFullscreen(!helpWidget.classList.contains('chat-fullscreen'));
    });
    helpWidget.addEventListener('click', event => {
      if (event.target === helpWidget && helpWidget.classList.contains('chat-fullscreen')) {
        exitChatFullscreen();
      }
    });
    chatMessages.addEventListener('click', async event => {
      const actionButton = event.target.closest('[data-chat-action]');
      if (!actionButton) return;
      const { chatAction, messageId, uid } = actionButton.dataset;
      if (chatAction === 'delete') {
        const authorIsCurrentUser = actionButton.closest('.chat-message')?.classList.contains('mine');
        if (!authorIsCurrentUser && !canModerateChat()) return;
        if (!window.confirm('Удалить это сообщение из чата?')) return;
        actionButton.disabled = true;
        try {
          await window.portalSession.db.collection('chatMessages').doc(messageId).delete();
        } catch (error) {
          console.error('Не удалось удалить сообщение чата:', error);
          chatStatus.textContent = error.code === 'permission-denied'
            ? 'Firebase запретил удаление. Проверьте, что правила Firestore опубликованы.'
            : 'Не удалось удалить сообщение.';
          chatStatus.className = 'help-status error';
        } finally {
          actionButton.disabled = false;
        }
        return;
      }
      if (!canModerateChat()) return;
      if (!uid || uid === window.portalSession?.user?.uid
        || uid === 'joCInK8h1odw5hnknvtNk8gOeoC2') return;
      actionButton.disabled = true;
      try {
        const muteRef = window.portalSession.db.collection('chatMutes').doc(uid);
        if (chatAction === 'unmute') {
          await muteRef.delete();
          chatStatus.textContent = `Ограничение для ${actionButton.dataset.nickname || 'участника'} снято.`;
        } else if (chatAction === 'mute') {
          const minutes = Number(actionButton.closest('.chat-message-tools')
            .querySelector('.chat-mute-duration').value);
          if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 10080) {
            throw new Error('Выбран некорректный срок ограничения.');
          }
          const target = await window.portalSession.db.collection('users').doc(uid).get();
          const nickname = target.data()?.nickname;
          if (!target.exists || !nickname) throw new Error('Профиль участника не найден.');
          const mutedUntil = new Date(Date.now() + minutes * 60000);
          await muteRef.set({
            uid,
            nickname,
            mutedUntil: firebase.firestore.Timestamp.fromDate(mutedUntil),
            mutedBy: window.portalSession.user.uid,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          chatStatus.textContent = `${nickname} ограничен в чате до ${mutedUntil.toLocaleString('ru-RU', {
            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
          })}.`;
        }
        chatStatus.className = 'help-status success';
      } catch (error) {
        console.error('Не удалось изменить ограничение чата:', error);
        chatStatus.textContent = error.code === 'permission-denied'
          ? 'Firebase запретил изменение. Проверьте, что правила Firestore опубликованы.'
          : error.message || 'Не удалось изменить ограничение чата.';
        chatStatus.className = 'help-status error';
      } finally {
        actionButton.disabled = false;
      }
    });
    feedbackFilter.addEventListener('change', renderFeedbackInbox);
    feedbackInbox.addEventListener('click', async event => {
      const deleteButton = event.target.closest('[data-feedback-id]');
      if (!deleteButton || !hasFeedbackAccess()) return;
      if (!window.confirm('Удалить это обращение? Восстановить его будет нельзя.')) return;
      deleteButton.disabled = true;
      try {
        await window.portalSession.db.collection('siteFeedback')
          .doc(deleteButton.dataset.feedbackId).delete();
      } catch (error) {
        console.error('Не удалось удалить обращение:', error);
        feedbackInboxStatus.textContent = error.code === 'permission-denied'
          ? 'Firebase запретил удаление. Проверьте, что правила Firestore опубликованы.'
          : 'Не удалось удалить обращение. Попробуйте ещё раз.';
        feedbackInboxStatus.className = 'help-status error';
        deleteButton.disabled = false;
      }
    });
    chatMessage.addEventListener('input', scheduleTypingStatus);
    chatMessage.addEventListener('blur', () => {
      if (typingWriteTimer) clearTimeout(typingWriteTimer);
      typingWriteTimer = 0;
      void clearOwnTypingStatus();
    });
    feedbackForm.addEventListener('submit', async event => {
      event.preventDefault();
      const message = feedbackMessage.value.trim();
      if (message.length < 5 || message.length > 2000) {
        feedbackStatus.textContent = 'Сообщение должно содержать от 5 до 2000 символов.';
        feedbackStatus.className = 'help-status error';
        return;
      }
      if (!window.portalSession?.user) {
        feedbackStatus.textContent = 'Войдите в аккаунт, чтобы отправить сообщение.';
        feedbackStatus.className = 'help-status error';
        return;
      }
      feedbackSubmit.disabled = true;
      feedbackStatus.textContent = 'Сохраняем обращение…';
      feedbackStatus.className = 'help-status';
      let saved = false;
      try {
        const profile = await window.portalSession.db.collection('users')
          .doc(window.portalSession.user.uid).get();
        const nickname = profile.data()?.nickname;
        if (!profile.exists || !nickname) throw new Error('Не удалось загрузить ваш профиль.');
        await window.portalSession.db.collection('siteFeedback').add({
          type: feedbackType,
          message,
          uid: window.portalSession.user.uid,
          nickname,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        saved = true;
        feedbackMessage.value = '';
        const endpoint = window.portalFeedbackConfig?.endpoint;
        if (!endpoint) {
          feedbackStatus.textContent = 'Обращение сохранено. Отправка в Telegram будет доступна после настройки DataBase.';
          feedbackStatus.className = 'help-status success';
          return;
        }
        const idToken = await window.portalSession.user.getIdToken();
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ type: feedbackType, message })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Не удалось отправить сообщение.');
        feedbackStatus.textContent = 'Обращение сохранено и отправлено. Спасибо!';
        feedbackStatus.className = 'help-status success';
      } catch (error) {
        console.error(saved ? 'Не удалось переслать сохранённое обращение в Telegram:' : 'Не удалось сохранить обращение:', error);
        feedbackStatus.textContent = saved
          ? `Обращение сохранено, но не отправлено в Telegram: ${error.message || 'проверьте настройки Worker.'}`
          : error.code === 'permission-denied'
            ? 'Firebase запретил сохранить обращение. Проверьте опубликованные правила Firestore.'
            : error.message || 'Не удалось сохранить обращение. Проверьте подключение и попробуйте ещё раз.';
        feedbackStatus.className = 'help-status error';
      } finally {
        feedbackSubmit.disabled = false;
      }
    });
    chatForm.addEventListener('submit', async event => {
      event.preventDefault();
      const message = chatMessage.value.trim();
      const user = window.portalSession?.user;
      if (!message || message.length > 1000 || chatSending) return;
      if (!user) {
        chatStatus.textContent = 'Войдите в аккаунт, чтобы писать в чат.';
        chatStatus.className = 'help-status error';
        return;
      }
      if (activeMuteFor(user.uid)) {
        updateOwnMuteStatus();
        return;
      }
      chatSending = true;
      chatSubmit.disabled = true;
      chatStatus.textContent = 'Отправляем…';
      chatStatus.className = 'help-status';
      try {
        const profile = await window.portalSession.db.collection('users').doc(user.uid).get();
        const nickname = profile.data()?.nickname;
        if (!profile.exists || !nickname) throw new Error('Профиль участника не найден.');
        await window.portalSession.db.collection('chatMessages').add({
          uid: user.uid,
          nickname,
          text: message,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        chatMessage.value = '';
        void clearOwnTypingStatus();
        chatStatus.textContent = 'Сообщение отправлено.';
        chatStatus.className = 'help-status success';
      } catch (error) {
        console.error('Не удалось отправить сообщение в чат:', error);
        chatStatus.textContent = error.code === 'permission-denied'
          ? 'Firestore отклонил сообщение. Проверьте опубликованные правила базы данных.'
          : 'Не удалось отправить сообщение. Проверьте подключение и попробуйте ещё раз.';
        chatStatus.className = 'help-status error';
      } finally {
        chatSending = false;
        updateOwnMuteStatus();
        if (!activeMuteFor(user.uid)) chatSubmit.disabled = false;
        chatMessage.focus();
      }
    });
    chatMessage.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        chatForm.requestSubmit();
      }
    });
    document.querySelectorAll('[data-emoji]').forEach(button => button.addEventListener('click', () => {
      const start = chatMessage.selectionStart;
      const end = chatMessage.selectionEnd;
      chatMessage.setRangeText(button.dataset.emoji, start, end, 'end');
      chatMessage.focus();
    }));
    window.portalSession.auth.onAuthStateChanged(user => {
      helpWidget.hidden = !user;
      helpPanel.hidden = true;
      exitChatFullscreen();
      helpLauncher.setAttribute('aria-expanded', 'false');
      setHelpView('help-options');
      stopChatSubscription();
      stopFeedbackSubscription();
      if (!user) {
        latestFeedbackDocs = [];
        latestChatDocs = [];
        olderChatDocs = [];
        chatMuteRecords.clear();
      }
      updateModerationAccess();
    });
    window.addEventListener('portal-authenticated', updateModerationAccess);
    window.addEventListener('portal-role-changed', updateModerationAccess);
    window.addEventListener('portal-signed-out', () => {
      stopFeedbackSubscription();
      stopChatSubscription();
      exitChatFullscreen();
      feedbackInboxButton.hidden = true;
    });
