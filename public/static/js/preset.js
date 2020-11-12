
const Presets = (() => {
  const from = { x: 0, y: 0 };
  const FuncObjs = {
    Linear: function (ang, dst) {
      let to = { x: dst * cos(ang), y: dst * sin(ang) };
      return [from, to];
    },
    Rotate: function (ang) {
      let to = { rotation: ang };
      return [from, to];
    },
    Wdgd: function (ang, dst, cnt) { // 왔다갔다
      let to = FuncObjs.Linear(ang, dst);
      let ret = [from];
      for (let i = 0; i < cnt; i++) {
        ret.push(to);
        ret.push(from);
      }
      return ret;
    }

    , Spinout: function (dst, cnt) {
      let ret = [from];
      let ang = 0;
      let ndst = dst / cnt * 12;
      for (let i = 0; i < cnt * 12; i++) {
        ret.push({ x: i * ndst * cos(ang), y: i * ndst * sin(ang) });
      }
      return ret;
    }
    , Zigzag: function (dir, cnt, ang, dst, flp) {
      let index = 0;
      let lsx = dst * cos(dir), lsy = dst * sin(dir);
      let rsx = dst * cos(180 + ang - dir), rsy = dst * sin(180 + ang - dir);
      let ret = [from];
      let fx = 0;
      let fy = 0;
      for (let i = 0; i < cnt; i++) {
        trig = i % 2 == 0;
        if (flp) trig = !trig;
        ret.push({ x: fx += trig ? lsx : rsx, y: fy += trig ? lsy : rsy });
      }
      return ret;
    }
  }

  const cos = (deg) => parseFloat(Math.cos(deg * Math.PI / 180).toFixed(15));
  const sin = (deg) => parseFloat(Math.sin(deg * Math.PI / 180).toFixed(15));

  const FuncSets = {
    Linear: {
      name: '선형 이동',
      type: {
        ang: 0,
        dst: 0
      }
    },
    Rotate: {
      name: '회전',
      type: {
        ang: 0
      }
    },
    Wdgd: {
      name: '반복 이동',
      type: {
        ang: 0,
        dst: 0,
        cnt: 0,
      }
    },
    Spinout: {
      name: '밖으로 회전',
      type: {
        dst: 0,
        cnt: 0
      }
    },
    Zigzag: {
      name: '지그재그 이동',
      type: {
        dir: 0,
        cnt: 0,
        ang: 0,
        dst: 0,
        flp: 0,
      }
    }
  };

  function getPresetHTML(func, name, type) {
    let struct = `<div class="preset" id="preset-${func}">`;
    struct += `<p onclick="Presets.togglePreset(this)" class="preset-title"><img/>${name}</p><div>`;
    Object.keys(type).forEach(key => { struct += `<label><span>${key}</span><input type="number" step="10" value="0" /></label>`; });
    struct += `<button onclick="Presets.getPreset(this)">적용</button></div></div>`;
    return struct;
  }

  function getHTML() {
    let struct = `<div class="presets">`;
    Object.keys(FuncSets).forEach(key => struct += getPresetHTML(key, FuncSets[key].name, FuncSets[key].type));
    struct += `</div>`;
    return struct;
  }

  function togglePreset(e) {
    let div = e.nextElementSibling;
    e.classList.toggle('on');
    div.classList.toggle('on');
  }

  function getPreset(o) {
    let func = o.parentElement.parentElement.id.substr(7);
    let length = o.parentElement.querySelectorAll('input').length;
    let values = Array.from(o.parentElement.querySelectorAll('input')).map(e => parseFloat(e.value || 0));
    console.log(func);
    console.log(length);
    console.log(values);
    console.log(this);
    if (length == values.length) {
      let ret = FuncObjs[func].apply(null, values);
      console.log(ret);
    } else {
      ipcRenderer.send('alert', { title: "알림", message: "유효하지 않은 값입니다." });
    }
  }

  return { getHTML: getHTML, togglePreset: togglePreset, getPreset: getPreset };
})();
addOnOccured(() => { Tool.initPresets() });
