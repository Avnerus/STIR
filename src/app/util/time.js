import jstz from 'jstimezonedetect'

class TimeUtil {
    constructor() {
    }

    getDateMessageId(alarmTime) {
        let alarmDate = new Date(alarmTime);
        let today = new Date();
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        if (today.getDate() == alarmDate.getDate()) {
            return 'ALARM_TODAY';
        }
        else if (tomorrow.getDate() == alarmDate.getDate()) {
            return 'ALARM_TOMORROW';
        } else {
            return 'ALARM_DATE';
        }
    }

    getAlarmTime(timeInput) {
        let timeComponents = timeInput.split(":");
        let alarmTime = new Date(new Date().setHours(timeComponents[0],timeComponents[1],0));

        if (alarmTime.getTime() < new Date().getTime()) {
            console.log("Alarm will be set for tomorrow");
            alarmTime.setDate(alarmTime.getDate() + 1);
        }
        alarmTime.setMilliseconds(0);
        return alarmTime;
    }

    getTimezone() {
        let timezone;

        let tz = jstz.determine();
        timezone = tz.name();

        console.log("User timezone: ", timezone);
        return timezone;
        
        /*
        else if (dtf.formatToParts) {
            return dtf.formatToParts(new Date())[6].value;
        } else {
            let tz = null;
            try {
                tz = (new Date).toString().split('(')[1].slice(0, -1);
            }
            catch (err) {
            }
            return tz || "LOCAL TIME";
        }
        return "LOCAL TIME"; */
    }

    getDefaultTime() {
        let defaultTime = new Date(new Date().setHours(9,0,0));
        let now = new Date();
        if (now.getHours() != 0) {
            defaultTime.setDate(defaultTime.getDate() + 1);
        }
        defaultTime.setMilliseconds(0);
        return defaultTime;
    }

    getDiff(date) {
        // https://stackoverflow.com/questions/7709803/javascript-get-minutes-between-two-dates
        let today = new Date();
        let diffMs = (date - today);
        let diffDays = Math.floor(diffMs / 86400000); // days
        let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        return {
            days: diffDays,
            hours: diffHrs,
            minutes: diffMins
        }
    }
};

// Singleton
let instance = new TimeUtil();
export default instance;

