<rouser-alarm-record>
<virtual data-is="stir-header"></virtual>
<div class="content">
  <div class="padded-full">
      <div class="description row">
            <h1><formatted-message id='ROUSER_RECORD_DESCRIPTION'/></h1>
      </div>
      <p>
      <div class="row notice">
         <formatted-message id='ROUSER_RECORD_NOTICE'/>
      </div>
      </p>
      <p>
      <div class="language-requirement">
           <formatted-message id='LANGUAGE_REQUIREMENT'/>
        <ul>
            <li each="{getLanguages()}" class="language-item">
               <formatted-message id='{name}'/>
            </li>
        </ul>
      </div>
      </p>
      <div id="prompt">
            <div class="intro row">
               <formatted-message id='PROMPT_INTRO' name="{state.rouser.currentAlarm.name}"/>
            </div>
            <p each="{text, i in state.rouser.currentAlarm.prompt[state.auth.locale].paragraphs}">{text}</p>
            <p><formatted-message id='PROMPT_INSTRUCTION' name="{state.rouser.currentAlarm.name}"/></p>
            <ul class="">
              <li each="{text, i in state.rouser.currentAlarm.prompt[state.auth.locale].instructions}">
                {text}
              </li>
            </ul>
       </div>
       <form show="{!loading}" action="" onsubmit="{requestCall}">
            <button class="btn primary raised" type="submit"><formatted-message id='RECORD_ACTION'/></button>
       </form>
       <img show="{loading}" src="/images/loading.gif">
   </div>
</div>

 <style>
     rouser-alarm-record {
         #prompt {
            background-color: #f8f8f8;
            color: black;
            padding: 10px;
            font-size: 13px;
            p {
                color: black;
            }
         }
        .description {
            margin-bottom: 10px;
        }
        .notice {
            font-weight: 600;
        }
        .language-requirement {
            border-bottom: 1px solid #ddd;
        }
     }
 </style>

 <script>
    import '../../common/stir-header.tag'
    import SocketUtil from '../../util/socket'

    this.on('mount', () => {
        console.log("alarm record mounted");
    });

    this.on('unmount', () => {
    });

    this.on('ready', () => {
        this.loading = false;
        SocketUtil.socket.once('recordings ready', (data) => {
            this.onRecordingReady(data);
        });
        this.update();
    });

    getLanguages() {
        const names = {
            'en': 'ENGLISH',
            'fr': 'FRENCH',
            'de': 'GERMAN'
        }
        return this.state.rouser.currentAlarm.locales.map(code => {return {name: names[code]}});
    }

    async requestCall(e) {
        e.preventDefault();
        console.log("Request a call!");
        try {
            this.loading = true;
            let result = await this.state.rouser.requestCall();
            console.log("Request call result", result);
        }
        catch(e) {
            console.log("Error requesting call", e);
            phonon.alert(e.name ? e.name : e.message, "Oops", false, "Ok");
            this.loading = false;
            this.update();
        }
    }

    onRecordingReady(data) {
        this.loading = false;
        this.state.rouser.recordingReady(data);
        console.log("Recording ready!", this.state.rouser.currentAlarm.recording);
        if (this.state.rouser.currentAlarm.recording.status == "success") {
            if (IS_CLIENT) {
                page("/rouser/alarm/" + this.state.rouser.currentAlarm._id + "/mix")
            }
        } else {
            console.log("Error", this.state.rouser.currentAlarm.recording.message);
            this.loading = false;
            this.update();
            phonon.alert(this.state.rouser.currentAlarm.recording.message, "Oops", false, "Ok");
        }
    }
 </script>
</rouser-alarm-record>
