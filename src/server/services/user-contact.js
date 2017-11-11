import TwilioUtil from '../util/twilio'
import STIRError from '../../app/stir-error'
import Session from '../models/session-persistent'
import Alarm from '../models/alarm'
import {encrypt} from './encrypt-user'

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
        let session = Session.getFor(params.user._id);

        if (data.code && session && session.contact && session.contact.verificationCode) {
            return this.verify(data,params,session.contact)
        } else {
            return this.generateVerficationCode(data,params);
        }
    }

    generateVerficationCode(data, params) {
        if (!data.phone) {
            return Promise.reject(new Error("Data does not contain a phone number"));
        }
        data.verificationCode = this.get4DigitCode();

        // Save in the session
        Session.setFor(params.user._id, {contact: data});
        
        return this.app.service("users").patch(params.user._id, {'status.phoneValidated' : false})
        .then((result) => {
           console.log("User updated sending text");
           return TwilioUtil.client.messages.create({
                body: 'Your STIR code is ' + data.verificationCode,
                to: data.phone,  
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
            contact['status.phoneValidated'] = true;
            return this.app.service("users").patch(params.user._id, contact)
            .then((result) => {
               console.log("Patched contact", result);
               return {status: "success"}
            })
            .catch((err) => {
                console.log("Error updating contact", err);
                throw (err);
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
