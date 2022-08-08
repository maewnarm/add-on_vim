import Standardized from "@/components/motion/std/standardized";
import Video from "@/components/motion/std/video";
import WIP from "@/components/motion/std/wip";
import {
  CloseCircleFilled,
  LeftOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
} from "@ant-design/icons";
import { Button, Switch } from "antd";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { useRef } from "react";

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
    operation: "(L) Pick work from Brushing m/c, place on roller",
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

const defaultMotionContext = {
  tableData: tableData,
  count: 0,
  step: 0,
  stepCount: 0,
  timerState: [false, false, false, false],
  playbackRate: 1,
  setCountFunction: (value: number) => {},
  setStepFunction: (value: number) => {},
  setStepCountFunction: (value: number) => {},
  setTimerStateFunction: (value: boolean[]) => {},
  setPlaybackRateFunction: (value: number) => {},
  resetVideoFunction: () => {},
  setResetVideoFunction: (func: () => void) => {},
};

export const MotionContext = React.createContext(defaultMotionContext);

const Motion = () => {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [stepCount, setStepCount] = useState(0);
  // timerState = [play,pause,stop,end]
  const [timerState, setTimerState] = useState([false, false, false, false]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoop, setIsLoop] = useState(false);
  const resetVideo = useRef(() => {});
  const context = useMemo(
    () => ({
      tableData,
      count,
      step,
      stepCount,
      timerState,
      playbackRate,
      setCountFunction,
      setStepFunction,
      setStepCountFunction,
      setTimerStateFunction,
      setPlaybackRateFunction,
      resetVideoFunction,
      setResetVideoFunction,
    }),
    [count, step, stepCount, timerState, playbackRate]
  );

  function setCountFunction(value: number) {
    setCount(value);
  }

  function setStepFunction(value: number) {
    setStep(value);
  }

  function setStepCountFunction(value: number) {
    setStepCount(value);
  }

  function setTimerStateFunction(value: boolean[]) {
    setTimerState(value);
  }

  function setPlaybackRateFunction(value: number) {
    setPlaybackRate(value);
  }

  function startTimerCountup() {
    setTimerState([true, false, false, false]);
  }

  function pauseTimerCountup() {
    setTimerState([false, true, false, false]);
  }

  function stopTimerCountup() {
    setTimerState([false, false, true, false]);
  }

  function resetVideoFunction() {
    resetVideo.current();
  }

  function setResetVideoFunction(func: () => void) {
    resetVideo.current = func;
  }

  const triggerLoop = () => {
    setIsLoop(!isLoop);
  };

  return (
    <MotionContext.Provider value={context}>
      <div className="main motion">
        <header>
          <a className="back" onClick={() => router.back()}>
            <LeftOutlined />
            Back
          </a>
          <p>Add-on Virtual Interface Mapping</p>
          <span>Developed by PE-BPK</span>
        </header>
        <div className="sub-header sub-header-1">
          <span>{"Lean Cardboard   +   e-Motion"}</span>
        </div>
        <div className="sub-header sub-header-2">
          <span>{"(Human + Karakuri + Automation)"}</span>
        </div>
        <div className="motion__operation">
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
                    id={1}
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
              <Video id={1} src="/videos/OP1.mp4" playbackRate={playbackRate}>
                <WIP id={1} amount={1} style={{ right: -50 }} />
              </Video>
              <Video
                id={1}
                src="/videos/Add-on.mp4"
                playbackRate={playbackRate}
              />
            </div>
          </div>
        </div>
      </div>
    </MotionContext.Provider>
  );
};

export default Motion;
