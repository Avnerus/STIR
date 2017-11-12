import mongoose from 'mongoose'

const AlarmSchema = new mongoose.Schema({
    time: {type: Date, required: true},
    name: {type: String, required: true},
    prompt: {
        en: {
            paragraphs: [String],
            instructions: [String]
        },
        fr: {
            paragraphs: [String],
            instructions: [String]
        },
        de: {
            paragraphs: [String],
            instructions: [String]
        }
    },
    analysis: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    assignedAt: {type: Date, required: false},
    delivered: {type: Boolean, default: false},
    analyzed: {type: Boolean, default: false},
    failed: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    mturk: {type: Boolean, default: false},
    notifiedSleeper: {type: Boolean, default: false},
    notifiedRousers: {type: Boolean, default: false},
    sentFeedback: {type: Boolean, default: false},
    locales: [String],
    userLocale: String,
    timezone: String,
    country: String,
    pronoun: String,
    questions: [String],
    recording: {
        rouserId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        recordingUrl: {type: String, default: null},
        mixUrl: {type: String, default: null},
        finalized: {type: Boolean, default: false},
    },
    generatedFrom: {
        big5: String,
        highs: String,
        lows: String,
        facet: String,
        need: String
    },
    dummy: {type: Boolean, default: false},
    debug: {
        watson: String
    }
}, {timestamps: true})

AlarmSchema.index({ userId: 1, time: -1  }, {unique: true, partialFilterExpression: { deleted: false }});

const Model = mongoose.model('Alarm', AlarmSchema);

export default Model;
