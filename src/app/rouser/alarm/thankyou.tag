<rouser-alarm-thankyou>
<virtual data-is="stir-header"></virtual>
<div class="content">
    <div class="padded-full">
       <div class="row description">
          <h1>Thank you!</h1>
       </div>
       <div>
            <p>If you would like, we can search for another sleeper in need of a wakeup.</p>

            <p>Or you can be a sleeper yourself.</p>
       </div>
       <div class="action">
            <a href="/rouser/alarms" class="btn primary" click="{refreshRouser}">
                <formatted-message id="ANOTHER_SLEEPER"/>
            </a>
            <a href="/sleeper/alarms" class="btn primary raised" click="{refreshSleeper}">
                <formatted-message id="BE_A_SLEEPER"/>
            </a>
        </div>
    </div>
</div>

<style>
    rouser-alarm-thankyou {
    }
</style>
    <script>
        import '../../common/stir-header.tag'

        refreshRouser(e) {
            this.state.rouser.invalidateAlarms();            
        }

        refreshSleeper(e) {
            this.state.sleeper.invalidateAlarms();            
        }

    </script>
</rouser-alarm-thankyou>
