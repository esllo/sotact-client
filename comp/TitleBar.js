/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled';

const Titlebar = styled.div((props) => ({
  display: 'flex',
  height: '30px',
  justifyContent: 'space-between',
  label: 'flex-box',
}));
const Menubar = styled.div((props) => ({
  lineHeight: '30px',
  fontSize: '13px',
  userSelect: 'none',
  zIndex: 3,
}));
const menuBar = css`
  p {
    padding: 0 6px;
    display: inline-block;
    cursor: default;
    color: #ececec;
    :hover{
      background: rgba(200, 200, 200, 0.2);
    }
  }
`;
const Title = styled.p((props) => ({
  position: 'absolute',
  width: '100%',
  textAlign: 'center',
  lineHeight: '30px',
  fontSize: '13px',
  userSelect: 'none',
  color: '#ececec',
}));
const buttons = css`
  width: 138px;
  display: flex;
  div {
    mask-size: 23.1% !important;
    flex: 1;
  }
`;
const buttonBase = css`
  width: 100%;
  height: 100%;
  opacity: 0.7;
  background: #ccc;
  :hover {
    background: #fff;
  }
`;
const buttonMinimize = css`
  :hover {
    background: rgba(200, 200, 200, 0.1);
  }
  div {
    mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E")
      no-repeat 50% 50%;
    ${buttonBase};
  }
`;
const buttonMaximize = css`
  :hover {
    background: rgba(200, 200, 200, 0.1);
  }
  div {
    mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E")
      no-repeat 50% 50%;
    ${buttonBase};
  }
`;
const buttonClose = css`
  :hover {
    background: #cf261d;
  }
  div {
    mask: url("data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E")
      no-repeat 50% 50%;
    ${buttonBase};
  }
`;
const DragArea = styled.div((props) => ({
  width: '100%',
  height: '30px',
  position: 'absolute',
  left: 0,
  top: 0,
}));
const draggable = css`
  -webkit-app-region: drag;
  -webkit-user-select: none;
`;
const nonDraggable = css`
  position: absolute;
  top: 0;
  left: 0;
  -webkit-app-region: no-drag;
`;
const leftNonDrag = css`
  ${nonDraggable};
  width: 2px;
  height: 30px;
  zindex: 999;
`;
const rightNonDrag = css`
  ${nonDraggable};
  right: 0;
  width: 2px;
  height: 30px;
  zindex: 999;
`;
const topNonDrag = css`
  ${nonDraggable};
  width: 100%;
  height: 2px;
  zindex: 999;
`;

const TitleBar = (props) => {
  const getBackground = () => {
    let color = props.color || '#313131';
    return color;
  };
  const callWindowEvent = (c) => {
    return function(){
      windowEvent(c);
    }
  }
  return (
    <Titlebar style={{ background: getBackground() }}>
      <Menubar css={menuBar}>
        <img src="" />
        <p>File</p>
        <p>Edit</p>
        <p>View</p>
        <p>Window</p>
        <p>Help</p>
      </Menubar>
      <div style={{ flex: 1 }} css={draggable}></div>
      <Title>TAW - Canvas Animate Tool</Title>
      <div css={buttons}>
        <div onClick={callWindowEvent(2)} css={buttonMinimize}>
          <div></div>
        </div>
        <div onClick={callWindowEvent(1)} css={buttonMaximize}>
          <div></div>
        </div>
        <div onClick={callWindowEvent(0)} css={buttonClose}>
          <div></div>
        </div>
      </div>
      <div css={leftNonDrag}></div>
      <div css={topNonDrag}></div>
      <div css={rightNonDrag}></div>
    </Titlebar>
  );
};
export default TitleBar;
