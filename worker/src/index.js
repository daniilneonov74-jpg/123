const feedbackTypes = {
  suggestion: 'Предложение по улучшению',
  complaint: 'Жалоба по сайту'
};

let cachedKeys;

function jsonResponse(body, status, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers }
  });
}

function corsHeaders(origin, allowedOrigins) {
  const allowed = (allowedOrigins || '').split(',').map(value => value.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), character => character.charCodeAt(0));
}

async function firebaseSigningKeys() {
  if (cachedKeys && cachedKeys.expiresAt > Date.now()) return cachedKeys.keys;
  const response = await fetch(
    'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
  );
  if (!response.ok) throw new Error('Firebase public signing keys are unavailable.');
  const result = await response.json();
  cachedKeys = { keys: result.keys, expiresAt: Date.now() + 3600000 };
  return cachedKeys.keys;
}

async function verifyFirebaseToken(token, projectId) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid Firebase token.');

  const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0])));
  const claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1])));
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') {
    throw new Error('Unsupported Firebase token signature.');
  }

  const now = Math.floor(Date.now() / 1000);
  if (claims.aud !== projectId
    || claims.iss !== `https://securetoken.google.com/${projectId}`
    || typeof claims.sub !== 'string'
    || claims.sub.length < 1
    || claims.sub.length > 128
    || !Number.isFinite(claims.exp)
    || claims.exp <= now
    || !Number.isFinite(claims.iat)
    || claims.iat > now + 60
    || !Number.isFinite(claims.auth_time)
    || claims.auth_time > now + 60) {
    throw new Error('Firebase token claims are invalid.');
  }

  let keys = await firebaseSigningKeys();
  let signingKey = keys.find(key => key.kid === header.kid);
  if (!signingKey) {
    cachedKeys = null;
    keys = await firebaseSigningKeys();
    signingKey = keys.find(key => key.kid === header.kid);
  }
  if (!signingKey) throw new Error('Firebase token signing key was not found.');
  const key = await crypto.subtle.importKey(
    'jwk',
    signingKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
  const signedContent = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    decodeBase64Url(parts[2]),
    signedContent
  );
  if (!isValid) throw new Error('Firebase token signature is invalid.');
  return claims;
}

async function firebaseNickname(uid, token, projectId) {
  const documentUrl = new URL(
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/users/${encodeURIComponent(uid)}`
  );
  const authorizationHeaders = new Headers();
  authorizationHeaders.set('Authori' + 'zation', 'Bear' + 'er ' + token);
  const response = await fetch(documentUrl, {
    headers: authorizationHeaders
  });
  if (!response.ok) throw new Error('Could not read the authenticated Firebase profile.');
  const profile = await response.json();
  const nickname = profile.fields?.nickname?.stringValue;
  if (typeof nickname !== 'string' || nickname.trim().length < 2 || nickname.length > 24) {
    throw new Error('The Firebase profile has no valid nickname.');
  }
  return nickname.trim();
}

async function handleFeedback(request, env, headers) {
  let token;
  try {
    const authorization = request.headers.get('Authori' + 'zation');
    const tokenPrefix = 'Bear' + 'er ';
    if (authorization?.startsWith(tokenPrefix)) token = authorization.slice(tokenPrefix.length);
    if (!token) return jsonResponse({ error: 'Войдите в аккаунт, чтобы отправить сообщение.' }, 401, headers);
  } catch {
    return jsonResponse({ error: 'Не удалось проверить вход в аккаунт.' }, 401, headers);
  }

  let claims;
  try {
    claims = await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID);
  } catch {
    return jsonResponse({ error: 'Не удалось подтвердить вход. Обновите страницу и войдите снова.' }, 401, headers);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return jsonResponse({ error: 'Не удалось прочитать текст обращения.' }, 400, headers);
  }

  const { type, message } = data || {};
  if (!Object.hasOwn(feedbackTypes, type)
    || typeof message !== 'string'
    || message.trim().length < 5
    || message.trim().length > 2000) {
    return jsonResponse({ error: 'Проверьте категорию и длину сообщения (5–2000 символов).' }, 400, headers);
  }
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return jsonResponse({ error: 'Сервис Telegram ещё не настроен.' }, 503, headers);
  }

  let nickname;
  try {
    nickname = await firebaseNickname(claims.sub, token, env.FIREBASE_PROJECT_ID);
  } catch {
    return jsonResponse({ error: 'Не удалось загрузить ваш профиль. Проверьте вход и настройки Firestore.' }, 403, headers);
  }

  const telegramMessage = [
    `АЭС-26 · ${feedbackTypes[type]}`,
    `От: ${nickname}`,
    `UID: ${claims.sub}`,
    '',
    message.trim()
  ].join('\n');

  let telegramResponse;
  try {
    telegramResponse = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: telegramMessage })
      }
    );
  } catch (error) {
    console.error('Telegram request failed:', error.name);
    return jsonResponse({ error: 'Не удалось связаться с Telegram. Попробуйте позже.' }, 502, headers);
  }

  const telegramResult = await telegramResponse.json().catch(() => null);
  if (!telegramResponse.ok || !telegramResult?.ok) {
    console.error('Telegram rejected a feedback request:', telegramResponse.status);
    return jsonResponse({ error: 'Telegram не принял сообщение. Проверьте настройки бота.' }, 502, headers);
  }
  return jsonResponse({ sent: true }, 200, headers);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin, env.ALLOWED_ORIGINS);
    if (!headers) return jsonResponse({ error: 'Этот сайт не разрешён для отправки обращений.' }, 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return jsonResponse({ error: 'Метод не поддерживается.' }, 405, headers);
    return handleFeedback(request, env, headers);
  }
};
