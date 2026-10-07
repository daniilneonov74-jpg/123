# Настройка отправки обращений через Cloudflare Worker

Токен Telegram хранится в Cloudflare Worker Secret, не в файлах сайта. Worker проверяет Firebase ID token, сверяет никнейм с профилем Firestore и разрешает запросы только с доменов, перечисленных в `ALLOWED_ORIGINS`.

## Перед началом

1. Отзовите уже отправленный в чат токен через `@BotFather` (`/revoke`) и создайте новый. Не публикуйте новый токен и не записывайте его в файлы.
2. Создайте или выберите частный Telegram-чат для обращений, добавьте туда бота и отправьте в чат любое сообщение.
3. Узнайте `TELEGRAM_CHAT_ID`. Запросите `getUpdates` локально, введя новый токен в запрос PowerShell (не в адресную строку и не в чат):

   ```powershell
   $secureToken = Read-Host "Введите новый токен бота" -AsSecureString
   $token = [System.Net.NetworkCredential]::new("", $secureToken).Password
   $updates = Invoke-RestMethod -Uri "https://api.telegram.org/bot$token/getUpdates"
   $updates.result | ForEach-Object { $_.message.chat | Select-Object id, type }
   Remove-Variable token, secureToken, updates
   ```

   Используйте `id` именно того частного чата или группы, куда должны приходить обращения. Если `result` пуст, напишите боту или отправьте сообщение в группу ещё раз и повторите запрос.

## Развёртывание на бесплатном плане Workers

1. Создайте аккаунт на Cloudflare и установите Node.js LTS с `https://nodejs.org/`.
2. Откройте VS Code → Terminal → New Terminal и выполните:

   ```powershell
   cd "C:\Users\Administrator\Desktop\АЭС-26\worker"
   npx wrangler login
   npx wrangler deploy
   ```

   Когда Wrangler впервые спросит имя аккаунта или подтвердить развёртывание, следуйте подсказкам в терминале.
3. Добавьте секреты в уже созданный Worker:

   ```powershell
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   ```

   Для каждого `secret put` Wrangler попросит значение в терминале. Вставляйте значения только туда. В код и этот файл секреты не добавлять.
4. Адрес Worker показан после первого `deploy`; он будет иметь вид `https://aes26-telegram-feedback.<ваш-аккаунт>.workers.dev`. Скопируйте его в `js/feedback-config.js`:

   ```js
   window.portalFeedbackConfig = {
     endpoint: 'https://aes26-telegram-feedback.<ваш-аккаунт>.workers.dev'
   };
   ```

5. Если сайт опубликован не на `aes-26.web.app` и не на `aes-26.firebaseapp.com`, добавьте его точный HTTPS origin в `ALLOWED_ORIGINS` файла `wrangler.toml`, через запятую без завершающего `/`.
6. Опубликуйте изменения Worker и сайта:

   ```powershell
   cd "C:\Users\Administrator\Desktop\АЭС-26\worker"
   npx wrangler deploy
   ```

   Затем опубликуйте файлы сайта обычным способом, которым вы публикуете проект. Правила Firestore нужны для чата, обращений в панели администраторов, блокировок и индикатора набора текста:

   ```powershell
   cd "C:\Users\Administrator\Desktop\АЭС-26"
   firebase deploy --only firestore:rules
   ```

Firebase Cloud Functions и тариф Blaze для отправки через Worker не нужны. Для локальной проверки сайт должен открываться через разрешённый HTTPS-домен; страница `file://` не разрешена настройкой CORS.

При последующих изменениях панели обращений и чата Cloudflare Worker заново развёртывать не нужно. Публикуйте изменённые файлы сайта и обновляйте Firestore rules указанной выше командой.
