const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const localPackage = require('./package.json');
const client = require('./src/structures/DiscordBot');
const Config = require('./config');


const logFilePath = './logs/errors.log';
const previousErrors = new Set();

async function sendToDiscordWebhook(message) {
    try {
        await axios.post(Config.discord.webhookerror, { content: message, });
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Discord вебхук:', error);
    }
}

const { execSync } = require('child_process');


function getSystemInfo() {
    const cpus = os.cpus();
    const cpuLoad = cpus.map(cpu => cpu.times).reduce((acc, times) => {
        acc.user += times.user;
        acc.nice += times.nice;
        acc.sys += times.sys;
        acc.idle += times.idle;
        return acc;
    }, { user: 0, nice: 0, sys: 0, idle: 0 });

    const totalCpuTime = cpuLoad.user + cpuLoad.nice + cpuLoad.sys + cpuLoad.idle;
    const cpuUsage = ((cpuLoad.user + cpuLoad.sys) / totalCpuTime) * 100;

    const memoryUsage = `${((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)} MB`;


    return {
        cpuUsage: cpuUsage.toFixed(2) + '%',
        memoryUsage,
    };
}

async function onBotStartup() {
    try {
        const systemInfo = getSystemInfo();
        const startupMessage = `Бот успешно запущен!\n
        Время запуска: ${new Date().toLocaleTimeString()}\n
        CPU Load: ${systemInfo.cpuUsage}\n
        Memory Usage: ${systemInfo.memoryUsage}`;
        console.log(startupMessage);

        await sendToDiscordWebhook(startupMessage);
    } catch (error) {
        console.error('Ошибка при запуске бота:', error);
    }
}



async function checkForUpdates() {
    const remoteUrl = 'https://raw.githubusercontent.com/alexemanuelol/rustplusplus/main/package.json';
    const local = localPackage;

    axios.get(remoteUrl)
        .then(async (response) => {
            const remote = response.data;

            if (remote.version !== local.version) {
                const updateMessage = `Обнаружено обновление:\n
                Текущая версия: ${local.version}\n
                Новая версия: ${remote.version}`;
                console.log(updateMessage);

 //               await client.log(client.intlGet(null, 'infoCap'), client.intlGet(null, 'updateInfo', {
 //                   current: local.version,
 //                   new: remote.version,
 //               }), 'warn');

                await sendToDiscordWebhook(updateMessage);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}


// Функция для логирования ошибок в файл
function logErrorToFile(error, location) {
    const logMessage = `${new Date().toISOString()} - Error: ${error.message}, Location: ${location}\n`;
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

process.on('unhandledRejection', async (error) => {
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
/*
        client.log(client.intlGet(null, 'errorCap'), client.intlGet(null, 'unhandledRejection', {
            error: error.message,
            location: location
        }), 'error');
*/
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
/*
        client.log(client.intlGet(null, 'errorCap'), `Unhandled Rejection: ${String(error)}`, 'error');
        console.log(`Unhandled Rejection: ${String(error)}`);
        */
    }
});

module.exports = { checkForUpdates, onBotStartup };
