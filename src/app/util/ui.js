export default class UIUtil {
    constructor(intl) {
        this.intl = intl;
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
};

