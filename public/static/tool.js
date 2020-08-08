const Tool = (() => {
  // immutable component
  const _p = byQuery('.center');
  const _ll = byID('flexbox-6');
  const _b = byQuery('.timebar');
  const _th = byID('flexbox-10');
  const _tb = byID('flexbox-11');
  const _ts = byID('timebody_scroll');
  const _thh = byID('timehead_head');
  const _tbh = byID('timebody_head');
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
      let item = findItem(pl, id);
      let did = nextUDID();
      _th.innerHTML += `<div did="${did}" uid="${id}" droppable="false">${item.name()}</div>`;
      data[did] = { src: id, timeline: { t0: { x: item.x(), y: item.y() } } };
      copyItemToTimeline(did, item);
      e.preventDefault();
    };
    _b.onmousedown = (e) => {};
    _b.onmouseup = (e) => {};
    _tb.onmousemove = (e) => {};
    initBar();
  }

  let udid = 0;
  let data = {};
  let flow = {};

  const getData = () => data;

  function makeFlowData() {
    sortData();
    flow = {};
    for (const k of Object.keys(data)) {
      const tmp = {};
      let o = data[k];
      const tl = Array.from(Object.keys(o.timeline), (x) =>
        parseInt(x.substr(1))
      );
      if (tl.length == 1) continue;
      tmp.src = o.src;
      for (let i = 0; i < tl.length - 2; i++) {
        let from = tl[i];
        let to = tl[i + 1];
        let keys = [...Object.keys(from), ...Object.keys(to)];
        keys = keys.filter((i, p) => keys.indexOf(i) === p);
        for (const key of keys) {
        }
      }
      flow[k] = tmp;
    }
  }

  function sortData() {
    for (const o of Object.values(data)) {
      const tmp = {};
      const arr = Array.from(Object.keys(o.timeline), (x) =>
        parseInt(x.substr(1))
      )
        .sort((a, b) => a - b)
        .map((e) => (tmp['t' + e] = o.timeline['t' + e]));
      o.timeline = tmp;
    }
  }

  function nextUDID() {
    return udid++;
  }

  function copyItemToTimeline(d, i) {
    const img = new Konva.Image({
      x: i.x(),
      y: i.y(),
      opacity: i.opacity(),
      draggable: true,
      visible: i.visible(),
      name: i.name(),
      image: i.image(),
    });
    img.setAttr('did', d);
    img.on('mousedown', moveSelectListener);
    img.on('mouseup', moveReleaseListener);
    addTl(img);
    redrawAll();
  }

  let currentUDID = 0;
  function moveSelectListener(e) {
    ms = e.currentTarget;
    if (si != null) clearInterval(si);
    si = setInterval(updateSel, 100);
  }
  function updateSel() {
    if (ms != null) {
      let dat = data[ms.getAttr('did')];
      dat.timeline['t' + getTimebar()] = { x: ms.x(), y: ms.y() };
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
  const getPLayer = () => pl;
  const getTLayer = () => tl;
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

  function layerSelect(o) {
    let i = findItem(pl, o.id);
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

  const TB_PAD = 20;
  const TIME_TICK = 1000;
  var currentTAW = null;
  const setCurrentTAW = (taw) => (currentTAW = taw);
  const moveTimebar = (o) => {
    _b.style.left = TB_PAD + o + 'px';
    if (getTimebar() >= TIME_TICK) {
      stopTimebar();
      _b.style.left = TB_PAD + size + 'px';
    } else if (getTimebar() <= TB_PAD) {
      _b.style.left = TB_PAD + 'px';
    }
    if (currentTAW != null) currentTAW.setProgress(getTimebar());
  };
  function startTimebar() {
    if (ti != null) clearInterval(ti);
    ti = setInterval(tickTime, 50);
  }
  const stopTimebar = () => clearInterval(ti);
  const resetTimebar = () => moveTimebar(0);
  const tickTime = () =>
    moveTimebar(parseInt(computedStyle(_b).left) + size * 0.001);
  const getTimebar = () =>
    Math.round(
      ((parseInt(computedStyle(_b).left) - TB_PAD) / size) * TIME_TICK
    );

  let lastX = -1;
  let lastL = -1;
  const size = parseInt(computedStyle(_tbh).width) - TB_PAD * 2;
  function initBar() {
    _tb.onmousemove = (e) => {
      let dist = lastL + e.x - lastX;
      if (lastX != -1 && dist >= 0 && dist <= size) {
        moveTimebar(dist);
      }
    };
    _b.onmousedown = (e) => {
      lastL = parseInt(computedStyle(_b).left) - TB_PAD;
      lastX = e.x;
    };
    _tb.onmouseleave = _tb.onmouseup = (e) => (lastX = lastL = -1);
    addTimebodyCalib();
    _tbh.onclick = (e) => {
      const pos = Math.round((e.offsetX - TB_PAD / size) * TIME_TICK);
      moveTimebar(e.offsetX - TB_PAD);
    };
    _tbh.onmousedown = (e) => {
      moveTimebar(e.offsetX - TB_PAD);
      lastL = e.offsetX - TB_PAD;
      lastX = e.x;
    };
  }

  const CALIB_CNT = 11;
  function addTimebodyCalib() {
    _tbh.style.width = size + TB_PAD * 2 + 'px';
    const dist = size / (CALIB_CNT - 1);
    // 10 = calib count
    for (let i = 0; i < CALIB_CNT; i++) {
      const u = createElem('p');
      u.className = 'time_calib_unit';
      u.textContent = i * 10 + '%';
      const d = createElem('div');
      d.className = 'time_calib';
      u.style.left = d.style.left = TB_PAD + dist * i + 'px';
      _tbh.appendChild(u);
      _tbh.appendChild(d);
    }
  }

  return {
    init: init,
    redrawAll: redrawAll,
    resize: resize,
    scale: scale,
    getStage: getStage,
    getPLayer: getPLayer,
    getTLayer: getTLayer,
    getParent: getParent,
    getData: getData,
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
    sortData: sortData,
    setCurrentTAW: setCurrentTAW,
  };
})();
