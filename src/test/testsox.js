var spawn = require('child_process').spawn;
//var soxProc = spawn('/bin/sh', ['-c','"sox public/recordings/59f33df168bac26dd7006caf-59f25adcaa2aa76473e3ffa6-rec.wav -r 44100 -c 2 -t wav -p delay 3 | sox - backingtracks/_2014_.wav -t mp3 public/recordings/59f33df168bac26dd7006caf-59f25adcaa2aa76473e3ffa6-mix.mp3 --combine mix trim 0 =9.925 fade t 0 0 5"'], {});

var soxProc = spawn('/bin/sh', ['-c','sox public/recordings/59f33df168bac26dd7006caf-59f25adcaa2aa76473e3ffa6-rec.wav -r 44100 -c 2 -t wav -p delay 3 | sox - backingtracks/_2014_.wav -t mp3 public/recordings/59f33df168bac26dd7006caf-59f25adcaa2aa76473e3ffa6-mix.mp3 --combine mix trim 0 =9.925 fade t 0 0 5'], {});

soxProc.on('error', function(err) {
	console.log("ERROR!", err);
});

soxProc.on('exit', function(code, signal) {
	console.log('Sox process exited with code ' + code +
		' and signal ' + signal);
});


