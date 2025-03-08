NGIT-KMEC Bunktendance Bot

🚀 NGIT-KMEC Bunktendance Bot is a Telegram bot that allows students to check their attendance percentage by entering their Netra-registered mobile number. The bot scrapes attendance data from the NGIT/KMEC student portal and provides real-time updates.

📌 Features

📊 Check attendance percentage for NGIT/KMEC students

📅 Get today's and overall attendance details

🤖 Simple and user-friendly Telegram bot interface

🔢 Attendance bunk calculator (how many classes you can miss)

🛡️ No database required—fetches data in real-time

🛠️ Tech Stack

Backend: Node.js (Telegraf.js for Telegram bot)

Web Scraping: Puppeteer

Hosting: Railway

🚀 How to Deploy

1️⃣ Clone the Repository

git clone https://github.com/HrushikeshMiddela/Bunktendance-bot.git
cd Bunktendance-bot

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables

Create a .env file in the root folder and add:

BOT_TOKEN=your_telegram_bot_token

4️⃣ Start the Bot Locally

node index.js

5️⃣ Deploy to a Hosting Service

Use a service like Railway, Render, or Fly.io for free deployment.

📜 Usage

Open Telegram and search for your bot.

Send /start to begin.

Select "📊 Check Attendance" and enter your details.

Receive real-time attendance updates!

🛠 Folder Structure

📁 your-repo-name/
├── 📜 index.js         # Main bot logic
├── 📜 attendance.js    # Web scraping logic
├── login.js       # Logging utility
├── 📜 .env.example    # Environment variable example
├── 📜 package.json    # Node.js dependencies

🤖 Bot Commands

Command

Description

/start

Starts the bot and shows the main menu

📊 Check Attendance

Fetches your attendance details

📖 Help

Shows usage instructions

ℹ️ About

Provides bot information

📝 Contributing

Want to improve this bot? Feel free to fork and submit a PR!

📧 Contact

For any issues, feel free to raise an issue or contact me at [Your Email or Telegram].

