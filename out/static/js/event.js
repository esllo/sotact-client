
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
            name: file.name,
            id: 'obj-' + getDateAsHex() + (file.name.replace(/\s/g, ''))
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
        Tool.clear();
        const tar = require('tar');
        fs.mkdtemp(require('os').tmpdir() + '/taw-', (err, dir) => {
          if (err) console.log(err);
          console.log('work with ' + dir);
          tar.x({
            file: fpath,
            C: dir,
          }).then(_ => {
            fs.readdirSync(dir).forEach(p => {
              pJson = dir + "/" + p + "/";
              let added = false;
              fs.readdirSync(dir + "/" + p).forEach(pp => {
                if (pp.endsWith('-data.json')) {
                  console.log('find : ' + pp);
                  pJson += pp;
                  console.log(pJson);
                  added = true;
                }
              });
              if (added) {
                let data = fs.readFileSync(pJson);
                data = JSON.parse(data);
                const tree = parser.parseJson(dir + "/", data);
                parser.waitForLoad(() => {
                  Tool.size(tree.size);
                  if (Tool.getPLayer().getChildren().length == 0) {
                    Tool.addPr(tree.group);
                  } else {
                    let group = Tool.getPLayer().getChildren()[0];
                    tree.group.getChildren().forEach(c => group.add(c));
                  }
                  Tool.parseData(tree.flow);
                  Tool.applyLayer();
                  Tool.redrawAll();
                  SAVE.recurDelete(dir);
                  Tool.reloadPoint();
                })
              } else {
                ipcRenderer.send('alert', { message: "???????????? ?????? ???????????????." });
              }
            });
          });
        });
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

// timeline, predraw toggle
byID('tm_toggle').addEventListener('change', (e) => {
  Tool.toggleLayer(e.target.checked);
});

byID('tb0').onclick = Tool.startTimebar;
byID('tb1').onclick = Tool.stopTimebar;
byID('tb2').onclick = Tool.resetTimebar;

// ????????? ?????? ?????? ??????
// byID('selector').onclick = () => byID('selector_hidden').click();

// ???????????? ?????? ??????
// byID('cloudSelect').onclick = () => {
//   ipcRenderer.send('requestCloud');
// };
function upload(name) {
  return function (result) {
    if (result) {
      const request = require('request');
      let req = request.post('http://13.125.214.132:4000', (e, r, b) => {
        if (e) {
          console.log('error')
          console.log(e);
        } else {
          console.log(r);
          console.log("--body--");
          console.log(b);
        }
      });
      let form = req.form();
      form.append('upload', fs.createReadStream('./tmp.taw'));
      form.append('user', userData.nickname);
      form.append('fileName', name);
    } else {
      console.log('failed');
    }
  }
}
// ?????? ??????
// byID('save').onclick = () => {
//   TAW.initFromTool();
//   Tool.setCurrentTAW(TAW);
//   if (Tool.session() != null && Tool.session().isConnected()) {
//     Tool.session().send('save');
//   } else {
//     let ans = ipcRenderer.sendSync('yesorno', { title: '??????????????? ??????', message: '??????????????? ???????', detail: '??????????????? ??????..' })
//     if (ans == 0) {
//       //cloud save
//       const prompt = require('electron-prompt');
//       prompt({
//         title: '????????? ?????? : ',
//         type: 'input'
//       }).then((r) => {
//         if (r != null && r != "" && userData != null) {
//           Tool.save('.', 'tmp', upload(r));
//         }
//       }).catch(console.error);
//     } else if (ans == 1) {
//       let savePath = ipcRenderer.sendSync('savepath', {
//         title: '???????????? ??????',
//         message: '????????? ????????? ???????????????',
//       });
//       if (savePath != undefined) {
//         //save locally
//         let index = savePath.match(/([^\\\/]*\.taw)/).index;
//         let path = savePath.substr(0, index);
//         let name = savePath.substr(index);
//         name = name.substr(0, name.length - 4);
//         Tool.save(path, name);
//       }
//     }
//   }
// }
byQuery('.exit_box').onclick = () => ipcRenderer.sendSync('yesorno', { title: '??????????????? ??????????????????????', message: '??????????????? ?????????????????????? ????????? ????????? ???????????? ????????????.' }) == 0 && Tool.clear();

let wrap = document.querySelector('.wrap_panel');
let acc_info = document.querySelector('.account_info');
byID('login').onclick = (e) => {
  if (e.target.classList.contains('on')) {
    wrap.classList.add('on');
    acc_info.classList.add('on');
  } else { ipcRenderer.send('loginRequest', null); }
};
document.getElementById('logout').onclick = () => {
  userData = null;
  byID('login').textContent = "Login";
  byID('login').classList.remove('on');
  wrap.classList.remove('on')
  acc_info.classList.remove('on');
  ipcRenderer.send('logout');
};
document.querySelector('.account_exit').onclick = () => wrap.classList.remove('on') ||
  acc_info.classList.remove('on');

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


byID('menu_open').onclick = () => openSo(true);

// {
//   ipcRenderer.send('requestCloud');
// };
byID('menu_save').onclick = () => openSo(false);
byID('menu_share').onclick = () => {
  if (Tool.key()) {
    ipcRenderer.send('requestShare', { id: Tool.key() });
  } else {
    ipcRenderer.send('alert', { title: "??????", message: "???????????? ???????????? ????????? ????????????." });
  }
};
byID('menu_friend').onclick = () => {
  ipcRenderer.send('requestFriend', null);
};

let _so_title = document.querySelector('.so_title');
let _so = document.querySelector('.so');
let _so_local = document.getElementById('so_local');
let _so_cloud = document.getElementById('so_cloud');
let _so_from = document.querySelector('.so_from');
let _so_input = document.querySelector('.so_input');
let _sv_input = document.getElementById('save_input');
let _sv_button = document.getElementById('save_cloud');

const releaseSo = () => {
  wrap.classList.remove('on');
  _so.classList.remove('on');
  _so_from.classList.remove('off');
  _so_input.classList.add('off');
}

function openSo(flag) {
  let text = flag ? "Open" : "Save";
  _so_title.textContent = text;
  wrap.classList.add('on');
  _so.classList.add('on');
  _so_local.onclick = () => {
    flag ? byQuery('input[type=file]').click() : saveLocal();
    releaseSo();
  }
  _so_cloud.onclick = () => {
    flag ? (ipcRenderer.send('requestCloud') || releaseSo())
      : (() => {
        if (userData == null) {
          ipcRenderer.send('alert', { title: "????????? ??????", message: "???????????? ???????????????." });
          return;
        }
        _so_from.classList.add('off');
        _so_input.classList.remove('off');
      })();
  }
}

_sv_button.onclick = () => {
  let value = _sv_input.value.trim();
  if (value != "" && value != null) {
    _sv_input.value = "";
    if (userData != null) {
      Tool.save('.', 'tmp', upload(value));
      releaseSo();
    }
  } else {
    ipcRenderer.send('alert', { title: "??????", message: "???????????? ?????? ??????????????????." });
  }
}

document.querySelector('.so_exit').onclick = releaseSo;

const saveLocal = () => {
  let savePath = ipcRenderer.sendSync('savepath', {
    title: '???????????? ??????',
    message: '????????? ????????? ???????????????',
  });
  if (savePath != undefined) {
    //save locally
    let index = savePath.match(/([^\\\/]*\.taw)/).index;
    let path = savePath.substr(0, index);
    let name = savePath.substr(index);
    name = name.substr(0, name.length - 4);
    Tool.save(path, name);
  }
}

const l = () => {
  TAW.initFromTool();
  Tool.setCurrentTAW(TAW);
  if (Tool.session() != null && Tool.session().isConnected()) {
    Tool.session().send('save');
  }
}