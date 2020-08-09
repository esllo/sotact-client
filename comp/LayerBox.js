import { useState, useEffect } from 'react';
import Layer from 'Layer';

const LayerBox = (props) => {
  const [hier, setHier] = useState([]);
  useEffect(() => {
    window.setHier = setHier;
  });
  const parseHier = (val, str) => {
    val.map((value, index) => {
      if (Array.isArray(value)) {
        return parseHier(value, str + "-" + index);
      } else {
        return (<Layer id={str + "-" + index} layerId="" text="" />);
      }
    })
  }

  return (
    <div className="layer_group">
      {parseHier(hier, "layer-group")}
    </div>
  );
};

export default LayerBox;
