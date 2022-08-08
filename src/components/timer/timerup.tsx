import React, { useEffect, useRef, useState } from "react";
import { MotionContext } from "@/pages/motion/index";

interface TimerProps {
  intervalTime_ms: number;
  start: boolean;
  pause?: boolean;
  stop: boolean;
  end?: boolean;
  loop?: boolean;
  targetSecond?: number;
  targetStepSecond?: number[];
  stopFunction?: () => void;
  outputFunction?: () => void;
  setHighlightStepFunction?: (step: number) => void;
  showTimer?: boolean;
}

const TimerUp: React.FC<TimerProps> = (props) => {
  const {
    intervalTime_ms,
    start,
    pause,
    stop,
    end,
    loop,
    targetSecond,
    targetStepSecond,
    outputFunction,
    stopFunction,
    setHighlightStepFunction,
    showTimer,
  } = props;
  const {
    count,
    step,
    stepCount,
    setCountFunction,
    setStepFunction,
    setStepCountFunction,
    setTimerStateFunction,
    setPlaybackRateFunction,
    resetVideoFunction,
  } = React.useContext(MotionContext);
  const mul = intervalTime_ms / 1000;
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const timerCounter = useRef<() => void>();
  const [stopped, setStopped] = useState(false);

  const timerCountup = () => {
    setCountFunction(count + 1);
  };

  const clearTimer = () => {
    clearInterval(timer);
  };

  useEffect(() => {
    timerCounter.current = timerCountup;
  }, [timerCountup]);

  useEffect(() => {
    if (!start) return;

    if (timer) {
      clearTimer();
    }

    if (stopped) {
      setCountFunction(0);
      setStepCountFunction(0);
      setStepFunction(1);
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
    setStepFunction(1);
    setStopped(true);
  }, [stop]);

  useEffect(() => {
    if (!end) return;

    clearTimer();
    setStopped(true);
  }, [end]);

  useEffect(() => {
    return () => {
      if (!timer) return;

      clearTimer();
    };
  }, []);

  useEffect(() => {
    let minutes = Math.floor((count * mul) / 60);
    let seconds = count * mul - minutes * 60;
    setSeconds(
      seconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        minimumFractionDigits: 1,
      })
    );
    setMinutes(minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 }));

    if (targetStepSecond) {
      const target = targetStepSecond[step - 1] * 10;
      if (stepCount === target) {
        setStepCountFunction(1);
        setStepFunction(step + 1);
      } else {
        setStepCountFunction(stepCount + 1);
      }
    }

    if (targetSecond) {
      // if (!stopFunction) return;

      if (count === targetSecond * 10) {
        if (loop) {
          setCountFunction(0);
          setStepCountFunction(0);
          setStepFunction(1);
          resetVideoFunction();
        } else {
          // stopFunction();
          setTimerStateFunction([false, false, false, true]);
        }
      }
    }
  }, [count]);

  useEffect(() => {
    if (!setHighlightStepFunction) return;

    setHighlightStepFunction(step);
    // if (step === 2) {
    //   setPlaybackRateFunction(0.1);
    // } else {
    //   setPlaybackRateFunction(1)
    // }
  }, [step]);

  return (
    <div className="timer timer-up">
      {showTimer && <p>{`${minutes}:${seconds}`}</p>}
    </div>
  );
};

export default TimerUp;
