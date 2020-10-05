const { takeWhile } = require("lodash");
// const { ipcRenderer } = require("electron");

// file selected
let input = byQuery('[type=file]');
if (input != null) {
  input.addEventListener('change', (e) => {
    if (e.target.value != '') {
      file = e.target.files[0];
      e.target.value = '';
      let fpath = file.path;
      if (fpath.endsWith('.psd')) {
        const tree = parser.parse(file.path);
        parser.waitForLoad((ctx) => {
          Tool.psd(ctx);
          Tool.size(tree.size);
          if (Tool.getPLayer().getChildren().length == 0) {
            Tool.addPr(tree.group);
          } else {
            let group = Tool.getPLayer().getChildren()[0];
            tree.group.getChildren().forEach(c => group.add(c));
          }
          Tool.applyLayer();
          Tool.redrawAll();
        });
      } else if (fpath.endsWith('.png') || fpath.endsWith('.jpg')) {
        let rimg = new Image();
        rimg.onload = () => {
          let img = new Konva.Image({
            x: 0,
            y: 0,
            listening: false,
            image: rimg,
            name: file.name
          })
          img.offset({ x: img.width() / 2, y: img.height() / 2 });
          let sz = Tool.size();
          let w = parseInt(Math.max(sz.width, img.width()));
          let h = parseInt(Math.max(sz.height, img.height()));
          Tool.size({ width: w, height: h });

          if (Tool.getPLayer().getChildren().length == 0) {
            let group = new Konva.Group();
            group.add(img);
            Tool.addPr(group);
          } else {
            Tool.getPLayer().getChildren()[0].add(img);
          }
          Tool.applyLayer();
          Tool.redrawAll();
        }
        rimg.src = fpath;
      } else if (fpath.endsWith('.taw')) {
        // reset

      }
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
byID('cloudSelect').onclick = () => {
  ipcRenderer.send('requestCloud');
};
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
byID('clear').onclick = Tool.clear;

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
    if (val != '') {
      if (val.match('[^-0-9.]') == null) {
        val = parseFloat(val);
        switch (fn) {
          case "opacity":
            if (val < 0) val = 0;
            if (val > 100) val = 100;
            val /= 100;
            break;
        }
      } else if (e.target.localName == "select") {
        if (fn == "visible") {
          val = val == "true";
        }
      } else {
        return;
      }
      Tool.changeLastTr(fn, val);
    }
  }
}

addOnOccured(() => {
  let ids = {
    xval: 'x', yval: 'y',
    sxval: 'scaleX', syval: 'scaleY',
    vval: 'visible', rval: 'rotation',
    oval: 'opacity', coval: 'globalCompositeOperation'
  };
  Object.keys(ids).forEach(key => byID(key).addEventListener(byID(key).localName == "select" ? 'change' : 'keyup', valueChanged(ids[key])));
  byID('tl_names').addEventListener('wheel', Tool.scrollTimeline);
  byID('tl_props').addEventListener('wheel', Tool.scrollTimeline);
});
