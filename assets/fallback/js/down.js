var axios = require('axios');

var win = remote.getCurrentWindow();

async function checkServer() {
    try {
        var r = await axios.get('https://aarix.social', {
            timeout: 1000
        });
    } catch(e) {
        win.loadURL('file://' + __dirname + '/../../fallback/html/index.html');
    }
}

checkServer();