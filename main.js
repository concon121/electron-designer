const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const windowStateKeeper = require('electron-window-state');
const elemon = require('elemon');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  var windowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    title: 'ElectronApp',
    'x': windowState.x,
    'y': windowState.y,
    'width': windowState.width,
    'height': windowState.height,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden'
  });

  windowState.manage(mainWindow);

  require('./main/help_menu.js');

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow();
  elemon({
    app: app,
    mainFile: 'main.js',
    bws: [{
      bw: mainWindow,
      res: ['index.html', 'renderer.js', 'stylesheets', 'control_utils.js', 'file_utils.js', 'question_events.js', 'custom.css', 'compiled_views.js', 'base_template.js', 'help_menu.js']
    }]
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
