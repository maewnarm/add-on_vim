import React,{useEffect} from "react";
import { OperationContext } from "../operation/operation";

export type IntervalTypes = {
  operation: string;
  interval: string;
  intervalNumber: number
  stdTime: number;
};

const demoIntervalData: IntervalTypes[] = [
  {
    operation: "Change Cutting Tool",
    interval: "1 / 5 pcs.",
    intervalNumber: 5,
    stdTime: 180,
  },
  {
    operation: "Cleaning",
    interval: "1 / 10 pcs.",
    intervalNumber: 10,
    stdTime: 60,
  },
  {
    operation: "Supply Material",
    interval: "1 / 20 pcs.",
    intervalNumber: 20,
    stdTime: 240,
  },
];

const TimeInterface = () => {
  const { intervalData, setIntervalData } = React.useContext(OperationContext);

  useEffect(() => {
    setIntervalData(demoIntervalData)
  }, [])
  

  return (
    <div className="time-interface custom-scrollbar">
      <div className="time-interface__wrapper">
        <table>
          <thead>
            <tr>
              <th>Operation</th>
              <th>Interval</th>
              <th>Standard time (s.)</th>
            </tr>
          </thead>
          <tbody>
            {intervalData.map((data, idx) => (
              <tr key={idx}>
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
