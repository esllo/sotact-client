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
