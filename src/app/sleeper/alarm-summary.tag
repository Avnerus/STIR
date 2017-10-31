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
            <p><formatted-message id='LISTEN_ALARM'/></p>
            <audio controls="controls">
                <source src="{state.sleeper.currentAlarm.recording.mixUrl}"></source>
            </audio>
            <p><b><formatted-message id='YOUR_TRAITS'/></b></p>
            <p each="{traits}">
                {trait} : {value}
            </p>
            <div class="action">
                <a class="btn raised primary" href="/rouser/alarms">
                    <formatted-message id='BE_A_ROUSER'/>
                </a>
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

    this.traits = Object.keys(this.state.sleeper.currentAlarm.generatedFrom).map((key) => {
        return {trait: key, value: this.state.sleeper.currentAlarm.generatedFrom[key]}
    });
    this.on('mount', () => {
        console.log("alarm summary mounted");
    });

    this.on('unmount', () => {
    });

    this.on('ready', () => {
    });

 </script>
</sleeper-alarm-summary>
