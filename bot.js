const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

// Optional: Store chat IDs in memory (or use a persistent storage like KV or a database)
let startUsers = new Set(); // Using Set to avoid duplicates

async function handleRequest(request) {
    const update = await request.json();

    if (update.message && update.message.text === '/start') {
        const chatId = update.message.chat.id;
        
        // Add chatId to the tracking Set
        startUsers.add(chatId);
        console.log(`New /start user: ${chatId}. Total unique users: ${startUsers.size}`);
        // You can also log additional info: update.message.from for user details

        const user = update.message.from;
        const username = user.username ? `@${user.username}` : 'User';
      
        const text = `Hello ${username}! I'm a Telegram bot.`;

        // Send a reply to the user
        await fetch(TELEGRAM_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text
            }),
        });

        // Optional: Log all current chat IDs
        console.log('Current /start user chat IDs:', Array.from(startUsers));
    }

    return new Response('OK');
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});