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
            <p><formatted-message id='LISTEN_ALARM'/></p>
            <p>
            <audio controls="controls">
                <source src="{state.sleeper.currentAlarm.recording.mixUrl}"></source>
            </audio>
            </p>
            <p><b><formatted-message id='YOUR_TRAITS'/></b></p>
            <div id="prompt">
                <div class="intro row">
                   <formatted-message id='PROMPT_INTRO' name="{state.sleeper.currentAlarm.name}"/>
                </div> 
                <p each="{text, i in state.sleeper.currentAlarm.prompt[state.auth.locale].paragraphs}">{text}</p>
                <p><i><formatted-message id='PROMPT_INSTRUCTION' name="{state.sleeper.currentAlarm.name}"/></i></p>
                <ul class="">
                  <li each="{text, i in state.sleeper.currentAlarm.prompt[state.auth.locale].instructions}">
                    {text}
                  </li>
                </ul>
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
     }
 </style>
 <script>

    import '../common/stir-header.tag'

    this.on('mount', () => {
        console.log("alarm summary mounted");
    });

    this.on('unmount', () => {
    });

    this.on('ready', () => {
    });

 </script>
</sleeper-alarm-summary>
