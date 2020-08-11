// file selected
let input = byQuery('[type=file]');
if (input != null) {
  input.addEventListener('change', (e) => {
    if (e.target.value != '') {
      file = e.target.files[0];
      e.target.value = '';
      const tree = parser.parse(file.path);
      parser.waitForLoad(() => {
        Tool.addPr(tree);
        Tool.applyLayer();
        Tool.redrawAll();
      });
    }
  });
}

// window resize
window.addEventListener('resize', () => {
  let parent = Tool.getParent();
  Tool.resize(Tool.getStage(), parent.offsetWidth, parent.offsetHeight);
});

// stage scale
byID('scale').oninput = (e) => {
  let scale = parseInt(e.target.value) / 100;
  Tool.scale(Tool.getStage(), scale);
};

// timeline, predraw toggle
byID('tm_toggle').addEventListener('change', (e) => {
  Tool.toggleLayer(e.target.checked);
});

byID('tb0').onclick = Tool.startTimebar;
byID('tb1').onclick = Tool.stopTimebar;
byID('tb2').onclick = Tool.resetTimebar;

addOnOccured(() => {
  byID('xval').addEventListener('keyup', Tool.xValChanged);
  byID('yval').addEventListener('keyup', Tool.yValChanged);
  byID('rval').addEventListener('keyup', Tool.rValChanged);
  byID('oval').addEventListener('keyup', Tool.oValChanged);
  byID('tl_names').addEventListener('wheel', Tool.scrollTimeline);
  byID('tl_props').addEventListener('wheel', Tool.scrollTimeline);
});
