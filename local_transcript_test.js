// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

// Creates a client
const client = new speech.SpeechClient();

async function quickstart() {
    const filename = 'test_boost.wav';
    const encoding = 'LINEAR16';
    const sampleRateHertz = 32000;
    const languageCode = 'hi-IN';
    model = 'latest_long'

    // phrase_set = speech.PhraseSet(phrases=[{"value":"HDFC", "boost": 20}]);
    // adaptation = speech.SpeechAdaptation(
    //     phrase_sets=[
    //         cloud_speech.SpeechAdaptation.AdaptationPhraseSet(
    //             inline_phrase_set=phrase_set
    //         )
    //     ]
    // );

    const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
        model: model,
        alternativeLanguageCodes: ['en-US'],
        useEnhanced: true,
        "speechContexts": [{
            "phrases": [
                { "value": "whether", "boost": -20 },
                { "value": "weather", "boost": 20 },
            ]
        }
        ],
    };

    /**
     * Note that transcription is limited to 60 seconds audio.
     * Use a GCS file for audio longer than 1 minute.
     */
    const audio = {
        content: fs.readFileSync(filename).toString('base64'),
    };

    const request = {
        config: config,
        audio: audio,
    };

    // Detects speech in the audio file. This creates a recognition job that you
    // can wait for now, or get its result later.
    const [operation] = await client.longRunningRecognize(request);

    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);
}
quickstart();