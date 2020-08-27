if (typeof fs == 'undefined') {
  fs = require('fs');
}

const SAVE = (() => {
  const _attr = ['x', 'y', 'width', 'height', 'visible', 'id', 'name', 'opacity', 'scale', 'rotation', 'offset'];
  function save(tree, flow, size, name, hash) {
    if (name == undefined) {
      name = hash = getDateAsHex();
    } else if (hash == undefined) {
      hash = getDateAsHex();
    }

    let path = name;
    if (!fs.existsSync(path)) fs.mkdirSync(path);
    path += '/' + hash;
    flow = flow.map((e) => {
      delete e['obj'];
      return e;
    });
    filemap = [];
    if (tree.constructor.name == 'PSD') {
    } else {
      recurSave(tree.children[0], path, filemap);
    }
    flow = { map: filemap, flow: flow, size: size, name: name };
    fs.writeFile(path + '-data.json', JSON.stringify(flow), (e) => {
      if (e) console.log(e);
      else console.log(path);
    });
  }
  function recurSave(parent, path, fm) {
    let childs = parent.children;
    let i = 0;
    for (const child of childs) {
      const cpath = path + '-' + i++;
      if (child.children.length == 0) {
        //shape
        let b = child.attrs.image.src.replace(/^data:image\/png;base64,/, '');
        fs.writeFile(cpath + '.png', b, 'base64', (e) => {
          if (e) console.log(e);
          else console.log(this);
        });
        const attrs = {};
        _attr.forEach((e) => attrs[e] = child[e]());

        fm.push({path: cpath + '.png', attrs: attrs});
      } else {
        //group
        recurSave(child, cpath, fm);
      }
    }
  }
  return { save: save };
})();
