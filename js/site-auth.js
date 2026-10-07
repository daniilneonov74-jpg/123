(() => {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('pointermove', event => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
      document.documentElement.classList.add('cursor-glow-visible');
    }, { passive: true });
    document.addEventListener('pointerleave', () => {
      document.documentElement.classList.remove('cursor-glow-visible');
    });
  }

  const loader = document.getElementById('site-loader');
  const gate = document.getElementById('auth-gate');
  const form = document.getElementById('auth-form');
  const nicknameLabel = document.getElementById('auth-nickname-label');
  const nicknameInput = document.getElementById('auth-nickname');
  const emailInput = document.getElementById('auth-email');
  const passwordInput = document.getElementById('auth-password');
  const submitButton = document.getElementById('auth-submit');
  const modeSwitch = document.getElementById('auth-mode-switch');
  const errorMessage = document.getElementById('auth-error');
  const googleButton = document.getElementById('auth-google');
  const profileName = document.getElementById('profile-name');
  const themeModeToggles = document.querySelectorAll('[data-theme-mode-toggle]');
  const creatorUid = 'joCInK8h1odw5hnknvtNk8gOeoC2';
  let authMode = 'login';
  let currentUser = null;
  let currentRole = 'member';
  let stopProfileListener = null;
  let pendingNickname = '';
  let pendingActiveSeconds = 0;
  let flushInProgress = false;
  let presenceWriteInProgress = false;
  let lastActiveTick = Date.now();
  let lastInteractionAt = Date.now();
  let lastPresenceActivityWrite = 0;
  let pageIsActive = document.visibilityState === 'visible';

  const themes = ['terracotta', 'ocean', 'sage', 'plum', 'midnight', 'rose', 'amber', 'slate'];

  function setColorMode(mode) {
    const selectedMode = mode === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.colorMode = selectedMode;
    themeModeToggles.forEach(themeModeToggle => {
      themeModeToggle.checked = selectedMode === 'dark';
      themeModeToggle.setAttribute('aria-checked', String(selectedMode === 'dark'));
    });
    document.querySelectorAll('[data-theme-mode-label]').forEach(label => {
      label.textContent = selectedMode === 'dark' ? 'Тёмная тема' : 'Светлая тема';
    });
    try {
      localStorage.setItem('aes26-color-mode', selectedMode);
    } catch (error) {
      console.error('Не удалось сохранить режим оформления:', error);
    }
  }

  try {
    setColorMode(localStorage.getItem('aes26-color-mode') || 'light');
  } catch (error) {
    console.error('Не удалось прочитать режим оформления:', error);
    setColorMode('light');
  }
  themeModeToggles.forEach(themeModeToggle => themeModeToggle.addEventListener('change', () => {
    setColorMode(themeModeToggle.checked ? 'dark' : 'light');
  }));

  function setTheme(theme) {
    const selectedTheme = themes.includes(theme) ? theme : 'terracotta';
    document.documentElement.dataset.theme = selectedTheme;
    try {
      localStorage.setItem('aes26-theme', selectedTheme);
    } catch (error) {
      console.error('Не удалось сохранить цвет оформления:', error);
    }
    document.querySelectorAll('[data-theme-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === selectedTheme));
    });
  }

  try {
    setTheme(localStorage.getItem('aes26-theme') || 'terracotta');
  } catch (error) {
    console.error('Не удалось прочитать сохранённую тему:', error);
    setTheme('terracotta');
  }

  if (typeof firebase === 'undefined' || !firebase.auth || !firebase.firestore) {
    if (loader) loader.hidden = true;
    if (gate) gate.hidden = false;
    if (errorMessage) errorMessage.textContent = 'Не удалось загрузить Firebase. Проверьте подключение к интернету и обновите страницу.';
    return;
  }

  const firebaseConfig = {
    apiKey: 'AIzaSyBKqtixYVjsUxW-dNjz8Cnl6BAJWvaU2zs',
    authDomain: 'aes-26.firebaseapp.com',
    projectId: 'aes-26',
    storageBucket: 'aes-26.firebasestorage.app',
    messagingSenderId: '304768334581',
    appId: '1:304768334581:web:6a72d5c389d585f891e3bc'
  };

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  window.portalSession = {
    auth,
    db,
    get user() { return currentUser; },
    get role() { return currentRole; }
  };

  function showError(message) {
    if (errorMessage) errorMessage.textContent = message;
  }

  function authError(error) {
    const messages = {
      'auth/email-already-in-use': 'Этот email уже зарегистрирован. Войдите в существующий аккаунт.',
      'auth/invalid-email': 'Проверьте правильность email.',
      'auth/invalid-credential': 'Неверный email или пароль.',
      'auth/user-not-found': 'Аккаунт с таким email не найден.',
      'auth/wrong-password': 'Неверный email или пароль.',
      'auth/weak-password': 'Пароль должен содержать не менее 6 символов.',
      'auth/network-request-failed': 'Не удалось связаться с Firebase Authentication. Проверьте подключение и откройте сайт через HTTP(S), не через file://.',
      'auth/too-many-requests': 'Слишком много попыток входа. Подождите и попробуйте ещё раз.',
      'auth/popup-closed-by-user': 'Окно Google было закрыто до завершения входа.',
      'auth/popup-blocked': 'Браузер заблокировал окно Google. Разрешите всплывающие окна и повторите попытку.',
      'auth/unauthorized-domain': 'Домен сайта не добавлен в разрешённые домены Firebase Authentication.',
      'auth/operation-not-allowed': 'Этот способ входа пока не включён в Firebase Authentication.'
    };
    console.error('Ошибка Firebase Authentication:', error);
    return messages[error.code] || `Не удалось выполнить вход${error.code ? ` (${error.code})` : ''}. Проверьте настройки Firebase Authentication.`;
  }

  function profileError(error) {
    const messages = {
      'permission-denied': 'Firebase запретил сохранить никнейм. Опубликуйте правила из firestore.rules в Firebase Console → Firestore Database → Rules.',
      unauthenticated: 'Сессия входа истекла. Обновите страницу и войдите снова.',
      unavailable: 'Firestore временно недоступен. Проверьте подключение к интернету и попробуйте ещё раз.',
      'failed-precondition': 'Firestore не настроен для проекта. Проверьте создание базы данных в Firebase Console.'
    };
    console.error('Ошибка профиля Firestore:', error);
    return messages[error.code] || 'Не удалось сохранить профиль в Firestore. Проверьте настройки и правила базы данных.';
  }

  function setMode(mode) {
    authMode = mode;
    showError('');
    const profileMode = mode === 'profile';
    const registerMode = mode === 'register';
    nicknameLabel.hidden = !(profileMode || registerMode);
    emailInput.closest('label').hidden = profileMode;
    passwordInput.closest('label').hidden = profileMode;
    emailInput.required = !profileMode;
    passwordInput.required = !profileMode;
    nicknameInput.required = profileMode || registerMode;
    nicknameInput.value = '';
    if (profileMode) passwordInput.value = '';
    submitButton.textContent = profileMode ? 'Сохранить никнейм' : registerMode ? 'Создать аккаунт' : 'Войти';
    document.getElementById('auth-title').textContent = profileMode ? 'Выберите никнейм' : registerMode ? 'Создать аккаунт' : 'Добро пожаловать';
    document.querySelector('.auth-intro').textContent = profileMode
      ? 'Укажите имя, которое будет видно другим участникам в статистике.'
      : 'Войдите или зарегистрируйтесь, чтобы открыть сайт и участвовать в общей статистике.';
    modeSwitch.hidden = profileMode;
    googleButton.hidden = profileMode;
    modeSwitch.textContent = registerMode ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться';
  }

  async function createProfile(user, nickname) {
    const cleanNickname = nickname.trim().replace(/\s+/g, ' ');
    if (cleanNickname.length < 2 || cleanNickname.length > 24) {
      throw new Error('Никнейм должен содержать от 2 до 24 символов.');
    }

    const profileRef = db.collection('users').doc(user.uid);
    await db.runTransaction(async transaction => {
      const profile = await transaction.get(profileRef);
      if (!profile.exists) {
        transaction.set(profileRef, {
          nickname: cleanNickname,
          activeSeconds: 0,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          role: user.uid === creatorUid ? 'creator' : 'member',
          online: true,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          lastActivityAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        const data = profile.data();
        transaction.update(profileRef, {
          nickname: cleanNickname,
          role: user.uid === creatorUid ? 'creator' : data.role || 'member',
          online: true,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          lastActivityAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    });
  }

  async function ensureProfileRole(user, data) {
    const role = user.uid === creatorUid ? 'creator' : data.role || 'member';
    if (data.role === role && data.online === true && data.lastSeen && data.lastActivityAt) return role;

    const profileRef = db.collection('users').doc(user.uid);
    await db.runTransaction(async transaction => {
      const profile = await transaction.get(profileRef);
      if (!profile.exists) throw new Error('Профиль пользователя не найден.');
      const currentData = profile.data();
      const updates = {
        online: true,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      };
      if (!currentData.lastActivityAt) updates.lastActivityAt = firebase.firestore.FieldValue.serverTimestamp();
      if (!currentData.role || (user.uid === creatorUid && currentData.role !== 'creator')) {
        updates.role = role;
      }
      transaction.update(profileRef, updates);
    });
    return role;
  }

  function enterPortal(user, nickname, role) {
    currentUser = user;
    currentRole = role;
    passwordInput.value = '';
    emailInput.value = '';
    nicknameInput.value = '';
    document.body.classList.add('is-authenticated');
    document.body.classList.remove('auth-pending');
    if (loader) loader.hidden = true;
    if (gate) gate.hidden = true;
    if (profileName) profileName.textContent = nickname;
    lastActiveTick = Date.now();
    lastInteractionAt = Date.now();
    pageIsActive = document.visibilityState === 'visible';
    if (stopProfileListener) stopProfileListener();
    stopProfileListener = db.collection('users').doc(user.uid).onSnapshot(snapshot => {
      if (!snapshot.exists) return;
      const updatedRole = snapshot.data().role || 'member';
      if (updatedRole === currentRole) return;
      currentRole = updatedRole;
      window.dispatchEvent(new CustomEvent('portal-role-changed', { detail: { role: updatedRole } }));
    }, error => {
      console.error('Не удалось отслеживать изменения роли пользователя:', error);
    });
    void writePresence(pageIsActive, pageIsActive);
    window.dispatchEvent(new CustomEvent('portal-authenticated', { detail: { role } }));
  }

  async function handleAuthenticatedUser(user) {
    currentUser = user;
    try {
      const profile = await db.collection('users').doc(user.uid).get();
      if (profile.exists && typeof profile.data().nickname === 'string') {
        pendingNickname = '';
        const data = profile.data();
        const role = await ensureProfileRole(user, data);
        enterPortal(user, data.nickname, role);
        return;
      }

      if (pendingNickname) {
        const name = pendingNickname;
        await createProfile(user, name);
        pendingNickname = '';
        enterPortal(user, name.trim().replace(/\s+/g, ' '), user.uid === creatorUid ? 'creator' : 'member');
        return;
      }

      if (loader) loader.hidden = true;
      if (gate) gate.hidden = false;
      document.body.classList.remove('is-authenticated');
      document.body.classList.remove('auth-pending');
      setMode('profile');
    } catch (error) {
      if (loader) loader.hidden = true;
      if (gate) gate.hidden = false;
      document.body.classList.remove('is-authenticated');
      document.body.classList.remove('auth-pending');
      if (currentUser) {
        setMode('profile');
        nicknameInput.value = pendingNickname;
      }
      showError(profileError(error));
    }
  }

  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      showError('');
      submitButton.disabled = true;
      try {
        if (authMode === 'profile') {
          if (!currentUser) throw new Error('Сессия пользователя не найдена. Выполните вход ещё раз.');
          const nickname = nicknameInput.value.trim();
          try {
            await createProfile(currentUser, nickname);
          } catch (error) {
            showError(error.code ? profileError(error) : error.message);
            return;
          }
          enterPortal(currentUser, nickname.replace(/\s+/g, ' '), currentUser.uid === creatorUid ? 'creator' : 'member');
          return;
        }

        if (authMode === 'register') {
          pendingNickname = nicknameInput.value.trim();
          await auth.createUserWithEmailAndPassword(emailInput.value.trim(), passwordInput.value);
        } else {
          await auth.signInWithEmailAndPassword(emailInput.value.trim(), passwordInput.value);
        }
      } catch (error) {
        if (authMode === 'register' && error.code) pendingNickname = '';
        showError(error.code ? authError(error) : error.message);
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  if (modeSwitch) {
    modeSwitch.addEventListener('click', () => setMode(authMode === 'register' ? 'login' : 'register'));
  }

  if (googleButton) {
    googleButton.addEventListener('click', async () => {
      showError('');
      googleButton.disabled = true;
      try {
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      } catch (error) {
        showError(authError(error));
      } finally {
        googleButton.disabled = false;
      }
    });
  }

  auth.onAuthStateChanged(user => {
    if (!user) {
      if (stopProfileListener) stopProfileListener();
      stopProfileListener = null;
      currentUser = null;
      currentRole = 'member';
      if (loader) loader.hidden = true;
      if (gate) gate.hidden = false;
      document.body.classList.remove('is-authenticated');
      document.body.classList.remove('auth-pending');
      window.dispatchEvent(new Event('portal-signed-out'));
      setMode('login');
      return;
    }
    void handleAuthenticatedUser(user);
  }, error => {
    console.error('Не удалось проверить сессию Firebase Authentication:', error);
    if (loader) loader.hidden = true;
    if (gate) gate.hidden = false;
    document.body.classList.remove('auth-pending');
    showError('Не удалось проверить авторизацию. Проверьте настройки Firebase и обновите страницу.');
  });

  const signOutButton = document.getElementById('sign-out');
  signOutButton?.addEventListener('click', async () => {
    try {
      await writePresence(false, false);
      await auth.signOut();
    } catch (error) {
      console.error('Не удалось выйти из аккаунта:', error);
      showError('Не удалось завершить сеанс. Попробуйте ещё раз.');
    }
  });

  function accrueVisibleTime() {
    const now = Date.now();
    if (pageIsActive && currentUser && document.body.classList.contains('is-authenticated')) {
      pendingActiveSeconds += Math.max(0, Math.floor((now - lastActiveTick) / 1000));
    }
    lastActiveTick = now;
  }

  async function writePresence(online, active) {
    if (!currentUser || presenceWriteInProgress) return;
    presenceWriteInProgress = true;
    const userId = currentUser.uid;
    const updates = {
      online,
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (active) {
      updates.lastActivityAt = firebase.firestore.FieldValue.serverTimestamp();
      lastPresenceActivityWrite = Date.now();
    }
    try {
      await db.collection('users').doc(userId).update(updates);
    } catch (error) {
      console.error('Не удалось обновить статус присутствия:', error);
      const membersStatus = document.getElementById('members-status');
      if (membersStatus) {
        membersStatus.textContent = 'Не удалось обновить статус присутствия. Проверьте опубликованные правила Firestore.';
      }
    } finally {
      presenceWriteInProgress = false;
    }
  }

  async function flushActiveTime() {
    if (!currentUser || !pendingActiveSeconds || flushInProgress) return;
    const seconds = Math.min(pendingActiveSeconds, 60);
    pendingActiveSeconds -= seconds;
    flushInProgress = true;
    const userId = currentUser.uid;
    const profileRef = db.collection('users').doc(userId);
    try {
      await db.runTransaction(async transaction => {
        const profile = await transaction.get(profileRef);
        if (!profile.exists) throw new Error('Профиль для записи времени не найден.');
        transaction.update(profileRef, {
          activeSeconds: firebase.firestore.FieldValue.increment(seconds),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    } catch (error) {
      pendingActiveSeconds += seconds;
      console.error('Не удалось сохранить активное время:', error);
      const summary = document.getElementById('statistics-summary');
      if (summary) summary.textContent = 'Не удалось сохранить статистику. Проверьте правила Firestore.';
    } finally {
      flushInProgress = false;
    }
  }

  setInterval(() => {
    accrueVisibleTime();
    void flushActiveTime();
    if (pageIsActive && currentUser) {
      const recentActivity = Date.now() - lastInteractionAt < 2 * 60 * 1000;
      const refreshActivity = recentActivity && Date.now() - lastPresenceActivityWrite > 60 * 1000;
      void writePresence(true, refreshActivity);
    }
  }, 30000);

  const recordInteraction = () => {
    lastInteractionAt = Date.now();
    if (pageIsActive && currentUser && Date.now() - lastPresenceActivityWrite > 30 * 1000) {
      void writePresence(true, true);
    }
  };
  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(eventName => {
    document.addEventListener(eventName, recordInteraction, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      accrueVisibleTime();
      pageIsActive = false;
      void flushActiveTime();
      void writePresence(false, false);
    } else {
      pageIsActive = true;
      lastActiveTick = Date.now();
      lastInteractionAt = Date.now();
      void writePresence(true, true);
    }
  });
  window.addEventListener('pagehide', () => {
    accrueVisibleTime();
    pageIsActive = false;
    void flushActiveTime();
    void writePresence(false, false);
  });

  window.loadLeaderboard = async () => {
    const list = document.getElementById('leaderboard');
    const summary = document.getElementById('statistics-summary');
    if (!list || !summary || !currentUser) return;
    summary.textContent = 'Загружаем рейтинг…';
    try {
      const snapshot = await db.collection('users').orderBy('activeSeconds', 'desc').limit(50).get();
      list.replaceChildren();
      if (snapshot.empty) {
        summary.textContent = 'В рейтинге пока нет участников.';
        return;
      }
      const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const currentRank = profiles.findIndex(profile => profile.id === currentUser.uid);
      summary.textContent = currentRank >= 0
        ? `Вы на ${currentRank + 1}-м месте. В рейтинг включается только время, когда сайт открыт на экране.`
        : 'Показаны первые 50 участников. Время засчитывается, только пока сайт открыт на экране.';
      profiles.forEach(profile => {
        const item = document.createElement('li');
        if (profile.id === currentUser.uid) item.classList.add('current-user');
        const name = document.createElement('span');
        name.className = 'leaderboard-name';
        name.textContent = profile.nickname || 'Участник';
        const time = document.createElement('span');
        time.className = 'leaderboard-time';
        const totalMinutes = Math.floor((Number(profile.activeSeconds) || 0) / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        time.textContent = hours ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
        item.append(name, time);
        list.appendChild(item);
      });
    } catch (error) {
      console.error('Не удалось загрузить рейтинг:', error);
      summary.textContent = 'Не удалось загрузить рейтинг. Проверьте правила Firestore.';
    }
  };

  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    button.addEventListener('click', () => setTheme(button.dataset.themeChoice));
  });
})();
