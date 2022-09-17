export type TableDataType = {
  operation: string;
  HT: number;
  MT: number;
  WT: number;
};

export type TriggerDataType = {
  id: number;
  time: string;
};

export type CtChartDataType = {
  name: string;
  HT: number;
};

export type ResultHtChartDataType = {
  step: string;
  name: string;
  HT?: number;
  avg?: number;
};
