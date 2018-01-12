<rouser-alarm-mix>
<virtual data-is="stir-header"></virtual>
<div class="content">
    <div class="padded-full">
       <h1><formatted-message id='ROUSER_MIX_DESCRIPTION'/></h1>
       <div>
            <p><formatted-message id='ROUSER_MIX_1'/></p>
            <p><formatted-message id='ROUSER_MIX_2'/></p>
            <p><formatted-message id='ROUSER_MIX_3'/></p>
       </div>
       <div>
        <p>
            <audio ref="audio" controls="controls">
                <source src={state.rouser.currentAlarm.recording.mixUrl} type="audio/wav">
            </audio>
        </p>
        <form action="" onsubmit="{finalize}">
           <button class="btn positive raised" type="submit">
                <formatted-message id='SUBMIT_MESSAGE'/>
            </button>
        </form>
        <button class="btn primary raised" type="button" click="{recordAgain}">
            <formatted-message id='RERECORD'/>
        </button>
        </div>
    </div>
</div>

<style>
    rouser-alarm-mix {
        form {
            display: inline-block;
            width: 100%;
        }

    }
</style>
    <script>
        import '../../common/stir-header.tag'

        this.on('mount', () => {
            console.log("alarm mix mounted");

        });

        this.on('unmount', () => {

        });

        this.on('ready', () => {
            this.update();
            this.refs.audio.load();
        })

        this.on('hidden', () => {
            this.refs.audio.pause();
        })

        recordAgain() {
            page("/rouser/alarm/" + this.state.rouser.currentAlarm._id + "/record")
        }

        async finalize(e) {
            e.preventDefault();
            try {
                console.log("Finalizing alarm");
                let result = await this.state.rouser.finalizeAlarm();
                console.log("Finalize result", result);
                if (result.status == "success") {
                    this.state.rouser.invalidateAlarms();
                    page("/rouser/alarm/" + this.state.rouser.currentAlarm._id + "/thankyou")
                } else {
                    console.log("Error finalizing alarm!", result);
                }
            }
            catch (e) {
                console.log("Error finalizing alarm!", e);
            }
        }
    </script>
</rouser-alarm-mix>
