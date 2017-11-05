export default class RouteUtil {
    constructor(state, intl) {
        this.state = state;
        this.intl = intl;
    }
    async routeSignup() {
        try {
            if (this.state.main.role == 'sleeper') {
                if (!this.state.auth.user.alarmLocales || this.state.auth.user.alarmLocales.length == 0) {
                    page("/sign-up/locale");
                } else if (!this.state.auth.user.pronoun) {
                    page("/sign-up/pronoun");
                }
                else if (this.state.sleeper.currentAlarm) {
                    await this.state.sleeper.addAlarm();
                    page("/sleeper/alarms");
                } else {
                    page("/");
                }
            } else if(this.state.main.role == 'rouser') {  // Rouser 
                if (!this.state.auth.user.alarmLocales || this.state.auth.user.alarmLocales.length == 0) {
                    page("/sign-up/locale");
                } else if (this.state.rouser.currentAlarm) {
                    page("/rouser/alarm/" + this.state.rouser.currentAlarm._id + "/record")                
                } else {
                    page("/rouser/alarms")
                }
            } else {
                page("/");
            }
        }

        catch(err) {
            if (err.code && err.code == 409) {
                phonon.alert(
                    this.intl.formatMessage('ALARM_EXISTS'),
                    "Oops", 
                    false, 
                    "Ok"
                );
            } else {
                phonon.alert(err.message, "Oops", false, "Ok");
            }
            this.state.sleeper.currentAlarm = null;
        }
    }
};

