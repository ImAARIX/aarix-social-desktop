var axios = require('axios');
var fileUpload = document.getElementById('fileUpload');
var textToCopy = document.getElementById('link');
var copyButton = document.getElementById('copyButton');
var agrougrouterButton = document.getElementById('agrougrouterButton');
var animation = document.getElementById('animation');
var success = document.getElementById('success');
var errorDiv = document.getElementById('error');
var uploadPercent = document.getElementById('uploadPercent');
var progressBar = document.getElementById('progressBar');
var closeAnimationButton = document.getElementById('closeAnimationButton');
var expirationRow = document.getElementById('expirationRow');
var expirationTime = document.getElementById('expiration_time');
var showedTime = document.getElementById('showedtime');
var expdate = document.getElementById('expdate');

var noUpload = 0;

changeSlider();

if(expirationTime.value == 0) {
    showedTime.innerText = "aucune"
}

fileUpload.onchange = () => {
    uploadFile(fileUpload);
};

agrougrouterButton.onclick = () => {
    agrougrouter();
};

copyButton.onclick = () => {
    if(copy()) {
        copyButton.style.backgroundColor = '#6ea4bf';
        copyButton.value = 'Copié !';
    } else { 
        copyButton.style.backgroundColor = 'red';
    }
}

closeAnimationButton.onclick = () => {
    closeAnimation();
}

async function changeSlider() {
    var webSliderFile = await axios.get('https://aarix.social/desktop/slider.json', {
    	validateStatus: function (status) {
    		return true;
        },
        timeout: 5000
    });
    if(webSliderFile.status == "200") {
        expirationTime.setAttribute('min', webSliderFile.data.base_user_slider_min);
        expirationTime.setAttribute('max', webSliderFile.data.base_user_slider_max);
    } else {

    }
}

async function uploadFile(inp) {
    noUpload++;

    expirationRow.style.height = "0";
    var loadingrow = document.getElementById('loadingrow');
    var formData = new FormData();
    var file = inp.files[0];

    if(file == undefined) return;

    loadingrow.style.height = "120px";

    formData.append("file", file);
    formData.append("expiration_time", (expirationTime.value * 3600));

    try {
        var uploadAnswer = await axios.post('https://api.aarix.social/v1/le-cafoutch/upload/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                updateBar(progressEvent);
            },
            validateStatus: function (status) {
                return true;
            }
        });

        var uploadData = uploadAnswer.data;
        var error = uploadData.error;

        if(error == "true") {
            var requestresponsecode = uploadData.requestresponsecode;
            switch(requestresponsecode) {
                case "2":
                    errorr("Le fichier est trop gros.");
                    break;
                case "3":
                    errorr("Le fichier existe déjà.");
                    break;
                case "4":
                    errorr("Il est interdit d'uploader des fichiers de ce format.");
                    break;
                case "5":
                    errorr("Erreur interne du serveur.");
                    break;
                case "6":
                    errorr("Aucun fichier n'a été envoyé !");
                    break;
                case "7":
                    errorr("Vous n'avez pas le droit d'utiliser cette expiration.");
                    break;
            }
        } else {
            if(uploadData.expirationtimestamp !== 0) {
                var offset = 1;
                var expt = new Date((uploadData.expirationtimestamp * 1000) + offset * 3600 * 1000).toUTCString().replace( / GMT$/, "" ).replace("Jan", "janvier").replace("Feb", "février").replace("Mar", "mars").replace("Apr", "avril").replace("May", "mai").replace("Jun", "juin").replace("Jul", "juillet").replace("Aug", "août").replace("Sep", "septembre").replace("Oct", "octobre").replace("Nov", "novembre").replace("Dec", "décembre").replace("Mon", "Lundi").replace("Tue", "Mardi").replace("Wed", "Mercredi").replace("Thu", "Jeudi").replace("Fri", "Vendredi").replace("Sat", "Samedi").replace("Sun", "Dimanche").replace(",", "");
                successs(uploadData.url, expt);
            } else {
                successs(uploadData.url, "jamais");
            }
        }
    } catch(e) {
        console.log('Huston we have problem...:', e);
        errorr("Une erreur inconnue est survenue.");
    }
    
}

function successs(successText, expt) {
    animation.style.backgroundColor = "#49416d";
    success.style.display = "block";
    animation.style.display = "table";

    textToCopy.innerText = successText;
    expdate.innerText = "Expire le : " + expt;
    expirationRow.style.height = "";

    loadingrow.style.height = "0";
    uploadPercent.innerText = "Upload en cours - 0%";


    //closeAnimation(10000, noUpload);
}

function errorr(errorInnerText) {
    animation.style.backgroundColor = "#ba3b46";
    errorDiv.style.display = "block";
    animation.style.display = "table";

    loadingrow.style.height = "0";
    expirationRow.style.height = "";

    var errorText = document.getElementById('errorText');
    errorText.innerText = errorInnerText;

    closeAnimation(3000, noUpload);
}

function closeAnimation(time, givenNoUpload) {
    setTimeout(() => {
        if(givenNoUpload !== undefined) if(noUpload !== givenNoUpload) return;
        animation.classList.remove('animation');
        animation.classList.add('animation-outanim');

        fileUpload.value = "";

        setTimeout(() => {
            animation.style.display = "";
            success.style.display = "none";
            errorDiv.style.display = "none";
            animation.classList.remove('animation-outanim');
            animation.classList.add('animation');

            copyButton.style.backgroundColor = "";
            copyButton.value = "Copier";
            agrougrouterButton.style.backgroundColor = "";
	        agrougrouterButton.value = "Agrougrouter";
        }, 500);
    }, time);
}

async function agrougrouter() {
    var formData = new FormData();
    formData.append("url", textToCopy.innerText);
    try {
        var r = await fetch("https://api.aarix.social/v1/agrougrou/url/", {
        method: "POST", body: formData, mode: "cors"
        })
        
        r.json().then((data) => {
	        textToCopy.innerText = data.url;
            if(copy()) {
                agrougrouterButton.style.backgroundColor = "#6ea4bf";
                agrougrouterButton.value = "Copié !";
            } else {
                agrougrouterButton.style.backgroundColor = "red";
            }
        });
    } catch(e) {
        console.log('Huston we have problem...:', e);
        agrougrouterButton.style.backgroundColor = "red";
    }
    
}

function copy(textToCopyInClipboard) {
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    if(textToCopyInClipboard == undefined) {
        textarea.value = textToCopy.innerText;
    } else {
        textarea.value = textToCopyInClipboard;
    }
    textarea.select();

    try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        return 1;
    } catch(e) {
        return 0;
    }
}

function updateBar(progressEvent) {
    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    progressBar.value = percentCompleted;
    uploadPercent.innerText = "Upload en cours - " + percentCompleted + "%";
}


var lastTarget = null;

window.addEventListener("dragenter", (event) => {
    lastTarget = event.target;
    if(animation.style.display == "") {
        document.querySelector(".dropzone").style.visibility = "";
        document.querySelector(".dropzone").style.opacity = 1;
    }
});

window.addEventListener("dragleave", (event) => {
    if(animation.style.display == "") {
        if(event.target === lastTarget || event.target === document) {
            document.querySelector(".dropzone").style.visibility = "hidden";
            document.querySelector(".dropzone").style.opacity = 0;
        }
    }
});

window.addEventListener("dragover", (event) => {
    event.preventDefault();
});

window.addEventListener("drop", (event) => {
    event.preventDefault();
    if(animation.style.display == "") {
        document.querySelector(".dropzone").style.visibility = "hidden";
        document.querySelector(".dropzone").style.opacity = 0;

        var types = event.dataTransfer.types;
        if(types.length > 2 || types.includes("text/plain") || types.includes("text/html")) {
            alert('Vous ne pouvez pas déposer du texte sur Le Cafoutch !');
        }else if(event.dataTransfer.files.length !== 1) {
            alert("Il n'est pour l'instant possible d'envoyer qu'un seul fichier à la fois.");
            return;
        }
        uploadFile(event.dataTransfer);
    }
})