'use strict';

import { mount,mixin } from 'riot';
import '../app/main.tag'
import page from 'page';
import Routes from '../app/routes';
import pageExpressMapper from 'page.js-express-mapper.js';
import State from '../app/state'
import 'nodent-runtime'
import SocketUtil from '../app/util/socket'
import TimeUtil from '../app/util/time'
import UIUtil from '../app/util/ui'
import RouteUtil from '../app/util/route'

// i18n
import {IntlMixin} from 'riot-intl'
import Messages from '../app/i18n/messages'
import Formats from '../app/i18n/formats'
import 'riot-intl/dist/locale-data/fr'

// Phonon
import 'phonon/dist/js/phonon-core'
import 'phonon/dist/js/components/dialogs'
import 'phonon/dist/js/components/preloaders'
import 'phonon/dist/js/components/forms'
import 'phonon/dist/js/components/panels'
import 'phonon/dist/js/components/notifications'

window.IS_SERVER = false
window.IS_CLIENT = true

const SUPPORTED_LANGS = {
    en: 1,
    fr: 1,
    de: 1
}

SocketUtil.initWithUrl(window.location.protocol + "//" + window.location.host);

// PHONON
phonon.options({
	navigator: {
	    defaultPage: 'main',
	    hashPrefix: '!', 
	    animatePages: true,
	    enableBrowserBackButton: true,
	    templateRootDirectory: '',
	    useHash: false,
        riotEnabled: true,
        riot: {
            compile: (fn) => {fn()},
            mount: mount
        }
	},
	// i18n: null if you do not want to use internationalization
	i18n: null
});

/*
let popover = phonon.popover('#lang-popover').onItemChanged(function (data) {
        if (data.value != state.auth.locale) {
            console.log("Language changed!", data)
            state.auth.locale = data.value;
            state.auth.updateContact(
                {locale: state.auth.locale}
            );
            let mixinObj = mixin('i18n', null, true);            
            mixinObj.i18n.messages = Messages[state.auth.locale];
            mixinObj.i18n.locales = [state.auth.locale];
            updateTag(phonon.navigator().currentPage);
        }
})*/ 

function updateTag(name) {
    let tags = phonon.tagManager.getAll();
    let found = false;
    for (let i = 0; i < tags.length && !found; i++) {
        if(tags[i].tagName === name) {
            tags[i].update();
            found = true;
        }
    }
}

window.page = page;

// activate express-mapper plugin
pageExpressMapper({
    renderMethod: null,
    expressAppName: 'app'
});

let state = new State();
let initialData = JSON.parse(window.initialData);

Object.keys(state).forEach((key) => {
    if (initialData[key]) {
        Object.assign(state[key], initialData[key]);
    }
});

page('*', function(ctx,next) {
    ctx.appState = state;
    ctx.populateQueue = [];
    next();
});

Routes.runRoutingTable(window.app);

page('*', function(ctx,next) {
    if (ctx.querystring && ctx.querystring.indexOf('lang') >= 0) {
        let newLocale = ctx.querystring.split('=')[1];
        if (SUPPORTED_LANGS[newLocale] && newLocale != ctx.appState.auth.locale) {
            console.log("Language switch!", newLocale);
            ctx.appState.auth.locale = newLocale;
            ctx.appState.auth.updateContact(
                {locale: ctx.appState.auth.locale}
            )
            .then(() => {
               window.location = ctx.canonicalPath;
            })
            .catch(() => {
                window.location = ctx.canonicalPath;
            })
            /*
            let mixinObj = mixin('i18n', null, true);            
            mixinObj.i18n.messages = Messages[ctx.appState.auth.locale];
            mixinObj.i18n.locales = [ctx.appState.auth.locale];
            updateTag(phonon.navigator().currentPage);

            let header = $('.next-language');
            header.removeClass('is-expanded');
            header.find('a > span')[0].innerHTML = newLocale;
            header.find('li.is-active').removeClass('is-active');
            header.find('a[data-code=' + newLocale+ ']').parent().addClass('is-active');*/
        }
        ctx.canonicalPath = ctx.canonicalPath.split('?')[0];
    }
    let path = ctx.canonicalPath.split('#')[0];
    path = path.split('?')[0];
    if (ctx.page) {
        phonon.navigator().changePage(ctx.page);
    }
    else if (path == "/") {
         phonon.navigator().changePage('main');
    } 
    else if (path.indexOf('auth/') == -1)  {
        let tagName = path.substring(1).replace(/\//g,"-");
        phonon.navigator().changePage(tagName);
    } else {
        next();
    }
})

mixin({state: state}); // Global state mixin
/* Locale */
IntlMixin.i18n = {
    locales: [state.auth.locale],
    messages: Messages[state.auth.locale],
    formats: Formats
}
mixin('i18n', IntlMixin, true); 
mixin('TimeUtil', {TimeUtil: TimeUtil}); 
mixin('UIUtil', {UIUtil: new UIUtil(state, IntlMixin)}); 
mixin('RouteUtil', {RouteUtil: new RouteUtil(state, IntlMixin)}); 

page();
phonon.navigator().start();
