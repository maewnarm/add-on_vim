import { MotionContext } from "@/pages/motion";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { ControlBar, Player, PlayerReference, PlayerState } from "video-react";

interface VideoProps {
  id: number;
  src: string;
  playbackRate: number;
  children?: JSX.Element;
}

const Video: React.FC<VideoProps> = (props) => {
  const { id, src, playbackRate, children } = props;
  const {
    tableData,
    count,
    step,
    timerState,
    setTimerStateFunction,
    setResetVideoFunction,
  } = React.useContext(MotionContext);
  const [isEnd, setIsEnd] = useState(false);
  const videoPlayer = useRef<PlayerReference | null>(null);
  // @ts-ignore
  const player = videoPlayer.current?.getState().player;
  const countRef = useRef(count);
  const timerStateRef = useRef(timerState);
  const isEndRef = useRef(isEnd);

  const play = () => {
    videoPlayer.current?.play();
  };

  const pause = () => {
    videoPlayer.current?.pause();
  };

  const stop = () => {
    videoPlayer.current?.seek(0);
    videoPlayer.current?.pause();
  };

  function videoStateChange(state: PlayerState) {
    if (timerStateRef.current[3]) {
      setTimerStateFunction([false, false, false, false]);
      return;
    }

    if (state.paused) {
      setTimerStateFunction([false, true, false, false]);
    } else {
      // check condition play from start
      if (countRef.current === 0) {
        videoPlayer.current?.seek(0);
      }
      setTimerStateFunction([true, false, false, false]);
    }
  }

  function resetVideo() {
    videoPlayer.current?.seek(0);
  }

  useEffect(() => {
    // set video player state change handle function
    videoPlayer.current?.subscribeToStateChange(videoStateChange);

    // set reset video function
    setResetVideoFunction(resetVideo);
  }, []);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    // timerState = [play,pause,stop,end]
    timerStateRef.current = timerState;

    if (timerState[0]) {
      play();
      setIsEnd(false);
    }

    if (timerState[1]) {
      pause();
    }

    if (timerState[2]) {
      stop();
    }

    if (timerState[3]) {
      pause();
      setIsEnd(true);
    }
  }, [timerState]);

  useEffect(() => {
    isEndRef.current = isEnd;
  }, [isEnd]);

  useEffect(() => {
    if (!videoPlayer.current) return;

    videoPlayer.current.playbackRate = playbackRate;
  }, [playbackRate]);

  return (
    <div className="video">
      <div className="video__label" style={{ bottom: 30 }}>
        <p>
          <span>OP1 - </span>
          <span>{tableData[step - 1]?.operation || "Waiting ..."}</span>
          <span>
            {tableData[step - 1] ? `[${tableData[step - 1].HT} s.]` : ""}
          </span>
        </p>
      </div>
      {children}
      <Player
        fluid={false}
        height={650}
        ref={(player) => (videoPlayer.current = player)}
      >
        <source src={src} type="video/mp4" />
        <ControlBar autoHide autoHideTime={500} />
      </Player>
    </div>
  );
};

export default Video;
