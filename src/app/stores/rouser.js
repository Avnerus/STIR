import Store from './store';
import SocketUtil from '../util/socket'
import MiscUtil from '../util/misc'

export default class RouserStore extends Store {

    constructor(state) {
        super(state);
        this.status = null;
        this.action = null;
        this.alarms = null;
        this.currentAlarm = null;
    }

    recordingReady(data) {
        if (!this.currentAlarm) {
            this.currentAlarm.recording = {};
        }
        this.currentAlarm.recording = data;
    }

    async getAlarms(contact) {
        try {
            if (!this.alarms && !this.gettingAlarms) {
                this.gettingAlarms = true;
                console.log("Get rouser alarms");
                this.alarms = await SocketUtil.rpc('alarms/rouser::find', {accessToken: this._state.auth.accessToken});
                this.gettingAlarms = false;
                this.clientTrigger('queue_updated')
            }
        }
        catch (e) {
            console.log("Error getting alarm queue", e);                    
            this.gettingAlarms = false;
        }
    }

    invalidateAlarms() {
        console.log("Rouser refresh");
        this.alarms = null;
    }

    setAction(action) {
        if (this.action != action) {
            console.log("Set rouser action", action);
            this.action = action;
            if (action == "alarms") {
                this.currentAlarm = null;
            }
            this.clientTrigger('action_updated', action);
        }
        if (action == null && IS_CLIENT) {
            // In case the video was playing
            $('#rouser-intro-panel').find('video')[0].pause();
        }
    }

    setRecordStage(stage) {
        console.log("Set record stage", stage);
        this.recordStage = stage;
        this.clientTrigger('record_stage_updated');
    }

    async chooseAlarm(id, mturk) {
        if (!this.currentAlarm || this.currentAlarm._id.toString() != id.toString()) {
            console.log("Rouser chooses alarm ", id);
            if (this.alarms) {
                this.currentAlarm = MiscUtil.findById(this.alarms,id);
            } else {
                this.currentAlarm = await SocketUtil.rpc('alarms/rouser::get', id, {accessToken: this._state.auth.accessToken, mturk: mturk});
            }
            console.log("Current alarm", this.currentAlarm);
            this.clientTrigger("alarm_loaded");
        }
    }

    async requestCall() {
        console.log("Requesting a call for alarm", this.currentAlarm);
        let result = await SocketUtil.rpc("recordings::create",{alarmId: this.currentAlarm._id});
        return result;
    }

    async finalizeAlarm() {
        console.log("Finalizing alarm");
        let result = await SocketUtil.rpc(
            "recordings::patch",
            this.currentAlarm._id, 
            {'recording.finalized': true}
        );
        return result;
    }
};
