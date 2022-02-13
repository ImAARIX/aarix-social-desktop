const fs = require('fs');
const remote = require('@electron/remote');

var appdataUserInfosDir = process.env.APPDATA + "/AARIX.social Desktop/userinfos"

var loginFormView = document.getElementById('loginFormView');
var app_logo = document.getElementById('app_logo');
var buttons = document.getElementById('buttons');

setTimeout(() => {
    loginFormView.style.display = 'block';
    setTimeout(() => {
        app_logo.style.opacity = "1";
        buttons.style.opacity = "1";
    }, 100);
}, 400);

function login() {
    remote.shell.openExternal("https://aarix.social/login/?redircode=QzlVYJCTSMr2hIznKCk6");
};

function withoutLogin() {
    var dataToWrite = {
        'userscope': 'none'
    };
    dataToWrite = JSON.stringify(dataToWrite);
    fs.writeFileSync(appdataUserInfosDir + '/userscope.json', dataToWrite);
    remote.app.relaunch();
    remote.app.exit(0);
}