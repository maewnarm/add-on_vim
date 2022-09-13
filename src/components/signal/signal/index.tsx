import {
  OperateTableType,
  OperateTableSignalType,
  OperationContext,
} from "../operation/operation";
import { ArrowRightOutlined, LineOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { MainContext } from "@/pages/_app";

const SignalInterface = () => {
  const { mqttClient } = useContext(MainContext);
  const { projectName, signalTypeData, signalData } =
    useContext(OperationContext);
  const [tableData, setTableData] = useState<OperateTableType[]>(signalData);
  const [tableBody, setTableBody] = useState<JSX.Element[]>([]);
  const triggerSignal = useRef<
    (
      unit: OperateTableType,
      signal: OperateTableSignalType,
      idxType: number,
      idxSignal: number
    ) => void
  >(() => {});
  const receiveSignal = useRef<
    (payload: { topic: string; message: any }) => void
  >(() => {});

  const setTriggerSignalFunction = useMemo(() => {
    triggerSignal.current = (
      unit: OperateTableType,
      signal: OperateTableSignalType,
      idxType: number,
      idxSignal: number
    ) => {
      if (!mqttClient) return;

      const data = JSON.stringify({
        value: signal.status ? 0 : 1,
      });

      // console.table({
      //   topic: process.env.NEXT_PUBLIC_TOPIC_UUID,
      //   unit: unit.unitName,
      //   signal: signal.signal,
      //   data: data,
      // });
      mqttClient.publish(
        `${process.env.NEXT_PUBLIC_TOPIC_UUID}/${projectName}/to_mc/${unit.unitName}/${signal.address}/${idxType}/${idxSignal}`,
        data
      );
    };
  }, [projectName]);

  const setReceiveSignalFunction = useMemo(() => {
    receiveSignal.current = (payload: { topic: string; message: any }) => {
      const [, , project, type, unitName, address, idxType, idxSignal] =
        payload.topic.split("/");
      const { value } = payload.message;

      if (type !== "signal") return;

      console.log("on receiveSignal");
      console.table({
        project: project,
        unitName: unitName,
        address: address,
        idxType: idxType,
        idxSignal: idxSignal,
        value: value,
      });
      let newTableData: OperateTableType[] = JSON.parse(
        JSON.stringify(tableData)
      );
      newTableData = newTableData.map((unitData) => {
        if (unitData.unitName === unitName) {
          if (unitData.signals[parseInt(idxType)][parseInt(idxSignal)]) {
            unitData.signals[parseInt(idxType)][parseInt(idxSignal)].status =
              !!value;
          }
        }
        return unitData;
      });
      setTableData(newTableData);
    };
  }, [tableData]);

  useEffect(() => {
    if (mqttClient) {
      mqttClient.on("message", (topic, message) => {
        const payload = { topic, message: JSON.parse(message.toString()) };
        const [, , , type] = topic.split("/");
        if (type === "signal") {
          receiveSignal.current(payload);
        }
      });
    }
  }, [mqttClient]);

  useEffect(() => {
    // update table signal data refer project name
    setTableData(signalData);
  }, [projectName]);

  useEffect(() => {
    if (!mqttClient) return;

    mqttClient.subscribe(
      `${process.env.NEXT_PUBLIC_TOPIC_UUID}/${projectName}/from_mc/signal/#`
    );
  }, [mqttClient, projectName]);

  useEffect(() => {
    const body: JSX.Element[] = [];
    tableData.forEach((unit, idxUnit) => {
      // loop unit
      const rowUnit = unit.signals.reduce((acc, s) => acc + s.length, 0);
      unit.signals.forEach((signals, idxType) => {
        // loop signal type
        const rowType = signals.length;
        signals.forEach((signal, idxSignal) => {
          // loop signal
          const rowSignal = signals.length;
          body.push(
            <tr key={`${idxUnit}-${idxType}-${idxSignal}`}>
              {idxType === 0 && idxSignal === 0 && (
                <>
                  <td rowSpan={rowUnit} className="body__no bottom-thick">
                    {unit.unitNo}
                  </td>
                  <td rowSpan={rowUnit} className="body__name bottom-thick">
                    {unit.unitName}
                  </td>
                </>
              )}
              {idxSignal === 0 && (
                <td
                  rowSpan={rowType}
                  className={`body__type ${
                    idxType + 1 === 3 && "bottom-thick"
                  }`}
                  title={signalTypeData[idxType]}
                >
                  {signalTypeData[idxType]}
                </td>
              )}
              <td
                className={`body__signal__vm ${
                  idxType + 1 === 3 &&
                  idxSignal + 1 === rowSignal &&
                  "bottom-thick"
                }`}
              >
                <a
                  id={`${unit.unitNo}-${idxType}-${signal.id}-vm`}
                  className={`type-${idxType} ${signal.status ? "on" : "off"}`}
                  onClick={() =>
                    triggerSignal.current(unit, signal, idxType, idxSignal)
                  }
                >
                  {signal.signal}
                </a>
              </td>
              <td className="body__signal__padding">
                <div>
                  <LineOutlined />
                  <ArrowRightOutlined />
                </div>
              </td>
              <td
                id={`${unit.unitNo}-${idxType}-${signal.id}-new`}
                className={`body__signal__new ${
                  idxType + 1 === 3 &&
                  idxSignal + 1 === rowSignal &&
                  "bottom-thick"
                }`}
              >
                <a
                  className={`type-${idxType} ${signal.status ? "on" : "off"}`}
                >
                  {signal.signal}
                </a>
              </td>
              <td
                className={`body__signal__new ${
                  idxType + 1 === 3 &&
                  idxSignal + 1 === rowSignal &&
                  "bottom-thick"
                }`}
              >
                {signal.address}
              </td>
            </tr>
          );
        });
      });
    });
    setTableBody(body);
  }, [tableData]);

  return (
    <div className="signal-interface custom-scrollbar">
      <div className="signal-interface__wrapper">
        <div className="signal-interface__wrapper__table">
          <table>
            <thead className="header">
              <tr>
                <th colSpan={2}>Unit</th>
                <th rowSpan={2} className="header__title__type">
                  Signal Type
                </th>
                <th rowSpan={2} className="header__title__vm">
                  Current MC
                </th>
                <th rowSpan={2} className="header__title__padding" />
                <th rowSpan={2} className="header__title__new">
                  New MC (Add-on)
                </th>
                <th rowSpan={2} className="header__title__new">
                  Address
                </th>
              </tr>
              <tr>
                <th className="header__no">No.</th>
                <th className="header__name">Name</th>
              </tr>
            </thead>
            <tbody className="body">{tableBody}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SignalInterface;
