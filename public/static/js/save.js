if (typeof fs == 'undefined') {
  fs = require('fs');
}

const SAVE = (() => {
  const tar = require('tar');
  const _attr = ['x', 'y', 'width', 'height', 'visible', 'id', 'name', 'opacity', 'scale', 'rotation', 'offset', 'globalCompositeOperation'];
  function save(tree, flow, size, name, real, cb) {
    if (cb == undefined) cb = () => { };
    let hash = getDateAsHex();
    if (name == undefined) {
      name = getDateAsHex();
    }

    let path = name + '/' + real;
    if (!fs.existsSync(path)) fs.mkdirSync(path);
    mflow = JSON.parse(JSON.stringify(flow));
    mflow = mflow.map((e) => {
      delete e['obj'];
      return e;
    });
    filemap = [];
    if (tree.constructor.name == 'PSD') {
    } else {
      recurSave(tree.children[0], path, real, hash, filemap);
    }
    flow = { map: filemap, flow: mflow, size: size, name: real };
    fs.writeFile(path + '/' + hash + '-data.json', JSON.stringify(flow), (e) => {
      if (e) {
        console.log(e);
        cb(false);
      } else console.log(path + '/' + hash);
    });
    tar.c({
      gzip: true,
      file: (name == "." ? "" : name) + real + '.taw',
      C: name
    }, [real]).then(_ => {
      console.log(_);
      console.log("created " + path);
      recurDelete(path);
      cb(true);
    }).catch(e => {
      console.error(e);
      cb(false);
    });
    return name + '/' + real + '.taw';
  }
  function recurSave(parent, path, real, hash, fm, n) {
    let childs = parent.children;
    let i = n || 0;
    for (const child of childs) {
      const cpath = hash + '-' + i++;
      if (child.children.length == 0) {
        //shape
        let b = child.attrs.image.src.replace(/^data:image\/png;base64,/, '');
        fs.writeFile(path + '/' + cpath + '.png', b, 'base64', (e) => {
          if (e) console.log(e);
        });
        const attrs = {};
        _attr.forEach((e) => attrs[e] = child[e]());

        fm.push({ path: real + '/' + cpath + '.png', attrs: attrs });
      } else {
        //group
        recurSave(child, path, real, hash, fm, n);
      }
    }
  }
  function recurDelete(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = path + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          recurDelete(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
  return { save: save, recurDelete: recurDelete };
})();
