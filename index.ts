process.env.TZ = 'Europe/Moscow';

const Discord = require('discord.js');
const Fs = require('fs');
const Path = require('path');
const axios = require('axios');

const fs = require('fs');
const path = require('path');
const Config = require('./config');

const logFilePath = path.join(__dirname, 'logs', 'errors.log');
const previousErrors = new Set();

const DiscordBot = require('./src/structures/DiscordBot');
const { onBotStartup, checkForUpdates } = require('./checkForUpdates');


createMissingDirectories();


const client = new DiscordBot({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildVoiceStates],
    retryLimit: 2,
    restRequestTimeout: 60000,
    disableEveryone: false
});

client.build();

(async () => {
    await onBotStartup();
    await checkForUpdates(client);
})();

function createMissingDirectories() {
    if (!Fs.existsSync(Path.join(__dirname, 'logs'))) {
        Fs.mkdirSync(Path.join(__dirname, 'logs'));
    }

    if (!Fs.existsSync(Path.join(__dirname, 'instances'))) {
        Fs.mkdirSync(Path.join(__dirname, 'instances'));
    }
/*  */
    if (!Fs.existsSync(Path.join(__dirname, 'credentials'))) {
        Fs.mkdirSync(Path.join(__dirname, 'credentials'));
    }

    if (!Fs.existsSync(Path.join(__dirname, 'maps'))) {
        Fs.mkdirSync(Path.join(__dirname, 'maps'));
    }
}

/*
process.on('unhandledRejection', error => {
    client.log(client.intlGet(null, 'errorCap'), client.intlGet(null, 'unhandledRejection', {
        error: error
    }), 'error');
    console.log(error);
});
*/
/*

// Функция для отправки сообщений в вебхук Discord
async function sendToDiscordWebhook(message: string): Promise<void> {
    try {
        await axios.post(Config.discord.webhookerror, {
            content: message
        });
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Discord вебхук:', error);
    }
}

// Функция для логирования ошибок в файл
function logErrorToFile(error: Error, location: string): void {
    const logMessage = `${new Date().toISOString()} - Error: ${error.message}, Location: ${location}\n`;
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

process.on('unhandledRejection', async (error: unknown) => {
    if (error instanceof Error) {
        const stack = error.stack ? error.stack.split('\n') : [];
        const location = stack[1] ? stack[1].trim() : 'Unknown location';

        const errorMessage = `Unhandled Rejection at: ${location}\nError: ${error.message}`;

        if (!previousErrors.has(errorMessage)) {
            previousErrors.add(errorMessage);
            if (previousErrors.size > 50) {
                // Ограничиваем размер набора ошибок, чтобы избежать утечки памяти
                previousErrors.clear();
            }

            // Логируем ошибку в файл
            logErrorToFile(error, location);

            // Отправляем ошибку в вебхук Discord
            await sendToDiscordWebhook(errorMessage);
        }

        client.log(client.intlGet(null, 'errorCap'), client.intlGet(null, 'unhandledRejection', {
            error: error.message,
            location: location
        }), 'error');

        console.log(`Unhandled Rejection at: ${location}`);
        console.log(error);
    } else {
        const errorMessage = `Unhandled Rejection: ${String(error)}`;
        if (!previousErrors.has(errorMessage)) {
            previousErrors.add(errorMessage);
            if (previousErrors.size > 50) {
                // Ограничиваем размер набора ошибок, чтобы избежать утечки памяти
                previousErrors.clear();
            }

            // Логируем ошибку в файл
            logErrorToFile(new Error(String(error)), 'Unknown location');

            // Отправляем ошибку в вебхук Discord
            await sendToDiscordWebhook(errorMessage);
        }

        client.log(client.intlGet(null, 'errorCap'), `Unhandled Rejection: ${String(error)}`, 'error');
        console.log(`Unhandled Rejection: ${String(error)}`);
    }
});
*/
exports.client = client;
