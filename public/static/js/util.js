function byID(i) {
  return document.getElementById(i);
}
function byClass(c) {
  return document.getElementsByClassName(c);
}
function byQuery(q) {
  return document.querySelector(q);
}
function byQuerys(q) {
  return document.querySelectorAll(q);
}
function computedStyle(e) {
  return window.getComputedStyle(e, null);
}
function createElem(t) {
  return document.createElement(t);
}
function findItem(l, i) {
  if (i.startsWith('obj-')) {
    return l.find("#" + i)[0];
  } else {
    let lh = i.substr(i.indexOf('-') + 1).split('-');
    let it = l;
    for (const h of lh) it = it.children[h];
    return it;
  }
}
var ETA = document.createElement('textarea');
function escape(text) {
  ETA.textContent = text;
  return ETA.innerHTML;
}
function concatKeys(arr1, arr2) {
  let k1 = Object.keys(arr1);
  let k2 = Object.keys(arr2);
  let arr = [...k1, ...k2];
  return arr.filter((e, i) => arr.indexOf(e) === i);
}
var df = [
  'getFullYear',
  'getMonth',
  'getDate',
  'getHours',
  'getMinutes',
  'getSeconds',
  'getMilliseconds',
];
function getFormattedDate() {
  let d = new Date();
  return (
    parseInt(df.map((e) => ((e = d[e]()) < 10 ? '0' + e : e)).join('')) +
    100000000
  )
    .toString()
    .substr(2);
}
function getDateAsHex() {
  let d = new Date();
  return (
    parseInt(df.map((e) => ((e = d[e]()) < 10 ? '0' + e : e)).join('')) +
    100000000
  )
    .toString(32)
    .substr(2);
}
function getRandomColor() {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}
function rainbow(step) {
  var r, g, b, h = step / 1000, i = ~~(h * 6), f = h * 6 - i, q = 1 - f;
  switch (i % 6) {
    case 0: r = 1; g = f; b = 0; break;
    case 1: r = q; g = 1; b = 0; break;
    case 2: r = 0; g = 1; b = f; break;
    case 3: r = 0; g = q; b = 1; break;
    case 4: r = f; g = 0; b = 1; break;
    case 5: r = 1; g = 0; b = q; break;
  }
  return "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
}