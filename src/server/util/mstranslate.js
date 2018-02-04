import MSTranslator from 'mstranslator'

class MSTranslateUtil {
    constructor() {
        this.client = new MSTranslator({
            api_key : process.env.MS_ACCESS_KEY
        },false) // No auto refresh, token will be initialzied and refreshed at interval

        this.TOKEN_REFRESH_INTERVAL = 9 * 60 * 1000;
        this.refreshToken();

    }
    refreshToken() {
        this.initToken()
        .then((keys) => {
            console.log("M$ KEYS: ", keys);
            setTimeout(() => {
                this.refreshToken();
            }, 
            this.TOKEN_REFRESH_INTERVAL);
        })
        .catch((err) => {
            console.error("Error initializing MSTranslator keys! Retrying in 10 seconds", err);
            setTimeout(() => {
                this.refreshToken();
            }, 
            10 * 1000);
        });
    }
    translate(text, target) {
        return new Promise((resolve, reject) => {
            let params = {
              text: text,
              to: target
            };
            if (this.client.credentials && this.client.credentials.api_key) {
                this.client.translate(params, (err, data) => {
                  if (err) {
                      reject(err);
                  } else {
                      resolve(data);
                  }
                });
            } else {
                console.error("No credentials for MSTranslator! Returning original");
                resolve(text);
            }
        })
    }

    initToken() {
        return new Promise((resolve, reject) => {
            this.client.initialize_token((err, keys) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(keys);
              }
            }, true /* noRefresh */);
        })
    }
};

// Singleton
let instance = new MSTranslateUtil();
export default instance;
