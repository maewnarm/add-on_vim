import Standardized from "@/components/motion/std/standardized";
import Video from "@/components/motion/std/video";
import WIP from "@/components/motion/std/wip";
import ProjectSelector from "@/components/selector/projects";
import TimerUp from "@/components/timer/timerUp";
import { TableDataType } from "@/types/motion";
import {
  CloseCircleFilled,
  LeftOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
} from "@ant-design/icons";
import { Button, Select, Switch } from "antd";
import React, { useMemo, useState, useEffect, useContext } from "react";
import { useRef } from "react";

// TODO render video focus outline operation

const defaultMotionContext = {
  tableData: [] as TableDataType[][],
  count: 0,
  step: [0],
  // stepCount: [0],
  timerState: [false, false, false, false],
  playbackRate: 1,
  setCountFunction: (value: number) => {},
  setStepFunction: (id: number, value: number) => {},
  // setStepCountFunction: (id: number, value: number) => {},
  setTimerStateFunction: (id: number, value: boolean[]) => {},
  setPlaybackRateFunction: (value: number) => {},
  playVideoFunction: (id: number) => {},
  pauseVideoFunction: (id: number) => {},
  resetVideoFunction: (id: number) => {},
  setPlayVideoFunctions: (id: number, func: () => void) => {},
  setPauseVideoFunctions: (id: number, func: () => void) => {},
  setResetVideoFunctions: (id: number, func: () => void) => {},
};

export const MotionContext = React.createContext(defaultMotionContext);

const Motion = () => {
  const [projectName, setProjectName] = useState("");
  const [count, setCount] = useState(0);
  const [step, setStep] = useState<number[]>([0, 0]);
  const [tableData, setTableData] = useState<TableDataType[][]>([]);
  // const [stepCount, setStepCount] = useState<number[]>([0, 0]);
  // timerState = [play,pause,stop,end]
  const [timerState, setTimerState] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoop, setIsLoop] = useState(false);
  const [wip, setWip] = useState<number[]>([0]);
  const playVideo = useRef([() => {}]);
  const pauseVideo = useRef([() => {}]);
  const resetVideo = useRef([() => {}]);
  const context = useMemo(
    () => ({
      tableData,
      count,
      step,
      // stepCount,
      timerState,
      playbackRate,
      setCountFunction,
      setStepFunction,
      // setStepCountFunction,
      setTimerStateFunction,
      setPlaybackRateFunction,
      playVideoFunction,
      pauseVideoFunction,
      resetVideoFunction,
      setPlayVideoFunctions,
      setPauseVideoFunctions,
      setResetVideoFunctions,
    }),
    [tableData, count, step, timerState, playbackRate, playVideo, resetVideo]
  );

  const loadTableData = async () => {
    await fetch(`/api/static/get?filePath=static_standardized.json`).then(
      async (res) => {
        const data = JSON.parse(await res.json());
        setTableData(data[projectName] || []);
      }
    );
  };

  function setCountFunction(value: number) {
    setCount(value);
  }

  function setStepFunction(id: number, value: number) {
    const newValue = [...step];
    newValue[id] = value;
    setStep(newValue);
  }

  // function setStepCountFunction(id: number, value: number) {
  //   const newValue = [...stepCount];
  //   newValue[id] = value;
  //   setStepCount(newValue);
  // }

  function setTimerStateFunction(id: number, value: boolean[]) {
    // const newValue = [...timerState]
    // newValue[id] = value
    // setTimerState(newValue);
    setTimerState(value);
  }

  function setPlaybackRateFunction(value: number) {
    setPlaybackRate(value);
  }

  function startTimerCountup() {
    // let newValue = [...timerState]
    // newValue = newValue.map(()=>[true, false, false, false])
    // setTimerState(newValue);
    setTimerState([true, false, false, false]);
  }

  function pauseTimerCountup() {
    // let newValue = [...timerState]
    // newValue = newValue.map(() => [false, true, false, false])
    // setTimerState(newValue);
    setTimerState([false, true, false, false]);
  }

  function stopTimerCountup() {
    // let newValue = [...timerState]
    // newValue = newValue.map(() => [false, false, true, false])
    // setTimerState(newValue);
    setTimerState([false, false, true, false]);
  }

  function playVideoFunction(id: number) {
    playVideo.current[id]();
  }

  function pauseVideoFunction(id: number) {
    pauseVideo.current[id]();
  }

  function resetVideoFunction(id: number) {
    resetVideo.current[id]();
  }

  function setPlayVideoFunctions(id: number, func: () => void) {
    playVideo.current[id] = func;
  }

  function setPauseVideoFunctions(id: number, func: () => void) {
    pauseVideo.current[id] = func;
  }

  function setResetVideoFunctions(id: number, func: () => void) {
    resetVideo.current[id] = func;
  }

  function setWipFunction(id: number, increment: number) {
    // console.log("set wip", wip);
    const newWip = [...wip];
    newWip[id] += increment;
    // console.log("newWip", newWip);
    setWip(newWip);
  }

  const triggerLoop = () => {
    setIsLoop(!isLoop);
  };

  useEffect(() => {
    loadTableData();
  }, [projectName]);

  useEffect(() => {
    console.log(tableData);
  }, [tableData]);

  return (
    <MotionContext.Provider value={context}>
      <div className="main motion">
        <div className="sub-header sub-header-1">
          <span>{"Lean Cardboard   +   e-Motion"}</span>
        </div>
        <div className="sub-header sub-header-2">
          <span>{"(Human + Karakuri + Automation)"}</span>
        </div>
        <div className="motion__operation">
          <div className="signal__project">
            [Project :
            <ProjectSelector set={setProjectName} />]
          </div>
          <TimerUp
            intervalTime_ms={100}
            start={timerState[0]}
            pause={timerState[1] || timerState[2]}
          />
          <Button
            type="ghost"
            shape="round"
            icon={<PlayCircleFilled />}
            onClick={() => startTimerCountup()}
            disabled={timerState[0]}
          >
            start
          </Button>
          <Button
            type="ghost"
            shape="round"
            icon={<PauseCircleFilled />}
            onClick={() => pauseTimerCountup()}
            disabled={!timerState[0]}
          >
            pause
          </Button>
          <Button
            type="ghost"
            shape="round"
            icon={<CloseCircleFilled />}
            onClick={() => stopTimerCountup()}
            disabled={!timerState[0]}
          >
            stop
          </Button>
          <Switch
            checkedChildren="loop on"
            unCheckedChildren="loop off"
            checked={isLoop}
            onChange={triggerLoop}
          />
        </div>
        <div className="motion__wrapper custom-scrollbar">
          <div className="motion__std custom-scrollbar">
            <div className="motion__std__stdized">
              <p>Standardized</p>
              <div className="motion__std__stdized__inner">
                <div className="motion__std__stdized__inner__element">
                  <Standardized
                    key={0}
                    id={0}
                    name={"Add-on"}
                    timerState={timerState}
                    isLoop={isLoop}
                    wipAddAt={"end"}
                    wipAddId={0}
                    wipAddIncrement={1}
                    setWipFunction={setWipFunction}
                    setWipAfterStep={7}
                    setWipAfterStepDelaySecond={0.2}
                  />
                </div>
                <div className="motion__std__stdized__inner__element">
                  <Standardized
                    key={1}
                    id={1}
                    name={"OP1"}
                    timerState={timerState}
                    isLoop={isLoop}
                    referencedWipCount={wip[0]}
                    wipRemoveAt={"start"}
                    wipRemoveId={0}
                    wipRemoveIncrement={-1}
                    setWipFunction={setWipFunction}
                  />
                </div>
                <div className="motion__std__stdized__inner__element">
                  <Standardized
                    key={2}
                    id={2}
                    name={"Outline"}
                    timerState={timerState}
                    isLoop={isLoop}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="motion__divider" />
          <div className="motion__virtual">
            <div className="motion__virtual__video">
              <Video
                id={1}
                name={"OP1"}
                src="/videos/OP1.mp4"
                playbackRate={playbackRate}
              ></Video>
              <Video
                id={0}
                name={"Add-on"}
                src="/videos/Add-on.mp4"
                playbackRate={playbackRate}
              >
                <WIP id={0} amount={wip} style={{ top: "37%", left: -30 }} />
              </Video>
              <Video
                id={2}
                name={"OP1"}
                src="/videos/OP1.mp4"
                playbackRate={playbackRate}
              ></Video>
              {/* TODO add video outline */}
            </div>
          </div>
        </div>
      </div>
    </MotionContext.Provider>
  );
};

export default Motion;
