var { ipcRenderer } = require('electron');
if (typeof psd === 'undefined') var psd = require('psd');

function windowEvent(code) {
  ipcRenderer.send('windowEvent', code);
}

var occurQueue = [];
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

function addOnOccured(cb) {
  occurQueue.push(cb);
}

ipcRenderer.on('loginSuccess', (e, c) => {
  console.log(e);
  console.log(c);
})