import TwilioUtil from '../util/twilio'
import STIRError from '../../app/stir-error'
import Alarm from '../models/alarm'
import {BaseI18n} from '../../app/i18n/i18n'
import {IntlMixin} from 'riot-intl'

export default class UserContactService {
    setup(app) {
        this.app = app;
    }
    find(params) {
        // Return just the status + role + name + country/code + locale + pronoun
        return Promise.resolve({
            status: params.user.status,
            role: params.user.role,
            name: params.user.name,
            country: params.user.country,
            countryCode: params.user.countryCode,
            locale: params.user.locale,
            alarmLocales: params.user.alarmLocales,
            pronoun: params.user.pronoun,
            env: {
                tooEarlyHours: this.app.service('alarms/rouser').getTooEarlyHours()
            }
        });
    }

    patch(id,data,params) {
        console.log("update user contact!", data,params);
        // Only allow updating the locale or pronoun
        if (Object.keys(data).length == 0) {
            return Promise.reject(new Error("No user data"));
        }
        else if (data.pronoun && data.pronoun != 'he' && data.pronoun != 'she' && data.pronoun != 'they') {
            return Promise.reject(new Error("Invalid pronoun!"));
        }
        else return this.app.service("users").patch(params.user._id, data)
        .then(() => {
            return Promise.resolve({status: 'success'})
        })
    }

    create(data,params) {
        console.log("set user contact", data,params);

        if (data.code && params.user.verificationCode) {
            return this.verify(data,params,params.user)
        } else {
            return this.generateVerficationCode(data,params, data.phone);
        }
    }

    generateVerficationCode(data, params, phone) {
        if (!data.phone) {
            return Promise.reject(new Error("Data does not contain a phone number"));
        }
        data.verificationCode = this.get4DigitCode();

        data['status.phoneValidated'] = false;
        
        return this.app.service("users").patch(params.user._id, data)
        .then((result) => {
           console.log("User updated sending text");
            let message = IntlMixin.formatMessage('CODE_MESSAGE',{
                number: data.verificationCode
            },BaseI18n,params.user.locale);
           return TwilioUtil.client.messages.create({
                body: message,
                to: phone,  
                from: TwilioUtil.TWILIO_PHONE_NUMBER
           })
        })
        .then((result) => {
            console.log("SMS result", result);
            return Promise.resolve({
                status: "success"
            });
        })
        .catch((err) => {
           console.log("Error updating contact", err);
           return Promise.reject(err);
        }) 
    }

    verify(data,params,contact) {
        console.log("Verify code service", data,params);
        console.log("User contact", contact);

        if (data.code == contact.verificationCode) {
            // Check that nobody already has that phone
            let refresh = false;

            return this.app.service("users").find({query: {
                phone: contact.phone,
                _id: {$ne: params.user._id}
            }})
            .then((result) => {
                if (result.length > 0) {
                    let user = result[0];
                    console.log("There is already a user with this phone!", user._id);
                    refresh = true;
                    // Remove the phone field
                    return this.app.service("users").patch(user._id, {
                         $unset: { phone: "" } ,
                         'status.phoneValidated': false
                    })
                    .then(() => {
                        return Alarm.update(
                            { 
                               'userId': user._id,
                            }, 
                            { $set: { userId: params.user._id  }},
                            { multi: true  }
                        );
                    })
                    .then(() => {
                        // Refersh alarms
                        this.app.service('alarms/rouser').getPendingAlarms();
                        return;
                    })
                }            
                else {
                    return;
                }
            })
            .then((result) => {
                return this.app.service("users").patch(params.user._id, {'status.phoneValidated': true})
            })
            .then((result) => {
               console.log("Patched contact", result);
               return {status: "success", refresh: refresh}
            })
            .catch((err) => {
                console.log("Error updating contact", err);
                if ((err.code && err.code == "EXISTS") || (err.name && err.name == 'Conflict')) {
                    return {status: "EXISTS"};
                } else {
                    throw (err);
                }
            });
        } else {
            return Promise.reject(new Error("Code is incorrect"));
        }
    }


    get4DigitCode() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    clearData(userId) {
        // Make sure there are no upcoming alarms for this user
        return Alarm.count({
            userId: userId,
            deleted: false,
            time: {$gt: new Date()}
        })
        .then((count) => {
            if (count == 0) {
                console.log("Clearing phone number and SNS");
                return this.app.service("users").patch(userId, {
                     $unset: { 
                         phone: "",
                         twitter: "",
                         facebook: ""
                     } ,
                     'status.phoneValidated': false
                })
            } else {
                console.log("NOT clearing out phone number because there are still alarms to go");
            }
        })
    }

    clearTokens(userId) {
        return this.app.service("users").patch(userId, {
             $unset: { 
                 twitter: "",
                 facebook: ""
             }
        })
    }
}
