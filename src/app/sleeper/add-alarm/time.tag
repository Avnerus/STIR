<time>
 <h1 class="title">Add Alarm time</h1>
  <b>Alarm will be set for: {state.sleeper.currentAlarm.time}</b>
  <form onsubmit="{ next }">
    Date/Time:<input ref="time" type="time" change="{onTimeChange}" required>
    <input type="submit" value="Next">
  </form>
  <p>
  <b show"{error}" class="error">{error}</b>
  </p>
 <style>
 </style>
 <script>
    this.on('mount', () => {
        console.log("add-alarm-time mounted");
        this.update();
    });

    this.on('unmount', () => {
    });

    onTimeChange() {
        let time = this.refs.time.value;
        let timeComponents = time.split(":");
        let alarmTime = new Date(new Date().setHours(timeComponents[0],timeComponents[1],0));

        if (alarmTime.getTime() < new Date().getTime()) {
            console.log("Alarm will be set for tomorrow");
            alarmTime.setDate(alarmTime.getDate() + 1);
        }
        alarmTime.setMilliseconds(0);
        this.state.sleeper.currentAlarm.time = alarmTime;
        this.update();

    }

    async next(e) {
        e.preventDefault();
        if (this.state.sleeper.action == "add-alarm") {
            try {
                await this.state.sleeper.saveProgress();
                page("/sleeper/alarms/add/personality")
            } catch (e) {
                console.log("Error saving progress", e);
                this.error = e.message;
                this.update();
            }
        } else {
            try {
                let result = await this.state.sleeper.saveAlarm();
                console.log("Save result", result);
                if (IS_CLIENT) {
                    page("/sleeper/alarms");
                }
            } catch (e) {
                console.log("Error saving alarm!", e);
                if (e.name == "Conflict") {
                    this.error = "There is already an alarm set for this time";
                } else {
                    this.error = e.message;
                }
                this.update();
            }
        }
    }


    Date.prototype.toLocaleISOString = function() {
            var pad = function(num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return this.getFullYear() +
            '-' + pad(this.getMonth() + 1) +
            '-' + pad(this.getDate()) +
            'T' + pad(this.getHours()) +
            ':' + pad(this.getMinutes()) + ':00';
        //    ':' + pad(this.getSeconds());
        }
 </script>
</time>
