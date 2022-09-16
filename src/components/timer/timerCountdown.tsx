import React, { useEffect, useRef, useState } from "react";
import { intervalCategory, OperationContext } from "../signal/operation/operation";
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
  const { setCountFunction, setPlanFunction, actualAmount, setActualFunction } =
    React.useContext(context);
  const { intervalData } = React.useContext(OperationContext);
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
    if (!pause) return;

    clearTimer();
  }, [pause]);

  useEffect(() => {
    if (!stop) return;

    clearTimer();
    setStopped(true);
  }, [stop]);

  useEffect(() => {
    if (actualAmount === 0) return;
    // reduce when reach interval target
    let sumTime = 0;
    intervalCategory.forEach((_, idx) => {
      intervalData[idx].forEach((interval) => {
        if (actualAmount % interval.interval === 0) {
          sumTime += interval.stdTime;
        }
      })
    });
    setSubCount(subCount - sumTime / mul);
  }, [actualAmount]);

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
