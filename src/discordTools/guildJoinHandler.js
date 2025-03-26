const { EmbedBuilder } = require('discord.js');
const DiscordEmbeds = require('./discordEmbeds.js');
const DiscordButtons = require('./discordButtons.js');
const Config = require('../../config');
const axios = require('axios'); // Добавляем импорт axios

module.exports = async (client, guild) => {
    // Отправка вебхука о новом сервере
    try {
        // Получаем информацию о пригласившем из аудит-лога
        let inviter = 'Неизвестно';
        try {
            const auditLogs = await guild.fetchAuditLogs({
                type: 28, // Числовой код для BOT_ADD
                limit: 1
            });
            const entry = auditLogs.entries.first();
            if (entry && entry.executor) {
                inviter = `${entry.executor.tag} (ID: ${entry.executor.id})`;
            }
        } catch (error) {
            console.error('Ошибка при получении аудит-лога:', error);
        }

        // Создаем Embed для вебхука
        const joinEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('✅ Бот добавлен на сервер')
            .addFields(
                { name: 'Название', value: guild.name, inline: true },
                { name: 'ID сервера', value: guild.id, inline: true },
                { name: 'Участников', value: guild.memberCount.toString(), inline: true },
                { name: 'Владелец', value: `<@${guild.ownerId}> (ID: ${guild.ownerId})`, inline: true },
                { name: 'Добавил', value: inviter }
            )
            .setThumbnail(guild.iconURL({ format: 'png', dynamic: true }))
            .setTimestamp();

        // Отправляем вебхук
        await axios.post(Config.discord.webhookerror, {
            embeds: [joinEmbed.toJSON()]
        });
         // Отправляем вебхук в inviteslogs

         // Проверка времени добавления
    const botJoinDate = guild.members.me?.joinedAt;
    const serverAge = Date.now() - guild.createdAt;
    if (serverAge > 300_000 && (Date.now() - botJoinDate) > 120_000) return;
         await axios.post(Config.discord.webhookinviteslogs, {
            embeds: [joinEmbed.toJSON()]
        });
    } catch (error) {
        console.error('Ошибка при отправке вебхука:', error);
    }

   

    // Проверка времени добавления
    const botJoinDate = guild.members.me?.joinedAt;
    const serverAge = Date.now() - guild.createdAt;
    if (serverAge > 300_000 && (Date.now() - botJoinDate) > 120_000) return;

    // Динамическая статистика
    /*
    const serverCount = client.guilds.cache.size;
    const badgeURL = `https://img.shields.io/badge/Серверов-${serverCount}-orange?logo=serverless&style=flat-square`;

    const supportEmbed = new EmbedBuilder()
        .setColor(0xDD6E0F)
        .setTitle('🔗 Ссылки')
        .setDescription(
            `💬 [Техподдержка](${Config.general.supportServer})\n` +
            `❤️ [Поддержать разработчика](${Config.general.donatelink} "Спасибо за вашу поддержку!")`
        )
        .setFooter({ 
            text: `Работает на ${serverCount} серверах.`,
            iconURL: badgeURL
        })
        .setThumbnail(client.user.displayAvatarURL({ 
            format: 'png', 
            size: 512,
            dynamic: true 
        }))

    channel.send({ 
        embeds: [DiscordEmbeds.getHelpEmbed(guild.id), supportEmbed],
        components: DiscordButtons.getHelpButtons()
    }).catch(console.error);
    */
};