<sleeper-welcome>
<virtual data-is="stir-header"></virtual>
<div class="content">
     <div class="padded-full">
           <div class="row description">
                <formatted-message id='SLEEPER_WELCOME'/>
            </div>
            <div class="how-works">
                <p><b><formatted-message id='HOW_IT_WORKS'/></b></p>
                <ul class="">
                  <li><formatted-message id='HOW_WORKS_1'/></li>
                  <li><formatted-message id='HOW_WORKS_2'/></li>
                  <li><formatted-message id='HOW_WORKS_3'/></li>
                  <li><formatted-message id='HOW_WORKS_4'/></li>
                </ul>
            </div>
            <div class="row explanation">
                <formatted-message id='SLEEPER_WELCOME_1'/>
            </div>
            <div class="disclaimer">
                <p><formatted-message id='SLEEPER_WELCOME_DISCLAIMER'/></p>
            </div>
            <div class="action">
                <button class="btn raised primary" click="{begin}">
                    <formatted-message id='BEGIN'/>
                </a>
            </div>
      </div>
 </div>
 <style>
     sleeper-welcome {
         .description {
            font-size: 20px;
            margin-bottom: 10px;
         }

         .explanation {
            font-size: 16px;
            margin-bottom: 20px;
         
         }

         .action {
            display: flex;
            justify-content: center;
            margin-top: 20px;
         }
     }
 </style>
 <script>
    import MiscUtil from '../util/misc'
    import '../common/stir-header.tag'

    this.on('mount', () => {
        console.log("sleeper welcome mounted");
    });

    this.on('unmount', () => {
    });

    this.on('ready', () => {
        this.update();
    });

    begin(e) {
        this.state.auth.shownSleeperIntro();
        page.show("/sleeper/alarms/add/time");
    }

 </script>
</sleeper-welcome>
