import { ProjectType } from "@/types/data";
import { MachineSignalType } from "@/types/setting";
import React, { useState, useEffect } from "react";
import { createContext } from "react";
import SignalInterface from "../signal";
import Result from "../result";
import { SettingTable } from "../tables/settingTable";
import TimeInterface, { IntervalTypes } from "../time";
import CanvasObject from "./canvas";
import { Divider, Tabs } from "antd";
import TimeStepline from "../timestep";

export type OperateTableType = {
  unitNo: number;
  unitName: string;
  signals: OperateTableSignalType[][]; // [[signals of type-1],[signal of type-2],...]
};

export type OperateTableSignalType = {
  id: number;
  signal: string;
  address: string;
  status: boolean;
};

export type ProjectDataContextType = ProjectType & {
  projectData: MachineSignalType;
  isLoading: boolean;
};

type OperationContextType = ProjectDataContextType & {
  set: (proj: ProjectDataContextType) => void;
  signalTypeData: string[];
  signalData: OperateTableType[];
  intervalData: IntervalTypes[][];
  setIntervalData: (data: IntervalTypes[][]) => void;
};

const signalTypes = ["MC condition", "Abnormal", "Setup"];

// const demoTableData: OperateTableType[] = [
//   {
//     unitNo: 1,
//     unitName: "MC_1",
//     signals: [
//       [
//         { id: 1, signal: "Home position", address: "W100.00", status: false },
//         { id: 2, signal: "Master check", address: "W100.01", status: false },
//       ],
//       [],
//       [
//         { id: 5, signal: "Tool change", address: "W300.00", status: false },
//         { id: 6, signal: "Part supply", address: "W300.01", status: false },
//       ],
//     ],
//   },
//   {
//     unitNo: 2,
//     unitName: "MC_1",
//     signals: [
//       [
//         { id: 1, signal: "Home position", address: "W100.00", status: false },
//         { id: 2, signal: "Master check", address: "W100.01", status: false },
//       ],
//       [
//         { id: 3, signal: "Work NG", address: "W200.00", status: false },
//         { id: 4, signal: "Fault stop", address: "W200.01", status: false },
//       ],
//       [
//         { id: 5, signal: "Tool change", address: "W300.00", status: false },
//         { id: 6, signal: "Part supply", address: "W300.01", status: false },
//       ],
//     ],
//   },
// ];

export const intervalCategory = ["Setup", "Part supply", "Quality"]


export const OperationContext = createContext<OperationContextType>({
  projectId: 0,
  projectName: "",
  projectData: {},
  isLoading: false,
  set: () => { },
  signalTypeData: [],
  signalData: [],
  intervalData: [],
  setIntervalData: () => { },
});

const Operation: React.FC<{ projectName: string }> = (props) => {
  const { projectName } = props;
  const [signalData, setSignalData] = useState<{
    [project: string]: OperateTableType[];
  }>({});
  const [intervalData, setIntervalData] = useState<{ [project: string]: IntervalTypes[][] }>({})
  const [context, setContext] = useState<OperationContextType>({
    projectId: 0,
    projectName: projectName,
    projectData: {},
    isLoading: false,
    set: set,
    signalTypeData: signalTypes,
    signalData: [],
    intervalData: [],
    setIntervalData: setIntervalDataFunction,
  });

  function set(proj: ProjectDataContextType) {
    setContext({ ...context, ...proj });
  }

  function setIntervalDataFunction(data: IntervalTypes[][]) {
    setContext({ ...context, intervalData: data });
  }

  const loadSignalData = async () => {
    await fetch(`/api/static/get?filePath=static_signals.json`).then(
      async (res) => {
        const data = JSON.parse(await res.json());
        setSignalData(data);
      }
    );
  };

  const loadIntervalData = async () => {
    await fetch(`/api/static/get?filePath=static_interval.json`).then(
      async (res) => {
        const data = JSON.parse(await res.json());
        setIntervalData(data)
      }
    )
  }

  useEffect(() => {
    loadSignalData();
    loadIntervalData();
  }, []);

  useEffect(() => {
    setContext({
      ...context,
      projectName: projectName,
      signalData: signalData[projectName] || [],
      intervalData: intervalData[projectName] || []
    });
  }, [projectName]);

  return (
    <OperationContext.Provider value={context}>
      <div className="operation custom-scrollbar">
        <div className="operation__result custom-scrollbar">
          <p>Trial Result</p>
          <Result />
        </div>
        <div className="operation__interface">
          <Tabs className="operation__interface__setting">
            {/* <Tabs.TabPane tab="Signal Interface" key="signal">
              <div className="operation__signal">
                <SignalInterface />
              </div>
            </Tabs.TabPane> */}
            <Tabs.TabPane tab="Time Interface" key="time">
              <div className="operation__time">
                <TimeInterface />
              </div>
            </Tabs.TabPane>
          </Tabs>
          <Divider
            style={{ marginTop: 10, marginBottom: 0, borderTopColor: "gray" }}
          />
          {/* <div className="operation__interface__stepline">
            <p>Machine Signal Timeline</p>
            <TimeStepline />
          </div> */}
        </div>

      </div>
    </OperationContext.Provider>
  );
};

export default Operation;
