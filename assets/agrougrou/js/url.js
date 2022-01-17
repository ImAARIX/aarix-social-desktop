var url = document.getElementById('url');
var textToCopy = document.getElementById('link');
var copyButton = document.getElementById('copyButton');
var animation = document.getElementById('animation');
var success = document.getElementById('success');
var errorDiv = document.getElementById('error');
var linkValue = "";

var noUrl = 0;

async function agrougrouter(agvalue) {
    noUrl++;
    var formData = new FormData();
    // if(!agvalue == "") {
        formData.append("url", agvalue);
    // }
    try {
        var r = await fetch("https://api.aarix.social/v1/agrougrou/url/", {
            method: "POST", body: formData, mode: "cors" })
        r.json().then((data) => {
            error = data.error;
                if(error == "true") {
                    requestresponsecode = data.requestresponsecode;
                    switch(requestresponsecode) {
                        case "2":
                            errorr("Aucune URL n'a été entrée");
                            break;
                        case "3":
                            errorr("L'URL ne contient pas de https:// ou de https://.");
                            break;
                        case "4":
                            errorr("L'URL provient déjà de agrougrou.");
                            break;
                        case "5":
                            errorr("Mauvaise utilisation.");
                            break;
                    }
                } else {
                    successs(data.url);
                }
        })
    } catch(e) {
        console.log('Huston we have problem...:', e);
        errorr("Une erreur inconnue est survenue.");
    }
}

function successs(successText) {
    animation.style.backgroundColor = "#49416d";
    success.style.display = "block";
    animation.style.display = "table";

    url.value = "";

    textToCopy.innerText = successText;

    closeAnimation(10000, noUrl);
}

function errorr(errorInnerText) {
    animation.style.backgroundColor = "#ba3b46";
    errorDiv.style.display = "block";
    animation.style.display = "table";

    url.value = "";

    var errorText = document.getElementById('errorText');
    errorText.innerText = errorInnerText;

    closeAnimation(3000, noUrl);
}

function closeAnimation(time, givenNoUrl) {
    setTimeout(() => {
        if(givenNoUrl !== undefined) if(noUrl !== givenNoUrl) return;
        animation.classList.remove('animation');
        animation.classList.add('animation-outanim');

        setTimeout(() => {
            animation.style.display = "none";
            success.style.display = "none";
            errorDiv.style.display = "none";
            animation.classList.remove('animation-outanim');
            animation.classList.add('animation');

            copyButton.style.backgroundColor = "";
            copyButton.value = "Copier";
        }, 500);
    }, time);
}

function copy() {
    var textarea = document.createElement("textarea");

    document.body.appendChild(textarea);

    textarea.value = textToCopy.innerText;
    textarea.select();
    try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        return 1;
    } catch(e) {
        return 0;
    }
}

function changeLinkValue(val) {
    linkValue = val;
}

$('form').keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      document.getElementById('agrougrouterButton').select();
      agrougrouter(linkValue);
      return false;
    }
  });