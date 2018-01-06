<sleeper-alarm-summary>
<virtual data-is="stir-header"></virtual>
<div class="content">
     <div class="padded-full">
            <h1 if="{!state.sleeper.currentAlarm.failed}">
                <formatted-message id='SLEEPER_SUMMARY_DESCRIPTION' name="{state.auth.user.name}"/>
            </h1>
            <h1 if="{state.sleeper.currentAlarm.failed}">
                <formatted-message id='SLEEPER_SUMMARY_FAILED' name="{state.auth.user.name}"/>
            </h1>
            <div class="action">
                <a class="btn raised primary" href="/rouser/alarms">
                    <formatted-message id='BE_A_ROUSER'/>
                </a>
            </div>
            <p>
                <formatted-message id='LISTEN_ALARM'/></p>
            <p>
            <audio controls="controls">
                <source src="{state.sleeper.currentAlarm.recording.mixUrl}"></source>
            </audio>
            </p>
            <p><b><formatted-message id='YOUR_TRAITS'/></b></p>
            <ul class="">
              <li>
                <formatted-message id="HIGH"/><formatted-message id="{state.sleeper.currentAlarm.generatedFrom.big5}"/>
              </li>
              <li if="{state.sleeper.currentAlarm.generatedFrom.lows}">
                <formatted-message id="LOW"/><formatted-message id="{state.sleeper.currentAlarm.generatedFrom.lows}"/>
              </li>
              <li if="{state.sleeper.currentAlarm.generatedFrom.highs}">
                <formatted-message id="HIGH"/><formatted-message id="{state.sleeper.currentAlarm.generatedFrom.highs}"/>
              </li>
              <li class="facet">
                <formatted-message id="{state.sleeper.currentAlarm.generatedFrom.facet}"/>
              </li>
              <li>
                <formatted-message id="IN_NEED"/><formatted-message id="{state.sleeper.currentAlarm.generatedFrom.need}"/>
              </li>
            </ul>
            <div if="{!state.sleeper.currentAlarm.sentFeedback}" id="feedback">
                <p>
                    <formatted-message id='SEND_FEEDBACK_DESC'/>
                </p>
               <form show="{ !loading && !sent }" action="" onsubmit="{sendFeedback}">
                    <input ref="feedbackText" type="text" required maxlength="120">
                    <div class="action">
                        <button class="btn primary" type="submit">
                            <formatted-message id='SEND_FEEDBACK'/>
                        </button>
                    </div>
               </form>
               <div show="{ loading }" class="circle-progress active">
                   <div class="spinner"></div>
               </div>
               <div id="check" class="{on: sent}">
                   <span class="{check: true, on: sent}"></span>
               </div>
            </div>
      </div>
 </div>
 <style>
     sleeper-alarm-summary {
         .description {
            font-size: 20px;
            margin-bottom: 10px;
         }
         .action {
            display: flex;
            justify-content: center;
            margin-top: 20px;
         }

         ul {
            padding-left: 15px;
         }

         #feedback {
            margin-top: 20px;
            form input {
                height: 28px;
            }
            p span {
                font-size: 18px;
            }
            
            #check {
                height: 0px;
                display: flex;
                justify-content: center;

                .on {
                    height: 30px;
                }

                span.check.on {
                    transform: rotate(-45deg);
                    border-radius: 0;
                    height: 0.8rem;
                    border-color: #0084e7;
                    border-top-style: none;
                    border-right-style: none;
                    border-bottom-style: solid;
                    border-left-style: solid;
                }
                span.check {
                    width: 30px;
                    height: 30px;
                    transition: all 0.3s ease-in-out;
                    position: absolute;
                }
            }
         }
     }
 </style>
 <script>

    import '../common/stir-header.tag'

    this.loading = false;
    this.sent = false;

    this.on('mount', () => {
        console.log("alarm summary mounted");
    });

    this.on('unmount', () => {
    });

    this.on('ready', () => {
    });

    async sendFeedback(e) {
        e.preventDefault();
        try {
            console.log("Sending feedback text", this.refs.feedbackText.value);
            this.loading = true;
            this.update();
            let result = await this.state.sleeper.sendFeedback(this.refs.feedbackText.value);
            console.log("Send result", result);
            this.loading = false;
            this.sent = true;
            this.update();
        }
        catch(err) {
            console.log("Error sending feedback!",err);
            phonon.alert(err.name ? err.name : err.message, "Oops", false, "Ok");
            this.loading = false;
            this.update();
        }
    }

 </script>
</sleeper-alarm-summary>
