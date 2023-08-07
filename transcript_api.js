// Imports the Google Cloud client library and create a client
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

// Set openai api configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


// Transcription function
async function transcribe(transcript_type) {
  const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';
  const audio = {
    uri: gcsUri,
  };

  switch (transcript_type) {
    case 'phone no':
      speechContext = [{}];
      break;
    case 'address':
      speechContext = [{}];
      break;
    case 'bank name':
      speechContext = [{
        "phrases": [
          { "value": "HDFC", "boost": 20 },
          { "value": "ICICI", "boost": 20 },
        ]
      }
      ];
      break;
    case 'bank name':
      speechContext = [{
        "phrases": [
          { "value": "HDFC", "boost": 20 },
          { "value": "ICICI", "boost": 20 },
        ]
      }
      ]
      break;
    case 'number':
      speechContext = [{}];
      break;
    default:
      speechContext = [{}];
      break;
  }

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'hi-IN',
    model: 'latest_long',
    alternativeLanguageCodes: ['en-US'],
    useEnhanced: true,
    "speechContexts": speechContext,
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
  cleanup(transcription + " ABC-123, Thomas Lane, New Delhi", transcript_type);  // Added as an example address
}

// Transcription cleanup function
async function cleanup(transcribed_text, transcript_type) {

  switch (transcript_type) {
    case 'phone no':
      gpt_prompt = "Reply only with a well formatted address, no other words by extracting a phone number from the given text: " + transcribed_text
      break;
    case 'address':
      gpt_prompt = "Reply only with a well formatted address, no other words by extracting an address from the given text: " + transcribed_text
      break;
    case 'bank name':
      gpt_prompt = "Reply only with a well formatted address, no other words by extracting a Bank name from the given text: " + transcribed_text
      break;
    case 'number':
      gpt_prompt = "Reply only with a well formatted address, no other words by extracting a single digit number from the given text: " + transcribed_text
      break;
  }

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: gpt_prompt,
  });
  console.log(transcribed_text);
  console.log(completion.data.choices[0].text);
}

transcribe('address');
