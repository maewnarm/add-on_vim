import React, { useEffect } from "react";
import { intervalCategory, OperationContext } from "../operation/operation";

export type IntervalTypes = {
  operation: string;
  interval: number;
  stdTime: number;
};

const TimeInterface = () => {
  const { intervalData } = React.useContext(OperationContext);

  return (
    <div className="time-interface custom-scrollbar">
      <div className="time-interface__wrapper">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Category</th>
              <th>Operation</th>
              <th>Interval</th>
              <th>Std. time (s.)</th>
            </tr>
          </thead>
          <tbody>
            {intervalCategory.map((cat, idxCategory) =>
              intervalData[idxCategory]?.map((data, idxData, arr) => (
                <tr key={`${idxCategory}-${idxData}`}>
                  <td>{idxData + 1}</td>
                  <td rowSpan={arr.length} className="body__category">
                    {cat}
                  </td>
                  <td className="body__operation">{data.operation}</td>
                  <td className="body__interval">{`1 / ${data.interval} pcs.`}</td>
                  <td className="body__stdtime">{data.stdTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeInterface;
