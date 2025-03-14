require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Check if TTS_API_URL is set
if (!process.env.TTS_API_URL) {
  console.error('Error: TTS_API_URL is not set in .env file');
  process.exit(1);
}

// Sample text to convert
const sampleText = process.argv[2] || "This is a test of the text-to-speech API.";

// Output file path
const outputPath = path.join(__dirname, 'test-output.wav');

console.log(`Converting text: "${sampleText}"`);
console.log(`Using API URL: ${process.env.TTS_API_URL}`);

// Function to convert text to speech
async function testTextToSpeech() {
  try {
    console.log('Sending request to TTS API...');
    
    const response = await axios({
      method: 'post',
      url: process.env.TTS_API_URL,
      data: {
        text: sampleText,
        format: 'wav'
      },
      responseType: 'stream',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response received, saving audio file...');
    
    // Save the audio file
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Audio file saved to: ${outputPath}`);
        resolve();
      });
      writer.on('error', (err) => {
        console.error('Error writing file:', err);
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error converting text to speech:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testTextToSpeech()
  .then(() => console.log('Test completed successfully!'))
  .catch(err => console.error('Test failed:', err));
