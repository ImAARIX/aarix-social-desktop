var axios = require('axios');

var retrySec = 30;
var retryInterval;
var retrySecInterval;

async function sendRequestToAARIXsocial() {
    retrySecInterval = setInterval(async function() {
        retrySec--;
        document.getElementById('retryMessage').innerText = "Nouvel essai dans : " + retrySec + "s";
    }, 1000);
    retryInterval = setInterval(async function() {
        try {
            retry = true;
            retrySec = 30;
            clearInterval(retrySecInterval);
            var r = await axios.get('https://aarix.social', {
                timeout: 1000
            });
            win.loadURL('file://' + __dirname + '/../../agrougrou/html/index.html');
        } catch(e) {
            retrySecInterval = setInterval(async function() {
                retrySec--;
                document.getElementById('retryMessage').innerText = "Nouvel essai dans : " + retrySec + "s";
            }, 1000);
        }
    }, 30000);
}

sendRequestToAARIXsocial();