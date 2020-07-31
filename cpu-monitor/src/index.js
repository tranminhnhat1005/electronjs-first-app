const {app, BrowserWindow, Menu} = require ('electron');
const os = require ('os-utils');
const path = require ('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require ('electron-squirrel-startup')) {
  app.quit ();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow ({
    transparent: 0.1,
    width: 350,
    height: 120,
    icon: path.join (__dirname, 'speed.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Build menu from template.
  const mainMenu = Menu.buildFromTemplate ([]);

  // Insert menu template.
  Menu.setApplicationMenu (mainMenu);

  // and load the index.html of the app.
  mainWindow.loadFile (path.join (__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools ();

  setInterval (() => {
    os.cpuUsage (function (v) {
      mainWindow.webContents.send ('num-cpu', os.cpuCount () * 1);
      mainWindow.webContents.send ('cpu', v * 100);
      mainWindow.webContents.send ('total-ram', os.totalmem () / 1024);
      mainWindow.webContents.send ('ram', 100 - os.freememPercentage () * 100);
    });
  }, 500);
};

// const mainMenuTemplate = [{label: ''}];
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on ('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on ('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit ();
  }
});

app.on ('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows ().length === 0) {
    createWindow ();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
