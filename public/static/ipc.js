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
};
window.addEventListener('resize', resizeCanvas);

const scaleCanvas = (x, y) => {
  stage.scaleX(x);
  stage.scaleY(y);
  stage.draw();
};

function applyLayers() {
  const layers = stage.getLayers()[0];
  let r = parseLayer(layers, "layer", 0);
  document.getElementById("flexbox-6").innerHTML = r;
}
function parseLayer(child, hier, level) {
  if (child.children.length != 0) {
    var returnText = `<div id=${hier} class="layer layer-level-${level}" onclick="event.stopPropagation();layerSelect(this);"><p>${child.name()}</p>`;
    child.children.map((v, i) => {
      returnText += parseLayer(v, hier + "-" + i, level + 1);
    });
    return returnText + "</div>";
  } else {
    // item
    return `<div id="${hier}" class="layer layer-level-${level}" onclick="event.stopPropagation();layerSelect(this);">
      <p>${child.name()}</p>
    </div>`;
  }
}
function layerSelect(obj) {
  let layHier = obj.id.substr(6).split("-");
  let layer = stage.getLayers()[0];
  let item = layer;
  for (const hier of layHier)
    item = item.children[hier];
  console.log(item);
}