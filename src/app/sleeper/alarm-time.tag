<alarm-time>
    <article class="alarm">
        <div class="alarm-container">
            <div class="alarm-click-group" click="{changeTime}">
                <div class="alarm-time-group">
                    <formatted-time if="{opts.data.time}"class="{alarm-time: true, verifying:opts.verifying}" value="{new Date(opts.data.time)}" format="short"/>
                    <formatted-time if="{!opts.data.time}"class="{alarm-time: true, verifying:opts.verifying}" value="{defaultTime}" format="short"/>
                    <span class="{alarm-timezone: true, verifying:opts.verifying}"><formatted-message id="LOCAL_TIME"/></span>
                </div>
                <div class="alarm-date-group">
                    <formatted-message if="{opts.data.time}" class="{alarm-date:true, verifying:opts.verifying}" id="{TimeUtil.getDateMessageId(opts.data.time)}" date="{new Date(opts.data.time)}"/>            
                    <formatted-message if="{!opts.data.time}" class="{alarm-date:true, verifying:opts.verifying}" id="{TimeUtil.getDateMessageId(this.defaultTime)}" date="{new Date(this.defaultTime)}"/>            
                </div>
            </div>
            <div class="actions" if="{opts.onCancel}">
                <a class="edit-alarm" click="{changeTime}" href="">
                    <formatted-message id="EDIT"/>
                </a>
                <a class="cancel-alarm" click="{cancelAlarm}" href="">
                    <formatted-message id="CANCEL"/>
                </a>
            </div>
        </div>
        <div show="{opts.verifying}" class="circle-progress active">
            <div class="spinner"></div>
        </div>
        <div if="{!opts.onCancel}" class="choose-time">
            <a class="alarm-action" click="{changeTime}">
                <i class="material-icons">arrow_drop_down</i>
            </a>
        </div>
    </article>
    <input ref="time" type="time" style="display:none;" change="{onTimeChange}" blur="{onTimeBlur}">
 <style>
     alarm-time {
         .alarm-time {
            font-size: 40px;
            font-family: 'Oswald', Helvetica, sans-serif;
            padding-top:10px;
            @media (max-width: 360px) {
                font-size: 36px;
            }
            @media (max-width: 340px) {
                font-size: 34px;
            }
            color: white;
            margin-right: 5px;
         }
         .alarm-time.verifying {
            color: lightgrey;         
         }
         .alarm-date {
            margin-top: 5px;
            margin-bottom: 5px;
            color: #ff7500;
            font-weight: 600px;
         }
         .alarm-date.verifying {
            color: gray;
         }
         .alarm-timezone.verifying {
            color: gray;         
         }
         .alarm {
            background-color: #232323;
            margin-top: 15px;
            padding: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-radius: 0px;
            justify-content: space-between;
         }
         .alarm-container {
            display: flex;
            flex-direction: column;
         }
         .alarm-time-group {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            color: #06c2ff;
           .clock-desc {
              margin-top: 10px;
            }
            margin-bottom: 5px;
         }
         .alarm-date-group {
            margin-bottom: 5px;
         }
         .alarm-action {
            color: #ff6969;
            i {
               font-size: 40px;
               @media (max-width: 360px) {
                    font-size: 36px;
               }
               @media (max-width: 345px) {
                    font-size: 30px;
               }
            }
         } 
         .actions {
             a {
                 text-transform: uppercase;                             
                 text-decoration: underline;
                 color: white;
                 font-weight: 400;
                 font-size: 14px;
                 margin-right: 10px;
             }
             .cancel-alarm {
                color: #ff6969;
             }
         }
         .circle-progress {
            width: 20px;
            height: 20px;
            position: unset;
         }
     }
     
     .alarm-time .alarm-action {
	color: white;
}

.alarm-time .alarm-time-group {
	color: gray;
}

.alarm-time .alarm-date {
	color: gray;
	text-transform: uppercase;
}
 </style>
 <script>
    import MiscUtil from '../util/misc'

    this.mixin('TimeUtil');

    this.defaultTime = this.TimeUtil.getDefaultTime();

    this.on('mount', () => {
        console.log("time mounted ", this.opts);
    });

    this.on('unmount', () => {
    });

    changeTime(e) {
        console.log("Change time!",opts.data.time,this.refs.time);
        let alarmTime = new Date(opts.data.time);
        this.refs.time.value = MiscUtil.pad(alarmTime.getHours(),2) + ':' + MiscUtil.pad(alarmTime.getMinutes(),2);
        console.log("Change time from",this.refs.time.value);
        $(this.refs.time).show().focus().click();
        if (phonon.device.os == "iOS") {
            $(this.refs.time).hide();
        }
    }
    
    onTimeChange(e) {
        if (phonon.device.os == "Android") {
            console.log("Time Change!");
            $(this.refs.time).hide();
            if (this.opts.onChange) {
                this.opts.onChange(this.opts.data, this.refs.time.value);
            }
        }
    }

    onTimeBlur(e) {
        console.log("Time Blurrr!",this.refs.time);
        if (phonon.device.os != "Android") {
            setTimeout(() => {
            console.log("Time Blurrr!",this.refs.time);
            $(this.refs.time).hide();
            if (this.refs.time.value) {
                if (this.opts.onChange) {
                    this.opts.onChange(this.opts.data, this.refs.time.value);
                }
            }
            },0)
        }
    }

    cancelAlarm(e) {
        console.log("Cancel alarm!",this.opts.data);
        if (this.opts.onCancel) {
            this.opts.onCancel(this.opts.data);
        }
    }
 </script>
</alarm-time>
