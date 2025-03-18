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

## Running as a Service on Debian

To run the bot as a systemd service that starts automatically after the network is established:

1. Copy the service file to the systemd directory:
   ```
   sudo cp fishspeech_bot.service /etc/systemd/system/fishspeech_bot
   ```

2. Edit the service file to update the paths:
   ```
   sudo vim /etc/systemd/system/fishspeech_bot
   ```
   
   Update the following lines with your actual paths:
   - `WorkingDirectory=/root/fishspeech_bot` (replace with the actual path to your bot directory)
   - `EnvironmentFile=/root/fishspeech_bot/.env` (replace with the actual path to your .env file)
   
   You may also want to change the `User=nobody` to a more appropriate user that has permissions to run the bot.

3. Reload the systemd daemon:
   ```
   sudo systemctl daemon-reload
   ```

4. Enable the service to start on boot:
   ```
   sudo systemctl enable fishspeech_bot
   ```

5. Start the service:
   ```
   sudo systemctl start fishspeech_bot
   ```

6. Check the status of the service:
   ```
   sudo systemctl status fishspeech_bot
   ```

7. View logs:
   ```
   sudo journalctl -u fishspeech_bot
   ```
   
   To follow logs in real-time:
   ```
   sudo journalctl -u fishspeech_bot -f
   ```

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
