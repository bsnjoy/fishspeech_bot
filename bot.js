require('dotenv').config();
const { Bot } = require('grammy');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

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
    // Send a "processing" message
    await ctx.reply('Converting your text to speech...');
    
    // Generate a unique filename for this conversion
    const timestamp = Date.now();
    const userId = ctx.from.id;
    const outputPath = path.join(tempDir, `speech_${userId}_${timestamp}.wav`);
    
    // Convert text to speech
    await textToSpeech(messageText, outputPath);
    
    // Send the audio file back to the user
    await ctx.replyWithVoice({ source: outputPath });
    
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

// Start the bot
bot.start();
console.log('Bot started successfully!');
