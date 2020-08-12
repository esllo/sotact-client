const TAW = (() => {
  var stg = null;
  var lay = null;
  var flow = [];
  var progress = 0;

  function setProgress(p) {
    return flow.map((fl) => {
      let from = p < fl.time[fl.index] ? 0 : fl.index;
      let to = p < fl.time[fl.index] ? fl.index : fl.max - 1;
      if (to > fl.max - 1) to = fl.max - 1;
      for (fl.index = from; fl.index < to;) {
        if (fl.time[fl.index + 1] > p) break;
        fl.index++;
      }
      let f = {};
      if (fl.index != fl.max - 1)
        for (const key of Object.keys(fl.data[fl.index])) {
          let value = fl.data[fl.index][key];
          let diffs = fl.data[fl.index + 1][key] - fl.data[fl.index][key];
          let dists = fl.time[fl.index + 1] - fl.time[fl.index];
          let prgrs = p - fl.time[fl.index];
          value += diffs * (prgrs / dists);
          fl.obj[key](value);
        }
      else {
        for (const key of Object.keys(fl.data[fl.index])) {
          f[key] = fl.data[fl.index][key];
          fl.obj[key](fl.data[fl.index][key]);
        }
      }
      lay.batchDraw();
      return f;
    });
  }

  function applyData(data) {
    flow = [];
    for (const key of Object.keys(data)) {
      let o = data[key];
      const tl = Array.from(Object.keys(o.timeline), (x) =>
        parseInt(x.substr(1))
      ).sort((a, b) => a - b);
      let i = findItem(lay, o.src);
      let df = [];
      let dt = [];
      tl.forEach((e) => df.push(o.timeline['t' + dt[dt.push(e) - 1]]));
      let ds = {
        src: o.src,
        obj: i,
        time: dt,
        data: df,
        max: Math.min(dt.length, df.length),
        index: 0,
        current: df[0],
      };
      flow.push(ds);
    }
  }

  const setStage = (stage) => (stg = stage);
  const setLayer = (layer) => (lay = layer);
  const getFlow = () => flow;

  function initFromTool() {
    setStage(Tool.getStage());
    setLayer(Tool.getPLayer());
    Tool.sortData();
    applyData(Tool.getData());
  }
  return {
    initFromTool: initFromTool,
    getFlow: getFlow,
    applyData: applyData,
    setStage: setStage,
    setLayer: setLayer,
    setProgress: setProgress,
  };
})();
