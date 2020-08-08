var psd = require('psd');

const parser = (() => {
  let cvs = document.createElement('canvas');
  let ctx = cvs.getContext('2d');
  var totalLoad = 0;
  var totalCount = 0;
  const parseImage = (png, width, height) => {
    cvs.width = width;
    cvs.height = height;
    ctx.clearRect(0, 0, width, height);
    let img = ctx.createImageData(width, height);
    img.data.set(png.data);
    ctx.putImageData(img, 0, 0);
    return cvs.toDataURL('image/png');
  };
  const parse = (path) => {
    let ctx = psd.fromFile(path);
    ctx.parse();
    console.log(ctx);
    totalLoad = totalCount = 0;
    return parseChilds(ctx.tree(), '');
  };
  function convertImage(imageURL, l, t, name, opacity, visible) {
    let image = new Image();
    let kImage = new Konva.Image({
      x: l,
      y: t,
      listening: false,
    });
    totalCount++;
    image.onload = async function () {
      totalLoad++;
      kImage.image(image);
      kImage.name(name);
      kImage.opacity(opacity);
      kImage.visible(visible);
      console.log('L:' + totalLoad + ' / ' + totalCount);
    };
    image.src = imageURL;
    return kImage;
  }
  function parseChilds(from, hier) {
    let childs = from._children;
    let i = 0;
    let group = new Konva.Group();
    group.name(escape(from.name) || '이름없음');
    for (const child of childs.reverse()) {
      console.log(hier + ' ' + ++i + ' / ' + childs.length);
      if (child.constructor.name === 'Group') {
        // Group
        let childGroup = parseChilds(child, '--' + hier);
        group.add(childGroup);
      } else {
        // Layer
        let lay = child.layer;
        let n = escape(child.name);
        let t = child.top;
        let l = child.left;
        let w = child.width;
        let h = child.height;
        let o = lay.opacity;
        let v = lay.visible;
        let png = lay.image.toPng();
        let imageURL = parseImage(png, w, h);
        let image = convertImage(imageURL, l, t, n, o, v);
        group.add(image);
      }
    }
    return group;
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const waitForLoad = async function (cb) {
    while (totalLoad != totalCount) await sleep(50);
    cb();
  };

  return { parse: parse, waitForLoad: waitForLoad };
})();
