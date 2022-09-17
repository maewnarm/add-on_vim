import { HumanContext } from "@/pages/human";
import { TableDataType } from "@/types/human";
import { Button, Popconfirm } from "antd";
import React, { useContext, useEffect, useState, useRef } from "react";

interface TimeTableProps {
  indexData: number;
}

const TimeTable: React.FC<TimeTableProps> = (props) => {
  const { indexData } = props;
  const {
    tableData,
    resultData,
    setResultData,
    triggerData,
    overIndex,
    underIndex,
  } = useContext(HumanContext);
  const [data, setData] = useState<TableDataType[]>([]);
  const [isRecord, setIsRecord] = useState(false);
  const trialIndex = useRef(0);
  const oldTime = useRef(0);
  const manualIndex = useRef(1);

  const clearResultData = () => {
    if (tableData.length === 0) return;

    const len = data.length;
    const emptyArray: number[][] = Array(5).fill(Array(len).fill(0));
    setResultData(emptyArray);
    trialIndex.current = 0;

    manualIndex.current = 1;
  };

  function trialResultTd(stepIndex: number) {
    // console.log(overIndex, underIndex);
    return resultData.map((res, trialIndex) => {
      let style: React.CSSProperties = {};
      // if (trialIndex === overIndex[0] - 1 && stepIndex === overIndex[1] - 1) {
      //   style = { backgroundColor: "orange" };
      // } else if (
      //   trialIndex === underIndex[0] - 1 &&
      //   stepIndex === underIndex[1] - 1
      // ) {
      //   style = { backgroundColor: "yellow" };
      // }

      if (data[stepIndex].HT < res[stepIndex]) {
        style = { backgroundColor: "#FA7070" };
      } else if (data[stepIndex].HT > res[stepIndex]) {
        style = { backgroundColor: "#C3FF99" };
      }

      return (
        <td key={`${trialIndex}-${stepIndex}`} className="result" style={style}>
          {res[stepIndex] === 0 || !!!res[stepIndex]
            ? ""
            : res[stepIndex].toFixed(1)}
        </td>
      );
    });
  }

  function trialResultSumTd() {
    return resultData.map((res, idxResult) => (
      <td key={idxResult} className="result sum">
        {res.reduce((sum, cur) => sum + cur, 0).toFixed(1)}
      </td>
    ));
  }

  useEffect(() => {
    setData(tableData[indexData] || []);
  }, [tableData, indexData]);

  useEffect(() => {
    clearResultData();
  }, [data]);

  useEffect(() => {
    // calculate to set data in resultData array
    if (!isRecord) return;
    if (!triggerData) return;
    if (trialIndex.current == 5) return;

    const step = data.length;
    const { id, time } = triggerData;
    const ts = Date.parse(time);
    if (id === 0) {
      // initial signal
      oldTime.current = ts;
    } else {
      // record result data
      const diffTime = (ts - oldTime.current) / 1000;
      // deep copy
      let result = JSON.parse(JSON.stringify(resultData));
      result[trialIndex.current][id - 1] = diffTime;
      setResultData(result);

      oldTime.current = ts;
      if (id === step) {
        trialIndex.current += 1;
      }
    }
  }, [triggerData]);

  const manualAddresult = () => {
    if (trialIndex.current == 5) return;

    const step = data.length;

    const val = Math.floor(Math.random() * 35) / 10;
    let result = JSON.parse(JSON.stringify(resultData));
    result[trialIndex.current][manualIndex.current - 1] = val;
    setResultData(result);

    if (manualIndex.current === step) {
      trialIndex.current += 1;
      manualIndex.current = 1;
    } else {
      manualIndex.current += 1;
    }
  };

  return (
    <div className="human__timetable custom-scrollbar">
      <div className="human__timetable__header">
        <div className="human__timetable__button">
          <Button
            type={isRecord ? "primary" : "default"}
            shape="round"
            onClick={() => setIsRecord(!isRecord)}
            disabled={data.length === 0}
          >
            {isRecord ? "Recording" : "Not record"}
          </Button>
          <Popconfirm
            title="Are you sure ?"
            onConfirm={clearResultData}
            okText="Yes"
            cancelText="Cancel"
          >
            <Button type="ghost" danger shape="round">
              Reset
            </Button>
          </Popconfirm>
          <Button onClick={() => manualAddresult()}>Add</Button>
        </div>
        <div className="human__timetable__guide">
          <div
            className="human__timetable__guide__marker"
            style={{ backgroundColor: "#FA7070" }}
          ></div>
          <span>Over std.</span>
          <div
            className="human__timetable__guide__marker"
            style={{ backgroundColor: "#C3FF99" }}
          ></div>
          <span>Under std.</span>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>No.</th>
            <th rowSpan={2}>Operation</th>
            <th rowSpan={2}>Std. HT</th>
            <th colSpan={5}>Trial result</th>
          </tr>
          <tr>
            <th>#1</th>
            <th>#2</th>
            <th>#3</th>
            <th>#4</th>
            <th>#5</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{data.operation}</td>
              <td>{data.HT.toFixed(1)}</td>
              {trialResultTd(idx)}
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ textAlign: "right" }}>
              Sum
            </td>
            <td className="sum">
              {data.reduce((sum, cur) => sum + cur.HT, 0).toFixed(1)}
            </td>
            {trialResultSumTd()}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;
