var { ipcRenderer } = require('electron');
if (typeof psd === 'undefined') var psd = require('psd');

function windowEvent(code) {
  ipcRenderer.send('windowEvent', code);
}

var occurQueue = [];
setTimeout(() => {
  async function useEffectOccured() {
    Tool.init();
    occurQueue.forEach(c => {
      try {
        c();
      } catch (e) {
        if (e) console.error(e);
      }
    });
  }
  window.useEffectOccured = useEffectOccured;
}, 3000);

function addOnOccured(cb) {
  occurQueue.push(cb);
}

ipcRenderer.on('loginSuccess', (e, c) => {
  byQuery('.login').value = c.nickname + "님 안녕하세요.";
  byQuery('.login').disabled = true;
})

ipcRenderer.on('cloudSelected', (e, arg) => {
  console.log(arg);
})