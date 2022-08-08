import React from "react";

interface WIPProps {
  id: number;
  amount: number;
  style?: React.CSSProperties
}

const WIP: React.FC<WIPProps> = (props) => {
  const { id,amount,style } = props;

  return (
    <div className="wip" style={style}>
      <p>
        <span>WIP = </span>
        <span className="wip__amount">{amount}</span>
      </p>
    </div>
  );
};

export default WIP;
