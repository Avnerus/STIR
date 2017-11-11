import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    country: String,
    countryCode: String,
    locale: String,
    pronoun: String,
    alarmLocales: [String],
    role: {type: String, default: "user"},
    alarmsRecorded: {type: Number, default: 0},
    waitingForAlarms: {type: Boolean, default: false},
    password: String,
    lastLogin: Date,
    status : {
        phoneValidated: {type: Boolean, default: false},
        suggestedSleeperHome: {type: Boolean, default: false},
        suggestedRouserHome: {type: Boolean, default: false},
        shownRouserVideo: {type: Boolean, default: false},
        shownSleeperIntro: {type: Boolean, default: false}
    },
    verificationCode: Number,
    twitter: {
        profile: {
            id: String,
            username: String,
            displayName: String
        },
        accessToken: String,
        refreshToken: String
    },
    facebook: {
        profile: {
            id: String,
            displayName: String
        },
        accessToken: String
    }
},{timestamps: true})

const Model = mongoose.model('User', UserSchema);

export default Model;
