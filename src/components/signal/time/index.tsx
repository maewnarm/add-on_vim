import React from "react";

type IntervalTypes = {
  operation: string;
  interval: string;
  stdTime: number;
};

const intervalData: IntervalTypes[] = [
  {
    operation: "Change Cutting Tool",
    interval: "1 / 50 pcs.",
    stdTime: 180,
  },
  {
    operation: "Cleaning",
    interval: "1 / 200 pcs.",
    stdTime: 60,
  },
  {
    operation: "Supply Material",
    interval: "1 / 500 pcs.",
    stdTime: 240,
  },
];

const TimeInterface = () => {
  return (
    <div className="time-interface">
      <div className="table-wrapper custom-scrollbar">
        <table>
          <thead>
            <tr>
              <th>Operation</th>
              <th>Interval</th>
              <th>Standard time (s.)</th>
            </tr>
          </thead>
          <tbody>
            {intervalData.map((data) => (
              <tr>
                <td className="body__operation">{data.operation}</td>
                <td className="body__interval">{data.interval}</td>
                <td className="body__stdtime">{data.stdTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeInterface;
