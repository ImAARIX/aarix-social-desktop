// Modules to control application life and create native browser window
require('@electron/remote/main').initialize();
const axios = require('axios');
const {app, Tray, Menu, nativeImage, BrowserWindow, dialog, shell} = require('electron');
const fs = require('fs');
const path = require('path')
const url = require('url');
var tray = null;
const icon = nativeImage.createFromPath(path.join(__dirname, './assets/img/icons/icon.png'));
const gotTheLock = app.requestSingleInstanceLock()





// START OF UPDATE CODE
async function searchForUpdate() {

	if(!gotTheLock) {
		app.quit();
	}

	try {
		var versionFile = fs.readFileSync(path.join(__dirname, './assets/json/version.json'));
  		var versionParsed = JSON.parse(versionFile);

		var webVersionFile = await axios.get('https://aarix.social/desktop/version.json', {
			validateStatus: function (status) {
				return true;
			},
			timeout: 5000
		});
  		if(webVersionFile.data.version !== undefined) {
    		var webVersionParsed = webVersionFile.data;
		  	console.log('appVersion: ' + versionParsed.version);
		  	console.log('webVersion: ' + webVersionParsed.version);
		  	if(versionParsed.version < webVersionParsed.version) {
		  		console.log('Update found! V' + webVersionParsed.version);
		  		showUpdateDialog(webVersionParsed.version);
		  		return true;
		  	} else {
		  		console.log('Up to date');
		  		return false;
		  	}
  		}
	} catch(e) {
		var err = e.toJSON();
		if(!(err.code == 'ETIMEDOUT') && !(err.code == 'ECONNABORTED')) {
			const options = {
				type: 'question',
				buttons: ['Ok'],
				defaultId: 0,
				title: "Vous n'êtes pas connecté à internet.",
				message: "Vous n'êtes pas connecté à internet.",
				detail: "Vous ne pouvez donc pas lancer l'application."
			}
			dialog.showMessageBox(null, options).then(() => {
				app.quit();
			});
			return true;
		} else {
			return false;
		}
	}
}

function showUpdateDialog(webVersion) {
	const options = {
		type: 'question',
		buttons: ['Mettre à jour', 'Quitter'],
		defaultId: 0,
		title: 'Mise à jour disponible',
		message: 'Mise à jour ' + webVersion + ' disponible.',
		detail: "Veuillez la télécharger depuis le site web et l'installer.",
	};
	dialog.showMessageBox(null, options).then((response) => {
		if(response.response == "0") {
			shell.openExternal("https://github.com/ImAARIX/aarix-social-desktop/releases/tag/v" + webVersion);
			app.quit();
		} else if(response.response == "1") {
			app.quit();
		}
	});
}
//END OF UPDATE CODE





//START OF APP CODE
async function launchApp() {
	if(!(await searchForUpdate())) {
		function createWindow () {
				const mainWindow = new BrowserWindow({
					  width: 900,
					  height: 530,
					  center: true,
					  movable: true,
					  resizable: false,
					  frame: false,
					  devTools: false,
					  webPreferences: {
							nodeIntegration: true,
							enableRemoteModule: true,
							contextIsolation: false,
							preload: path.join(__dirname, './assets/node_js/preload.js'),
					  },
					  show: false,
					  icon: icon
				})
		  
				mainWindow.loadURL(url.format({
					  pathname: path.join(__dirname, './assets/agrougrou/html/index.html'),
					  protocol: 'file:',
					  slashes: true
				}));
				require("@electron/remote/main").enable(mainWindow.webContents);
				return mainWindow;
		  }
	
		app.whenReady().then(() => {
			const win = createWindow()
	  
			win.once('ready-to-show', () => {
				tray = new Tray(icon);
				const contextMenu = Menu.buildFromTemplate([
					{label: 'Quitter', role: 'quit'}
				]);
          		tray.setToolTip('AARIX.social Desktop');
				tray.setContextMenu(contextMenu);
				tray.displayBalloon({
					title: 'AARIX.social Desktop',
					content: 'AARIX.social Desktop tourne actuellement en arrière plan.'
				});
	  
				tray.on('click', () => {
					if(win.isVisible()) {
						win.hide();
					} else {
						win.show();
					}
				})
			})
			app.on('activate', function () {
				if (BrowserWindow.getAllWindows().length === 0) createWindow()
			})
	  })
		  // app.on('window-all-closed', function () {
		// 	if (process.platform !== 'darwin') app.quit()
		  // })
	}
}
//END OF APP CODE





launchApp();