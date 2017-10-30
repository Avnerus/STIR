<sleeper-alarms>
<header class="header-bar">
    <div class="pull-left">
        <a href="/"><h1>STIR | Sleeper</h1></a>
    </div>
</header>
<div class="content">
     <div class="padded-full">
         <div show="{state.sleeper.alarms != null}">
             <h1 if="{state.auth.user.name}"><formatted-message id="CLOCK_WELCOME_NAME" name="{state.auth.user.name}"/></h1>
             <h1 if="{!state.auth.user.name}"><formatted-message id="CLOCK_WELCOME"/></h1>
             <p if="{state.sleeper.alarms && state.sleeper.alarms.length > 0}"><formatted-message id="CLOCK_DESC"/></p>
             <p if="{state.sleeper.alarms && state.sleeper.alarms.length == 0}"><formatted-message id="CLOCK_DESC_NO_ALARMS"/></p>
              <alarm-time
                  each={ state.sleeper.alarms } 
                  data="{ {time: this.time, _id: this._id} }" 
                  on-change="{parent.onAlarmTimeChange}"
                  on-cancel="{parent.onAlarmCancel}"
              >
              </alarm-time>
              <div class="add-alarm">
                   <div class="add-button">
                       <a href="/sleeper/alarms/add/time">
                            <i class="material-icons">alarm_add</i>
                       </a>
                   </div>
              </div>
         </div>
     </div>
      <div show="{ state.sleeper.alarms == null }" class="circle-progress center active">
        <div class="spinner"></div>
     </div>
</div>

 <style>
     sleeper-alarms {
         .add-alarm {
            display: flex;
            justify-content: center;
            @media (max-height: 650px) {
                position: relative;
                top: 50px;
                padding-bottom: 20px;
            }
            position: absolute;
            width: 100%;
            bottom: 80px; 
            right: 1px;
           .add-button {
                background-color: #f36b21;
                border-radius: 40px;
                // box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
                width: 65px;
                height: 65px;
                display: flex;
                justify-content: center;
                align-items: center;
                
                a {
                    width: 55px;
                    height: 55px;
                   i {
                        font-size: 55px;
                        color: white;
                   }
                }
            }
         }
     }
 </style>
 <script>
    import './alarm-time.tag'
    import MiscUtil from '../util/misc'

    this.mixin('TimeUtil');
    this.mixin('UIUtil');

    this.on('mount', () => {
        console.log("alarms mounted");
        this.state.sleeper.on('alarms_updated', this.onAlarmsUpdated);
    });

    this.on('ready', () => {
        this.update();
        if (!MiscUtil.isStandaone() && this.state.auth.user && !this.state.auth.user.status.suggestedSleeperHome) {
            $('#home-suggest-message').html(
                this.formatMessage('HOME_SUGGEST', {
                    role: this.formatMessage('SLEEPER')
                })
            );
            phonon.panel('#home-suggest').open();
            this.state.auth.suggestedSleeperHome();
        } else if (this.state.sleeper.newAlarmTime) {
            let diff = this.TimeUtil.getDiff(new Date(this.state.sleeper.newAlarmTime));
            this.state.sleeper.newAlarmTime = null;
            let messageId = diff.days == 1 ? 'NEW_ALARM_NOTIFICATION_1DAY' : 'NEW_ALARM_NOTIFICATION';
            phonon.notif(
                this.formatMessage(messageId, {
                    hours: diff.hours,
                    minutes: diff.minutes
                }),
                2000, false
            );
        }
        let manifestLink = $('link[href="manifest.json"]');
        if (manifestLink.length == 0) {
            $('head').append('<link rel="manifest" href="/sleeper/manifest.json">');
        }
    })

    this.on('unmount', () => {
        this.state.sleeper.off('alarms_updated', this.onAlarmsUpdated);
    });

    onAlarmsUpdated() {
        this.update();
    }
    onAlarmTimeChange(item, time) {
        this.state.sleeper.chooseAlarm(item._id);
        this.saveAlarm(time);
    }

    async saveAlarm(time) {
        console.log("Save alarm!", this.state.sleeper.currentAlarm._id, time);
        try {
            let timezone = this.TimeUtil.getTimezone();
            let prevTime = this.state.sleeper.currentAlarm.time;
            let alarmTime = this.TimeUtil.getAlarmTime(time);
            let result = await this.state.sleeper.saveAlarmTime(alarmTime,timezone);
            console.log("Save result", result);
            if (result.status == "too_early") {
                let confirm = phonon.confirm(
                    this.formatMessage('TOO_EARLY_CONFIRM', {hours: result.hours}), 
                    this.formatMessage('NOTICE'),
                    true, 
                    this.formatMessage('OK'),
                    this.formatMessage('CANCEL')
                );

                confirm.on('confirm', async () => {
                    alarmTime.setDate(alarmTime.getDate() + 1);
                    let result = await this.state.sleeper.saveAlarmTime(alarmTime, timezone);
                    this.update();
                });
                confirm.on('cancel', () => {
                    this.state.sleeper.currentAlarm.time = prevTime;
                    this.update();
                });
            } else {
                this.update();
            }
            this.update();
        } catch (e) {
            console.log("Error saving alarm!", e);
            if (e.name == "Conflict") {
                phonon.alert(
                    this.formatMessage('ALARM_EXISTS'),
                    this.formatMessage('OOPS'),
                    false, 
                    this.formatMessage('OK')
                    );
            } else {
                this.UIUtil.showError(e.message);
            }
            this.update();
        }
    }
    onAlarmCancel(item) {
        console.log("Cancel alarm!",item._id);
        this.state.sleeper.currentAlarm = item;
        let confirm = phonon.confirm(
            this.formatMessage('CANCEL_ALARM', {name: this.state.auth.user.name}),
            this.formatMessage('PLEASE_CONFIRM'),
            false, 
            this.formatMessage('YES'),
            this.formatMessage('NO')
        );
        confirm.on('confirm', async() => {
            try {
                let result = await this.state.sleeper.deleteAlarm();
                console.log("delete result", result);
                this.update();
            } catch (e) {
                console.log("Error deleting alarm!", e);
            }
        });
        confirm.on('cancel', function() {} );
    }
 </script>
</sleeper-alarms>
