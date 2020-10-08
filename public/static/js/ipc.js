var { ipcRenderer } = require('electron');
var http = require('http');
if (typeof psd === 'undefined') var psd = require('psd');

let userData = null;
function windowEvent(code) {
  ipcRenderer.send('windowEvent', code);
}

let occred = false;
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
    occred = true;
  }
  window.useEffectOccured = useEffectOccured;
}, 1000);

function addOnOccured(cb) {
  if (occred) cb();
  else occurQueue.push(cb);
}

ipcRenderer.on('loginSuccess', (e, c) => {
  byQuery('.login').value = c.nickname + "님 안녕하세요.";
  byQuery('.login').disabled = true;
  userData = c;
})

ipcRenderer.on('cloudSelected', (e, args) => {
  Tool.clear();
  fs.mkdtemp(require('os').tmpdir() + '/taw-', (err, dir) => {
    if (err) console.log(err);
    console.log('dir : ' + dir);
    let tar = require('tar');
    let req = http.get('http://d3mb0cokyn26gw.cloudfront.net/' + args[0] + '.taw', (res) => {
      res.on('end', () => {
        console.log('end1');
      });
      res.pipe(tar.x({
        C: dir,
      })).on('close', () => {
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
            const tree = parser.parseJson(require('path').resolve(dir) + "/", data);
            console.log('parse start');
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
              if (Tool.session() == null) {
                ss = Conn.Session(args[0]);
                Tool.session(ss);
                Tool.sessionCreated();
              }
              Tool.session().connect();
              console.log('load finish');
            })
          } else {
            ipcRenderer.send('alert', { message: "유효하지 않은 파일입니다." });
          }
        });
      });
    }).on('end', () => {
      console.log('end2');
    }).on('error', (err) => {
      console.log('download error');
      console.log(err);
    });
  });
})