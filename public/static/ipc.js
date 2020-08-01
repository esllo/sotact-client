var { ipcRenderer } = require('electron');
if (typeof psd === 'undefined') var psd = require('psd');

function windowEvent(code) {
  ipcRenderer.send('windowEvent', code);
}

function useEffectOccured() {
  Tool.init();
}
