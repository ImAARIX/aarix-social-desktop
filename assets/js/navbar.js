const remote = require('@electron/remote');
const $ = require('jquery');
var win = remote.getCurrentWindow();
var closeButton = document.getElementById('close');
var agrougrouPage = document.getElementById('agrougrouPage');
var leCafoutchPage = document.getElementById('leCafoutchPage');
var appView = document.getElementById('appView');

var clicked = false;

closeButton.addEventListener('click', () => {
    win.hide();
});

var lct = document.getElementById('le-cafoutch-text');
var lcf = document.getElementById('le-cafoutch-fade');

var agt = document.getElementById('agrougrou-text');
var agf = document.getElementById('agrougrou-fade');

var lc = document.getElementById('le-cafoutch');
var ag = document.getElementById('agrougrou');

if(!ag) {
    setTimeout(() => {
        lcf.style.opacity = "0";
    }, 10);

    lct.addEventListener('mouseover', () => {
        if(!clicked) {
            lcf.style.opacity = "1";
        }
    })
    
    lct.addEventListener('mouseout', () => {
        if(!clicked) {
            lcf.style.opacity = "0";
        }
    });

    agrougrouPage.addEventListener('click', () => {
        var win = remote.getCurrentWindow();
        clicked = true;
        agf.style.opacity = "1";
        appView.style.opacity = 0;
        setTimeout(() => {
            win.loadURL('file://' + __dirname + '../../../agrougrou/html/index.html');
        }, 105);
    });
}

if(!lc) {
    setTimeout(() => {
        agf.style.opacity = "0";
    }, 10);

    agt.addEventListener('mouseover', () => {
        if(!clicked) {
            agf.style.opacity = "1";
        }
    })
    
    agt.addEventListener('mouseout', () => {
        if(!clicked) {
            agf.style.opacity = "0";
        }
    });

    leCafoutchPage.addEventListener('click', () => {
        var win = remote.getCurrentWindow();
        clicked = true;
        lcf.style.opacity = "1";
        appView.style.opacity = 0;
        setTimeout(() => {
            win.loadURL('file://' + __dirname + '../../../le-cafoutch/html/index.html');
        }, 105);
    });
}

