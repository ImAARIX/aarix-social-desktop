const remote = require('@electron/remote');
var win = remote.getCurrentWindow();
var closeButton = document.getElementById('close');

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
    lct.addEventListener('mouseover', () => {
        console.log("hover");
        lcf.style.opacity = "1";
    })
    
    lct.addEventListener('mouseout', () => {
        lcf.style.opacity = "0";
    });
}

if(!lc) {
    agt.addEventListener('mouseover', () => {
        console.log("hover");
        agf.style.opacity = "1";
    })
    
    agt.addEventListener('mouseout', () => {
        agf.style.opacity = "0";
    });
}