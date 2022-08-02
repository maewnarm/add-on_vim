import TimerUp from "@/components/timer/timerup";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import StdTable from "./table";
import StdTimechart from "./timechart";

interface StandardizedProps {
  id: number
}

export type TableDataType = {
  operation: string;
  HT: number;
  MT: number;
  WT: number;
};

const tableData: TableDataType[] = [
  {
    operation: "(R) Pick work from roller, set to Welding m/c",
    HT: 1.0,
    MT: 0,
    WT: 0,
  },
  { operation: "(L) Pick work from Welding m/c", HT: 0.8, MT: 0, WT: 0 },
  { operation: "(R) Push nagara switch Welding m/c", HT: 0.9, MT: 18.0, WT: 0 },
  { operation: "(R+L) Appearance check welding point", HT: 2.9, MT: 0, WT: 0 },
  {
    operation: "(L) Pickw ork from Brushing m/c, place on roller",
    HT: 0.9,
    MT: 0,
    WT: 0,
  },
  {
    operation: "(R) Set work to Brushing m/c, push nagara switch",
    HT: 1.0,
    MT: 0,
    WT: 0,
  },
  {
    operation: "(R) Pick stator core from box, appearance core sheet",
    HT: 2.8,
    MT: 0,
    WT: 0,
  },
  {
    operation:
      "(L) Pick work from jig, (R) Set stator core to pallet, push nagara switch",
    HT: 1.2,
    MT: 0,
    WT: 0,
  },
  {
    operation: "(R+L) Appearance check welding point, place on roller",
    HT: 2.3,
    MT: 0,
    WT: 0,
  },
];

const Standardized:React.FC<StandardizedProps> = ({id}) => {
  const [timerState, setTimerState] = useState([false, false, false]);
  const [highlightRow, setHighlightRow] = useState(0);

  const setHighlightPosition = (targetId: string) => {
    // const targetRow = document.getElementById(targetId);
    // if (!targetRow) return;
    const otherRows = document.getElementsByClassName("step-row");

    Array.from(otherRows).forEach((row) => {
      if (row.id !== targetId) {
        row.classList.remove("highlighted");
      } else {
        row.classList.add("highlighted");
      }
    });
  };

  const startTimerCountup = () => {
    setTimerState([true, false, false]);
  };

  const pauseTimerCountup = () => {
    setTimerState([false, true, false]);
  };

  const stopTimerCountup = () => {
    setTimerState([false, false, true]);
  };

  const setHighlightStep = (step: number) => {
    console.log("set highlightstep");
    setHighlightRow(step);
  };

  useEffect(() => {
    if (highlightRow === 0) return;
    setHighlightPosition(`row-${highlightRow}`);
  }, [highlightRow]);

  // TODO catch count up value
  // TODO create condition to change timechart data (confirm performance)

  return (
    <div className="standardized custom-scrollbar">
      <div className="standardized__header">
        <p>OP1</p>
        <TimerUp
          intervalTime_ms={100}
          start={timerState[0]}
          pause={timerState[1]}
          stop={timerState[2]}
          targetSecond={13.8}
          targetStepSecond={tableData.map((step) => step.HT)}
          stopFunction={stopTimerCountup}
          setStepFunction={setHighlightStep}
          showTimer={true}
        />
        <Button onClick={() => startTimerCountup()} disabled={timerState[0]}>
          start
        </Button>
        <Button onClick={() => pauseTimerCountup()} disabled={!timerState[0]}>
          pause
        </Button>
        <Button onClick={() => stopTimerCountup()} disabled={!timerState[0]}>
          stop
        </Button>
      </div>
      <div className="standardized__table">
        <StdTable tableData={tableData} />
      </div>
      <div className="standardized__timechart">
        <StdTimechart
          id={id}
          stdData={tableData.map((step,idx) => ({
            index: idx,
            name: step.operation,
            value: step.HT,
          }))}
        />
      </div>
    </div>
  );
};

export default Standardized;
