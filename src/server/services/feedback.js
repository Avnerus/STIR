import Errors from 'feathers-errors'
import TwilioUtil from '../util/twilio'
import {IntlMixin} from 'riot-intl'
import {BaseI18n} from '../../app/i18n/i18n'

const MAX_TEXT_LENGTH = 120;

export default class FeedbackService {
    constructor() {
    }
    setup(app) {
        this.app = app;
    }
    create(data,params) {
        console.log("FeedbackService::create! ", data,params);
        let targetAlarm;

        return this.app.service("alarms/sleeper").get(data.alarmId)
        .then((alarm) => {
            console.log("Alarm", alarm);
            if (
                alarm.userId.toString() == params.user._id.toString() && 
                !alarm.sentFeedback &&
                data.text.length <= MAX_TEXT_LENGTH &&
                alarm.assignedTo &&
                !alarm.mturk
            ) {
                // Get the rouser
                targetAlarm = alarm;
                return this.app.service("users").get(alarm.assignedTo);
            } else {
                throw new Errors.Forbidden();
            }
        })
        .then((rouser) => {
            if (!rouser.phone) {
                let errorMessage = IntlMixin.formatMessage('FEEDBACK_CANT_REACH',{
                },BaseI18n,params.user.locale);
                throw new Error(errorMessage);
            }
            let message = IntlMixin.formatMessage('FEEDBACK_MESSAGE',{
                name: targetAlarm.name,
                text: data.text
            },BaseI18n,rouser.locale);

            console.log("Message: " + message);

            return TwilioUtil.sendMessage(rouser.phone, message);
        })
        .then((result) => {
            this.app.service("alarms/sleeper").patch(data.alarmId, {sentFeedback: true});
            return {status: "success"};
        })

    }
}
