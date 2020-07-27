import { useState, useEffect } from 'react';

const Layer = (props) => {
  return (<div id={props.layerId}>
    <img src="" />
    <p>{props.text}</p>
  </div>);
};

export default Layer;
