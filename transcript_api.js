// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

async function transcribe(transcript_type) {
  // The path to the remote LINEAR16 file
  const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
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
}

const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function cleanup (transcribed_text) {
const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "How are you today?",
});
console.log(transcribed_text);
console.log(completion.data.choices[0].text);
}

transcribe('phone no');
cleanup("some text");
