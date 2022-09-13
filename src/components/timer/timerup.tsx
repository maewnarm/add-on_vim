import React, { useEffect, useRef, useState } from "react";
import { MotionContext } from "@/pages/motion/index";

interface TimerUpProps {
  // id: number;
  intervalTime_ms: number;
  start: boolean;
  pause?: boolean;
  // stop: boolean;
  // end?: boolean;
  // loop?: boolean;
  // targetSecond?: number;
  // targetStepSecond?: number[];
  // stopFunction?: () => void;
  // outputFunction?: () => void;
  // setHighlightStepFunction?: (step: number) => void;
  showTimer?: boolean;
}

const TimerUp: React.FC<TimerUpProps> = (props) => {
  const { intervalTime_ms, start, pause, showTimer } = props;
  const { setCountFunction } = React.useContext(MotionContext);
  const mul = intervalTime_ms / 1000;
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [subCount, setSubCount] = useState(0);
  const timerCounter = useRef<() => void>();
  const [stopped, setStopped] = useState(false);

  const timerCountup = () => {
    setSubCount(subCount + 1);
  };

  const clearTimer = () => {
    clearInterval(timer);
  };

  useEffect(() => {
    timerCounter.current = timerCountup;
  }, [timerCountup]);

  useEffect(() => {
    setCountFunction(subCount);
  }, [subCount]);

  useEffect(() => {
    console.log("start");
    if (!start) return;

    if (timer) {
      clearTimer();
    }

    let interval = setInterval(() => {
      if (!timerCounter.current) return;

      timerCounter.current();
    }, intervalTime_ms);

    setTimer(interval);
    setStopped(false);
  }, [start]);

  useEffect(() => {
    console.log("pause");
    if (!pause) return;

    clearTimer();
  }, [pause]);

  useEffect(() => {
    return () => {
      if (!timer) return;

      clearTimer();
    };
  }, []);

  return <div className="timer timer-up">{showTimer && subCount}</div>;
};

export default TimerUp;
