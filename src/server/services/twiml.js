import TwilioUtil from '../util/twilio'
import {twiml} from 'twilio'
import User from '../models/user'
import Session from '../models/session-persistent'
import DownloadUtil from '../util/download'
import {decrypt} from './encrypt-user'

const TWIML_SESSIONS = {};

export default { 
    getRecordingTwiML: function(req,res) {
        console.log("TWIML RECORDING SERVICE CALLED!");
        const response = new twiml.VoiceResponse();
        // Get the pending recording 
        Promise.resolve({})
        .then(() => {
            let twimlSession = TWIML_SESSIONS[req.body.CallSid];
            if (!twimlSession || !twimlSession.pendingRecording) {
                response.say({}, "Sorry, there is no pending recording for you right now");
            } else {
                return User.findOne({_id: twimlSession.pendingRecording.rouserId})
                .then((user) => {
                    console.log("Found user ", user);
                    if (req.body.RecordingSid) {
                        response.say({}, "Thank you mister");
                    } else {
                        response.say({}, "It's S T I R time! Record something for 10 seconds and then press hash");
                        response.record({
                                timeout: 10,
                                recordingStatusCallback: '/twiml/recording-status',
                                finishOnKey: '#'
                        });
                    }
                })
                .catch((err) => {
                    console.log("Error in twiml service!", err);
                    response.say({}, "Sorry, a Stir error has occured");
                    delete TWIML_SESSIONS[req.body.CallSid];
                })
            }

        })
        .then(() => {
            res.type('text/xml');
            res.send(response.toString());
        })
        .catch((err) => {
            console.log("Error in recording service!",err);
            res.send(err.message);
        })
    },

    getAlarmTwiML: function(req,res) {
        console.log("TWIML ALARM SERVICE CALLED!", req.body);
        const response = new twiml.VoiceResponse();

        const defaultText = "Good morning from Stir. We're sorry but no one was able to record your personalized message. But please wake up anyway!";
        
        Promise.resolve({})
        .then(() => {
            let twimlSession = TWIML_SESSIONS[req.body.CallSid];
            if (!twimlSession || !twimlSession.pendingAlarm) {
                throw new Error("No pending alarm call!");
            } else {
                return twimlSession.pendingAlarm;
            }
        })
        .then((alarm) => {
            req.app.service('alarms/rouser').alarmDelivered(alarm);

            if (
                alarm.recording && 
                alarm.recording.finalized
            ) {
                if (alarm.recording.mixUrl.match(/^http.*/)) {
                    response.play({},alarm.recording.mixUrl);
                } else {
                    response.play({},SERVER_URL + alarm.recording.mixUrl);
                }
            } else {
                response.say({}, defaultText);
            }
           
        })
        .then(() => {
            delete TWIML_SESSIONS[req.body.CallSid];
            res.type('text/xml');
            res.send(response.toString());
        })
        .catch((err) => {
            console.log("Error in twiml alarm service!", err);
            let errorResponse = new twiml.VoiceResponse();
            errorResponse.say({}, defaultText);
            res.type('text/xml');
            res.send(response.toString());

            if (TWIML_SESSIONS[req.body.CallSid]) {
                delete TWIML_SESSIONS[req.body.CallSid];
            }
        })
    },
    dispatchRecordingCall: function(data, params) {
        console.log("TWIML Dispatch recording!");
        return TwilioUtil.client.calls.create({
                url: SERVER_URL + '/twiml-rec.xml',
                to: decrypt(params.user.phone),
                from: TwilioUtil.TWILIO_PHONE_NUMBER
        }).then((response) => {
            TWIML_SESSIONS[response.sid] = {
                pendingRecording: data
            }

            return {status: "success"}
        })
        .catch((err) => {
            console.log("Error dispatching call", err )
            throw new Error(err);
        })
    },
    dispatchAlarmCall: function(user, alarm) {
        console.log("TWIML Dispatch alarmo!");
        return TwilioUtil.client.calls.create({
                url: SERVER_URL + '/twiml-alarm.xml',
                to: user.phone,
                from: TwilioUtil.TWILIO_PHONE_NUMBER
        }).then((response) => {
            TWIML_SESSIONS[response.sid] = {
                pendingAlarm: alarm
            }
            return {status: "success"}
        })
        .catch((err) => {
            console.log("Error dispatching call", err )
            throw new Error(err);
        })
    },
    getRecordingStatus: function(req,res) {
        console.log("getRecordingStatus called!", req.body);
        if (req.body.RecordingStatus == 'completed') {
            let sessionData = TWIML_SESSIONS[req.body.CallSid];
            if (sessionData && sessionData.pendingRecording) {
                console.log("Downloading recording!", sessionData.pendingRecording);
                let recordingUrl = 
                    '/recordings/' + 
                    sessionData.pendingRecording.alarmId + '-' + 
                    sessionData.pendingRecording.rouserId +
                    '-rec.wav';
                DownloadUtil.saveUrl(req.body.RecordingUrl, 'public' + recordingUrl)
                .then(() => {
                    console.log("Finished download!");
                    sessionData.pendingRecording.recordingUrl = recordingUrl + '?t=' + (new Date).getTime();
                    req.app.service('recordings').ready(sessionData.pendingRecording);
                    delete TWIML_SESSIONS[req.body.CallSid];
                })
                .catch((err) => {
                    console.log("Error downloading file!", err);
                    delete TWIML_SESSIONS[req.body.CallSid];
                })
                res.send({status: "success"});
            } else {
                res.send("No pending recording");
            }
        } else {
            if (TWIML_SESSIONS[req.body.CallSid]) {
                delete TWIML_SESSIONS[req.body.CallSid];
            }
            res.send("Recording not completed");
        }
    }
}

