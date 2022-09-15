import React, { useEffect } from "react";
import { OperationContext } from "../operation/operation";

export type IntervalTypes = {
  operation: string;
  interval: number;
  stdTime: number;
};

const category = ["Setup", "Part supply", "Quality"]

const TimeInterface = () => {
  const { intervalData, setIntervalData } = React.useContext(OperationContext);

  return (
    <div className="time-interface custom-scrollbar">
      <div className="time-interface__wrapper">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Operation</th>
              <th>Interval</th>
              <th>Standard time (s.)</th>
            </tr>
          </thead>
          <tbody>
            {category.map((cat, idx) => (

              intervalData.map((data, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td className="body__operation">{data.operation}</td>
                  <td className="body__interval">{`1 / ${data.interval} pcs.`}</td>
                  <td className="body__stdtime">{data.stdTime}</td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeInterface;
