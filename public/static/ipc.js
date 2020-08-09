var { ipcRenderer } = require('electron');
if (typeof psd === 'undefined') var psd = require('psd');

function windowEvent(code) {
  ipcRenderer.send('windowEvent', code);
}

var occurQueue = [];
async function useEffectOccured() {
  Tool.init();
  occurQueue.forEach(e => e());
}

function addOnOccured(cb){
  occurQueue.push(cb);
}