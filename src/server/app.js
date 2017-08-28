import feathers from 'feathers';
import rest from 'feathers-rest';
import socketio from 'feathers-socketio'
import Routes from '../app/routes';

import { render,mixin } from 'riot';
import '../app/main.tag'

//import feathersPassport from 'feathers-passport';
//import hooks from 'feathers-hooks';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compress from 'compression'
import cors from 'cors'
import FS from 'fs';

import mongoose from 'mongoose'
import service from 'feathers-mongoose'

import State from '../app/state';
import hooks from 'feathers-hooks'
import authentication from 'feathers-authentication'
import jwt from 'feathers-authentication-jwt'
import authHooks from 'feathers-authentication-hooks';
import errorHandler from 'feathers-errors/handler';
import AuthSettings from './auth-settings'
import AuthService from './services/auth'

import FBAnalyzeService from './services/fbanalyze'

import UserModel from './models/user'
import AlarmModel from './models/alarm'

import SocketUtil from '../app/util/socket'

global.fetch = require('node-fetch');
global.io = require('socket.io-client');

SocketUtil.initWithUrl("http://localhost:3000");

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
.use(bodyParser.urlencoded({ extended: true  }));

// Auth middleware
app.use(AuthService);

// Services
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/stir', {useMongoClient: true});

app
.use('/users', service({Model: UserModel}))
.use('/alarms', service({Model: AlarmModel}))
.use('/fbanalyze', new FBAnalyzeService());

//Setup authentication
app.configure(authentication(AuthSettings));
app.configure(jwt());


// Setup a hook to only allow valid JWTs or successful 
// local auth to authenticate and get new JWT access tokens
app.service('authentication').hooks({
  before: {
    create: [
      authentication.hooks.authenticate(['jwt'])
    ]
  }
});

app.service('alarms').before({
  find: [
    authentication.hooks.authenticate(['jwt']),
    authHooks.queryWithCurrentUser()
  ]
});

// Client routes
app.use(function (req, res, next) {
    try {
        console.log("Init state");
        req.appState = new State();
        req.populateQueue = [];
        req.appState.auth.setAcessToken(req.accessToken);
        next();
    } catch (e) {
        console.log("Error in middleware!", e);
    }
});

Routes.runRoutingTable(app);

app.use(function (req, res, next) {
    if (!req.handledRoute) {
        res.status(404).send('Nothing to see here!');
    } else {
        Promise.all(req.populateQueue)
        .then(() => {
            console.log("Render riot");
            mixin({state: req.appState}); // Global state mixin
            res.render('index', {
              initialData: JSON.stringify(req.appState, (key,value) => {return (key == '_state' ? function() {} : value); }),
              body: render('main', req.appState)
            })
        })
    }
});

app.use(errorHandler());


console.log("Starting server");

// Server routes
let server = 
    app.listen(3000, () => {

    let host = server.address().address
    let port = server.address().port

    console.log('Node/Feathers app listening at http://%s:%s', host, port);


    // Init the loopback socket connection
    // socketUtil.initWithUrl('http://localhost:3000');
});
