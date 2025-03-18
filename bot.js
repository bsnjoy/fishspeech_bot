require('dotenv').config();
const { Bot, InputFile } = require('grammy');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Check if required environment variables are set
if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('Error: TELEGRAM_BOT_TOKEN is not set in .env file');
  process.exit(1);
}

if (!process.env.TTS_API_URL) {
  console.error('Error: TTS_API_URL is not set in .env file');
  process.exit(1);
}

// Create a temporary directory for audio files if it doesn't exist
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Initialize the bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Add middleware for debugging
bot.use(async (ctx, next) => {
  console.log('Received update:', JSON.stringify(ctx.update, null, 2));
  await next();
});

// Handle /start command
bot.command('start', async (ctx) => {
  console.log('Received /start command');
  await ctx.reply('👋 Welcome to FishSpeech Bot! Send me any text message and I will convert it to speech. Messages starting with # or // will be ignored as comments.');
});

// Handle /help command
bot.command('help', async (ctx) => {
  console.log('Received /help command');
  await ctx.reply(
    '🔊 *FishSpeech Bot Help*\n\n' +
    'This bot converts text messages to speech.\n\n' +
    '*Commands:*\n' +
    '/start - Start the bot\n' +
    '/help - Show this help message\n\n' +
    '*Usage:*\n' +
    '1. Simply send any text message\n' +
    '2. The bot will convert it to speech and send back an audio file\n' +
    '3. Messages starting with # or // will be ignored as comments\n\n' +
    '*Examples:*\n' +
    'Hello, convert this to speech\n' +
    '# This is a comment and will be ignored\n' +
    '// This is also a comment',
    { parse_mode: 'Markdown' }
  );
});

// Helper function to check if a message is a comment
function isComment(text) {
  return text.startsWith('#') || text.startsWith('//');
}

// Helper function to convert text to speech
async function textToSpeech(text, outputPath) {
  try {
    const response = await axios({
      method: 'post',
      url: process.env.TTS_API_URL,
      data: {
        text: text,
        format: 'wav'
      },
      responseType: 'stream',
      seed: 12,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Save the audio file
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error converting text to speech:', error.message);
    throw error;
  }
}

// Handle text messages
bot.on('message:text', async (ctx) => {
  const messageText = ctx.message.text;
  
  // Ignore comments
  if (isComment(messageText)) {
    await ctx.reply('Ignoring comment message.');
    return;
  }

  try {
    // Send a "processing" message and store the message object
    const processingMsg = await ctx.reply('Converting your text to speech...');
    
    // Generate a unique filename for this conversion
    const timestamp = Date.now();
    const userId = ctx.from.id;
    const outputPath = path.join(tempDir, `speech_${userId}_${timestamp}.wav`);
    
    // Convert text to speech
    await textToSpeech(messageText, outputPath);
    
    // Send the audio file back to the user using
    // await ctx.replyWithAudio(new InputFile(outputPath));
    await ctx.replyWithVoice(new InputFile(outputPath));
    
    // Delete the "Converting your text to speech..." message
    await ctx.api.deleteMessage(ctx.chat.id, processingMsg.message_id);
    
    // Clean up the file after sending
    fs.unlinkSync(outputPath);
    
  } catch (error) {
    console.error('Error processing message:', error);
    await ctx.reply('Sorry, there was an error processing your message. Please try again later.');
  }
});

// Handle errors
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Start the bot with more detailed options
console.log('Starting bot...');
bot.start({
  drop_pending_updates: true,
  onStart: (botInfo) => {
    console.log(`Bot started as @${botInfo.username}`);
    console.log('Bot information:', JSON.stringify(botInfo, null, 2));
  }
}).catch(err => {
  console.error('Failed to start bot:', err);
});
