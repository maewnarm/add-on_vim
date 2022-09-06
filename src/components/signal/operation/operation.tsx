import { ProjectType } from "@/types/data";
import { MachineSignalType } from "@/types/setting";
import React, { useState } from "react";
import { createContext } from "react";
import SignalInterface from "../signal";
import Result from "../result";
import { SettingTable } from "../tables/settingTable";
import TimeInterface, { IntervalTypes } from "../time";
import CanvasObject from "./canvas";
import { Divider, Tabs } from "antd";
import TimeStepline from "../timestep";

export type ProjectDataContextType = ProjectType & {
  project_data: MachineSignalType;
  isLoading: boolean;
};

type OperationContextType = ProjectDataContextType & {
  set: (proj: ProjectDataContextType) => void;
  intervalData: IntervalTypes[];
  setIntervalData: (data: IntervalTypes[]) => void;
};

export const OperationContext = createContext<OperationContextType>({
  project_id: 0,
  project_name: "",
  project_data: {},
  isLoading: false,
  set: () => {},
  intervalData: [],
  setIntervalData: () => {},
});

const Operation = () => {
  const [project, setProject] = useState<OperationContextType>({
    project_id: 0,
    project_name: "",
    project_data: {},
    isLoading: false,
    set: set,
    intervalData: [],
    setIntervalData: setIntervalDataFunction,
  });

  function set(proj: ProjectDataContextType) {
    setProject({ ...project, ...proj });
  }

  function setIntervalDataFunction(data: IntervalTypes[]) {
    setProject({ ...project, intervalData: data });
  }

  return (
    <OperationContext.Provider value={project}>
      <div className="operation custom-scrollbar">
        <div className="operation__interface">
          <Tabs className="operation__interface__setting">
            <Tabs.TabPane tab="Signal Interface" key="signal">
              <div className="operation__signal">
                <SignalInterface />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Time Interface" key="time">
              <div className="operation__time">
                <TimeInterface />
              </div>
            </Tabs.TabPane>
          </Tabs>
          <Divider
            style={{ marginTop: 10, marginBottom: 0, borderTopColor: "gray" }}
          />
          <div className="operation__interface__stepline">
            <p>Machine Signal Timeline</p>
            <TimeStepline />
          </div>
        </div>
        <div className="operation__result custom-scrollbar">
          <p>Trial Result</p>
          <Result />
        </div>
      </div>
    </OperationContext.Provider>
  );
};

export default Operation;
