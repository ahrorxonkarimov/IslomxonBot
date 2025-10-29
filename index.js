const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();
const TOKEN = process.env.TOKEN; // Bot token
const bot = new Telegraf(TOKEN);

// Adminlar va kanal
const ADMIN_IDS = [5985723887]; // Siz bergan ID
const DOMAIN = process.env.DOMAIN; // Render URL, masalan: https://islomxon-bot.onrender.com
const CHANNEL = '@Islomxon_masjidi';

// Web App faylini yuborish
app.get('/webapp.html', (req, res) => {
  res.sendFile(__dirname + '/webapp.html');
});

// Webhook callback
app.use(bot.webhookCallback('/bot-webhook'));

// /start buyrug‘i
bot.command('start', (ctx) => {
  if (!ADMIN_IDS.includes(ctx.from.id)) return ctx.reply('Faqat adminlar.');
  ctx.reply('Islomxon jome masjidi\nNamoz vaqtlarini yuborish:', {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Web App ochish', web_app: { url: `${DOMAIN}/webapp.html` } }
      ]]
    }
  });
});

// /id buyrug‘i
bot.command('id', (ctx) => {
  ctx.reply(`ID: ${ctx.from.id}`);
});

// Web App orqali yuborilgan ma’lumotlarni kanalga post qilish
bot.on('web_app_data', async (ctx) => {
  if (!ADMIN_IDS.includes(ctx.from.id)) return;

  try {
    const data = JSON.parse(ctx.webAppData.data);

    const text = `Islomxon jome masjidi

Sana: ${data.date}

Bomdod: ${data.bomdod}
Peshin: ${data.peshin}
Asr: ${data.asr}
Shom: ${data.shom}
Hufton: ${data.hufton}

${data.izoh}

Hududingiz uchun to'g'ri vaqtlarda namoz o'qing!
Allah qabul qilsin!

https://t.me/Islomxon_masjidi`;

    await bot.telegram.sendMessage(CHANNEL, text);

    await ctx.reply('Post kanalga yuborildi!', {
      reply_markup: { inline_keyboard: [[{ text: 'Kanalga o‘tish', url: 'https://t.me/Islomxon_masjidi' }]] }
    });
  } catch (err) {
    console.error('XATO:', err.message);
    ctx.reply('Xato: ' + err.message);
  }
});

// Webhook o‘rnatish
(async () => {
  await bot.telegram.setWebhook(`${DOMAIN}/bot-webhook`);
  console.log('Webhook o‘rnatildi');
})();

// Server port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ishlayapti: ${DOMAIN}/webapp.html`);
});
