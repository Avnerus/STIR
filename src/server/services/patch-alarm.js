export default function patchAlarmHook(hook) {
    console.log("Path alarm hook!");
    if (hook.params.provider == "socketio" || hook.params.provider == "rest") {
        // User can only update the time and timezone and deleted
        let newData = {};
        if (hook.data.time) {
            newData.time = hook.data.time;
        }    
        if (hook.data.timezone) {
            newData.timezone = hook.data.timezone;
        }
        if (hook.data.deleted) {
            newData.deleted = hook.data.deleted;

            // Clear data if's the last alarm (Checked by the service)
            hook.app.service("/user/contact").clearData(hook.params.user._id);                        
        }    
        hook.data = newData;
    }
    return hook;
}

