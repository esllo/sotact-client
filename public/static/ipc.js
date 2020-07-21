let psd = require('psd');
const { default: Konva } = require('konva');
let cvs = document.createElement('canvas');
let ctx = cvs.getContext('2d');
var Kv = window.Konva;
const toImage = (png) => {
    let width = png.width || 0;
    let height = png.height || 0;
    if (width == 0 && height == 0) return null;
    cvs.width = width;
    cvs.height = height;
    ctx.clearRect(0, 0, width, height);
    let img = ctx.createImageData(width, height);
    for (let i = 0; i < png.data.length; i++)
        img.data[i] = png.data[i];
    ctx.putImageData(img, 0, 0);
    let p = new Image();
    p.src = cvs.toDataURL('image/png');
    return p;
}
let clayer = null;
let tr = null;
let input = document.querySelector("[type=file]");
if (input != null) {
    console.log('add event');
    input.addEventListener('change', (e) => {
        console.log('changed');
        if (clayer == null) {
            clayer = new Kv.Layer();
            tr = new Kv.Transformer();
            tr.zIndex(999);
            clayer.add(tr);
            window.stage.add(clayer);
            window.stage.on('click tap', e => {
                // if(e.target === window.stage){
                //     tr.nodes([]);
                //     clayer.draw();
                //     return;
                // }
                // tr.nodes([e.target]);
                // clayer.draw();
            });
        }
        if (e.target.value == '') {

        } else {
            file = e.target.files[0];
            e.target.value = '';
            let psdFile = psd.fromFile(file.path);
            psdFile.parse();
            window.psdFile = psdFile;
            let childs = psdFile.tree()._children;
            for (const child of childs.reverse()) {
                let lay = child.layer;
                testImage = toImage(lay.image.toPng());
                if (testImage != null) {
                    let konvaImage = new Kv.Image({
                        x: 0,
                        y: 0,
                        image: testImage,
                        draggable: true,
                        scaleX: 0.3,
                        scaleY: 0.3,
                    });
                    clayer.add(konvaImage);
                    clayer.batchDraw();
                }
            }
            tr.remove();
            clayer.add(tr);
            clayer.draw();
        }
    });
}