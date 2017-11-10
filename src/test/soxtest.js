var sox = require('sox');
var SoxCommand = require('sox-audio');
var TimeFormat = SoxCommand.TimeFormat;
runTest();

function runTest() {
    Promise.all([identifyWav('public/recordings/5a0600ab8cd84d14a2d9adbf-5a05fec88cd84d14a2d9adbe-rec.wav'),identifyWav('backingtracks/openness.wav')])
    .then((waveInfo) => {
        console.log("Wave info", waveInfo);
        
    //    var endTimeFormatted = TimeFormat.formatTimeRelativeToEnd(waveInfo[1].duration - waveInfo[0].duration - 3);
        var startTimeFormatted = TimeFormat.formatTimeAbsolute(waveInfo[0].duration + 5 + 8);

        var subCommand = SoxCommand('public/recordings/5a0600ab8cd84d14a2d9adbf-5a05fec88cd84d14a2d9adbe-rec.wav')
        .output('-p')
        //.output('test.wav')
        .outputSampleRate(44100)
        .outputChannels(2)
        .outputFileType('wav')
        .addEffect('delay', '5');

        var command = SoxCommand()
        .inputSubCommand(subCommand)
        .input('-v 0.5 backingtracks/openness.wav')
        .combine('mix')
        .output('mix.mp3')
        .outputFileType('mp3')
        .trim(0, startTimeFormatted)
        .addEffect('fade', 't 5 0 8');

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

