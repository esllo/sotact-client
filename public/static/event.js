const { takeWhile } = require("lodash");

// file selected
let input = byQuery('[type=file]');
if (input != null) {
  input.addEventListener('change', (e) => {
    if (e.target.value != '') {
      file = e.target.files[0];
      e.target.value = '';
      const tree = parser.parse(file.path);
      parser.waitForLoad((ctx) => {
        Tool.psd(ctx);
        Tool.size(tree.size);
        Tool.addPr(tree.group);
        Tool.applyLayer();
        Tool.redrawAll();
      });
    }
  });
}

// window resize
window.addEventListener('resize', () => {
  let parent = Tool.getParent();
  Tool.rebsize(Tool.getStage(), parent.offsetWidth, parent.offsetHeight);
});

// stage scale
byID('scale').oninput = (e) => {
  let scale = parseInt(e.target.value) / 100;
  Tool.scale(Tool.getStage(), scale);
};
byID('speed').value = 20;
byID('speed').oninput = (e) => {
  Tool.updateTb(parseInt(e.target.value));
}

// timeline, predraw toggle
byID('tm_toggle').addEventListener('change', (e) => {
  Tool.toggleLayer(e.target.checked);
});

byID('tb0').onclick = Tool.startTimebar;
byID('tb1').onclick = Tool.stopTimebar;
byID('tb2').onclick = Tool.resetTimebar;

byID('selector').onclick = () => byID('selector_hidden').click();
byID('save').onclick = () => {
  TAW.initFromTool();
  Tool.setCurrentTAW(TAW);
  const prompt = require('electron-prompt');
  prompt({
    title: 'Insert File Name : ',
    type: 'input'
  }).then((r) => {
    if (r != null) {
      if (r == "")
        r = 'untitled' + (new Date().getTime());
      Tool.save(r);
    }
  }).catch(console.error);
}

byQuery('.login').onclick = () => ipcRenderer.send('loginRequest', null);
byQuery('.session').onclick = () => {
  if (Tool.session() == null) {
    ss = Conn.Session('someKey');
    Tool.session(ss);
    Tool.sessionCreated();
  }
  Tool.session().connect();
}

function valueChanged(fn) {
  return function (e) {
    let val = e.target.value.trim();
    if (val != '' && val.match('[^-0-9.]') == null) {
      val = parseFloat(val);
      if (fn == "opacity") {
        if (val < 0) val = 0;
        if (val > 100) val = 100;
        val /= 100;
      }
      Tool.changeLastTr(fn, val);
    }
  }
}

addOnOccured(() => {
  byID('xval').addEventListener('keyup', valueChanged('x'));
  byID('yval').addEventListener('keyup', valueChanged('y'));
  byID('rval').addEventListener('keyup', valueChanged('rotation'));
  byID('oval').addEventListener('keyup', valueChanged('opacity'));
  byID('tl_names').addEventListener('wheel', Tool.scrollTimeline);
  byID('tl_props').addEventListener('wheel', Tool.scrollTimeline);
});
