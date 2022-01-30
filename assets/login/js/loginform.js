var app_logo = document.getElementById('app_logo');
var buttons = document.getElementById('buttons');

setTimeout(() => {
    app_logo.style.opacity = 1;
    setTimeout(() => {
        buttons.style.opacity = "1";
    }, 400)
}, 500);

function login() {
    
};