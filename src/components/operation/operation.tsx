import { ProjectType } from "@/types/data";
import { MachineSignalType } from "@/types/setting";
import React, { useState } from "react";
import { createContext } from "react";
import { SettingTable } from "../tables/settingTable";
import CanvasObject from "./canvas";

export type ProjectDataContextType = ProjectType & {
  project_data: MachineSignalType;
  isLoading: boolean;
};

type OperationContextType = ProjectDataContextType & {
  set: (proj: ProjectDataContextType) => void;
};

export const OperationContext = createContext<OperationContextType>({
  project_id: 0,
  project_name: "",
  project_data: {},
  isLoading: false,
  set: () => {},
});

const Operation = () => {
  const [project, setProject] = useState<OperationContextType>({
    project_id: 0,
    project_name: "",
    project_data: {},
    isLoading: false,
    set: set,
  });

  function set(proj: ProjectDataContextType) {
    setProject({ ...project, ...proj });
  }

  return (
    <OperationContext.Provider value={project}>
      <div className="operation">
        <aside className="operation__setting">
          <p>Setting</p>
          <SettingTable />
        </aside>
        <div className="operation__interface">
          <p>{`3D Interface${
            project.project_name && ` [${project.project_name}]`
          }`}</p>
          <div className="operation__interface__guide">
            <b>Left click</b>
            <p>: rotate</p>
            <b>Right click</b>
            <p>: move</p>
          </div>
          <div id="canvas" className="operation__interface__canvas">
            <CanvasObject />
          </div>
        </div>
      </div>
    </OperationContext.Provider>
  );
};

export default Operation;
