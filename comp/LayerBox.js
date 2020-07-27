import { useState, useEffect } from 'react';
import Layer from 'Layer';

const LayerBox = (props) => {
  const [hier, setHier] = useState([]);

  return (
    <div className="layer_group">
      {hier.map((value, index) => {
        <Layer ></Layer>;
      })}
    </div>
  );
};

export default LayerBox;
