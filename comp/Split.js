/** @jsx jsx */ import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled';

const DirSplit = styled.div((props) => ({
  userSelect: 'none',
  background: '#000',
  cursor: 'ew-resize',
  label: 'flex-box-split',
}));

const Split = (props) => {
  const dir = props.dir || 'vertical';
  const _css =
    dir == 'vertical'
      ? css`
          margin-left: -3px;
          width: 3px;
        `
      : css`
          margin-top: -3px;
          height: 3px;
        `;
  return <DirSplit className={'split ' + dir} dir={dir} css={_css}></DirSplit>;
};

export default Split;
