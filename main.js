const { app, protocol, BrowserWindow, screen, ipcMain, Menu, dialog } = require('electron');
const http = require('http');


let win, login, userData = null;
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const _win = new BrowserWindow({
    width: 1600,
    height: 900,
    show: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });
  _win.webContents.openDevTools();

  return _win;
}

function createLoginWindow() {
  let _win = new BrowserWindow({
    width: 450,
    height: 440,
    show: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  _win.setMenu(null);
  _win.webContents.openDevTools();
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
    width: 500,
    height: 700,
    show: true,
    frame: true,
    webPreferences: {
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
var google = null, kakao = null;
ipcMain.on('googleLogin', (e, c) => {
  google = createOAuthWindow();
  openListen();
  const param = {
    scope: 'email',
    access_type: 'offline',
    include_granted_scopes: true,
    state: 'state_parameter_passthrough_value',
    redirect_uri: 'http://localhost:8080/user/google-login',
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
  let kakao = createOAuthWindow();
  openListen();
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
    width: 500,
    height: 700,
    show: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  cloudWindow.on('closed', () => cloudWindow = null);
  cloudWindow.loadURL(`file://${__dirname}/out/static/html/cloud.html#` + userData.nickname);
  cloudWindow.openDevTools();
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
function createShareWindow(id) {
  if (shareWindow != null) return;
  if (userData == null) {
    showDialog({ title: "로그인 필요", message: "로그인이 필요합니다." }, ['Ok'])
    return;
  }

  shareWindow = new BrowserWindow({
    width: 500,
    height: 700,
    show: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  shareWindow.on('closed', () => shareWindow = null);
  shareWindow.loadURL(`file://${__dirname}/out/static/html/share.html#` + userData.nickname + "&" + id);
  shareWindow.openDevTools();
}
ipcMain.on('requestShare', (e, a) => {
  createShareWindow(a.id);
})

ipcMain.on('closeShare', () => {
  shareWindow.close();
  shareWindow = null;
})


function showDialog(args, buttons) {
  return dialog.showMessageBoxSync(win, {
    type: 'question',
    buttons: buttons,
    title: args.title || "TAW",
    message: args.message || "",
    detail: args.detail || ""
  });
}
ipcMain.on('alert', (e, args) => {
  if (args == undefined) args = {};
  e.returnValue = showDialog(args, ['Ok']);
});
ipcMain.on('yesorno', (e, args) => {
  if (args == undefined) args = {};
  e.returnValue = showDialog(args, ['Yes', 'No']);
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