import sox from 'sox'
import SoxCommand from 'sox-audio';

const FADE_DELAY_BEFORE_REC = 5;
const FADE_OUT_TIME = 8;

class SoxUtil {
    constructor() {
    }
    mixBackingTrack(recording, backingTrack, output){
        const TimeFormat = SoxCommand.TimeFormat;
        return Promise.all([this.identifyWav(recording),this.identifyWav(backingTrack)])
        .then((waveInfo) => {
            return new Promise((resolve, reject) => {
                console.log("Wave info", waveInfo);

                let startTimeFormatted = TimeFormat.formatTimeAbsolute(waveInfo[0].duration + FADE_DELAY_BEFORE_REC + FADE_OUT_TIME);

                let subCommand = SoxCommand(recording)
                .output('-p')
                .outputSampleRate(44100)
                .outputChannels(2)
                .outputFileType('wav')
                .addEffect('delay',FADE_DELAY_BEFORE_REC);

                let command = SoxCommand()
                .inputSubCommand(subCommand)
                .input('-v 0.3 ' + backingTrack)
                .combine('mix')
                .output(output)
                .outputFileType('mp3')
                .trim(0, startTimeFormatted)
                .addEffect('fade', 't ' + FADE_DELAY_BEFORE_REC + ' 0 ' + FADE_OUT_TIME);

                let errorThrow = function(err, stdout, stderr) {
                  console.log('Cannot process audio: ' + err.message);
                  console.log('Sox Command Stdout: ', stdout);
                  console.log('Sox Command Stderr: ', stderr)
                  reject(new Error(err.message));
                };

                command.on('error', errorThrow);
                subCommand.on('error', errorThrow);

                command.on('end', function() {
                      resolve({status: "success"})
                });

                command.run();

            });
        })
    }
    identifyWav(file) {
        return new Promise((resolve, reject) => {
            sox.identify(file, function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
};

// Singleton
let instance = new SoxUtil();
export default instance;


