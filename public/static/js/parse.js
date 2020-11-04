var psd = require('psd');

const parser = (() => {
  let cvs = document.createElement('canvas');
  let ctx = cvs.getContext('2d');
  var _psd = null;
  var totalLoad = 0;
  var totalCount = 0;
  var idIndex = 0;
  const parseImage = (png, width, height) => {
    cvs.width = width;
    cvs.height = height;
    ctx.clearRect(0, 0, width, height);
    let img = ctx.createImageData(width, height);
    img.data.set(png.data);
    ctx.putImageData(img, 0, 0);
    return cvs.toDataURL('image/png');
  };
  const toDataImage = (image, kImage, m) => {
    cvs.width = image.width;
    cvs.height = image.height;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.drawImage(image, 0, 0);
    let img = new Image();
    img.onload = () => {
      totalLoad++;
      kImage.image(img);
      Object.keys(m.attrs).forEach(attr => {
        console.log(attr + " : " + m.attrs[attr]);
        if (attr == "visible" && m.attrs[attr] == null)
          m.attrs[attr] = true;
        kImage[attr](m.attrs[attr])
      });
      image = null;
    }
    img.src = cvs.toDataURL('image/png');
  }
  const parse = (path) => {
    _psd = psd.fromFile(path);
    _psd.parse();
    console.log(_psd);
    totalLoad = totalCount = idIndex = 0;
    return {
      size: { width: _psd.image.width(), height: _psd.image.height() },
      group: parseChilds(_psd.tree(), ''),
    };
  };
  const parseJson = (dir, data) => {
    totalLoad = totalCount = idIndex = 0;
    console.log('data');
    console.log(data);
    return {
      size: data.size,
      group: parseJsonMap(dir, data.map),
      name: data.name,
      flow: data.flow
    }
  }
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
      kImage.id('obj-' + getDateAsHex() + idIndex++);
      kImage.image(image);
      kImage.name(name);
      kImage.opacity(opacity);
      kImage.visible(visible);
      kImage.x(kImage.x() + kImage.width() / 2);
      kImage.y(kImage.y() + kImage.height() / 2);
      kImage.offset({ x: kImage.width() / 2, y: kImage.height() / 2 });
    };
    image.src = imageURL;
    return kImage;
  }
  function parseChilds(from, hier, grp) {
    let childs = from._children;
    let i = 0;
    let group = grp || new Konva.Group();
    // const p = confirm('Parse Group as one layer?');
    p = true;
    group.name(escape(from.name) || '이름없음');

    for (const child of childs.reverse()) {
      if (child.constructor.name === 'Group' && !p) {
        // Group
        let childGroup = parseChilds(child, '--' + hier, group);

        // group.add(childGroup);
      } else {
        // Layer
        let lay = child.layer;
        let n = escape(child.name);
        let t = child.top;
        let l = child.left;
        let w = child.width;
        let h = child.height;
        let o = lay.opacity / 255;
        let v = lay.visible;
        let png = lay.image.toPng();
        let imageURL = parseImage(png, w, h);
        let image = convertImage(imageURL, l, t, n, o, v);
        group.add(image);
      }
    }
    return group;
  }

  function parseJsonMap(dir, map) {
    let group = new Konva.Group();
    map.forEach(m => {
      let iPath = dir + m.path;
      console.log(iPath);
      let image = new Image();
      let kImage = new Konva.Image({ listening: false, });
      totalCount++;
      image.onload = async function () {
        toDataImage(image, kImage, m);
      };
      image.src = iPath;
      group.add(kImage);
    });
    return group;
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const waitForLoad = async function (cb) {
    while (totalLoad != totalCount) {
      await sleep(200);
      if (true) console.log(totalLoad + " / " + totalCount);
    } cb(_psd);
  };

  return { parse: parse, waitForLoad: waitForLoad, parseJson: parseJson };
})();
