import { MotionContext } from "@/pages/motion";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { ControlBar, Player, PlayerReference, PlayerState } from "video-react";

interface VideoProps {
  id: number;
  name: string;
  src: string;
  playbackRate: number;
  children?: JSX.Element;
}

const Video: React.FC<VideoProps> = (props) => {
  const { id, name, src, playbackRate, children } = props;
  const {
    tableData,
    count,
    step,
    timerState,
    setTimerStateFunction,
    playVideoFunction,
    setPlayVideoFunctions,
    setPauseVideoFunctions,
    setResetVideoFunctions,
  } = React.useContext(MotionContext);
  const [isEnd, setIsEnd] = useState(false);
  const videoPlayer = useRef<PlayerReference | null>(null);
  // @ts-ignore
  // const player = videoPlayer.current?.getState().player;
  const countRef = useRef(count);
  const timerStateRef = useRef(timerState);
  const isEndRef = useRef(isEnd);

  const play = () => {
    // videoPlayer.current?.seek(0);
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
    // if (timerStateRef.current[3]) {
    //   setTimerStateFunction([false, false, false, false]);
    //   return;
    // }

    if (state.paused) {
      // setTimerStateFunction([false, true, false, false]);
      if (timerStateRef.current[0]) {
        // still play on loop
        play();
      }
    } else {
      // check condition play from start
      if (countRef.current === 0) {
        videoPlayer.current?.seek(0);
      }
      // setTimerStateFunction([true, false, false, false]);
    }
  }

  // function playVideo() {
  //   videoPlayer.current?.play()
  // }

  function resetVideo() {
    videoPlayer.current?.seek(0);
  }

  useEffect(() => {
    // set video player state change handle function
    videoPlayer.current?.subscribeToStateChange(videoStateChange);

    // set play video function
    setPlayVideoFunctions(id, play);

    // set pause video function
    setPauseVideoFunctions(id, pause);

    // set reset video function
    setResetVideoFunctions(id, resetVideo);
  }, [tableData]);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  // useEffect(() => {
  //   // timerState = [play,pause,stop,end]
  //   timerStateRef.current = timerState;

  //   if (timerState[0]) {
  //     play();
  //     setIsEnd(false);
  //   }

  //   if (timerState[1]) {
  //     pause();
  //   }

  //   if (timerState[2]) {
  //     stop();
  //   }

  //   if (timerState[3]) {
  //     pause();
  //     setIsEnd(true);
  //   }
  // }, [timerState]);

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
          <span>{name || "..."} - </span>
          <span>
            {tableData[id]
              ? tableData[id][step[id] - 1]?.operation
              : "Waiting ..."}
          </span>
          <span>
            {tableData[id] ? `[${tableData[id][step[id] - 1]?.HT} s.]` : ""}
          </span>
        </p>
      </div>
      {children}
      <Player
        ref={(player) => (videoPlayer.current = player)}
        fluid={false}
        height={650}
        preload={"auto"}
      >
        <source src={src} type="video/mp4" />
        <ControlBar autoHide autoHideTime={500} disableCompletely />
      </Player>
    </div>
  );
};

export default Video;
