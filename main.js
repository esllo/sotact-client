const { app, protocol, BrowserWindow, screen, ipcMain } = require('electron');
const http = require('http');

let win, login;
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const _win = new BrowserWindow({
    width: 1600,
    height: 900,
    show: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  _win.webContents.openDevTools();

  return _win;
}

function createLoginWindow() {
  let _win = new BrowserWindow({
    width: 400,
    height: 300,
    show: true,
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  _win.on('closed', () => _win = null)

  return _win;
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('*', (req, cb) => {
    alert(req);
    alert(req.url);
  });
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
    win.isMaximized() ? win.unmaximize() : win.maximize();
  } else if (c == 2) {
    win.minimize();
  }
});
ipcMain.on('loginRequest', (e, c) => {
  login = createLoginWindow();
  login.loadURL(`file://${__dirname}/out/static/login.html`);
})
function createOAuthWindow() {
  let _win = new BrowserWindow({
    width: 500,
    height: 700,
    show: true,
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  _win.on('closed', () => _win = null)

  return _win;
}


function concatUrl(params) {
  return Object.keys(params).map((e) => e + "=" + params[e]).join("&");
}

var listen;
function openListen() {
  listen = http.createServer((rq, rs) => {
    console.log(rq.url);
    rs.end('');
    listen.close();
  }).listen(8080);
}
function closeListen() {
  if (listen != null)
    listen.close();
  listen = null;
}

ipcMain.on('googleLogin', (e, c) => {
  let google = createOAuthWindow();
  const param = {
    scope: 'email',
    access_type: 'offline',
    include_granted_scopes: true,
    state: 'state_parameter_passthrough_value',
    redirect_uri: 'http://localhost:8080/user/google-login',
    client_id: '764349256353-a3ik370k7ig28979cqls8igp9mt9g5h9.apps.googleusercontent.com',
    response_type: 'code'
  };
  google.on('closed', () => {
    kakao = null;
    closeListen();
  })
  const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + concatUrl(param);
  console.log(url + '\n');
  google.loadURL(url, { userAgent: 'Chrome' });
})

ipcMain.on('kakaoLogin', (e, c) => {
  let kakao = createOAuthWindow();
  const param = {
    client_id: '276ef22491e2971006db8f2ce046d690',
    redirect_uri: 'http://localhost:8080/user/kakao-login',
    response_type: 'code'
  };
  kakao.on('closed', () => {
    kakao = null;
    closeListen();
  })
  const url2 = 'https://accounts.kakao.com/login?continue=https%3A%2F%2Fkauth.kakao.com%2Foauth%2Fauthorize%3Fclient_id%3D276ef22491e2971006db8f2ce046d690%26redirect_uri%3Dhttp%3A%2F%2Flocalhost%3A8080%2Fuser%2Fkakao-login%26response_type%3Dcode';
  const url = 'https://kauth.kakao.com/oauth/authorize?' + concatUrl(param);
  console.log(url + '\n');
  kakao.loadURL(url2, {userAgent: 'Chrome'});
})