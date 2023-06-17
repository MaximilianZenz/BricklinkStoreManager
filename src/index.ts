import { app, BrowserWindow,ipcMain, dialog } from 'electron';
import * as path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 900,
    width: 1800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../src/index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  ipcMain.handle("showFileSaveDialog", async (e, message) => {
    return await dialog.showSaveDialog({
      defaultPath: message.order_id+'.pdf',
      title: 'Save Bill',
      buttonLabel: 'Save',
      filters: [
        {
          name: 'PDF Files',
          extensions: ['pdf']
        },
      ], properties: [] });
  });

  ipcMain.handle("showFolderOpenDialog", async (e, message) => {
    return await dialog.showOpenDialog({
      title: 'Backup',
      buttonLabel: 'Select',
      properties: ['openDirectory'] });
  });

  ipcMain.handle("showImageOpenDialog", async (e, message) => {
    return await dialog.showOpenDialog({
      title: 'Load Image',
      buttonLabel: 'Open',
      filters: [
        {
          name: 'Pictures',
          extensions: ['jpeg','png']
        },
      ], properties: ['openFile'] });
  });

  ipcMain.handle("getDataPath", async (e, message) => {
    return app.getPath('userData');
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  //if (process.platform !== 'darwin') {
    app.quit();
  //}
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

