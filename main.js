const { app, protocol, BrowserWindow, screen, ipcMain, Menu, dialog, nativeImage } = require('electron');
const http = require('http');
const { list } = require('tar');

const LOGO_DATA_URL = "data:image/png;base64,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";

let win, login, userData = null;
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const _win = new BrowserWindow({
    icon: nativeImage.createFromDataURL(LOGO_DATA_URL),
    width: 1600,
    height: 900,
    show: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });
  // _win.webContents.openDevTools();
  return _win;
}

function createLoginWindow() {
  let _win = new BrowserWindow({
    icon: nativeImage.createFromDataURL(LOGO_DATA_URL), width: 450,
    height: 440,
    show: true,
    frame: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  _win.setMenu(null);
  // _win.webContents.openDevTools();
  _win.on('closed', () => _win = null)

  return _win;
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  // app.getAppPath(); exe path
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
ipcMain.on('windowEventLogin', (e, c) => {
  if (login != null) {
    login.quit();
  }
});
ipcMain.on('loginRequest', (e, c) => {
  login = createLoginWindow();
  login.loadURL(`file://${__dirname}/out/static/html/login.html`);
})
ipcMain.on('closeLogin', () => {
  login.close();
  login = null;
})
function createOAuthWindow() {
  let _win = new BrowserWindow({
    icon: nativeImage.createFromDataURL(LOGO_DATA_URL),
    width: 500,
    height: 700,
    show: true,
    frame: true,
    webPreferences: {
      nodeIntegration: false,
    }
  });
  _win.on('closed', () => _win = null)

  return _win;
}


function concatUrl(params) {
  return Object.keys(params).map((e) => e + "=" + params[e]).join("&");
}

var listen;
let port = 8080;
function openListen() {
  if (listen != null) {
    return;
  }
  listen = http.createServer((rq, rs) => {
    console.log(rq.url);
    if (login != null) {
      login.webContents.send('oauth', rq.url);
    }
    rs.end('<head><meta charset="utf-8"/></head><p>현재 창을 닫아주세요.</p>');
    (kakao != null) && kakao.close() || (kakao = null);
    (google != null) && google.close() || (google = null);
    listen.close();
  });
  listen.on('error', e => {
    console.log(port + ' port already used');
    port++;
    listen = null;
    openListen();
  });
  listen.listen(port);
}
function closeListen() {
  if (listen != null)
    listen.close();
  listen = null;
}
var google = null, kakao = null;
ipcMain.on('googleLogin', (e, c) => {
  if (google != null) return;
  google = createOAuthWindow();
  openListen();
  const param = {
    scope: 'email',
    access_type: 'offline',
    include_granted_scopes: true,
    state: 'state_parameter_passthrough_value',
    redirect_uri: 'http://localhost:' + port + '/user/google-login',
    client_id: '764349256353-a3ik370k7ig28979cqls8igp9mt9g5h9.apps.googleusercontent.com',
    response_type: 'code',
    prompt: 'select_account',
    login_hit: 'current_email'
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
  if (kakao != null) return;
  let kakao = createOAuthWindow();
  openListen();
  const param = {
    client_id: '276ef22491e2971006db8f2ce046d690',
    redirect_uri: 'http://localhost:' + port + '/user/kakao-login',
    response_type: 'code'
  };
  kakao.on('closed', () => {
    kakao = null;
    closeListen();
  })
  const url2 = 'https://accounts.kakao.com/login?continue=https%3A%2F%2Fkauth.kakao.com%2Foauth%2Fauthorize%3Fclient_id%3D276ef22491e2971006db8f2ce046d690%26redirect_uri%3Dhttp%3A%2F%2Flocalhost%3A8080%2Fuser%2Fkakao-login%26response_type%3Dcode';
  const url = 'https://kauth.kakao.com/oauth/authorize?' + concatUrl(param);
  console.log(url + '\n');
  kakao.loadURL(url2, { userAgent: 'Chrome' });
})

ipcMain.on('loginSuccess', (e, c) => {
  login.close();
  win.webContents.send('loginSuccess', c);
  userData = c;
});
ipcMain.on('logout', () => {
  userData = null;
})

let cloudWindow = null;

function createCloudWindow() {
  if (cloudWindow != null) return;
  if (userData == null) {
    showDialog({ title: "로그인 필요", message: "로그인이 필요합니다." }, ['Ok'])
    return;
  }
  cloudWindow = new BrowserWindow({
    icon: nativeImage.createFromDataURL(LOGO_DATA_URL),
    width: 500,
    height: 700,
    show: true,
    frame: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  cloudWindow.on('closed', () => cloudWindow = null);
  cloudWindow.loadURL(`file://${__dirname}/out/static/html/cloud.html#` + userData.nickname + "&" + userData.userId);
  // cloudWindow.openDevTools();
}

ipcMain.on('requestCloud', (e) => {
  createCloudWindow();
})

ipcMain.on('closeCloud', () => {
  cloudWindow.close();
  cloudWindow = null;
})

ipcMain.on('cloudSelected', (e, args) => {
  if (win != null) {
    win.webContents.send('cloudSelected', args);
  }
  cloudWindow.close();
})

let shareWindow = null;
function createShareWindow(id, fonly = false) {
  if (shareWindow != null) return;
  if (userData == null) {
    showDialog({ title: "로그인 필요", message: "로그인이 필요합니다." }, ['Ok'])
    return;
  }

  shareWindow = new BrowserWindow({
    icon: nativeImage.createFromDataURL(LOGO_DATA_URL),
    width: 500,
    height: 700,
    show: true,
    frame: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  shareWindow.on('closed', () => shareWindow = null);
  shareWindow.loadURL(`file://${__dirname}/out/static/html/share.html#` + userData.nickname + "&" + id + "&" + userData.userId + "&" + fonly);
  // shareWindow.openDevTools();
}
ipcMain.on('requestShare', (e, a) => {
  createShareWindow(a.id);
})

ipcMain.on('requestFriend', (e, a) => {
  createShareWindow('', true);
});

ipcMain.on('closeShare', () => {
  shareWindow.close();
  shareWindow = null;
})


function showDialog(args, buttons) {
  let vwin = BrowserWindow.getFocusedWindow() || win;
  switch (args.from) {
    case "login": vwin = login;
      break;
    case "cloud": vwin = cloudWindow;
      break;
    case "share": vwin = shareWindow;
  }
  return dialog.showMessageBoxSync(vwin, {
    type: 'question',
    buttons: buttons,
    title: args.title || "TAW",
    message: args.message || "",
    detail: args.detail || ""
  });
}
ipcMain.on('alert', (e, args) => {
  if (args == undefined) args = {};
  e.returnValue = showDialog(args, ['Ok'], e.sender);
});
ipcMain.on('yesorno', (e, args) => {
  if (args == undefined) args = {};
  e.returnValue = showDialog(args, ['Yes', 'No'], e.sender);
});

ipcMain.on('savepath', (e, args) => {
  if (args == undefined) args = {};
  e.returnValue = dialog.showSaveDialogSync(win, {
    title: args.title || "",
    message: args.message || "",
    filters: [{
      name: "TAW project",
      extensions: ['taw']
    }]
  });
});