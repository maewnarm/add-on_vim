import TimeCatcher from "@/components/timer/timeCatcher";
import { MotionContext } from "@/pages/motion";
import { ClockCircleFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import StdTable from "./table";
import StdTimechart from "./timechart";

interface StandardizedProps {
  id: number;
  name: string;
  timerState: boolean[];
  disableVideo: boolean;
  isLoop: boolean;
  referencedWipCount?: number;
  wipAddAt?: "start" | "end";
  wipAddId?: number;
  wipAddIncrement?: number;
  wipRemoveAt?: "start" | "end";
  wipRemoveId?: number;
  wipRemoveIncrement?: number;
  setWipFunction?: (id: number, increment: number) => void;
  setWipAfterStep?: number;
  setWipAfterStepDelaySecond?: number;
}

const Standardized: React.FC<StandardizedProps> = (props) => {
  const {
    id,
    name,
    timerState,
    disableVideo,
    isLoop,
    referencedWipCount,
    wipAddAt,
    wipAddId,
    wipAddIncrement,
    wipRemoveAt,
    wipRemoveId,
    wipRemoveIncrement,
    setWipFunction,
    setWipAfterStep,
    setWipAfterStepDelaySecond,
  } = props;
  // console.log(props)
  const { tableData } = React.useContext(MotionContext);
  const [highlightRow, setHighlightRow] = useState(0);
  const [subCount, setSubCount] = useState(0);
  const [targetCT, setTargetCT] = useState(0);

  const setHighlightPosition = (targetId: string) => {
    const rows = document.getElementsByClassName(`step-row-${id}`);

    Array.from(rows).forEach((row) => {
      if (row.id !== targetId) {
        row.classList.remove("highlighted");
      } else {
        row.classList.add("highlighted");
        // row.scrollIntoView();
      }
    });
  };

  const setHighlightStep = (step: number) => {
    setHighlightRow(step);
  };

  function setSubCountFunction(value: number) {
    setSubCount(value);
  }

  useEffect(() => {
    setTargetCT(
      tableData[id]?.reduce((acc, data) => acc + data.HT, 0) || 0)
  }, [tableData])

  useEffect(() => {
    // if (highlightRow === 0) return;
    setHighlightPosition(`row-${id}-${highlightRow}`);
  }, [highlightRow]);

  return (
    <div className="standardized">
      <div className="standardized__header">
        <p>{name}</p>
        <ClockCircleFilled />
        <TimeCatcher
          key={id}
          id={id}
          intervalTime_ms={100}
          disableVideo={disableVideo}
          start={timerState[0]}
          pause={timerState[1]}
          stop={timerState[2]}
          end={timerState[3]}
          loop={isLoop}
          targetSecond={targetCT}
          targetStepSecond={tableData[id]?.map((step) => step.HT || 0)}
          referencedCounter={referencedWipCount}
          startCounterId={
            wipAddAt === "start"
              ? wipAddId
              : wipRemoveAt === "start"
                ? wipRemoveId
                : undefined
          }
          startCounterIncrement={
            wipAddAt === "start"
              ? wipAddIncrement
              : wipRemoveAt === "start"
                ? wipRemoveIncrement
                : undefined
          }
          endCounterId={
            wipAddAt === "end"
              ? wipAddId
              : wipRemoveAt === "end"
                ? wipRemoveId
                : undefined
          }
          endCounterIncrement={
            wipAddAt === "end"
              ? wipAddIncrement
              : wipRemoveAt === "end"
                ? wipRemoveIncrement
                : undefined
          }
          outputFunction={setWipFunction}
          trigOutputAfterStep={setWipAfterStep}
          trigOutputAfterStepDelaySecond={setWipAfterStepDelaySecond}
          setHighlightStepFunction={setHighlightStep}
          setSubCountFunction={setSubCountFunction}
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
          subCount={subCount}
          targetSecond={targetCT}
          stdData={tableData[id]?.map((step, idx) => ({
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
