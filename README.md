# NGIT-KMEC Bunktendance Bot

🚀 **NGIT-KMEC Bunktendance Bot** is a Telegram bot that allows students to check their attendance percentage by entering their Netra-registered mobile number. The bot scrapes attendance data from the NGIT/KMEC student portal and provides real-time updates.

## 📌 Features
- 📊 Check attendance percentage for NGIT/KMEC students
- 📅 Get today's and overall attendance details
- 🤖 Simple and user-friendly Telegram bot interface
- 🔢 Attendance bunk calculator (how many classes you can miss)
- 🛡️ No database required—fetches data in real-time

## 🛠️ Tech Stack
- **Backend:** Node.js (Telegraf.js for Telegram bot)
- **Web Scraping:** Puppeteer
- **Hosting:** Railway/Render/Fly.io (Recommended)

## 🚀 How to Deploy

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/HrushikeshMiddela/Bunktdance-Bot.git
cd Bunktdance-Bot
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root folder and add:
```sh
BOT_TOKEN=your_telegram_bot_token
```

### 4️⃣ Start the Bot Locally
```sh
node index.js
```

### 5️⃣ Deploy to a Hosting Service
Use a service like [Railway](https://railway.app), [Render](https://render.com), or [Fly.io](https://fly.io) for free deployment.

## 📜 Usage
1. Open Telegram and search for your bot.
2. Send `/start` to begin.
3. Select "📊 Check Attendance" and enter your details.
4. Receive real-time attendance updates!

## 🛠 Folder Structure
```sh
📁 Bunktdance-Bot/
├── 📜 index.js         # Main bot logic
├── 📜 attendance.js    # Web scraping logic
├── login.js       # Logging utility
├── 📜 .env.example    # Environment variable example
├── 📜 package.json    # Node.js dependencies
```

## 🤖 Bot Commands
| Command | Description |
|---------|-------------|
| `/start` | Starts the bot and shows the main menu |
| `📊 Check Attendance` | Fetches your attendance details |
| `📖 Help` | Shows usage instructions |
| `ℹ️ About` | Provides bot information |

## 📝 Contributing
Want to improve this bot? Feel free to fork and submit a PR!


