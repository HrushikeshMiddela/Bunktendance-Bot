require('dotenv').config();
const { Telegraf } = require('telegraf');
const { fetchAttendance } = require('./attendance');
const logger = require('./login');

const bot = new Telegraf(process.env.BOT_TOKEN);

const PORTAL_URLS = {
  NGIT: 'http://ngit-netra.teleuniv.in/',
  KMEC: 'http://kmec-netra.teleuniv.in/',
};

const userSessions = new Map();
const userCommands = new Map(); // Track command usage per user

// ✅ Handle unexpected errors
bot.catch((err, ctx) => {
  logger.error('Bot error', { error: err.message });
  ctx.reply('🚨 Oops! An unexpected error occurred. Please try again later.');
});

// ✅ Start Command with Reply Keyboard
bot.command('start', (ctx) => {
  const userId = ctx.from.id;
  
  // Track user's command count
  userCommands.set(userId, (userCommands.get(userId) || 0) + 1);
  userSessions.set(userId, { step: 'askInstitute' });

  ctx.reply(
    `👋 *Welcome to Ngit-Kmec Bunktendance Bot!*\n\n` +
    `📌 Choose an option below or type your response:`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          [{ text: "📊 Check Attendance" }],
          [{ text: "📖 Help" }, { text: "ℹ️ About" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    }
  );
});

// ✅ Handle "Check Attendance" Button Click
bot.hears("📊 Check Attendance", (ctx) => {
  userSessions.set(ctx.from.id, { step: 'askInstitute' });
  ctx.reply("Are you from *NGIT* or *KMEC*? Reply with *ngit* or *kmec*.", { parse_mode: "Markdown" });
});

// ✅ Handle "Help" Button Click
bot.hears("📖 Help", (ctx) => {
  ctx.reply("ℹ️ *How to use this bot:*\n\n" +
            "1️⃣ Type /start to begin.\n" +
            "2️⃣ Select your college (NGIT/KMEC).\n" +
            "3️⃣ Enter your registered mobile number.\n\n" +
            "✅ Then, your attendance details will be fetched automatically!", 
            { parse_mode: "Markdown" });
});

// ✅ Handle "About" Button Click
bot.hears("ℹ️ About", (ctx) => {
  ctx.reply("🤖 *Bot Created By:*\n\n" +
            "*Hrushikesh-csm* - who never hit 75% attendance but still wants you to\n\n" +
            "🛠️ *Built Using:*\n" +
            "💻 Node.js & Web Scraping 🕵️‍♂️\n" +
            "📡 Powered by Telegraf.js 🚀", 
            { parse_mode: "Markdown" });
});


// ✅ Handle User Inputs
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const userSession = userSessions.get(userId);

  if (!userSession) {
    return ctx.reply('⚠️ Please start with /start.');
  }

  const userInput = ctx.message.text.trim().toUpperCase();

  if (userSession.step === 'askInstitute') {
    if (!['NGIT', 'KMEC'].includes(userInput)) {
      return ctx.reply('❌ Invalid input. Reply with *ngit* or *kmec*.', { parse_mode: 'Markdown' });
    }

    userSessions.set(userId, { step: 'askMobile', institute: userInput });
    return ctx.reply(`✅ You selected *${userInput}*. Now, send your 10-digit (Netra) mobile number.`);
  }

  if (userSession.step === 'askMobile') {
    if (!/^\d{10}$/.test(userInput)) {
      return ctx.reply('🚫 Send a valid 10-digit mobile number.');
    }

    const { institute } = userSession;
    const portalUrl = PORTAL_URLS[institute];
    userSessions.delete(userId);

    try {
      await ctx.reply('⏳ agu kochem time padthadi...'); 
      const attendanceData = await fetchAttendance(portalUrl, userInput, institute);
      await ctx.reply(attendanceData, { parse_mode: 'Markdown' });

      // Show user how many times they used commands
      
    } catch (error) {
      logger.error('Attendance fetch error', { error: error.message, userId });
      await ctx.reply(`⚠️ Error: ${error.message}`);
    }
  }
});

// ✅ Start Bot
bot.launch()
  .then(() => logger.info('Bot started successfully'))
  .catch((error) => logger.error('Failed to start bot', { error: error.message }));
