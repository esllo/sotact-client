import styled from '@emotion/styled';
import { useEffect } from 'react';

const Flex = styled.div((props) => ({
  display: 'flex',
  flexDirection: props.dir || 'column',
  minWidth: props.minWidth,
  minHeight: props.minHeight,
  flex: props.weight || 'none',
  label: 'flex-box',
  background: props.background,
}));

const FlexBox = (props) => {
  const compID = 'flexbox-' + FlexBox.compID++;
  useEffect(() => {
    
  }, []);
  return (
    <Flex
      id={compID}
      className={props.className}
      background={props.background || '#232323'}
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
