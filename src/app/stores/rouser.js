import Store from './store';
import SocketUtil from '../util/socket'
import MiscUtil from '../util/misc'

export default class RouserStore extends Store {

    constructor(state) {
        super(state);
        this.status = null;
        this.signUpStage = "contact";
        this.action = null;
        this.alarms = null;
        this.currentAlarm = null;
    }
    async getStatus() { 
        if (!this.status)  {
            try {
                let result = await SocketUtil.rpc('user/contact::find', {accessToken: this._state.auth.accessToken});
                console.log("Rouser contact status", result);
                this.status = result;
                this.trigger("status_updated");
            }

            catch (e) {
                console.log("Error getting rouser status  ", e);                    
            }
        }
    }

    async getAlarms(contact) {
        try {
            if (!this.alarms) {
                console.log("Get rouser alarms");
                this.alarms = await SocketUtil.rpc('rouser/alarms::find', {accessToken: this._state.auth.accessToken});
                console.log("Rouser alarms queue", this.alarms);
            }
        }
        catch (e) {
            console.log("Error getting alarm queue", e);                    
        }
    }

    setAction(action) {
        this.action = action;
        this.trigger('action_updated', action);
    }

    setSignUpStage(stage) {
        console.log("Set sign up stage", stage);
        this.signUpStage = stage;
        this.trigger('rouser_sign_up_stage');
    }

    setRecordStage(stage) {
        console.log("Set record stage", stage);
        this.recordStage = stage;
        this.trigger('record_stage_updated');
    }

    chooseAlarm(id) {
        console.log("Rouser chooses alarm ", id);
        this.currentAlarm = MiscUtil.findById(this.alarms,id);
        console.log("Current alarm", this.currentAlarm);
    }

    async requestCall() {
        console.log("Requesting a call for alarm", this.currentAlarm);
        let result = await SocketUtil.rpc("recordings::create",{alarmId: this.currentAlarm._id});
        return result;
    }

};
