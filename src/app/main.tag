<main data-page="true">
    <!--role ref="role"></role-->
    <div if="{!state.main.role}">
            <div class="content">
                <div class="padded-full">
                    <h1><formatted-message id='HOME_TITLE'/></h1>
                    <p><formatted-message id='HOME_EXPLANATION'/></p>
                    <p><formatted-message id='HOME_CHOICE1'/></p>
                    <p><formatted-message id='HOME_CHOICE2'/></p>
                    <h1><formatted-message id='HOME_ACTION'/></h1>
                    <a class="btn primary" href="/sleeper/alarms" click="{refreshSleeper}">
                        <formatted-message id='SLEEPER'/>
                    </a>
                    <a class="btn primary" href="/rouser/alarms" click="{refreshRouser}">
                        <formatted-message id='ROUSER'/>
                    </a>
                </div>
                <div id="credits-link">
                    <a href="/credits">
                        <formatted-message id='CREDITS'/>
                    </a>
                </div>
            </div>
    </div>

    <style>
        body {
            font-family: 'Roboto Condensed', Helvetica, sans-serif;
            font-weight: 400;
            color: white;
            background-color: #000;
        }
        .app-page {
            background-color: #000;
        }
        body.arte {
            .app-page {
                top: 0;
                padding-top: 40px;
            }
            .header-bar ~ .content {
                margin-top: 92px;
            }
            
            main .content {
                margin-top: 52px;
            }
        }
        body.nfb {
            .app-page {
                top: -40px;
                padding-top: 40px;
            }
            .header-bar ~ .content {
                margin-top: 92px;
            }
            
            main .content {
                margin-top: 52px;
            }
        }

        .btn.raised {
                box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)
                }
        .btn {
            display: inline-block;
            font-family: 'Abel', Helvetica, sans-serif;
            text-transform: uppercase;
            font-size: .9rem;
            font-weight: 600;
            letter-spacing: .1rem;
            border: 3px solid white;
            padding: 20px;
            margin-top: 10px;
            text-align: center;
            width: 100%;
            color: white !important;
            line-height: 20px;
            border-radius: 0;
        }
       .btn:hover, .btn.btn-flat:hover {
         background: white !important;
         color: black !important;
         transition: all .5s;
       }
        .btn.btn-flat {
            border: none;
            color: white !important;
        }
       .primary,.positive {
            background-color: #000 !important;        
        }
        .positive {
            border-color: #0ae700 !important;
        }
        .padded-full {
            font-size: 16px;
            padding: 20px;
            margin: 0;
            min-height: 580px;
            p {
                font-family: 'Roboto Condensed', Helvetica, sans-serif;
                font-size: .9rem;
                margin-bottom: 10px;
                color: #d1d1d1;
                margin-top: 16px;
            }
        }
        h1 {
            font-family: 'Abel', Helvetica, sans-serif;
            text-transform: uppercase;
            font-size: 1.4rem;
            letter-spacing: .1rem;
            margin-top: 10px;
            font-weight: 600;
            line-height: unset;
            margin: unset;
            margin-bottom: 13.9333px;
            margin-left: 0px;
            margin-right: 0px;
            margin-top: 13.9333px;
        }

        a {
            font-weight: 600;
        }

        label {
            color: white;
        }

        input, select, textarea {
            background-color: transparent !important;
            color: white !important;
        }
    
        main {
            .title {
                margin-bottom: 30px;
            }
            .explanation {
                font-size: 16px;
                margin-bottom: 10px;
            }
            .choice {
                font-size: 16px;
                margin-bottom: 50px;
            }
            .action {
                margin-bottom: 30px;
            }

        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            /* display: none; <- Crashes Chrome on hover */
            -webkit-appearance: none;
            margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
        }
        input[type="number"] {
            -moz-appearance: textfield !important;
        }

        .header-bar {
            //box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12);
            background-color: #000;
            border-bottom: 1px solid #333333;

            h1 {
                line-height: 26px;
                span {
                    color: white;
                }
            }

        }
        .description {
            font-size: 18px;
        }
        .title {
            font-size: 18px;

        }
        .explanation {
            margin-top: 15px;

        }
        .action {
            margin-top: 20px;

        }
        .disclaimer, .disclaimer > p  {
            color: #c2f442;
            font-size: .7rem;
            margin-top: 30px;
        }

        .dialog {
            background-color: #333;
            box-shadow: none;
            .padded-full {
                min-height: 0px;
            }
        }

        .circle-progress {
            background-color: transparent;

        }
        .notification {
            font-size: 16px;
            line-height: unset;
            padding-top: 20px;
            padding-bottom: 15px;
            padding-left: 30px;
        }

        .popover {
            width: 52px;
            top: 43px !important;
            border-radius: 10px;
            .list li {
                line-height: 40px;
                height: auto;
                min-height: 40px;
            }
            background-color: rgba(118,160,243,0.6);
        }
        .stepper-container {
            display: flex;
            justify-content: center;
            @media (max-height: 650px) {
                position: relative;
                bottom: 50px;
            }
            position: absolute;
            bottom: 60px;
            width: 100%;
            padding-top: 20px;
            .dot {
              height: 10px!important;
              width: 10px!important;
              margin: 4px!important;
              border: 2px solid white!important;
            }
        }
        #credits-link {
            display: flex;
            justify-content: center;
            @media (max-height: 650px) {
                position: relative;
                bottom: 15px;
            }
            position: absolute;
            bottom: 60px;
            width: 100%;
            padding-top: 20px;

           a {
                color: white;
                letter-spacing: 1px;
                text-decoration: underline;
                font-weight: 600;
                font-family: Abel;
                font-size: .8rem;      
           }
           
           a:hover {
                color: blue;
           }
        }
        #prompt {
            .intro {
                font-size: 18px;
                margin-bottom: 10px;
            }        
            p {
                font-size: 16px;
            }
            ul {
                padding-left: 10px;
                margin-top: 0;

                li {
                    font-size: 16px;
                    margin-bottom: 5px;
                }

            }
        }

        #arte-footer {
            position: absolute;
            bottom: -80%;
            z-index: 2;
        }

        #home-suggest {
            .padded-full {
                display: flex;
                justify-content: space-between;
                align-items: center;

                span {
                    padding-right: 10px;
                    font-weight: bold;
                }
                
                a {
                    position: relative;
                    top: 3px;
                }
            }
        }
        .panel {
            background-color: #333;

            .padded-full {
                min-height: 0;
            }
        }

        .intro-panel {
            z-index: 9999;
            .content {
                background-color: black;
                video {
                    width: 100%;
                }
            }
            .overlay {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                h1 {
                    color: black;
                    position: absolute;
                    top: 15%;
                    width: 100%;
                    text-align: center;
                }
                
                .video-title {
                  display: none;
                }

                a {
                    width: 100%;
                    text-align: center;
                }
                
                .play-button {
                    position: absolute;
                    width: 90px;
                    height: 90px;
                    background-color: rgba(0,0,0,.6);
                    display: flex;
                    border-radius: 50%;
                    justify-content: center;
                    align-items: center;
                    
                    i {
                        color: #fff;
                        font-size: 60px;
                    }
                }

                .skip-link {
                    position: absolute;
                    bottom: 5%;
                    font-size: .9rem;
                    font-family: Abel;
                    font-weight: 600;
                    text-decoration: underline;
                    color: #333;
                    text-transform:uppercase;
                }
                
            }
        }
        .IIV::-webkit-media-controls-play-button,
        .IIV::-webkit-media-controls-start-playback-button {
              opacity: 0;
                   pointer-events: none;
                        width: 5px;
                         
         }

        .error {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            
            span {
                font-size: 20px;
                margin-bottom: 20px;
                text-align: center;
                padding: 10px;
            }
        }

        #home-suggest-iphone {
            img {
                margin-left: 3px;
                margin-right: 3px;
                position: relative;
                top: 3px;
            }
        }
        #home-suggest-android {
            .share-icon {
                position: relative;
                top: 5px;
            }
        }
        .home-suggest {
            a {
                position: absolute;
                right: 5px;
                top: 5px;
            }
            .padded-full {
                line-height: 22px;
            }

        }
    </style>

    <script>
        import { mount } from 'riot'

        import './sleeper/add-alarm/add-time.tag'
        import './sleeper/add-alarm/personality.tag'
        import './sleeper/add-alarm/questions.tag'
        import './sleeper/clock.tag'
        import './sleeper/alarm-summary.tag'
        import './sleeper/welcome.tag'

        import './rouser/alarms.tag'
        import './rouser/welcome.tag'
        import './rouser/alarm/mix.tag'
        import './rouser/alarm/record.tag'
        import './rouser/alarm/thankyou.tag'
        import './rouser/alarm/mturk.tag'

        import './common/sign-up/contact.tag'
        import './common/sign-up/verify.tag'
        import './common/sign-up/locale.tag'
        import './common/sign-up/pronoun.tag'

        import './admin/login.tag'
        import './admin/dashboard.tag'

        import './credits.tag'

        import MiscUtil from './util/misc'

        this.on('mount', () => {
            console.log("Main mounted");

            if (IS_CLIENT && !this.state.auth.mturk) {
               if (!this.state.auth.accessToken) {
                    console.log("Opening intro");
                    MiscUtil.initVideoPanel('#intro-panel');
                    phonon.panel('#intro-panel').open();                    
               }
               this.state.auth.loginRest();
            }
        });

        this.on('ready', () => {
            this.update();
        })

        this.on('update', () => {
            console.log("Main update");
        })

        this.on('unmount', () => {
            this.state.main.off('main_role_updated', this.roleUpdated);
        })

        roleUpdated(role) {
            console.log("Main role updated!", role);
        }

        refreshRouser(e) {
            this.state.rouser.invalidateAlarms();            
        }

        refreshSleeper(e) {
            this.state.sleeper.invalidateAlarms();            
        }
    </script>
</main>
