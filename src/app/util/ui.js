export default class UIUtil {
    constructor(state, intl) {
        this.intl = intl;
        this.state = state;
    }
    showError(errorText) {
        phonon.alert(errorText, this.intl.formatMessage('ERROR_TITLE'), false, "Ok");
    }

    suggest(role) {
        let panelId = null;

        if (phonon.device.os == "iOS") {
            panelId = '#home-suggest-iphone';
        } else if (phonon.device.os == 'Android') {
            panelId = '#home-suggest-android';
        }
        if (panelId) {
            let panel = $(panelId);
            panel.find('.home-suggest-tap').html(
                this.intl.formatMessage('HOME_SUGGEST_TAP')
            );
            panel.find('.home-suggest-message').html(
                this.intl.formatMessage('HOME_SUGGEST', {
                    role: this.intl.formatMessage(role)
                })
            );

            phonon.panel(panelId).open();
            return true;
        } else {
            return false;
        }
    }
    addManifests(role) {
        if (phonon.device.os == "iOS") {
            let iphoneTitle = $('meta[name="apple-mobile-web-app-title"]');
            let iphoneValue = this.intl.formatMessage('STIR') + ' - ' + this.intl.formatMessage(role.toUpperCase());
            if (iphoneTitle.length == 0) {
               $('head').append('<meta name="apple-mobile-web-app-title" content="' + iphoneValue + '">');
            } else {
                iphoneTitle.attr('content',iphoneValue);
            }

            let iphoneIcon = $('link[rel="apple-touch-icon"]');
            let iconValue = "/images/icons/" + role + "/" + this.state.auth.locale + "/icon-152x152.png";
            if (iphoneIcon.length == 0) {
               $('head').append('<link rel="apple-touch-icon" href="' + iconValue + '">');
            } else {
                iphoneIcon.attr('href',iconValue);
            }
        }
        else if (phonon.device.os == "Android") {
            let manifestLink = $('link[rel="manifest"]');
            let manifestValue = '/' + role + '/manifest_' + this.state.auth.locale + '.json';

            if (manifestLink.length == 0) {
                $('head').append('<link rel="manifest" href="' + manifestValue + '">');
            } else {
                manifestLink.attr('href', manifestValue);
            }
        }
    }
};

