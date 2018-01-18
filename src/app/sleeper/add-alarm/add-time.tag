<sleeper-alarms-add-time>
  <virtual data-is="stir-header"></virtual>
  <div class="content">
      <div class="padded-full">
            <h1><formatted-message id='SLEEPER_TIME_WHEN'/></h1>
            <alarm-time
              data="{ state.sleeper.currentAlarm }"
              on-change="{onAlarmTimeChange}"
              on-cancel={null}
              verifying={verifying}
             >
             </alarm-time>
            <div id="next-container">
                  <button class="btn primary raised" click="{next}"><formatted-message id='NEXT'/></button>
            </div>
            <div class="disclaimer">
                <formatted-message id='SLEEPER_TIME_DISCLAMER' 
                    hours="{state.auth.user.env.tooEarlyHours}"
                />
            </div>
      </div>
      <div class="stepper-container">
          <stepper size="{state.sleeper.getSteps()}" current="1"></stepper>
      </div>
  </div>
 <style>
    sleeper-alarms-add-time {
        #next-container {
            display: flex;
            justify-content: center;
            margin-top: 60px;

            a {
                width: 100px;
            }
        }
    }
 </style>
 <script>
    import '../alarm-time.tag'
    import '../../common/stepper.tag'
    import '../../common/stir-header.tag'

    this.mixin('TimeUtil');

    this.on('before-mount', () => {
        if (this.state.sleeper.currentAlarm == null) {
            this.state.sleeper.currentAlarm = {};
        }
    });

    this.on('mount', () => {
        if (this.state.sleeper.currentAlarm == null) {
            this.state.sleeper.currentAlarm = {};
        }
    });

    this.on('ready', () => {
        this.state.sleeper.calculateSteps();

        if (this.state.sleeper.currentAlarm == null) {
            this.state.sleeper.currentAlarm = {};
        }
        this.state.sleeper.currentAlarm.timezone = this.TimeUtil.getTimezone();
        this.verified = false;
        this.update();
        this.state.auth.refreshStatus();
        this.state.auth.on('status_updated', this.onStatusUpdated);
    })
    this.on('update', () => {
        console.log("add-alarm-time update.");
    });

    this.on('unmount', () => {
        console.log("add-alarm-time unmounted");
    });

    this.on('hidden', () => {
        this.state.auth.off('status_updated', this.onStatusUpdated);
    });

    async onAlarmTimeChange(item, time) {
        console.log("Alarm time change!",item,time);
        let alarmTime;
        let prevTime = this.state.sleeper.currentAlarm.time;
        if (time) {
            alarmTime = this.TimeUtil.getAlarmTime(time);
            this.state.sleeper.currentAlarm.time = alarmTime;
        } else {
            alarmTime = this.state.sleeper.currentAlarm.time;
        }
        this.verifying = true;
        this.update();
        try {
            let result = await this.saveProgress();
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
                    this.state.sleeper.currentAlarm.time = item.time = alarmTime;
                    let result = await this.saveProgress();
                    this.verifying = false;
                    this.verified = true;
                    this.update();
                });
                confirm.on('cancel', () => {
                    console.log("Swithc back to prev time!", prevTime);
                    item.time = this.state.sleeper.currentAlarm.time = prevTime;
                    this.verifying = false;
                    this.update();
                });
            } else {
                this.verified = true;
                this.verifying = false;
                this.update();
            }
            this.update();

            return true;
        } catch (e) {
            console.log("Error saving progress", e);
            if (e.code && e.code == 'EXISTS') {
                phonon.alert(this.formatMessage('ALARM_EXISTS'), "Oops!", false, "Ok");
            } else {
                phonon.alert(e.message, "Oops!", false, "Ok");
            }
            this.verifying = false;
            this.update();
            return false;
        }
    }

    async next() {
        if (!this.verified) {
            if (!this.state.sleeper.currentAlarm.time) {
                this.state.sleeper.currentAlarm.time = this.TimeUtil.getDefaultTime();
            }
            let result = await this.onAlarmTimeChange(this.state.sleeper.currentAlarm, null);
            if (result) {
                page("/sleeper/alarms/add/personality")
            }
        } else {
            page("/sleeper/alarms/add/personality")
        }
    }

    async saveProgress() {
        console.log("Saving progress");
        let result = await this.state.sleeper.saveProgress();
        console.log(result);
        return result;
    }

    onStatusUpdated() {
        console.log("User status updated!");
        this.state.sleeper.steps = null;
        this.update();
    }

 </script>
</sleeper-alarms-add-time>
