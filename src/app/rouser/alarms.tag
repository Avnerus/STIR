<rouser-alarms>
<virtual data-is="stir-header"></virtual>
<div class="content">
     <div show="{state.rouser.alarms != null && state.rouser.alarms.length > 0}" class="padded-full">
            <h1><formatted-message id='ROUSER_FOUND_SLEEPER'/></h1>
            <p><formatted-message id='ROUSER_SLEEPER_EXPLANATION'/></p>
            <article class="sleeper" each={ state.rouser.alarms }>
                <div class="details">
                    <a href="/rouser/alarm/{_id}/record">{name}</a>
                    <span class="country">{country}</span>
                </div>
                <div class="sleeperbutton">
                        <a href="/rouser/alarm/{_id}/record">
                            <button class="btn primary raised">
                            <formatted-message id="{'WAKE_' + pronoun}"/>
                            </button>
                        </a>
                </div>
            </article>
      </div>
     <div show="{state.rouser.alarms != null && state.rouser.alarms.length == 0}" class="padded-full">
            <h1><formatted-message id='ROUSER_NO_SLEEPERS'/></h1>
            <p><formatted-message id='ROUSER_NO_SLEEPERS_EXPLANATION'/></p>
      </div>
      <div show="{ state.rouser.alarms == null }" class="circle-progress center active">
        <div class="spinner"></div>
     </div>
 </div>
 <style>
     rouser-alarms {
         .description {
            font-size: 20px;
            margin-bottom: 10px;
         }
         .sleeper {
            background-color: #232323;
            margin-top: 15px;
            padding: 20px;
            margin-top: 30px;
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap:wrap;
            justify-content : space-between;

            .details {
                display: flex;
                flex-direction: column;

            a {
              text-transform: uppercase;
              font-family:
              letter-spacing: .15rem;
              color: white;
              font-family: Oswald;
            }

        		.country {
        			text-transform: uppercase;
        			opacity: .5;
        			font-weight: 600;
        			letter-spacing: .05rem;
        			font-size:.8rem;
        		}
            }

             .details a {
	          font-size: 1.7rem;
	          font-weight: 400!important;
	          line-height: 1.2;
	          color: white;
	         }

            .sleeperbutton {
               width: 100%;
               margin-top: 15px;
            }

            .btn {
                margin-top: 0;
            }
         }
     }

     rouser-alarm-record .notice {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          margin-bottom: 10px;
          color: #C8C8C8;
          margin-top: 16px;
}

	.language-requirement {
		font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          margin-bottom: 10px;
          color: #C8C8C8;
          margin-top: 16px;
}

	.rouser-alarm-record #prompt {
		border-radius:0px!important;
		padding:20px!important;

		p {
		font-family: 'Montserrat', sans-serif;
		font-size: 13px
          margin-bottom: 10px;
          color: #000000;
		font-weight: 400;
		}

		ul li {
		font-family: 'Montserrat', sans-serif;
		font-size: 13px;
          margin-bottom: 10px;
          color: #000000;
		font-weight: 400;
		}

	}
 </style>
 <script>
    import '../common/stir-header.tag'
    import MiscUtil from '../util/misc'

    this.mixin('UIUtil');

    this.on('mount', () => {
        console.log("alarm-queue mounted");
        this.state.rouser.on('queue_updated', this.queueUpdated);
    });

    this.off('unmount', () => {
        this.state.rouser.on('queue_updated', this.queueUpdated);
    });

    this.on('ready', () => {
        this.update();
        if (phonon.device.os == "iOS" && this.state.auth.accessToken) {
            window.history.replaceState(null, null, "/rouser/alarms?accessToken=" + this.state.auth.accessToken);
        }
        this.UIUtil.addManifests('rouser');

        if (!MiscUtil.isStandaone() && this.state.auth.user && !this.state.auth.user.status.suggestedRouserHome) {
            if (this.UIUtil.suggest('ROUSER')) {
                this.state.auth.suggestedRouserHome();
            }
        }
        this.state.auth.refreshStatus();
    });

    queueUpdated() {
        console.log("Queue updated");
        this.update();
    }

 </script>
</rouser-alarms>
