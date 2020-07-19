import styled from '@emotion/styled';

const Flex = styled.div(props => ({
  display: 'flex',
  flexDirection: props.dir,
  label: 'flex-box'
}));

const FlexBox = (props) => {
  return (
    <Flex dir={props.dir || 'column'}>
      {props.children}
    </Flex>
  );
};

export default FlexBox;
