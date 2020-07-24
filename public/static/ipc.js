var { ipcRenderer } = require('electron');
if (typeof psd === 'undefined') var psd = require('psd');
var cvs = document.createElement('canvas');
var ctx = cvs.getContext('2d');
const toImage = (png) => {
  let width = png.width || 0;
  let height = png.height || 0;
  if (width == 0 && height == 0) return null;
  cvs.width = width;
  cvs.height = height;
  ctx.clearRect(0, 0, width, height);
  let img = ctx.createImageData(width, height);
  for (let i = 0; i < png.data.length; i++) img.data[i] = png.data[i];
  ctx.putImageData(img, 0, 0);
  let p = new Image();
  p.src = cvs.toDataURL('image/png');
  return p;
};
let tr = null;
let input = document.querySelector('[type=file]');
if (input != null) {
  console.log('add event');
  input.addEventListener('change', (e) => {
    console.log('changed');
    if (e.target.value == '') {
    } else {
      file = e.target.files[0];
      console.log(file.path);
      e.target.value = '';
      const tree = parser.parse(file.path);
      parser.waitForLoad(() => {
        const layer = new Konva.Layer();
        layer.add(tree);
        stage.add(layer);
      });
      // let psdFile = psd.fromFile(file.path);
      // psdFile.parse();
      // window.psdFile = psdFile;
      // let childs = psdFile.tree()._children;
      // for (const child of childs.reverse()) {
      //   let lay = child.layer;
      //   testImage = toImage(lay.image.toPng());
      //   if (testImage != null) {
      //     let konvaImage = new Konva.Image({
      //       x: 0,
      //       y: 0,
      //       image: testImage,
      //       draggable: true,
      //       scaleX: 0.5,
      //       scaleY: 0.5,
      //     });
      //     konvaImage.opacity(lay.image.obj.opacity);
      //     let clayer = new Konva.Layer();
      //     window.stage.add(clayer);
      //     clayer.add(konvaImage);
      //     clayer.batchDraw();
      //   }
      // }
      // stage.draw();
    }
  });
}
function windowEvent(code) {
  ipcRenderer.send('windowEvent', code);
}
const resizeCanvas = () => {
  const center = document.querySelector('.center');
  stage.width(center.offsetWidth);
  stage.height(center.offsetHeight);
}
window.addEventListener('resize', resizeCanvas);

const scaleCanvas = (x, y) => {
  stage.scaleX(x);
  stage.scaleY(y);
  stage.draw();
}