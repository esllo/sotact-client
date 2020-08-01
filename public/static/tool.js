const Tool = (() => {
  // immutable component
  const _p = byQuery('.center');
  const _ll = byID('flexbox-6');
  const _b = byQuery('.timebar');
  const _th = byID('flexbox-10');
  const _tb = byID('flexbox-11');
  const _nv = byID('nval');
  const _xv = byID('xval');
  const _yv = byID('yval');

  // konva objects
  let stg = null;
  let pl = null;
  let tl = null;

  // tool objects
  let ls = null;
  let ms = null;
  let si = null;
  let ti = null;
  let time = 0;

  function init() {
    stg = new Konva.Stage({ container: 'container' });
    pl = new Konva.Layer();
    tl = new Konva.Layer();
    tl.hide();
    stg.add(pl);
    stg.add(tl);
    resize(stg, _p.offsetWidth, _p.offsetHeight);
    _th.setAttribute('droppable', true);
    _th.ondragover = (e) => e.preventDefault();
    _th.ondrop = (e) => {
      const id = e.dataTransfer.getData('target');
      let item = findItem(id);
      _th.innerHTML += `<div droppable="false">${item.name()}</div>`;
      copyItemToTimeline(item);
      e.preventDefault();
    };
  }

  function copyItemToTimeline(i) {
    const img = new Konva.Image({
      x: i.x(),
      y: i.y(),
      opacity: i.opacity(),
      draggable: true,
      visible: i.visible(),
      name: i.name(),
      image: i.image(),
    });
    img.on('mousedown', moveSelectListener);
    img.on('mouseup', moveReleaseListener);
    addTl(img);
    redrawAll();
  }

  function moveSelectListener(e) {
    ms = e.currentTarget;
    if (si != null) clearInterval(si);
    si = setInterval(updateSel, 100);
  }
  function updateSel() {
    if (ms != null) {
      _nv.value = ms.name();
      _xv.value = ms.x();
      _yv.value = ms.y();
    }
  }
  function moveReleaseListener(e) {
    updateSel();
    ms = null;
    clearInterval(si);
  }

  const addPr = (obj) => pl.add(obj);
  const addTl = (obj) => tl.add(obj);

  const toggleLayer = (bool) => {
    if (bool) {
      pl.hide();
      tl.show();
      tl.draw();
    } else {
      pl.show();
      tl.hide();
      pl.draw();
    }
  };

  const showTimeline = () => {
    toggleLayer(true);
  };

  const showPredraw = () => {
    toggleLayer(false);
  };

  const resize = (o, w, h) => {
    if (h === undefined) h = w;
    o.width(w);
    o.height(h);
    redrawAll();
  };

  const scale = (o, x, y) => {
    if (y === undefined) y = x;
    o.scaleX(x);
    o.scaleY(y);
    redrawAll();
  };

  const getStage = () => stg;
  const getParent = () => _p;

  const redrawAll = () => {
    pl.draw();
    tl.draw();
    stg.draw();
  };

  const applyLayer = () => {
    _ll.innerHTML = parseLayer(pl, 'layer', 0);
  };

  const parseLayer = (c, h, l) => {
    if (c.children.length != 0) {
      var rt = `<div id=${h} class="layer layer-level-${l}" 
      onclick="event.stopPropagation();
      Tool.layerSelect(this);">
      <p>${c.name()}</p>`;
      c.children.map((v, i) => {
        rt += parseLayer(v, h + '-' + i, l + 1);
      });
      return rt + '</div>';
    } else {
      // item
      return `<div id="${h}" class="layer layer-level-${l}" 
      onclick="event.stopPropagation();Tool.layerSelect(this);" 
      ondragstart="event.dataTransfer.setData('target', event.srcElement.id)" 
      draggable="true">
        <p>${c.name()}</p>
      </div>`;
    }
  };

  function findItem(i) {
    let lh = i.substr(6).split('-');
    let l = pl;
    let it = l;
    for (const h of lh) it = it.children[h];
    return it;
  }

  function layerSelect(o) {
    let i = findItem(o.id);
    if (ls != null) {
      ls[0].style.opacity = 1;
      ls[1].draggable(false);
      ls[1].listening(false);
    }
    if (!(ls != null && i == ls[1])) {
      ls = [o, i];
      o.style.opacity = 0.5;
      i.draggable(true);
      i.listening(true);
      redrawAll();
    }
  }

  const moveTimebar = (o) => (_b.style.left = 10 + o + 'px');
  function startTimebar() {
    if (ti != null) clearInterval(ti);
    ti = setInterval(tickTime, 33);
  }
  const stopTimebar = () => clearInterval(ti);
  const resetTimebar = () => moveTimebar((time = 0));
  const tickTime = () => moveTimebar((time += 2));

  return {
    init: init,
    redrawAll: redrawAll,
    resize: resize,
    scale: scale,
    getStage: getStage,
    getParent: getParent,
    toggleLayer: toggleLayer,
    showTimeline: showTimeline,
    showPredraw: showPredraw,
    addPr: addPr,
    addTl: addTl,
    applyLayer: applyLayer,
    layerSelect: layerSelect,
    startTimebar: startTimebar,
    stopTimebar: stopTimebar,
    resetTimebar: resetTimebar,
    moveTimebar: moveTimebar,
  };
})();
