/*
    Copyright (C) 2022 Alexander Emanuelsson (alexemanuelol)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    https://github.com/alexemanuelol/rustplusplus

*/

const Discord = require('discord.js');
const Fs = require('fs');
const Path = require('path');
const axios = require('axios');

const DiscordBot = require('./src/structures/DiscordBot');

createMissingDirectories();
//checkForUpdates();

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

function createMissingDirectories() {
    if (!Fs.existsSync(Path.join(__dirname, 'logs'))) {
        Fs.mkdirSync(Path.join(__dirname, 'logs'));
    }

    if (!Fs.existsSync(Path.join(__dirname, 'instances'))) {
        Fs.mkdirSync(Path.join(__dirname, 'instances'));
    }

    if (!Fs.existsSync(Path.join(__dirname, 'credentials'))) {
        Fs.mkdirSync(Path.join(__dirname, 'credentials'));
    }

    if (!Fs.existsSync(Path.join(__dirname, 'maps'))) {
        Fs.mkdirSync(Path.join(__dirname, 'maps'));
    }
}
/*
function checkForUpdates() {
    const remote = 'https://raw.githubusercontent.com/alexemanuelol/rustplusplus/main/package.json';
    const local = require('./package.json');

    axios.get(remote).then((response: { data: any; }) => {
        const remote = response.data;

        if (remote.version !== local.version) {
            client.log(client.intlGet(null, 'infoCap'), client.intlGet(null, 'updateInfo', {
                current: local.version,
                new: remote.version
            }), 'warn');
        }
    }).catch((error: any) => {
        console.log(error);
    });
}
*/
/*
process.on('unhandledRejection', error => {
    client.log(client.intlGet(null, 'errorCap'), client.intlGet(null, 'unhandledRejection', {
        error: error
    }), 'error');
    console.log(error);
});
*/
process.on('unhandledRejection', (error: unknown) => {
    // Приводим тип error к Error, чтобы получить доступ к свойству stack
    if (error instanceof Error) {
        const stack = error.stack ? error.stack.split('\n') : [];
        const location = stack[1] ? stack[1].trim() : 'Unknown location';

        client.log(client.intlGet(null, 'errorCap'), client.intlGet(null, 'unhandledRejection', {
            error: error.message,
            location: location
        }), 'error');

        console.log(`Unhandled Rejection at: ${location}`);
        console.log(error);
    } else {
        // Если error не является экземпляром Error, просто логируем его
        client.log(client.intlGet(null, 'errorCap'), `Unhandled Rejection: ${String(error)}`, 'error');
        console.log(`Unhandled Rejection: ${String(error)}`);
    }
});
exports.client = client;
