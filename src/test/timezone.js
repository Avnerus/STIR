import IntlMixin from 'riot-intl/src/mixin'
import {BaseI18n, withTimezone} from '../app/i18n/i18n'

let message = IntlMixin.formatMessage('FAIL_NOTIFY',{
        name: "Tester",
        time: new Date("2017-11-13T18:40:00.000Z")
},withTimezone("Europe/Helsinki"),"en");

console.log(message);


