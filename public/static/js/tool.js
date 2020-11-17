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

  const _props = ['x', 'y', 'rotation', 'opacity', 'visible', 'scaleX', 'scaleY', 'globalCompositeOperation'];

  // konva objects
  let stg = null;
  let pl = null;
  let tl = null;
  let bl = null;
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
  let blRect = null;

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
    lastX = lastL = -1;
    _tps.innerHTML = _tns.innerHTML = '';
    blRect.width(0);
    blRect.height(0);
    bl.batchDraw();
    applyLayer();
    redrawAll();
    initTr();
    key(null);
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
    bl = new Konva.Layer();
    blRect = new Konva.Rect({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      fill: "#fff",
      shadowBlur: 4
    });
    bl.add(blRect);
    tl.hide();
    stg.add(bl);
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
      copyItemToTimeline(did, item);
      copyToLine(did, id, item.name());
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
    TAW.initFromTool();
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

      for (let ind = 0; ind < Math.min(dt.time.length, dt.data.length); ind++) {
        let tm = dt.time[ind];
        let tmb = 't' + tm;
        if (tl.timeline[tmb] === undefined) {
          setPoint(d, tm);
        }
        tl.timeline[tmb] = dt.data[ind];
      }
      copyToLine(d, dt.src, i.name());
      data.push(tl);
    });
    TAW.initFromTool();
  }

  function copyToLine(did, uid, name) {
    Presets.closeAll();
    _tns.innerHTML += `<div class="tl_name" did="${did}" uid="${uid}" droppable="false" onclick="Tool.nameSelected(this);Tool.selectNode(this);">
      ${name}
      <p class="tl_name_color" onclick="Tool.toggleBase(event, this)"></p>
      <p class="tl_name_clear" onclick="Tool.clearPoint(event, this)"></p>
    </div>`;
    let caps = createCaps();
    _tps.innerHTML += `<div class="tl_prop" did="${did}" uid="${uid}">${caps}</div>`;
    setTimeout(() => {
      recomm(name);
      let selfNOde = document.querySelector(`.tl_name[did="${did}"]`);
      nameSelected(selfNOde);
      selectNode(selfNOde);
    }, 500);
  }

  function toggleBase(e, o) {
    e.stopPropagation();
    o.classList.toggle('time');
  }

  function clearPoint(e, o) {
    e.stopPropagation();
    let res = ipcRenderer.sendSync('yesorno', { title: '알림', message: '모든 속성을 삭제하시겠습니까?' });
    if (res != 0) return;
    let did = o.parentElement.getAttribute('did');
    let points = Array.from(document.querySelectorAll(`.tl_prop[did="${did}"] > .point`));
    Object.keys(data[did].timeline).forEach((v, i) => {
      (i != 0) && delete data[did].timeline[v];

    });
    points.forEach((el, i) => (i != 0) && el.parentElement.removeChild(el));
  }

  function reloadPoint() {
    let points = document.querySelectorAll('.point');
    Array.from(points).forEach(p => p.parentElement.removeChild(p));
    data.forEach(dat => {
      let did = getDidObjByID(dat.src).getAttribute('did');
      Object.keys(dat.timeline).forEach(k => {
        k = k.substr(1);
        console.log('point set ' + did + " / " + k);
        setPoint(did, k);
      });
    });
  }

  function recomm(name) {
    name = name.replace(/[0-9]/g, '');
    fetch('http://52.78.1.107:8081/?' + encodeURI(name)).then(r => r.text()).then(text => {
      let json = JSON.parse(text);
      if (json.recom) {
        console.log(json.recom)
        let recom = parseInt(json.recom);
        let presets = document.querySelectorAll('.preset-title');
        if (recom >= 0 && recom < presets.length) {
          Presets.togglePreset(document.querySelectorAll('.preset-title')[recom]);
          toast(`[${name}]에 프리셋이 추천되었습니다.`);
          return;
        }
      }
      throw 'e';
    }).catch(e => {
      console.log(e);
      toast(`추천된 프리셋이 없습니다.`);
    });
  }

  const toast_box = document.querySelector('.alert_box');
  let toast_count = 0;
  function toast(msg) {
    let line = document.createElement('div');
    line.className = 'alert_line';
    line.textContent = msg;
    toast_box.appendChild(line);
    setTimeout(() => line.classList.add('on'), 50);
    setTimeout(() => {
      line.classList.add('offn');
      setTimeout(() => { line.parentElement.removeChild(line); }, 450)
    }, 2500)
  }

  function nameSelected(o) {
    let names = document.querySelectorAll('.tl_name');
    Array.from(names).forEach(e => e != o && e.classList.contains('on') && e.classList.remove('on'));
    o.classList.contains('on') ? o.classList.remove('on') : o.classList.add('on');
  }

  function createCaps() {
    let body = ``;
    for (let i = 0; i < 101; i++) {
      body += `<div class="cap cap-${i}"></div>`;
    }
    return body;
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
    img.on('dragmove', moveListener);
    nodes.push(img);
    addTl(img);
    redrawAll();
  }

  function checkPoint(did, progress) {
    let d = byQuery(`div.tl_prop[did="${did}"]`);
    if (d != null) {
      let cap = d.querySelector('.cap-' + progress);
      let p = cap.previousElementSibling;
      if (p != null) {
        if (!p.classList.contains('cap')) {
          p.parentElement.removeChild(p);
        }
      }
      return cap;
    }
    return null;
  }

  function setPoint(did, progress) {
    let cap = checkPoint(did, progress);
    if (cap != null) {
      let p = document.createElement('div');
      p.className = 'point';
      p.setAttribute('udid', did);
      p.setAttribute('progress', progress);
      p.oncontextmenu = (e) => {
        let progress = p.getAttribute('progress');
        if (progress != 0) {
          let result = ipcRenderer.sendSync('yesorno', { title: "알림", message: "삭제 하시겠습니까?" });
          if (result == 0) {
            let udid = p.getAttribute('udid');
            delete data[udid].timeline['t' + progress];
            p.parentElement.removeChild(p);
            (currentTAW != null) && TAW.applyData(data);
          }
        }
      }
      cap.parentElement.insertBefore(p, cap);
    }
  }

  // function setPoint(did, progress) {
  //   let d = byQuery(`div[udid="${did}"][progress="${progress}"]`);
  //   if (d == null) {
  //     d = createElem('div');
  //     d.setAttribute('udid', did);
  //     d.setAttribute('progress', progress);
  //     d.className = 'tl_point';
  //     d.style.left = (bsize() * progress) / TIME_TICK + TB_PAD - 2 + 'px';
  //     byQuery(`div[did="${did}"]:not([droppable=false])`).appendChild(d);
  //   }
  // }

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
      anchorSize: 10,
      anchorStrokeWidth: 1,
      anchorCornerRadius: 5,
      borderDash: [5, 5],
      centerScaling: true,
    });
    console.log(tr);
    const evv = (e) => {
      if (e.type == "transformstart") ms = tr.node();

      if (e.type == "transformend") { updateSel(); (ms = null) };
    };
    tr.on('transform', evv);
    tr.on('transformend', evv);
    tr.on('transformstart', evv);
    tl.add(tr);
  }

  function selectNode(obj) {
    const node = nodes[parseInt(obj.getAttribute('did'))];
    ms = node;
    updateProp();
    ms = null;
    selectItem(node, false);
  }

  function selectItem(e, fe = true) {
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
    if (fe) {
      let tg = getDidObjByID(target.id());
      if (tg != null) nameSelected(tg);
    }
  }

  function getDidObjByID(id) {
    let target = null;
    Object.keys(data).forEach(e => data[e].src == id && (target = document.querySelector(`.tl_name[did="${e}"]`)))
    return target;
  }

  function moveSelectListener(e) {
    ms = e.currentTarget;
    if (si != null) clearInterval(si);
    si = setInterval(updateSel, 100);
    selectItem(e);
  }

  function moveListener(e) {
    let t = e.currentTarget;
    if (lastTr == null) selectItem(e);
  }

  function attrChange(pk) {
    let item = tl.find('#' + pk.src);
    if (item.length == 0) {
      const id = pk.src;
      let i = findItem(pl, id);
      let did = nextUDID();
      i.id(id);

      data[did] = {
        src: id,
        timeline: {
          t0: createTlData(i),
        },
      };
      copyItemToTimeline(did, i);
      copyToLine(did, id, i.name())
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
    TAW.initFromTool();
  }

  function refineUpdate(o) {
    ['x', 'y', 'scaleX', 'scaleY', 'rotation'].forEach(e => o[e](parseInt(o[e]() * 100) / 100));
  }

  function applyUpdate(o) {
    refineUpdate(o);
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

  function applyPreset(o) {
    if (lastTr != null) {
      console.log('preset');
      let offset = getTimebar();
      let dist = (100 - offset) / (o.length - 1);
      console.log('lasttr');
      console.log(lastTr);
      let did = getDidObjByID(lastTr.id()).getAttribute('did');
      console.log('did : ' + did);
      o.forEach((e, i) => {
        let attrs = {};
        _props.forEach(p => attrs[p] = lastTr[p]());
        Object.keys(e).forEach(k => {
          switch (k) {
            case 'x':
            case 'y':
              attrs[k] += e[k];
              break;
            case 'rotation':
            case 'opacity':
              attrs[k] = e[k];
          }
        });
        let tm = parseInt(offset + (dist * i));
        data[did].timeline['t' + tm] = attrs;
        setPoint(did, tm);
      });
      TAW.initFromTool();
    }
  }

  function updateProp() {
    if (ms != null) {
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

  function needUpdate() {
    if (ms == null) return false;
    return (_xv.value != ms.x()) || (_yv.value != ms.y()) || (_rv.value != ms.rotation()) ||
      (_ov.value != (ms.opacity() * 100)) || (_sxv.value != ms.scaleX()) || (_syv.value != ms.scaleY()) ||
      (_vv.value != ms.visible()) || (_cv.value != ms.globalCompositeOperation());
  }

  function updateSel() {
    if (ms != null) {
      if (needUpdate()) {
        applyUpdate(ms);
        updateProp();
      }
    }
  }

  function moveReleaseListener(e) {
    updateSel();
    ms = null;
    clearInterval(si);
  }

  const addPr = (obj) => {
    pl.add(obj);
    // let ww = blRect.width(), hh = blRect.height();
    // (obj.children != null) && obj.children.forEach(e => {
    //   console.log(e);
    //   console.log(e.attrs);
    //   let [x, y] = e.position();
    //   let [w, h] = e.size();
    //   (x + w > ww) && (ww = x + w) || bl.batchDraw();
    //   (y + h > hh) && (hh = y + h) || bl.batchDraw();
    // });
  };
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
    bl.batchDraw();
    pl.batchDraw();
    tl.batchDraw();
    // stg.batchDraw();
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
  const TIME_TICK = 100;
  const TICK_RATE = 16;
  var currentTAW = null;
  const setCurrentTAW = (taw) => (currentTAW = taw);
  const moveTimebar = (o, t = false) => {
    _b.style.left = TB_PAD + o + 'px';
    t && arrangeTimebar();
    if (getTimebar() >= TIME_TICK) {
      stopTimebar();
      _b.style.left = TB_PAD + bsize() + 'px';
    } else if (getTimebar() <= 0) {
      _b.style.left = TB_PAD + 'px';
    }
    if (currentTAW != null) {
      let ret = currentTAW.setProgress(getTimebar());
    }
  };
  const arrangeTimebar = () => {
    let per = getTimebar();
    _b.style.left = TB_PAD + per * (bsize() / 100) + 'px';
  }
  function startTimebar() {
    TAW.initFromTool();
    if (ti != null) clearInterval(ti);
    ti = setInterval(tickTime, TICK_RATE);
  }
  const updateTb = (v) => tb_v = v / 100000;
  let tb_v = 0.0002;
  const stopTimebar = () => { clearInterval(ti); arrangeTimebar() };
  const resetTimebar = () => moveTimebar(0);
  const tickTime = () =>
    moveTimebar(parseInt(computedStyle(_b).left) + bsize() * tb_v);
  const getTimebar = () =>
    Math.round(
      ((parseInt(computedStyle(_b).left) - TB_PAD) / bsize()) * TIME_TICK
    );

  let lastX = -1;
  let lastL = -1;
  const bsize = () => parseInt(computedStyle(_tbh).width) - TB_PAD * 2;
  function initBar() {
    _tb.onmousemove = (e) => {
      let dist = lastL + e.x - lastX;
      if (lastX != -1 && dist >= 0 && dist <= bsize()) {
        moveTimebar(dist, true);
      }
    };
    _b.onmousedown = (e) => {
      lastL = parseInt(computedStyle(_b).left) - TB_PAD;
      lastX = e.x;
    };
    _tb.onmouseleave = _tb.onmouseup = (e) => (lastX = lastL = -1);
    addTimebodyCalib();
    _tbh.onclick = (e) => {
      const pos = Math.round((e.offsetX - TB_PAD / bsize()) * TIME_TICK);
      moveTimebar(e.offsetX - TB_PAD, true);
    };
    _tbh.onmousedown = (e) => {
      moveTimebar(e.offsetX - TB_PAD, true);
      lastL = e.offsetX - TB_PAD;
      lastX = e.x;
    };
  }

  const CALIB_CNT = 11;
  function addTimebodyCalib() {
    // _tbh.style.width = bsize() + TB_PAD * 2 + 'px';
    // const dist = bsize() / (CALIB_CNT - 1);
    // // 10 = calib count
    // for (let i = 0; i < CALIB_CNT; i++) {
    //   const u = createElem('p');
    //   u.className = 'time_calib_unit';
    //   u.textContent = i * 10 + '%';
    //   const d = createElem('div');
    //   d.className = 'time_calib';
    //   u.style.left = d.style.left = TB_PAD + dist * i + 'px';
    //   _tbh.appendChild(u);
    //   _tbh.appendChild(d);
    // }
  }

  const size = (s) => {
    if (s != undefined) sz = s;
    blRect.size(sz);
    bl.batchDraw();
    return sz;
  }

  const save = (n, h, cb) => {
    moveTimebar(0);
    let p = getPLayer();
    let f = currentTAW.getFlow();
    SAVE.save(p, f, size(), n, h, cb);
  };

  let lastKey = null;
  const key = (key) => lastKey = (key == undefined ? lastKey : key)

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
    clear: clear,
    nameSelected: nameSelected,
    applyPreset: applyPreset,
    key: key,
    toggleBase: toggleBase,
    clearPoint: clearPoint,
    reloadPoint: reloadPoint
  };
})();
