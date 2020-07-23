var psd = require('psd');

(() => {
  let cvs = document.createElement('canvas');
  let ctx = cvs.getContext('2d');
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
    parseChilds(ctx.tree());
  };
  const parseChilds = (from) => {
    let childs = from._children;
    for (const child of childs.reverse()) {
      let layer = child.layer;
      let name = child.name;
      let [t, l, w, h] = [chlid.top, child.left, child.width, child.height];
      let opacity = layer.opacity;
      let visible = layer.visible;
      let png = layer.image.toPng();
      let imageURL = parseImage(png, w, h);
      let image = new Image();
      image.src = imageURL;
      image.onload = () => {
        let kImage = new Konva.Image({
          x: l,
          y: t,
          image: image,
        });
        kImage.opacity(opacity);
        kImage.visible(visible);
      };
    }
  };
  return { parse: parse };
})();
