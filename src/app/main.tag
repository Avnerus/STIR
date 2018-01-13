<main data-page="true">
    <!--role ref="role"></role-->
    <div if="{!state.main.role}" show="{state.auth.accessToken}">
            <div class="content">
                <div class="padded-full">
                    <h1><formatted-message id='HOME_TITLE'/></h1>
                    <p><formatted-message id='HOME_EXPLANATION'/></p>
                    <p><formatted-message id='HOME_CHOICE1'/></p>
                    <p><formatted-message id='HOME_CHOICE2'/></p>
                    <h1 class="second"><formatted-message id='HOME_ACTION'/></h1>
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
            font-family: 'Montserrat', Helvetica, sans-serif;
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
              //  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)
                }
        .btn {
            display: inline-block;
            font-family: 'Oswald', Helvetica, sans-serif;
            text-transform: uppercase;
            font-size: 14px;
            font-weight: 500;
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
        div#social-buttons {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
	    margin-left: 0px;
	    margin-right: 0px;
        }
       .primary,.positive {
            background-color: #000 !important;
        }
        .positive {
            border-color: white;
        }
        .padded-full {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
	        line-height: 18px;
            padding: 20px;
            margin: 0;
            min-height: 400px;
        }

        p {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            line-height: 18px;
            margin-bottom: 10px;
            color: #C8C8C8;
            margin-top: 16px;
         }

        h1 {
            font-family: 'Oswald', Helvetica, sans-serif;
            font-weight: 500;
            font-size: 22px;
            letter-spacing: .15rem;
            line-height: 1.4;
            text-transform: uppercase;
            margin-bottom: 13.9333px;
            margin-left: 0px;
            margin-right: 0px;
            margin-top: 13.9333px;
        }

        h1.second {
            margin-top: 30px;
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

        .intl-tel-input {
	        width: 100%;
        }

    input#phone {
	    font-size: 24px;
	    border-bottom: 2px solid white;
	    border-bottom-width: 2px!important;
        font-family: 'Oswald', Helvetica, sans-serif;
        letter-spacing: .15rem;
    }

    input:invalid {
	    border-color: #f44242!important;
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
            font-family: 'Montserrat', Helvetica, sans-serif;
            color: gray;
            font-size: 9.5px;
            line-height: 1.4;
            margin-top: 15px;
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
        .circle-progress.active {
            .spinner {
                border-top-color: #ffffff;
                border-right-color: #ffffff;
                border-bottom-color: #ffffff;
                border-left-color:  #0084e7;

            }
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
                bottom: 10px;
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
            position: relative;
            bottom: 30px;
            width: 100%;
            padding-top: 20px;

           a {
                color: white;
                text-decoration: underline;
                font-family: Oswald, Helvetica;
		text-transform:uppercase;
		letter-spacing: .15rem;
                font-size: 14px;
           }

           a:hover {
                color: blue;
           }
        }
        #prompt {
            .intro {
                margin-bottom: 10px;
            }
            p {
                font-size: 13px;
                font-family: 'Montserrat', Helvetica, sans-serif;
            }
            ul {
                padding-left: 20px;
                margin-top: 0;

                li {
                    font-size: 13px;
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
        #onf-intro {
            position: fixed !important;
        }

        .intro-panel {
            z-index: 1002;
            .content {
                background-color: black;
                video {
                    width: 100%;
                }
                display: flex;
                justify-content: center;
                align-items: center
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
                    width: 90px;
                    height: 90px;
                    border: 3px solid #000;
                    display: flex;
                    border-radius: 50%;
                    justify-content: center;
                    align-items: center;

                    i {
                        color: #000;
                        font-size: 60px;
                    }
                }

                .skip-link {
                    position: absolute;
                    bottom: 5%;
                    font-size: 14px;
		    letter-spacing: .1rem;
                    font-family: Oswald, sans-serif;
                    font-weight: 600;
                    text-decoration: underline;
                    color: #000;
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
                font-size: 16px;
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
                color: white;
            }
        }
        .home-suggest {
            a {
                position: absolute;
                right: 5px;
                top: 5px;
                color: white;
            }
            .padded-full {
                line-height: 22px;
            }

        }

	ul#sortable {
		li {
			padding: 0px;
			padding-bottom: 15px;
			font-family: 'Montserrat', Helvetica, sans-serif;

			i {
				padding-right:15px;
			}
		}

}

.how-works p {
	font-family: 'Oswald', Helvetica, sans-serif;
	text-transform: uppercase;
	font-weight: 500;
    font-size: 18px;
    letter-spacing: .15rem;
    line-height: 1.4;
    color: white;
}

#SLEEPER_WELCOME, .how-works ul, .row.explanation {
	font-family: 'Montserrat', Helvetica, sans-serif;
	font-size: 14px;
	line-height: 18px;
	color: #C8C8C8;
}

.how-works li {
    margin-bottom: 8px;
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

        this.on('mount', async () => {
            console.log("STIR Main mounted: Environment: " + this.state.main.env);
            if (IS_CLIENT && this.state.main.env == 'production') {
                console.log = function() {};
            }

            if (IS_CLIENT && !this.state.auth.mturk) {
               if (!this.state.auth.accessToken) {
                    console.log("Opening intro");
                    MiscUtil.initVideoPanel('#intro-panel', this.formatMessage('SKIP'));
                    phonon.panel('#intro-panel').open();
               }
               await this.state.auth.loginRest();
               this.update();
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
