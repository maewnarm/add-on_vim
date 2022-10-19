export type SetupDataType = {
  std: StdSetupDataType[];
  video: VideoSetupDataType[];
};

export type StdSetupDataType = {
  key: number
  id: number
  name: string;
  disableVideo: boolean;
  wipAddAt?: "start"| "end";
  wipAddId?: number;
  wipAddIncrement?: number;
  setWipAfterStep?: number;
  setWipAfterStepDelaySecond?: number;
  referencedWipCount?: number;
  wipRemoveAt?: "start" | "end";
  wipRemoveId?: number;
  wipRemoveIncrement?: number;
};

export type VideoSetupDataType = {
  id: number
  name: string
  src: string
  wip: {
    id: number
    style: {
      top: string
      left: number
    }
  }
  textStyle: {
    bottom: number
  }
}