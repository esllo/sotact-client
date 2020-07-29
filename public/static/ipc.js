var { ipcRenderer } = require('electron');
const { update } = require('lodash');
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
let pr = null;
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
        if (pr == null) {
          pr = new Konva.Layer();
          stage.add(pr);
        }
        pr.add(tree);
        applyLayers();
        initTimeline();
        stage.draw();
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
  let r = parseLayer(layers, 'layer', 0);
  document.getElementById('flexbox-6').style.overflowY = 'scroll';
  document.getElementById('flexbox-6').innerHTML = r;
}
function parseLayer(child, hier, level) {
  if (child.children.length != 0) {
    var returnText = `<div id=${hier} class="layer layer-level-${level}" onclick="event.stopPropagation();layerSelect(this);"><p>${child.name()}</p>`;
    child.children.map((v, i) => {
      returnText += parseLayer(v, hier + '-' + i, level + 1);
    });
    return returnText + '</div>';
  } else {
    // item
    return `<div id="${hier}" class="layer layer-level-${level}" onclick="event.stopPropagation();layerSelect(this);" ondragstart="dragstart_(event)" draggable="true">
      <p>${child.name()}</p>
    </div>`;
  }
}
var lastSelect = null;
function findItem(id) {
  let layHier = id.substr(6).split('-');
  let layer = stage.getLayers()[0];
  let item = layer;
  for (const hier of layHier) item = item.children[hier];
  return item;
}
function layerSelect(obj) {
  let item = findItem(obj.id);
  if (lastSelect != null) {
    lastSelect[0].style.opacity = 1;
    lastSelect[1].draggable(false);
    lastSelect[1].listening(false);
    // lastSelect[1].zIndex(lastSelect[2]);
  }
  if (lastSelect != null && item == lastSelect[1]) {
  } else {
    lastSelect = [obj, item, item.zIndex()];
    obj.style.opacity = 0.5;
    item.draggable(true);
    item.listening(true);
    // item.zIndex(999);
    stage.draw();
  }
}

document.getElementById('scale').oninput = (e) => {
  let scale = parseInt(e.target.value) / 100;
  scaleCanvas(scale, scale);
};

var tm = null;
function initTimeline() {
  tm = new Konva.Layer({
    x: 0,
    y: 0,
  });
  tm.hide();
  stage.add(tm);
}

document.getElementById('tm_toggle').addEventListener('change', (e) => {
  if (e.target.checked) {
    pr.hide();
    tm.show();
  } else {
    pr.show();
    tm.hide();
  }
  stage.draw();
});

const propbox = document.getElementById('flexbox-10');
propbox.setAttribute('droppable', true);
propbox.ondragover = (e) => {
  e.preventDefault();
};
propbox.ondrop = (e) => {
  const id = e.dataTransfer.getData('target');
  let item = findItem(id);
  propbox.innerHTML += `<div droppable="false">${item.name()}</div>`;
  copyItemToTimeline(item);
  e.preventDefault();
};
const dragstart_ = (e) => {
  e.dataTransfer.setData('target', e.srcElement.id);
};

var mvSel = null;
var selIntv = null;
const nv = document.getElementById('nval');
const xv = document.getElementById('xval');
const yv = document.getElementById('yval');
function moveSelectListener(e) {
  mvSel = e.currentTarget;
  selIntv = setInterval(updateSel, 100);
}
function updateSel() {
  if (mvSel != null) {
    nv.value = mvSel.name();
    xv.value = mvSel.x();
    yv.value = mvSel.y();
  }
}
function moveReleaseListener(e) {
  updateSel();
  mvSel = null;
  clearInterval(selIntv);
}

function copyItemToTimeline(item) {
  console.log(item);
  const img = new Konva.Image({
    x: item.x(),
    y: item.y(),
    opacity: item.opacity(),
    draggable: true,
    visible: item.visible(),
    name: item.name(),
    image: item.image(),
  });
  img.on('mousedown', moveSelectListener);
  img.on('mouseup', moveReleaseListener);
  tm.add(img);
  stage.draw();
}
