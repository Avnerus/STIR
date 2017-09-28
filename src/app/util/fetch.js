// Fetch Util
class FetchUtil {
    constructor() {
    }

    postJSON(target, data, accessToken) {
        return fetch(target, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(data),
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': accessToken
            }
        })
        .then((response) => {
             return response.json();
        })
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
