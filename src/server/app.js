import feathers from 'feathers';
import rest from 'feathers-rest';
import socketio from 'feathers-socketio'
import Routes from '../app/routes';

import { render,mixin } from 'riot';
import '../app/main.tag'

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression'
import cors from 'cors'
import FS from 'fs';

import mongoose from 'mongoose'
import service from 'feathers-mongoose'

import State from '../app/state'
import hooks from 'feathers-hooks'
import session from 'express-session';
import authentication from 'feathers-authentication'
import jwt from 'feathers-authentication-jwt'
import oauth1 from 'feathers-authentication-oauth1'
import oauth2 from 'feathers-authentication-oauth2'
import local from 'feathers-authentication-local'
import CustomOAuthVerifier from './util/oauth-jwt-verifier'
import CustomOAuthHandler from './util/oauth-jwt-handler'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import authHooks from 'feathers-authentication-hooks'
import errorHandler from 'feathers-errors/handler'
import AuthSettings from './auth-settings'
import {createFixtures, authHook, authMiddleware} from './services/auth'
import {disallow, pluck} from 'feathers-hooks-common'
import TwiMLService from './services/twiml'

import FBAnalyzeService from './services/fbanalyze'
import TwitterAnalyzeService from './services/twitter-analyze'
import QuestionsAnalyzeService from './services/questions-analyze'

import UserContactService from './services/user-contact'
import RecordingsService from './services/recordings'
import SessionService from './services/session'
import FeedbackService from './services/feedback'

import UserModel from './models/user'
import AlarmModel from './models/alarm'

import GeneratePrompt from './services/generate-prompt'
import TooEarlyHook from './services/too-early-hook'
import AlarmManager from './services/alarm-manager'
import patchAlarmHook from './services/patch-alarm'
import dispatchMTurkHook from './services/dispatch-mturk'
import noDotPluck from './util/no-dot-pluck'
import {encryptUser, decryptUser} from './services/encrypt-user'

import SocketUtil from '../app/util/socket'
import TimeUtil from '../app/util/time'
import PersistentSession from './models/session-persistent'
import NFBUtil from './util/nfb'

import {IntlMixin} from 'riot-intl'
import {BaseI18n} from '../app/i18n/i18n'

import Messages from '../app/i18n/messages'
import Formats from '../app/i18n/formats'
import Errors from 'feathers-errors'

global.fetch = require('node-fetch');
global.io = require('socket.io-client');

global.SERVER_URL = process.env['SERVER_URL'];

SocketUtil.initWithUrl("http://localhost:3030");

const SUPPORTED_LANGS = {
    'en' : 'en'/*,
    'fr': 'fr',
    'de': 'de'*/
}

const app = feathers()
.set('views', process.env.APP_BASE_PATH + "/src/server/views")
.set('view engine', 'ejs')
.configure(rest())
.configure(socketio({wsEngine: 'uws'}))
.configure(hooks())
.use(compress())
.options('*', cors())
.use(cors())
.use(feathers.static(process.env.APP_BASE_PATH + "/public"))
.use(cookieParser())
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true  }))
.use(function(req, res, next) {
    req.feathers.ip = req.headers['x-forwarded-for'] || req.ip;
    if (req.query.lang && SUPPORTED_LANGS[req.query.lang]) {
        req.feathers.locale = req.forceLocale = req.locale = req.query.lang;
    } else {
        req.feathers.locale = req.locale = req.acceptsLanguages('en'/*,'fr','de'*/) || 'en';
    }
    next();
})
.use(session({ secret: AuthSettings.secret, resave: true, saveUninitialized: true  }));

app.enable('trust proxy');
app.set('trust proxy', true);

//app.use(authMiddleware);

// Services

app
.use('/users', service({Model: UserModel}))
.use('/alarms/sleeper', service({Model: AlarmModel}))
.use('/alarms/admin', service({Model: AlarmModel}))
.use('/alarms/rouser', new AlarmManager())
.use('/fbanalyze', new FBAnalyzeService())
.use('/twitter-analyze', new TwitterAnalyzeService())
.use('/questions-analyze', new QuestionsAnalyzeService())
.use('/user/contact', new UserContactService())
.use('/recordings',new RecordingsService())
.use('/user/session',new SessionService())
.use('/feedback',new FeedbackService());

// TWIML
app.post('/twiml-rec.xml', TwiMLService.getRecordingTwiML)
app.post('/twiml-alarm.xml', TwiMLService.getAlarmTwiML)
app.post('/twiml/recording-status', TwiMLService.getRecordingStatus)

//Setup authentication
app.configure(authentication(AuthSettings));
app.configure(jwt());
app.configure(oauth1({
  name: 'twitter',
  Strategy: TwitterStrategy,
  consumerKey: process.env['TWITTER_API_KEY'],
  consumerSecret: process.env['TWITTER_API_SECRET'],
  failureRedirect: "/sleeper/alarms/add/personality",
  callbackURL: process.env['SERVER_URL'] + "/auth/twitter/callback",
  Verifier: CustomOAuthVerifier,
  handler:  CustomOAuthHandler({
      successRedirect: "/sleeper/alarms/add/personality"
  })
}));
app.configure(oauth2({
  name: 'facebook',
  Strategy: FacebookStrategy,
  clientID: process.env['FB_APP_ID'],
  clientSecret : process.env['FB_APP_SECRET'],
  scope: ['public_profile', 'user_posts'],
  callbackURL: process.env['SERVER_URL'] + "/auth/facebook/callback",
  failureRedirect: "/sleeper/alarms/add/personality",
  Verifier: CustomOAuthVerifier,
  handler:  CustomOAuthHandler({
     successRedirect: "/sleeper/alarms/add/personality",
  })
}));
// For admin
//
app.configure(local({
  usernameField: "name"
}));

app.service('users').before({
  all: disallow('external')
});
app.service('users').hooks({
  before: {
    create: [
      local.hooks.hashPassword()
    ],
    patch: [
        encryptUser
    ]
  },
  after: {
      get: [
          decryptUser
      ]
  }
});

// Setup a hook to only allow valid JWTs or successful 
// local auth to authenticate and get new JWT access tokens
app.service('authentication').hooks({
  before: {
    create: [
      authHook,
      authentication.hooks.authenticate(['local','jwt'])
    ]
  },
  after: {
      create: [
          (hook) => {
              if (hook.params.user && hook.params.user._id) {
                  hook.app.service('users').patch(hook.params.user._id, {lastLogin: new Date()});
              }
              return hook;
          }
      ]
  }
});

app.service('/alarms/sleeper').hooks({
    before: {
        create: [
          authHooks.associateCurrentUser(),
          (hook) => { 
              hook.data.locales = hook.params.user.alarmLocales,
              hook.data.country = hook.params.user.country, 
              hook.data.pronoun = hook.params.user.pronoun,
              hook.data.userLocale = hook.params.user.locale 
          },
          (hook) => { 
              if (hook.data.analysis == 'questions') {
                  console.log("Pulling questions from session!");
                  let sessionData = PersistentSession.getFor(hook.params.user._id.toString());
                  console.log("Pulled", sessionData.questions);
                  hook.data.questions = sessionData.questions;
              }
          },
        ],
        find: [
          authentication.hooks.authenticate(['jwt']),
          authHooks.queryWithCurrentUser(),
          (hook) => {
              if (hook.params.provider) {
                    hook.params.query.$select = ['id','time']; 
                    hook.params.query.time = {$gt: new Date()};
                    hook.params.query.$sort = {time: 1};
              }
              return hook;
          }
        ],
        patch: [
            authHooks.restrictToOwner({ ownerField: 'userId' }),
            TooEarlyHook,
            patchAlarmHook
        ],
        get: [
            authentication.hooks.authenticate(['jwt']),
            authHooks.restrictToOwner({ ownerField: 'userId' }),
        ],
        remove: disallow('external')
    },
    after: {
        create: [
          GeneratePrompt,
          pluck('_id', 'time') 
        ],
        patch: [
          (hook) => {
            if (!hook.result.status) {
                return pluck('_id', 'time')(hook);
            }
          }
        ],
        get: [
            (hook) => {
                if (hook.params.provider && !hook.result.delivered && !hook.result.failed) {
                    throw(new Errors.NotFound());
                }
            },
            pluck('_id', 'time', 'failed', 'generatedFrom', 'recording.mixUrl', 'prompt','name', 'sentFeedback') 
        ]
    }
});

app.service('fbanalyze').before({
  find: [
    authentication.hooks.authenticate(['jwt'])
  ]
});
app.service('twitter-analyze').before({
  find: [
    authentication.hooks.authenticate(['jwt'])
  ]
});

app.service('/questions-analyze').hooks({
    before: {
      create: [
        pluck('questions', 'name')
      ]
    }
})

app.service('/user/contact').hooks({
    before: {
      find: [
        authentication.hooks.authenticate(['jwt']),
        authHooks.queryWithCurrentUser()
      ],
      patch: [
        noDotPluck(
            'locale',
            'alarmLocales',
            'pronoun',
            'status.suggestedSleeperHome', 
            'status.suggestedRouserHome', 
            'status.shownRouserVideo',
            'status.shownSleeperIntro'
        )
      ]
    }
})
app.service('/user/session').hooks({
    before: {
        find: [
          authentication.hooks.authenticate(['jwt'])
        ],
        create: [
            TooEarlyHook
        ]
    }
});

app.service('/alarms/rouser').hooks({
    before: {
        find: [
          authentication.hooks.authenticate(['jwt']),
        ],
        get: [
          (hook) => {
            if (hook.params.query && hook.params.query.mturk && hook.params.query.mturk.assignmentId) {
                // Bypass authentication with mturk
                console.log("Bypassing authentication!");
                return hook;
            }
            else {
               return authentication.hooks.authenticate(['jwt'])(hook);
            }
          }
        ]
    }
});

app.service('/recordings').before({
  create: [
      authHooks.associateCurrentUser({ as: 'rouserId'})
  ]
});

// Recording upload
app.post('/recordings/upload', (res, req) => {app.service('recordings').upload(res,req);});

app.service('/recordings').filter('ready', function(data, connection, hook) {
    if (connection.user._id.toString() == data.rouserId) {
        return data;
    } else {
        return false;
    }
});

app.service('/alarms/admin').hooks({
  before: {
    all: [
      authentication.hooks.authenticate(['jwt']),
      authHooks.restrictToRoles({
          roles: ['admin'],
          fieldName: 'role'
      })
   ],
    patch: [dispatchMTurkHook]
  },
  after: {
    find: [
      pluck('_id', 'createdAt','time', 'name', 'recording.finalized', 'delivered', 'assignedTo', 'mturk', 'analyzed', 'recording.mixUrl','failed')
    ]
  }
});

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV == 'development') {
    mongoose.set('debug', true)
}
mongoose.connect(process.env['MONGO_CONNECTION'], {useMongoClient: true})
.then(() => {
    return createFixtures(app);
})
.then(() => {
    return app.service('alarms/rouser').createDummyAlarms();
})
.then(() => {
    return app.service('alarms/rouser').getPendingAlarms();
})

// Client routes
app.use(authMiddleware);
app.use(function (req, res, next) {
    try {
        console.log("Init state");
        req.appState = new State();
        req.populateQueue = [];
        req.appState.auth.setAcessToken(req.accessToken);
        req.appState.auth.locale = req.locale;
        req.appState.main.env = process.env.NODE_ENV;
        next();
    } catch (e) {
        console.log("Error in middleware!", e);
    }
});

Routes.runRoutingTable(app);

app.use(async function (req, res, next) {
    console.log("Render middleware");
    if (!req.handledRoute) {
        return next(new Errors.NotFound());
    } else {
        try {
            for (let i = 0; i < req.populateQueue.length; i++) {
                let taskObj = req.populateQueue[i];
                console.log("Runnint task", taskObj);
                await req.appState[taskObj.store][taskObj.task].apply(req.appState[taskObj.store], taskObj.args);
            }
            
            if (req.appState.auth.user.locale && !req.forceLocale) {
                req.appState.auth.locale = req.appState.auth.user.locale;
            } else if (req.appState.auth.locale && !req.appState.auth.user.locale) {
                req.appState.auth.user.locale = req.appState.auth.locale;
            }

            let nfbSettings = null;
            if (!req.query.assignmentId) {
                nfbSettings = await NFBUtil.getSettings(process.env.NFB_ENDPOINT, req.feathers.ip, req.forceLocale || req.appState.auth.user.locale);
            }

            console.log("Render riot");
            mixin({state: req.appState}); // Global state mixin
            mixin({TimeUtil: TimeUtil}); 

            /* Locale */
            IntlMixin.i18n = {
                locales: [req.appState.auth.locale],
                messages: Messages[req.appState.auth.locale],
                formats: Formats
            }
            mixin(IntlMixin); 

            let initialData = JSON.stringify(req.appState, (key,value) => {
                  return ((key == '_state' || key == 'debug') ? function() {} : value); 
            });
            initialData = initialData.replace(/\'/g,"\\'");

            let renderOpts = {
              initialData: initialData,
              body: render('main', req.appState)
            };

            if (nfbSettings) {
                Object.assign(renderOpts, {
                    nfbShare: nfbSettings.share,
                    nfbDeps: nfbSettings.dependencies,
                    nfbHeader: nfbSettings.header,
                    //nfbFooter: nfbSettings.footer
                    nfbTopnav: nfbSettings.geoloc.topnav,
                    nfbTag: nfbSettings.tag
                });
            } 
            res.render('index', renderOpts);

        } catch(err) {
            console.log("Error in rendering!", err);
            return next(err);
        }
    }
});

app.use(errorHandler({
    html: (error, req, res, next) => {
        console.log("Render error", error);
        if (error.code == 404) {
            error.message = "Page not found";
        } else {
            error.message = getCustomMessage(req) || error.message;
        }
        res.render('error', {error: error, home: process.env.SERVER_URL});
    }
}));

function getCustomMessage(req, error) {
    console.log("Get custom message?" , req.user);    
    let locale = 'en';
    if (req.feathers && req.feathers.locale) {
        locale = req.feathers.locale;
    }
    if (req.user && req.user.locale) {
        locale = req.user.locale;
    }
    if (req.page == 'sleeper-alarm-summary') {
        return IntlMixin.formatMessage('ALARM_SUMMARY_AUTH_ERROR',{},BaseI18n, locale);
        
    } else {
        return null;
    }
}


console.log("Starting server");

// Server routes
let server = 
    app.listen(3030, () => {

    let host = server.address().address
    let port = server.address().port

    console.log('Node/Feathers app listening at http://%s:%s', host, port);
});
