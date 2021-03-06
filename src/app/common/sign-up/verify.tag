<sign-up-verify>
  <virtual data-is="stir-header"></virtual>
  <div class="content">
      <div class="padded-full">
           <p>
                <formatted-message if="{state.auth.user.name}" id='CONTACT_VERIFY_NAME'
                    name="{state.auth.user.name}"
                />
                <formatted-message if="{!state.auth.user.name}" id='CONTACT_VERIFY'/>
            </p>
           <form action="" onsubmit="{verifyCode}">
                <input ref="code" type="number" min="1000" max="9999">
                <div class="action">
                    <button class="btn primary raised" type="submit">
                        <formatted-message id='NEXT'/>
                    </button>
                </div>
           </form>
          <p>
          <b show"{error}" class="error">{error}</b>
          </p>
      </div>
      <div if="{state.main.role == 'sleeper'}">
          <div class="stepper-container">
              <stepper size="{state.sleeper.getSteps()}" current="4"></stepper>
          </div>
      </div>
     <div if="{state.main.role == 'rouser'}">
          <div class="stepper-container">
              <stepper size="3" current="2"></stepper>
          </div>
     </div>
  </div>
 <style>
     sign-up-verify {
         .action {
            margin-top: 15px;
         }
     }
 </style>
 <script>
    import '../stir-header.tag'
    this.mixin('RouteUtil');

    this.on('mount', () => {
        console.log("sign-up contacts mounted");
    });

    this.on('ready', () => {
        $(this.refs.code).focus();
    })

    this.on('unmount', () => {
    });

   async verifyCode(e) {
        e.preventDefault();
        try {
            console.log("Verify code " + this.refs.code.value);
            let result = await this.state.auth.verifyCode(this.refs.code.value);
            console.log("Verify code result : " , result);
            if (result.status == "success") {
                if (result.refresh) {
                    this.state.sleeper.invalidateAlarms();                
                }
                await this.RouteUtil.routeSignup();
            } else {
                throw new Error("Internal error");
            }
        }
        catch (err) {
           console.log("Error while verifying code!", err);
           phonon.alert(err.message, "Oops!", false, "Ok");
        }
    }
 </script>
</sign-up-verify>
