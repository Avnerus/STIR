<rouser-welcome>
<virtual data-is="stir-header"></virtual>
<div class="content">
     <div class="padded-full">
            <h1><formatted-message id='ROUSER_WELCOME'/></h1>
           <div>
                <p><formatted-message id='ROUSER_WELCOME_1'/></p>
                <p><formatted-message id='ROUSER_WELCOME_2'/></p>
                <p><formatted-message id='ROUSER_WELCOME_3'/></p>
                <p><formatted-message id='ROUSER_WELCOME_4'/></p>
            </div>
            <div class="disclaimer">
                <p>
                    <formatted-message id='ROUSER_WELCOME_DISCLAIMER'/>
                </p>
            </div>
            <div class="action">
                <button class="btn raised primary" click="{begin}">
                    <formatted-message id='BEGIN'/>
                </a>
            </div>
      </div>
 </div>
 <style>
     rouser-welcome {
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
    import MiscUtil from '../util/misc'
    import '../common/stir-header.tag'

    this.on('mount', () => {
        console.log("rouser welcome mounted");
    });

    this.on('unmount', () => {
    });

    this.on('ready', () => {
        this.state.rouser.setAction("alarms");
        if (!MiscUtil.isStandaone() && IS_CLIENT && !this.state.auth.mturk) {
            console.log("Opening intro");
            MiscUtil.initVideoPanel('#rouser-intro-panel');
            phonon.panel('#rouser-intro-panel').open();                    
        }
        this.update();
    });

    begin(e) {
        this.state.auth.shownRouserVideo();
        page.show("/rouser/alarms");
    }

 </script>
</rouser-welcome>
