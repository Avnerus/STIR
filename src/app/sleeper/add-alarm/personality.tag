<sleeper-alarms-add-personality>
  <virtual data-is="stir-header"></virtual>
  <div class="content">
    <div class="padded-full">
        <h1><formatted-message id='PERSONALITY_DESCRIPTION'/></h1>
        <div show="{!loading}">
            <div id="social-buttons" class="row">
              <a href="/auth/facebook" class="btn primary raised">
                <formatted-message id='CONNECT_FACEBOOK'/>
              </a>
              <a href="/auth/twitter" class="btn primary raised">
                <formatted-message id='CONNECT_TWITTER'/>
              </a>
            </div>
            <div class="row">
                <a id="questions-link" href="/sleeper/alarms/add/questions">
                    <formatted-message id='NOT_SOCIAL'/>
                </a>
            </div>
        </div>
        <div show="{ loading }" class="circle-progress center active">
           <div class="spinner"></div>
        </div>
        <div class="disclaimer" show="{!loading}">
            </p><formatted-message id='PERSONALITY_DISCLAIMER_1'/></p>
            <p>
                <formatted-message id='PRIVACY_DISCLAMER_1'/>
                <a href="/privacy.html" click="{privacy}"><formatted-message id='PRIVACY_DISCLAMER_2'/></a>
                <formatted-message id='PRIVACY_DISCLAMER_3'/>
            </p>
        </div>
      </div>
      <div class="stepper-container">
          <stepper size="{state.sleeper.getSteps()}" current="2"></stepper>
      </div>
  </div>
  
 <style>

     sleeper-alarms-add-personality {
         #choose-text {
            margin-top: 20px;
         } 
         #social-buttons {
             display: flex;
             margin-top: 15px;
             margin-bottom: 15px;
             
             a {
                line-height: 1.5;
                margin-left: 10px;
                margin-right: 10px;
             }
         }
         #questions-link {
            font-size: 12px;     
         }

         .circle-progress.active {
             position: relative;
             top: 0;
             margin-top: 30px;
         }
     }
 </style>
 <script>
    import '../../common/stepper.tag'
    import '../../common/stir-header.tag'

    this.on('mount', () => {
        console.log("add-alarm-personality mounted");
        this.state.sleeper.on('alarm_created', this.onAlarmCreated);
    });

    showError(err) {
        console.log("Error",err);
        let errorText;
        if (err.code && err.code == 130) {
            errorText = "The twitter servers are currently over capacity, please try again in a few minutes!"
        } else if (err.code && err.code == 'FB-NO-POSTS') {
            errorText = this.formatMessage('FB_NO_PERMISSION');
        }
        else {
            errorText = "We have encountred the following error: " + err.message + ". Please inform our developers!";
            if (err.code) {
                errorText += ' (Code ' + err.code + ')';
            }
        }
        phonon.alert(errorText, "Oops", false, "Ok");
    }

    this.on('unmount', () => {
        this.state.sleeper.off('alarm_created', this.onAlarmCreated);
    });

    this.on('ready', () => {
        this.update();
    });

    this.on('transitionend', async () => {
        if (IS_CLIENT) {
            try {
                let analysisStatus = null;

                // Did we just get the twitter credentials?
                if (this.state.sleeper.pendingTwitter) {
                    console.log("Got twitter credentials! analyzing tweets")
                    this.loading = true;
                    this.update();
                    analysisStatus = await this.state.sleeper.twitterAnalyze();
                    this.state.sleeper.currentAlarm.analysis = 'twitter';
                    this.state.sleeper.pendingTwitter = false;
                    this.loading = false;
                } else if (this.state.sleeper.pendingFacebook){
                    this.loading = true;
                    this.update();
                    analysisStatus = await this.state.sleeper.analyzeFacebook();
                    this.state.sleeper.currentAlarm.analysis = 'facebook';
                    this.state.sleeper.pendingFacebook = false;
                    this.loading = false;
                }

                if (analysisStatus) {
                    console.log("analysis status", analysisStatus);
                    if (analysisStatus.status == "success") {
                        this.state.auth.setUserName(analysisStatus.userName);
                        this.state.sleeper.currentAlarm.name = analysisStatus.userName;
                        this.validateCheck();
                        setTimeout(() => {
                            this.update();
                        },500);
                   } else {
                        throw new Error(analysisStatus);
                   }
                } else {
                    this.update();
                }
            }

            catch (err) {
                this.state.sleeper.pendingTwitter = false;
                this.state.sleeper.pendingFacebook = false;
                this.loading = false;
                this.showError(err);
                this.update();
            }
        }
    })


    async validateCheck() {
        if (!this.state.auth.user.status.phoneValidated) {
            if (IS_CLIENT) {
                page("/sign-up/contact")
            }
        } else if (!this.state.auth.user.pronoun) {
            if (IS_CLIENT) {
                page("/sign-up/pronoun")
            }
        }
        else {
            try {
                await this.state.sleeper.addAlarm();
            } catch(err) {
                this.showError(err);
            }
        }
    }
    onAlarmCreated() {
        console.log("New alarm created!");
        if (IS_CLIENT) {
            page("/sleeper/alarms");
        }
    }

    privacy(e) {
        e.preventDefault();
        window.location = "/privacy.html"
    }
 </script>
</sleeper-alarms-add-personality>
