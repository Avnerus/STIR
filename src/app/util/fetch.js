// Fetch Util
class FetchUtil {
    constructor() {
    }

    postJSON(target, data, accessToken) {
        if (typeof(fetch) != 'undefined') {
            let options = {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                }
            }
            if (accessToken) {
                options.headers.Authorization = accessToken;
            }

            return fetch(target,options)
            .then((response) => {
                 return response.json();
            })
        } else if (IS_CLIENT && $) {
            return new Promise((resolve, reject) => {
                let options =  {
                      type: "POST",
                      url: target,
                      data: JSON.stringify(data),
                      dataType: 'json',
                      contentType: 'application/json',
                      success: (result) => {
                          console.log("Jquery ajax result!", result);
                          resolve(result);
                      },
                      error: (err) => {
                          console.log("Jquery ajax error!", err);
                          reject(err)
                      }
                };
                if (accessToken) {
                    options.headers = {Authorization : accessToken}
                }

                $.ajax(options);
            });
        } else {
            throw new Error("No fetch client!");
        }
    }

    get(target, accessToken) {
        console.log("Fetching " + target + " with accessToken " + accessToken);
        return fetch(target, {
             method: 'GET',
             credentials: 'include',
             headers: {
                 'Accept': 'application/json',
                 'Authorization': accessToken
             }
        })
        .then((response) => {
             return response.json();
        })
    }

};

// Singleton
let instance = new FetchUtil();
export default instance;
