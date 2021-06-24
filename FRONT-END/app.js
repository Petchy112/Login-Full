const axios = require('axios');


window.fbAsyncInit = function () {
    FB.init({
        appId: '1218076828653725',
        cookie: true,                     // Enable cookies to allow the server to access the session.
        xfbml: true,                     // Parse social plugins on this webpage.
        version: 'v11.0'           // Use this Graph API version for this call.
    });
};
async function calledFB(response) {
    if (response.status == 'connected') {
        console.log(response)
        const data = await fetch("http://localhost:80/api/loginWithFb", {
            method: 'POST',
            headers: {
                authorization: response.authResponse.userID
            }
        })
    }
    throw err;
}
