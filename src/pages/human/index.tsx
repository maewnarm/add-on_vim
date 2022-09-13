import HumanResultChart from "@/components/human/chart";
import ResultData from "@/components/human/data";
import TimeTable from "@/components/human/timetable";
import ProjectSelector from "@/components/selector/projects";
import { TableDataType, TriggerDataType } from "@/types/motion";
import React, { useContext, useState, useEffect, useMemo } from "react";
import { MainContext } from "../_app";

export const HumanContext = React.createContext({
  tableData: [] as TableDataType[][],
  resultData: [] as number[][],
  setResultData: (data: number[][]) => {},
  triggerData: undefined as TriggerDataType | undefined,
  overIndex: [0, 0],
  underIndex: [0, 0],
  setOverIndex: ((value: number[]) => {}) as React.Dispatch<
    React.SetStateAction<number[]>
  >,
  setUnderIndex: ((value: number[]) => {}) as React.Dispatch<
    React.SetStateAction<number[]>
  >,
});

const Human = () => {
  const { mqttClient } = useContext(MainContext);
  const [projectName, setProjectName] = useState("");
  const [tableData, setTableData] = useState<TableDataType[][]>([]);
  const [resultData, setResultData] = useState<number[][]>([]);
  const [triggerData, setTriggerData] = useState<TriggerDataType | undefined>();
  const [overIndex, setOverIndex] = useState([0, 0]);
  const [underIndex, setUnderIndex] = useState([0, 0]);
  const context = useMemo(
    () => ({
      tableData: tableData,
      resultData: resultData,
      setResultData: setResultDataFunction,
      triggerData: triggerData,
      overIndex: overIndex,
      underIndex: underIndex,
      setOverIndex: setOverIndex,
      setUnderIndex: setUnderIndex,
    }),
    [tableData, resultData, triggerData]
  );

  const loadTableData = async () => {
    await fetch(`/api/static/get?filePath=static_standardized.json`).then(
      async (res) => {
        const data = JSON.parse(await res.json());
        setTableData(data[projectName] || []);
      }
    );
  };

  function setResultDataFunction(data: number[][]) {
    setResultData(data);
  }

  useEffect(() => {
    if (!mqttClient) return;

    mqttClient.on("message", (topic, message) => {
      const payload = { topic, message: JSON.parse(message.toString()) };
      console.log(topic);
      console.log(payload);
      const [, , type] = topic.split("/");
      console.log(type);
      if (type !== "trigger") return;

      setTriggerData(payload.message);
    });
    mqttClient.subscribe(
      `${process.env.NEXT_PUBLIC_TOPIC_UUID}/${projectName}/trigger`
    );
    console.info(
      `MQTT subscribing : ${process.env.NEXT_PUBLIC_TOPIC_UUID}/${projectName}/trigger`
    );
  }, [mqttClient, projectName]);

  useEffect(() => {
    loadTableData();
  }, [projectName]);

  return (
    <HumanContext.Provider value={context}>
      <div className="main human custom-scrollbar">
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
          <span>{"Human Motion"}</span>
          <div className="human__project">
            [Project :
            <ProjectSelector set={setProjectName} />]
          </div>
        </div>
        <main>
          <TimeTable indexData={1} />
          <div className="human__result">
            <ResultData indexData={1} />
            <HumanResultChart />
          </div>
        </main>
      </div>
    </HumanContext.Provider>
  );
};

export default Human;
