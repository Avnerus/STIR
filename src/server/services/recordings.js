import Alarm from '../models/alarm'
import Session from '../models/session-persistent'
import SoxUtil from '../util/sox'
import formidable from 'formidable'
import MTurkUtil from '../util/mturk'
import DownloadUtil from '../util/download'
import S3Util from '../util/s3'
import TwiMLService from './twiml'

const BACKING_TRACKS = {
    big5_agreeableness: 'agreeableness.wav',
    big5_conscientiousness: '_2014_.wav',
    big5_extraversion: 'extraversion.wav',
    big5_neuroticism: 'neuroticism.wav',
    big5_openness: 'openness.wav'
}

export default class RecordingsService {
    constructor() {
        this.events = ['ready'];
    }
    setup(app) {
        this.app = app;
    }
    find(params) {
        // Return just the status
        return Promise.resolve(params.user.status);
    }

    create(data,params) {
        console.log("RecordingsService::create! ", data,params);
        // Create a pending recording for this user
        //
        return TwiMLService.dispatchRecordingCall(data, params);
    }

    patch(id, data, params) {
        console.log("Finalize alarm!", id, data, params);
        // Get the alarm
        return Alarm.findOne({
            _id: id
        }).then((alarm) => {
            console.log("Found alarm", alarm);            
            if (alarm.recording.rouserId.toString() == params.user._id.toString()) {
                console.log("Patching");
                let query = {};
                query['recording.finalized'] = data['recording.finalized'];
                return this.app.service('/alarms/sleeper').patch(id, query);
            } else {
                throw new Error("Invalid rouser id for this alarm!")
            }
        })
        .then((result) => {
            if (data['recording.finalized'] == true) {
                console.log("Alarm recorded!", result);
                this.emit('finalized', result);
                this.app.service("users").patch(params.user._id, {$inc: {alarmsRecorded: 1}});
                // Upload to S3
                S3Util.uploadRecordings(result, this.app);
                return {status: "success"}
            }
        });
    }


    ready(data) {
        console.log("Recording file is ready! mixing",data);
        this.app.service('/alarms/sleeper').get(data.alarmId, {query: {$select:['generatedFrom'] }})
        .then((alarm) => {
            console.log("Alarm data", alarm);
            // Mix
            return SoxUtil.mixBackingTrack(
                'public/recordings/' + data.alarmId + '-' + data.rouserId + '-rec.wav',
                'backingtracks/' + BACKING_TRACKS[alarm.generatedFrom.big5],
                'public/recordings/' + data.alarmId + '-' + data.rouserId + '-mix.mp3'
            )
        })
        .then((result) => {
            console.log("Mixing result", result);
            data.mixUrl = '/recordings/' + data.alarmId + '-' + data.rouserId + '-mix.mp3?t=' + new Date().getTime();
            let recording = Object.assign({}, data);
            recording.finalized = false;
            data.status = "success";
            delete recording.alarmId;
            this.app.service('/alarms/sleeper').patch(data.alarmId,{recording: recording})
            this.emit('ready', data);
        })
        .catch((err) => {
            console.log("Mixing error",err);
            data.status = "error";
            data.message = err.toString();
            this.emit('ready', data);
        });
    }

    upload(req, res) {
        console.log("Recording upload!");
        let recordingFile;
        let destinationPath;
        let mixPath;
        let alarmId;
        let targetAlarm;

        this.parseForm(req)
        .then((form) => {
            // Find the hit
            recordingFile = form.files.file;
            return MTurkUtil.getHIT(form.fields.hitId)
        })
        .then((hit) => {
            console.log(hit.HITStatus);
            if (hit && hit.HITStatus != 'Disposed') {
                console.log("Got HIT");
                // Find the alarn
                return Alarm.findOne({
                    _id: hit.RequesterAnnotation,
                    'recording.finalized': false,
                    mturk: true,
                    time: {$gt: new Date()}
                })
            } else {
                throw new Error("There is no avaialble HIT");
            }
        })
        .then((alarm) => {
            if (alarm) {
                targetAlarm = alarm;
                console.log("Alarm: ", alarm);
                alarmId = alarm._id;
                destinationPath = 'recordings/' + alarm._id + '-rec.wav';
                mixPath = 'recordings/' + alarm._id + '-mix.mp3';

                // Copy the file
                return DownloadUtil.copyFile(recordingFile.path, 'public/' + destinationPath) ;
            } else {
                throw new Error("There is no Alarm for this HIT");
            }
        })
        .then(() => {
            return SoxUtil.mixBackingTrack(
                'public/' + destinationPath,
                'backingtracks/' + BACKING_TRACKS[targetAlarm.generatedFrom.big],
                'public/' + mixPath
            )
        })
        .then(() => {
            // Finalize!
            return this.app.service('/alarms/sleeper').patch(alarmId, {
                'recording.finalized': true,
                'recording.recordingUrl':  '/' + destinationPath,
                'recording.mixUrl': '/' + mixPath,
            });
        })
        .then((result) => {
            S3Util.uploadRecordings(result, this.app);
            res.send(process.env['S3_URL'] + '/' + destinationPath)
        })
        .catch((err) => {
            console.log("Error receiving upload!", err);
            res.status(500).send(err.message)
        })
    }

    parseForm(req) {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();

            form.parse(req, function(err, fields, files) {
              console.log("Received form", fields, files);
              if (!err && fields && files) {
                resolve({
                    fields: fields,
                    files: files
                })
              } else {
                  reject(err);
              }
            });
        })
    }
}
