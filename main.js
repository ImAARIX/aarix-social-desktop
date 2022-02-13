//All requirements
const axios = require('axios');
const {app, Tray, Menu, nativeImage, BrowserWindow, dialog, shell, protocol} = require('electron');
const fs = require('fs');
const path = require('path');
const url = require('url');
require('@electron/remote/main').initialize();
//

//Tray icon declarations
var tray = null;
const icon = nativeImage.createFromPath(path.join(__dirname, './assets/img/icons/aarixsocial_logo.png'));
//

//Window declarations
var mainWin;
var loginWin;
const gotTheLock = app.requestSingleInstanceLock()
//

//Dir declarations
var appdataDir = process.env.APPDATA + "/AARIX.social Desktop/";
var appdataUserInfosDir = process.env.APPDATA + "/AARIX.social Desktop/userinfos"
//





// START OF SECOND INSTANCE CODE (AND PROTOCOL CODE)
if(!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		if(mainWin !== undefined) {
			mainWin.show();
			mainWin.focus();
		} else if(loginWin !== undefined) {
			loginWin.show();
			loginWin.focus();
		}
		
		
		commandLine.find((arg) => {
			if(arg.startsWith('aarixsocialdesktop://')) {
				var commandUsed = arg.replace('aarixsocialdesktop://', '').split('/');
				if(commandUsed[1].includes('?scope=')) {
					commandUsed = arg.replace('aarixsocialdesktop://', '').split('?scope=');
					if(commandUsed[0] == 'login' || commandUsed[0] == 'login/') {
						if(commandUsed[1] !== undefined) loginWithScope(commandUsed[1]);
					}
				}
			}
		});
		
})
}

if (process.defaultApp) {
	if (process.argv.length >= 2) {
  		app.setAsDefaultProtocolClient('aarixsocialdesktop', process.execPath, [path.resolve(process.argv[1])]);

	}
} else {
	app.setAsDefaultProtocolClient('aarixsocialdesktop');
}
//





// START OF UPDATE CODE
async function searchForUpdate() {
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
		  	if(versionParsed.version < webVersionParsed.version) {
		  		showUpdateDialog(webVersionParsed.version);
		  		return true;
		  	} else {
		  		return false;
		  	}
  		}
	} catch(e) {
		var err = e.toJSON();
		if(!(err.code == 'ETIMEDOUT') && !(err.code == 'ECONNABORTED')) {
			firstStart();
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
		title: 'AARIX.social Desktop - Mise à jour disponible',
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
async function firstStart() {
	if(!fs.existsSync(appdataDir) || !fs.existsSync(appdataUserInfosDir) || !fs.existsSync(appdataUserInfosDir + '/userscope.json')) {
		return true;
	} else {
		return false;
	}
	
}

function loginWithScope(scope) {
	if(scope !== undefined) {
		if(!fs.existsSync(appdataUserInfosDir)) {
			fs.mkdirSync(appdataUserInfosDir, { recursive: true });
		}
	
		var dataToWrite = {
			'userscope': scope
		};
		dataToWrite = JSON.stringify(dataToWrite);
		fs.writeFileSync(appdataUserInfosDir + '/userscope.json', dataToWrite);
		app.relaunch();
		app.exit(0);
	}
}

function createMainWindow() {
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

function createLoginWindow() {
	const loginWindow = new BrowserWindow({
		  width: 300,
		  height: 450,
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

	loginWindow.loadURL(url.format({
		  pathname: path.join(__dirname, './assets/login/html/index.html'),
		  protocol: 'file:',
		  slashes: true
	}));
	require("@electron/remote/main").enable(loginWindow.webContents);
	return loginWindow;
}

async function launchApp() {
	if(!(await searchForUpdate()) && !(await firstStart())) {
		app.whenReady().then(() => {
			mainWin = createMainWindow();
	  
			mainWin.once('ready-to-show', () => {
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
					if(mainWin.isVisible()) {
						mainWin.hide();
					} else {
						mainWin.show();
					}
				})
			});

			app.on('activate', function () {
				if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
			});

			protocol.registerFileProtocol('aarixsocialdesktop', () => {});
			

			setInterval(() => checkServer(mainWin), 60000);
			setInterval(() => searchForUpdate(), 60000);
	  	})
		  // app.on('window-all-closed', function () {
		// 	if (process.platform !== 'darwin') app.quit()
		  // })
	} else if(await searchForUpdate()) {
		return;
	} else if(await firstStart()) {
		fs.mkdirSync(appdataDir, { recursive: true });
		fs.mkdirSync(appdataUserInfosDir, { recursive: true });

		app.whenReady().then(() => {
			loginWin = createLoginWindow();
			loginWin.once('ready-to-show', () => {
				loginWin.show();
			});
		});
	}
}

async function checkServer(mainWin) {
    try {
        var r = await axios.get('https://aarix.social', {
            timeout: 5000
        });
    } catch(e) {
        mainWin.loadURL('file://' + __dirname + '/assets/fallback/html/index.html');
    }
}
//END OF APP CODE





launchApp();