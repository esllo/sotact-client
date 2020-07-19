const { app, protocol, BrowserWindow } = require('electron');

let win;
function createWindow() {
  const _win = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    frame:false,
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
