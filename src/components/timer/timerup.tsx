import React, { useEffect, useRef, useState } from "react";

interface TimerProps {
  intervalTime_ms: number;
  start: boolean;
  pause?: boolean;
  stop: boolean;
  loop?: boolean;
  targetSecond?: number;
  targetStepSecond?: number[];
  stopFunction?: () => void;
  outputFunction?: () => void;
  setStepFunction?: (step: number) => void;
  showTimer?: boolean;
}

const TimerUp: React.FC<TimerProps> = (props) => {
  const {
    intervalTime_ms,
    start,
    pause,
    stop,
    loop,
    targetSecond,
    targetStepSecond,
    outputFunction,
    stopFunction,
    setStepFunction,
    showTimer,
  } = props;
  const mul = intervalTime_ms / 1000;
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [stepCount, setStepCount] = useState(0);
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const timerCounter = useRef<() => void>();
  const [stopped, setStopped] = useState(false);

  const timerCountup = () => {
    setCount(count + 1);
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
      clearInterval(timer);
    }

    if (stopped) {
      setCount(0);
      setStepCount(0);
      setStep(1);
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

    clearInterval(timer);
    setStopped(true);
  }, [stop]);

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
        setStepCount(1);
        setStep(step + 1);
      } else {
        setStepCount(stepCount + 1);
      }
    }

    if (targetSecond) {
      if (!stopFunction) return;

      if (count === targetSecond * 10) {
        if (loop) {
          setCount(0);
          setStepCount(0);
          setStep(1);
        } else {
          stopFunction();
        }
      }
    }
  }, [count]);

  useEffect(() => {
    if (!setStepFunction) return;

    setStepFunction(step);
  }, [step]);

  return (
    <div className="timer timer-up">
      {showTimer && <p>{`${minutes}:${seconds}`}</p>}
    </div>
  );
};

export default TimerUp;
