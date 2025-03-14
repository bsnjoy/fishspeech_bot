# FishSpeech Telegram Bot

A Telegram bot that converts text messages to speech using a text-to-speech API.

## Features

- Converts text messages to audio files
- Ignores comments (messages starting with # or //)
- Sends audio files back to the user

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Telegram bot token (obtained from [@BotFather](https://t.me/BotFather))
- Access to the text-to-speech API

## Setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd fishspeech-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file and add your Telegram bot token:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   TTS_API_URL=http://192.168.1.65:8080/v1/tts
   ```

## Running the Bot

Start the bot with:

```
npm start
```

Or directly with:

```
node bot.js
```

## Usage

1. Start a chat with your bot on Telegram
2. Send any text message to convert it to speech
3. The bot will reply with an audio file of the synthesized speech
4. Messages starting with # or // will be ignored as comments

## Troubleshooting

- If the bot doesn't respond, check that your Telegram bot token is correct
- Ensure the text-to-speech API is accessible from your server
- Check the console logs for any error messages

### Testing the Text-to-Speech API

You can test the text-to-speech API without running the full bot using the included test script:

```
npm run test-tts
```

Or with custom text:

```
npm run test-tts -- "Your custom text here"
```

This will generate a file called `test-output.wav` in the project directory.

## License

MIT
