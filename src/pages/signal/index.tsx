import ProjectSelector from "@/components/selector/projects";
import Operation from "@/components/signal/operation/operation";
import type { NextPage } from "next";
import React, { useState } from "react";


const Signal: NextPage = () => {
  const [projectName, setProjectName] = useState("");

  return (
    <div className="main signal custom-scrollbar">
      <div className="sub-header sub-header-1">
        <span>{"Real Interface"}</span>
      </div>
      <div
        className="sub-header sub-header-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <span>{"Machine Signals"}</span>
        <div className="signal__project">
          [Project :
          <ProjectSelector set={setProjectName}/>
          ]
        </div>
      </div>
      <main>
        {/* <Result /> */}
        <Operation projectName={projectName} />
      </main>
    </div>
  );
};

export default Signal;
