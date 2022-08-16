import React from "react";

interface WIPProps {
  id: number;
  amount: number[];
  style?: React.CSSProperties;
}

const WIP: React.FC<WIPProps> = (props) => {
  const { id, amount, style } = props;

  return (
    <div className="wip" style={style}>
      <div className="wip__wrapper">
        <p className="wip__wrapper__amount">{amount[id] || 0}</p>
        <p>WIP</p>
      </div>
    </div>
  );
};

export default WIP;
