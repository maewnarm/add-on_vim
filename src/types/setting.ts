import React from "react";

export interface EditableRowProps {
  index: number;
}

export type EdittingMachineModalProps = SignalModalProps & {
  machine_name: string;
};

export type SignalModalProps = {
  visible: boolean;
  project_id: number;
  machine_id: number;
  setVisible: (visible: boolean) => void;
};

export type SignalCategoryDataType = {
  signal_category_id: number;
  category: string;
};

export type SignalDataType = {
  signal_id: number;
  signal_name: string;
  signal_category_id: number;
};

export type MachineSignalType = {
  [machine_id: string]: MachineSignalDataType;
};

export type MachineSignalDataType = {
  machine_name: string;
  project_id: number;
  project_name: string;
  signals: SignalType;
};

export type AllSignalDataType = {
  [category: string]: SignalDataType[];
};

export type SignalType = {
  [category: string]: (SignalDataType & { machine_signal_id: number })[];
};

export type TableProjectDataItem = {
  key: string;
  project_id: number;
  project_name: string;
};

export type TableProjectDataType = {
  key: React.Key;
  project_id: number;
  project_name: string;
};

export type TableSettingSignalType = {
  key: React.Key;
  machine_id: number;
  machine_name: string;
};
