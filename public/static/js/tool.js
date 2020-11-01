const Tool = (() => {
  // immutable component
  const _p = byQuery('.center');
  const _ll = byQuery('.left');
  const _rl = byQuery('.right');
  const _ls = byQuery('.layers');
  const _ps = byQuery('.fx_presets');
  const _b = byQuery('.timebar');
  const _th = byQuery('.timeline_head');
  const _tb = byQuery('.timeline_body');
  const _ts = byID('timebody_scroll');
  const _thh = byID('timehead_head');
  const _tbh = byID('timebody_head');
  const _tns = byID('tl_names');
  const _tps = byID('tl_props');
  const _nv = byID('nval');
  const _xv = byID('xval');
  const _yv = byID('yval');
  const _rv = byID('rval');
  const _ov = byID('oval');
  const _sxv = byID('sxval');
  const _syv = byID('syval');
  const _vv = byID('vval');
  const _cv = byID('coval');

  const _props = ['x', 'y', 'rotation', 'opacity', 'visible', 'scale', 'globalCompositeOperation'];

  // konva objects
  let stg = null;
  let pl = null;
  let tl = null;
  let ctx = null;
  const psd = (_psd) => {
    if (_psd === undefined) return ctx;
    ctx = _psd;
  };

  // tool objects
  let ls = null;
  let ms = null;
  let si = null;
  let ti = null;
  let time = 0;
  let sz = 0;

  function clear() {
    if (_session != null) {
      if (_session.socket() != null)
        _session.socket().close();
      _session = null;
    }
    pl.children.length != 0 && pl.destroyChildren();
    tl.children.length != 0 && tl.destroyChildren();
    ls = ms = si = ti = sz = 0;
    udid = maxDist = 0;
    data = [];
    nodes = [];
    lastTr = tr = currentTAW = null;
    dragged = false;
    lastX = lastL = -1;
    _tps.innerHTML = _tns.innerHTML = '';
    applyLayer();
    redrawAll();
    initTr();
  }

  // session
  let _session = null;
  const session = (s) => _session = s || _session;
  function isValidSession() {
    return _session != null && _session.socket().connected;
  }
  function sessionCreated() {

  }

  function init() {
    stg = new Konva.Stage({ container: 'container' });
    pl = new Konva.Layer();
    tl = new Konva.Layer();
    tl.hide();
    stg.add(pl);
    stg.add(tl);
    rebsize(stg, _p.offsetWidth, _p.offsetHeight);
    _tns.setAttribute('droppable', true);
    _tns.ondragover = (e) => e.preventDefault();
    _tns.ondrop = (e) => {
      const id = e.dataTransfer.getData('target');
      console.log('id:' + id);
      let item = findItem(pl, id);
      let did = nextUDID();
      item.id(id);
      console.log(id);
      let color = rainbow(Math.floor(Math.random() * 1000));
      _tns.innerHTML += `<div class="tl_name" did="${did}" uid="${id}" droppable="false" onclick="Tool.selectNode(this)">
        ${item.name()}
        <p class="tl_name_color" style="background: ${color}"></p>
      </div>`;
      data[did] = {
        src: id,
        timeline: {
          t0: createTlData(item),
        },
      };
      if (isValidSession()) {
        _session.send('attrChange',
          {
            src: id,
            time: 0,
            data: data[did].timeline['t0']
          });
      }
      _tps.innerHTML += `<div class="tl_prop" did="${did}" uid="${id}"></div>`;
      copyItemToTimeline(did, item);
      maxDist = computedStyle(_tns).height + 26 - computedStyle(_th).height;
      setPoint(did, 0);
      e.preventDefault();
    };
    _b.onmousedown = (e) => { };
    _b.onmouseup = (e) => { };
    _tb.onmousemove = (e) => { };
    initTr();
    initBar();
    initProp();
  }

  function initPresets() {
    _ps.innerHTML = Presets.getHTML();
  }

  let maxDist = 0;
  function scrollTimeline(e) {
    e.preventDefault();
    let targetScroll = _tns.scrollTop;
    targetScroll += e.deltaY * 0.2;
    if (targetScroll < 0) targetScroll = 0;
    if (targetScroll > maxDist) targetScroll = maxDist;
    _tps.scrollTop = _tns.scrollTop = targetScroll;
  }

  let udid = 0;
  let data = {};

  const getData = () => data;
  function parseData(datum) {
    data = [];
    datum.forEach(dt => {
      let tl = { src: dt.src, timeline: {} };
      let i = findItem(pl, dt.src)
      console.log('find ' + dt.src);
      let d = nextUDID();
      copyItemToTimeline(d, i);

      let color = rainbow(Math.floor(Math.random() * 1000));
      _tns.innerHTML += `<div class="tl_name" did="${d}" uid="${dt.src}" droppable="false" onclick="Tool.selectNode(this)">
        ${i.name()}
        <p class="tl_name_color" style="background: ${color}"></p>
      </div>`;
      _tps.innerHTML += `<div class="tl_prop" did="${d}" uid="${dt.src}"></div>`;
      for (let ind = 0; ind < Math.min(dt.time.length, dt.data.length); ind++) {
        let tm = dt.time[ind];
        let tmb = 't' + tm;
        if (tl.timeline[tmb] === undefined) {
          setPoint(d, tm);
        }
        tl.timeline[tmb] = dt.data[ind];
      }
      data.push(tl);
    });
    TAW.initFromTool();
  }

  function createTlData(item) {
    let tmp = {};
    _props.forEach(prop => tmp[prop] = item[prop]());
    return tmp;
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

  var nodes = [];
  function copyItemToTimeline(d, i) {
    const img = new Konva.Image({
      id: i.id(),
      x: i.x(),
      y: i.y(),
      opacity: i.opacity(),
      draggable: true,
      visible: i.visible(),
      name: i.name(),
      image: i.image(),
      offset: i.offset(),
    });
    img.setAttr('did', d);
    img.on('mousedown', moveSelectListener);
    img.on('mouseup', moveReleaseListener);
    img.on('click', selectItem);
    nodes.push(img);
    addTl(img);
    redrawAll();
  }

  function setPoint(did, progress) {
    let d = byQuery(`div[udid="${did}"][progress="${progress}"]`);
    if (d == null) {
      d = createElem('div');
      d.setAttribute('udid', did);
      d.setAttribute('progress', progress);
      d.className = 'tl_point';
      d.style.left = (bsize * progress) / TIME_TICK + TB_PAD - 2 + 'px';
      byQuery(`div[did="${did}"]:not([droppable=false])`).appendChild(d);
    }
  }

  function changeLastTr(fn, v) {
    if (lastTr != null) {
      lastTr[fn](v);
      applyUpdate(lastTr);
      tl.draw();
    }
  }

  function initProp() { }

  var lastTr = null;
  var tr = null;

  function initTr() {
    tr = new Konva.Transformer({
      anchorbsize: 10,
      anchorStrokeWidth: 1,
      anchorCornerRadius: 5,
      borderDash: [5, 5],
      centerScaling: true,
    });
    const evv = (a) => {
      // console.log(a);
    };
    tr.on('mousedown', evv);
    tr.on('dragmove', evv);
    tr.on('transform', evv);
    tr.on('transformend', evv);
    tr.on('transformstart', evv);
    tl.add(tr);
  }

  function selectNode(obj) {
    const node = nodes[parseInt(obj.getAttribute('did'))];
    ms = node;
    updateSel();
    ms = null;
    selectItem(node);
  }

  function selectItem(e) {
    console.log('curTarget:' + e.currentTarget);
    let target = e.currentTarget || e;
    if (lastTr != target) {
      lastTr = target;
      tr.nodes([lastTr]);
    } else {
      lastTr = null;
      tr.nodes([]);
    }
    tr.zIndex(tl.children.length - 1);
    tl.batchDraw();
  }

  let dragged = false;
  function moveSelectListener(e) {
    lastTr = ms = e.currentTarget;
    tr.nodes([lastTr]);
    tr.zIndex(tl.children.length - 1);
    tl.batchDraw();
    dragged = false;
    if (si != null) clearInterval(si);
    si = setInterval(updateSel, 100);
  }

  function attrChange(pk) {
    let item = tl.find('#' + pk.src);
    if (item.length == 0) {
      const id = pk.src;
      let i = findItem(pl, id);
      let did = nextUDID();
      i.id(id);

      let color = rainbow(Math.floor(Math.random() * 1000));
      _tns.innerHTML += `<div class="tl_name" did="${did}" uid="${id}" droppable="false" onclick="Tool.selectNode(this)">
        ${i.name()}
        <p class="tl_name_color" style="background: ${color}"></p>
      </div>`;
      data[did] = {
        src: id,
        timeline: {
          t0: createTlData(i),
        },
      };
      _tps.innerHTML += `<div class="tl_prop" did="${did}" uid="${id}"></div>`;
      copyItemToTimeline(did, i);
      setPoint(did, 0);
    }
    item = tl.find('#' + pk.src)
    item = item[0];
    let did = item.getAttr('did');
    if (data[did].timeline['t' + pk.time] == undefined)
      data[did].timeline['t' + pk.time] = {};
    Object.keys(pk.data).forEach(key => {
      data[did].timeline['t' + pk.time][key] = pk.data[key];
      item[key](pk.data[key]);
    });
    setPoint(did, pk.time);
    tl.draw();
  }

  function applyUpdate(o) {
    let dat = data[o.getAttr('did')];
    let tm = getTimebar();
    let tmb = 't' + tm;
    if (dat.timeline[tmb] === undefined) {
      setPoint(parseInt(o.getAttr('did')), tm);
    }
    dat.timeline[tmb] = createTlData(o);

    if (isValidSession()) {
      _session.send('attrChange',
        {
          src: o.id(),
          time: tm,
          data: dat.timeline[tmb]
        });
    }

    TAW.initFromTool();
  }

  function updateSel() {
    if (ms != null) {
      dragged = true;
      applyUpdate(ms);
      _nv.textContent = ms.name();
      _xv.value = ms.x();
      _yv.value = ms.y();
      _rv.value = ms.rotation();
      _ov.value = ms.opacity() * 100;
      _sxv.value = ms.scaleX();
      _syv.value = ms.scaleY();
      _vv.value = ms.visible();
      _cv.value = ms.globalCompositeOperation();
    }
  }

  function moveReleaseListener(e) {
    if (!dragged) lastTr = null;
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

  const rebsize = (o, w, h) => {
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
    _ls.innerHTML = pl.children.length == 0 ? "" : parseLayer(pl, 'layer', 0);
  };

  const parseLayer = (c, h, l) => {
    if (c.children.length != 0) {
      let rt = '';
      c.children.map((v, i) => {
        rt += parseLayer(v, h + '-' + i, l + 1);
      });
      return rt;
    } else {
      // item
      return `<div id="${c.id()}" class="layer layer-level-${l}" 
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
  const TICK_RATE = 16;
  var currentTAW = null;
  const setCurrentTAW = (taw) => (currentTAW = taw);
  const moveTimebar = (o) => {
    _b.style.left = TB_PAD + o + 'px';
    if (getTimebar() >= TIME_TICK) {
      stopTimebar();
      _b.style.left = TB_PAD + bsize + 'px';
    } else if (getTimebar() <= 0) {
      _b.style.left = TB_PAD + 'px';
    }
    if (currentTAW != null) {
      let ret = currentTAW.setProgress(getTimebar());
    }
  };
  function startTimebar() {
    if (ti != null) clearInterval(ti);
    ti = setInterval(tickTime, TICK_RATE);
  }
  const updateTb = (v) => tb_v = v / 100000;
  let tb_v = 0.0002;
  const stopTimebar = () => clearInterval(ti);
  const resetTimebar = () => moveTimebar(0);
  const tickTime = () =>
    moveTimebar(parseInt(computedStyle(_b).left) + bsize * tb_v);
  const getTimebar = () =>
    Math.round(
      ((parseInt(computedStyle(_b).left) - TB_PAD) / bsize) * TIME_TICK
    );

  let lastX = -1;
  let lastL = -1;
  const bsize = parseInt(computedStyle(_tbh).width) - TB_PAD * 2;
  function initBar() {
    _tb.onmousemove = (e) => {
      let dist = lastL + e.x - lastX;
      if (lastX != -1 && dist >= 0 && dist <= bsize) {
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
      const pos = Math.round((e.offsetX - TB_PAD / bsize) * TIME_TICK);
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
    _tbh.style.width = bsize + TB_PAD * 2 + 'px';
    const dist = bsize / (CALIB_CNT - 1);
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

  const size = (s) => (sz = s || sz);

  const save = (n, h, cb) => {
    moveTimebar(0);
    let p = getPLayer();
    let f = currentTAW.getFlow();
    SAVE.save(p, f, size(), n, h, cb);
  };

  return {
    init: init,
    initPresets: initPresets,
    redrawAll: redrawAll,
    rebsize: rebsize,
    scale: scale,
    getStage: getStage,
    getPLayer: getPLayer,
    getTLayer: getTLayer,
    getParent: getParent,
    getData: getData,
    parseData: parseData,
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
    changeLastTr: changeLastTr,
    scrollTimeline: scrollTimeline,
    setPoint: setPoint,
    psd: psd,
    save: save,
    size: size,
    selectNode: selectNode,
    updateTb: updateTb,
    attrChange: attrChange,
    session: session,
    sessionCreated: sessionCreated,
    clear: clear
  };
})();
