const remote = require('@electron/remote');
var win = remote.getCurrentWindow();
var closeButton = document.getElementById('close');

closeButton.addEventListener('click', () => {
    win.hide();
    
});