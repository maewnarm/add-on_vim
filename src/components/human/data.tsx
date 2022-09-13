import { HumanContext } from "@/pages/human";
import { min } from "@antv/util";
import React, { useState, useEffect, useContext } from "react";

interface ResultDataProps {
  indexData: number;
}

type SumDataType = {
  [key: string]: number | string;
};

const defaultSumData = {
  "Average HT": 0,
  "Max difference": 0,
  "Most over Std. step": "",
  "Most under Std. step": "",
};

const ResultData: React.FC<ResultDataProps> = (props) => {
  const { indexData } = props;
  const { tableData, resultData, setOverIndex, setUnderIndex } =
    useContext(HumanContext);
  const [sumData, setSumData] = useState<SumDataType>(defaultSumData);

  function sumDataTd() {
    if (!sumData) return <></>;

    return Object.entries(sumData).map(([key, val], idx) => (
      <tr key={idx}>
        <td>{key}</td>
        <td>{typeof val === "number" ? val.toFixed(1) : val}</td>
      </tr>
    ));
  }

  useEffect(() => {
    // calculate result data to summary data
    let sumAverage: number[] = [];
    let totalAverage = 0;
    let maxDiffTime = 0;
    let minDiffTime = 0;
    let mostOver = "";
    let mostUnder = "";
    let overIndex = [0, 0];
    let underIndex = [0, 0];
    const std = tableData[indexData]?.map((data) => data.HT);
    resultData.forEach((trialResult, trialIndex) => {
      let sum = 0;
      trialResult.every((val, stepIndex) => {
        if (val === 0) return false;

        const dif = val - std[stepIndex];
        if (dif > maxDiffTime) {
          maxDiffTime = dif;
          mostOver = `#${trialIndex + 1} / Step ${stepIndex + 1}`;
          overIndex = [trialIndex + 1, stepIndex + 1];
        }
        if (dif < minDiffTime) {
          minDiffTime = dif;
          mostUnder = `#${trialIndex + 1} / Step ${stepIndex + 1}`;
          underIndex = [trialIndex + 1, stepIndex + 1];
        }
        sum += val;

        return true;
      });
      const sumInTrial = trialResult.reduce((sum, cur) => sum + cur, 0);
      if (sumInTrial > 0) {
        sumAverage.push(sumInTrial);
      }
    });
    totalAverage =
      sumAverage.reduce((sum, cur) => sum + cur, 0) / sumAverage.length || 0;

    setSumData({
      "Average HT": totalAverage,
      "Max difference": maxDiffTime,
      "Most over Std. step": mostOver,
      "Most under Std. step": mostUnder,
    });
    setOverIndex(overIndex);
    setUnderIndex(underIndex);
  }, [tableData, resultData]);

  return (
    <div className="human__result__data">
      <p>Summary data</p>
      <div className="human__result__data__sum">
        <table>
          <tbody>{sumDataTd()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultData;
