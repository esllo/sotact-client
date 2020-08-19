/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled';

const DirSplit = styled.div((props) => ({
  userSelect: 'none',
  background: '#060607',
  label: 'flex-box-split',
  zIndex: 999,
}));

const Split = (props) => {
  const dir = props.dir || 'vertical';
  const _css =
    dir == 'vertical'
      ? css`
          margin-left: -2px;
          width: 2px;
          cursor: ew-resize;
        `
      : css`
          margin-top: -2px;
          height: 2px;
          cursor: ns-resize;
        `;
  return <DirSplit className={'split ' + dir} dir={dir} css={_css}></DirSplit>;
};

export default Split;
