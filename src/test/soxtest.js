var sox = require('sox');
var SoxCommand = require('sox-audio');
var TimeFormat = SoxCommand.TimeFormat;
runTest();

function runTest() {
    Promise.all([identifyWav('public/recordings/5a02fe3fce8e1017d90a8ce9-5a025405edc7b652c3ea889b-rec.wav'),identifyWav('backingtracks/openness.wav')])
    .then((waveInfo) => {
        console.log("Wave info", waveInfo);
        
    //    var endTimeFormatted = TimeFormat.formatTimeRelativeToEnd(waveInfo[1].duration - waveInfo[0].duration - 3);
        var startTimeFormatted = TimeFormat.formatTimeAbsolute(waveInfo[0].duration + 3 + 3);

        var subCommand = SoxCommand('public/recordings/5a02fe3fce8e1017d90a8ce9-5a025405edc7b652c3ea889b-rec.wav')
        .output('-p')
        //.output('test.wav')
        .outputSampleRate(44100)
        .outputChannels(2)
        .outputFileType('wav')
        .addEffect('delay', '3');

        var command = SoxCommand()
        .inputSubCommand(subCommand)
        .input('-v 0.5 backingtracks/openness.wav')
        .combine('mix')
        .output('mix.mp3')
        .outputFileType('mp3')
        .trim(0, startTimeFormatted)
        .addEffect('fade', 't 0 0 5');

        var errorThrow = function(err, stdout, stderr) {
          console.log('Cannot process audio: ' + err.message);
          console.log('Sox Command Stdout: ', stdout);
          console.log('Sox Command Stderr: ', stderr)
          throw new Error(err.message);
        };

        command.on('error', errorThrow);
        subCommand.on('error', errorThrow);

        command.run();
    })
    .catch((err) => {
        console.log("Promise error!",err);
    })
}



function identifyWav(file) {
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

