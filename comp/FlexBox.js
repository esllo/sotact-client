import styled from '@emotion/styled';
import { useEffect } from 'react';

const Flex = styled.div((props) => ({
  display: 'flex',
  flexDirection: props.dir || 'column',
  minWidth: props.minWidth,
  minHeight: props.minHeight,
  flex: props.weight || 'none',
  label: 'flex-box',
}));

const FlexBox = (props) => {
  const compID = 'flexbox-' + FlexBox.compID++;
  useEffect(() => {
    const parent = document.getElementById(compID);
    const splits = parent.querySelectorAll(':scope > .split');
    const childs = parent.querySelectorAll(':scope > .child');
    for (let child of childs) {
      let width = parseFloat(computeSize(child).width);
      width /= getParentWidth(child.parentElement);
      child.style.width = width * 100 + '%';
    }
    function computeSize(elem) {
      let prop = window.getComputedStyle(elem, null);
      return {
        width: prop.width,
        height: prop.height,
        minWidth: prop.minWidth,
      };
    }
    function computeCursor(elem) {
      return window.getComputedStyle(elem, null).cursor;
    }
    function getParentWidth(elem) {
      let prop = window.getComputedStyle(elem, null);
      return parseFloat(prop.width);
    }
    let tmpWidth = [];
    let startX = 0;
    let resizeTarget = [];
    let maxWidth = 0;
    let minWidth = 0;
    function resize(e) {
      endX = e.x;
      let width = [tmpWidth[0] + endX - startX, tmpWidth[1] - endX + startX];
      if (width[0] < minWidth || width[0] > maxWidth) return;
      pWidth = getParentWidth(e.target.parentElement);
      resizeTarget[0].style.width = (width[0] / pWidth) * 100.0 + '%';
      resizeTarget[1].style.width = (width[1] / pWidth) * 100.0 + '%';
    }
    for (const split of splits) {
      split.addEventListener('mousedown', (e) => {
        resizeTarget = [
          e.target.previousElementSibling,
          e.target.nextElementSibling,
        ];
        let size = [computeSize(resizeTarget[0]), computeSize(resizeTarget[1])];
        tmpWidth = [parseFloat(size[0].width), parseFloat(size[1].width)];
        minWidth = parseFloat(size[0].minWidth);
        maxWidth = tmpWidth[0] + tmpWidth[1] - parseFloat(size[1].minWidth);
        startX = e.x;
        document.body.style.cursor = computeCursor(e.target);
        document.addEventListener('mousemove', resize);
      });
    }
    document.addEventListener('mouseup', () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', resize);
    }); 
  }, []);
  return (
    <Flex
      id={compID}
      dir={props.dir || 'column'}
      minWidth={props.minWidth || '60px'}
      minHeight={props.minHeight || '60px'}
      style={props.style}
      weight={props.weight}>
      {props.children}
    </Flex>
  );
};
FlexBox.compID = 1;

export default FlexBox;
