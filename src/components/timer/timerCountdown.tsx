import React, { useEffect, useRef, useState } from "react";
import type { defaultMachineSignalContext } from "../signal/result";

interface TimerUpProps {
  context: React.Context<typeof defaultMachineSignalContext>;
  // id: number;
  intervalTime_ms: number;
  start: boolean;
  pause?: boolean;
  stop?: boolean;
  // end?: boolean;
  // loop?: boolean;
  // targetSecond: number;
  targetMinute: number;
  targetHour: number;
  // targetStepSecond?: number[];
  // stopFunction?: () => void;
  // outputFunction?: () => void;
  // setHighlightStepFunction?: (step: number) => void;
  showTimer?: boolean;
}

const TimerCountdown: React.FC<TimerUpProps> = (props) => {
  const {
    context,
    intervalTime_ms,
    start,
    pause,
    stop,
    targetMinute,
    targetHour,
    showTimer,
  } = props;
  const { setCountFunction, setPlanFunction, setActualFunction } =
    React.useContext(context);
  const mul = intervalTime_ms / 1000;
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const targetInSecond = useRef<number>(
    (targetMinute * 60 + targetHour * 3600) / mul
  );
  const [subCount, setSubCount] = useState(targetInSecond.current);
  const timerCounter = useRef<() => void>();
  const [stopped, setStopped] = useState(false);

  const timerCountdown = () => {
    setSubCount(subCount - 1);
  };

  const clearTimer = () => {
    clearInterval(timer);
  };

  useEffect(() => {
    timerCounter.current = timerCountdown;
  }, [timerCountdown]);

  useEffect(() => {
    if (subCount > 0) {
      setCountFunction(subCount);
    } else {
      clearTimer();
    }
  }, [subCount]);

  useEffect(() => {
    console.log("start", start);
    if (!start) return;

    if (timer) {
      clearTimer();
    }

    if (stopped) {
      setSubCount(targetInSecond.current);
      setPlanFunction(0);
      setActualFunction(0);
    }

    let interval = setInterval(() => {
      if (!timerCounter.current) return;

      timerCounter.current();
    }, intervalTime_ms);

    setTimer(interval);
    setStopped(false);
  }, [start]);

  useEffect(() => {
    console.log("pause", pause);
    if (!pause) return;

    clearTimer();
  }, [pause]);

  useEffect(() => {
    if (!stop) return;

    clearTimer();
    setStopped(true);
  }, [stop]);

  useEffect(() => {
    return () => {
      if (!timer) return;

      clearTimer();
    };
  }, []);

  return <div className="timer timer-up">{showTimer && subCount}</div>;
};

TimerCountdown.defaultProps = {
  targetMinute: 0,
  targetHour: 0,
};

export default TimerCountdown;
