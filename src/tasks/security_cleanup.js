import mongoose from 'mongoose'
import User from '../server/models/user'

const HOURS_SINCE_UPDATE_SNS = 1;

console.log("Running security cleanup");
console.log("------------------------");

mongoose.Promise = global.Promise;
mongoose.connect(process.env['MONGO_CONNECTION'], {useMongoClient: true})
.then(() => {
    return deleteLingeringTokens();
})
.then((result) => {
    console.log(result.n + " Lingering tokens deleted");
})
.then(() => {
    process.exit();
})
.catch((err) => {
    console.error("Error during security cleanup!", err);
})


function deleteLingeringTokens() {
    let timeout = new Date();
    timeout.setHours(timeout.getHours() - HOURS_SINCE_UPDATE_SNS);

    return User.update(
        { 
           'updatedAt': {$lt: timeout},
           $or: [
               { facebook: { $exists: true } },
               { twitter: { $exists: true } },
           ]
        }, 
        {$unset: { 
            twitter: "",
            facebook: ""
        }},
        { multi: true  }
    );
}
