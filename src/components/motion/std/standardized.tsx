import TimerUp from "@/components/timer/timerup";
import { MotionContext } from "@/pages/motion";
import { ClockCircleFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import StdTable from "./table";
import StdTimechart from "./timechart";

interface StandardizedProps {
  id: number;
  timerState: boolean[];
  isLoop: boolean;
}

const Standardized: React.FC<StandardizedProps> = (props) => {
  const { id, timerState, isLoop } = props;
  const { tableData } = React.useContext(MotionContext);
  const [highlightRow, setHighlightRow] = useState(0);
  const [targetCT, setTargetCT] = useState(
    tableData.reduce((acc, data) => acc + data.HT, 0)
  );

  const setHighlightPosition = (targetId: string) => {
    const rows = document.getElementsByClassName("step-row");

    Array.from(rows).forEach((row) => {
      if (row.id !== targetId) {
        row.classList.remove("highlighted");
      } else {
        row.classList.add("highlighted");
        row.scrollIntoView();
      }
    });
  };

  const setHighlightStep = (step: number) => {
    setHighlightRow(step);
  };

  useEffect(() => {
    if (highlightRow === 0) return;
    setHighlightPosition(`row-${id}-${highlightRow}`);
  }, [highlightRow]);

  return (
    <div className="standardized custom-scrollbar">
      <div className="standardized__header">
        <p>OP1</p>
        <ClockCircleFilled />
        <TimerUp
          intervalTime_ms={100}
          start={timerState[0]}
          pause={timerState[1]}
          stop={timerState[2]}
          end={timerState[3]}
          loop={isLoop}
          targetSecond={targetCT}
          targetStepSecond={tableData.map((step) => step.HT)}
          setHighlightStepFunction={setHighlightStep}
          showTimer={true}
        />
      </div>
      <div className="standardized__table custom-scrollbar">
        <StdTable id={id} />
      </div>
      <div className="standardized__timechart">
        <StdTimechart
          id={id}
          intervalTime_ms={100}
          targetSecond={targetCT}
          stdData={tableData.map((step, idx) => ({
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
