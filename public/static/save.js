if (typeof fs == "undefined") {
    fs = require('fs');
}

const SAVE = (() => {
    function save(tree, flow) {
        let path = 'hash';
        if (!fs.existsSync(path))
            fs.mkdirSync(path);
        path += '/hash';
        flow = flow.map(e => { delete e['obj']; return e });
        filemap = [];
        if (tree.constructor.name == "PSD") {

        } else {
            recurSave(tree.children[0], path, filemap);
        }
        flow = { map: filemap, flow: flow };
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
                let b = child.attrs.image.src.replace(/^data:image\/png;base64,/, "");
                fs.writeFile(cpath + ".png", b, 'base64', (e) => {
                    if (e) console.log(e);
                    else console.log(this);
                });
                fm.push(cpath + ".png");
            } else {
                //group
                recurSave(child, cpath, fm);
            }
        }
    }
    return { save: save };
})();