import React, { useEffect, useRef, useState } from "react";
import { MotionContext } from "@/pages/motion/index";

interface TimeCatcherProps {
  id: number;
  intervalTime_ms: number;
  start: boolean;
  pause?: boolean;
  stop: boolean;
  end?: boolean;
  loop?: boolean;
  targetSecond?: number;
  targetStepSecond?: number[];
  referencedCounter?: number;
  startCounterId?: number;
  startCounterIncrement?: number;
  endCounterId?: number;
  endCounterIncrement?: number;
  stopFunction?: () => void;
  outputFunction?: (id: number, increment: number) => void;
  trigOutputAfterStep?: number;
  trigOutputAfterStepDelaySecond?: number;
  setHighlightStepFunction?: (step: number) => void;
  setSubCountFunction: (value: number) => void;
  showTimer?: boolean;
}

const TimeCatcher: React.FC<TimeCatcherProps> = (props) => {
  const {
    id,
    intervalTime_ms,
    start,
    pause,
    stop,
    end,
    loop,
    targetSecond,
    targetStepSecond,
    referencedCounter,
    startCounterId,
    startCounterIncrement,
    endCounterId,
    endCounterIncrement,
    stopFunction,
    outputFunction,
    trigOutputAfterStep,
    trigOutputAfterStepDelaySecond,
    setHighlightStepFunction,
    setSubCountFunction,
    showTimer,
  } = props;
  const {
    count,
    // step,
    setCountFunction,
    setStepFunction,
    // setStepCountFunction,
    setTimerStateFunction,
    setPlaybackRateFunction,
    playVideoFunction,
    pauseVideoFunction,
    resetVideoFunction,
  } = React.useContext(MotionContext);
  const mul = intervalTime_ms / 1000;
  // const [timer, setTimer] = useState<NodeJS.Timer>();
  const [gotWork, setGotWork] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [subCount, setSubCount] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [subStepCount, setSubStepCount] = useState(0);
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const timerCounter = useRef<() => void>();
  const [stopped, setStopped] = useState(false);

  // const timerCountup = () => {
  //   // setCountFunction(id,count[id] + 1);
  //   setSubCount(subCount+1)
  // };

  // const clearTimer = () => {
  //   clearInterval(timer);
  // };

  // useEffect(() => {
  //   timerCounter.current = timerCountup;
  // }, [timerCountup]);

  useEffect(() => {
    if (!start) return;

    // if (timer) {
    //   clearTimer();
    // }

    if (stopped) {
      // setCountFunction(id,0);
      setSubStepCount(0);
      setSubStep(1);
    }

    // let interval = setInterval(() => {
    //   if (!timerCounter.current) return;

    //   timerCounter.current();
    // }, intervalTime_ms);

    // setTimer(interval);
    setStopped(false);
    setIsPaused(false);
  }, [start]);

  useEffect(() => {
    if (!pause) return;

    // clearTimer();
  }, [pause]);

  useEffect(() => {
    if (!stop) return;

    // clearTimer();
    setSubCount(0);
    setSubStep(0);
    setStopped(true);
  }, [stop]);

  useEffect(() => {
    if (!end) return;

    // clearTimer();
    setStopped(true);
  }, [end]);

  // useEffect(() => {
  //   return () => {
  //     if (!timer) return;

  //     clearTimer();
  //   };
  // }, []);

  useEffect(() => {
    if (isPaused) return;

    if (count === 0) {
      setSubCount(0);
    } else {
      // condition video be playable
      if (
        typeof referencedCounter !== "undefined" &&
        referencedCounter < 1 &&
        !gotWork
      )
        return;

      playVideoFunction(id);
      setSubCount(subCount + 1);
    }
  }, [count]);

  useEffect(() => {
    // send value to parent
    setSubCountFunction(subCount);
    let sec = Math.round(subCount * mul * 10) / 10;
    let secStep = Math.round(subStepCount * mul * 10) / 10;
    let minutes = Math.floor(sec / 60);
    let seconds = sec - minutes * 60;
    setSeconds(
      seconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        minimumFractionDigits: 1,
      })
    );
    setMinutes(minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 }));

    // counter method check at start
    if (subCount === 1) {
      // initial set subStep
      if (subStep === 0) {
        setSubStep(1);
      }

      if (
        outputFunction &&
        typeof startCounterId !== "undefined" &&
        typeof startCounterIncrement !== "undefined"
      ) {
        outputFunction(startCounterId, startCounterIncrement);

        // set has work in process to TRUE
        setGotWork(true);
      }
    }

    if (targetStepSecond) {
      const subTarget =
        Math.round(
          targetStepSecond[subStep === 0 ? 0 : subStep - 1] * 10 * 10
        ) / 10;

      if (subStepCount === subTarget) {
        setSubStepCount(1);
        setSubStep(subStep + 1);
      } else {
        setSubStepCount(subStepCount + 1);
      }
    }

    if (targetSecond) {
      // if (!stopFunction) return;

      if (subCount === targetSecond * 10) {
        // set has work in process to FALSE
        setGotWork(false);

        if (loop) {
          // setCountFunction(id,0);
          setSubCount(0);
          setSubStep(0);
          setSubStepCount(0);

          if (typeof referencedCounter !== "undefined") {
            pauseVideoFunction(id);
          }

          resetVideoFunction(id);
        } else {
          // stopFunction();
          // setTimerStateFunction(id,[false, false, false, true]);
          setIsPaused(true);
        }
      }
    }

    // increase counter method check
    if (
      outputFunction &&
      typeof endCounterId !== "undefined" &&
      typeof endCounterIncrement !== "undefined"
    ) {
      if (trigOutputAfterStep && trigOutputAfterStepDelaySecond) {
        if (
          subStep === trigOutputAfterStep &&
          secStep === trigOutputAfterStepDelaySecond
        ) {
          outputFunction(endCounterId, endCounterIncrement);
        }
      }
    }
  }, [subCount]);

  useEffect(() => {
    if (!setHighlightStepFunction) return;

    setHighlightStepFunction(subStep);
    setStepFunction(id, subStep);
    // if (step === 2) {
    //   setPlaybackRateFunction(0.1);
    // } else {
    //   setPlaybackRateFunction(1)
    // }
  }, [subStep]);

  return (
    <div className="timer timer-up">
      {showTimer && <p>{`${minutes}:${seconds}`}</p>}
    </div>
  );
};

export default TimeCatcher;
