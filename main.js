const { app, protocol, BrowserWindow, screen, ipcMain } = require('electron');

let win;
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const _win = new BrowserWindow({
    width: width,
    height: height,
    show: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  return _win;
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('*', (req, cb) => {
    alert(req);
    alert(req.url);
  })
  win = createWindow();
  win.loadURL(`file://${__dirname}/out/index.html`);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('windowEvent', (e, c) => {
  if (c == 0) {
    app.quit();
  } else if (c == 1) {
    win.isMaximized() ? win.unmaximize() :
      win.maximize();
  } else if (c == 2) {
    win.minimize();
  }
})