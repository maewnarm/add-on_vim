import { MQTTConnection } from "@/lib/mqtt";
import { ArrowRightOutlined, LineOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

type OperateTableType = {
  unitNo: number;
  unitName: string;
  signals: OperateTableSignalType[][]; // [[signals of type-1],[signal of type-2],...]
};

type OperateTableSignalType = {
  id: number;
  signal: string;
  address: string;
  status: boolean;
};

const signalTypes = ["MC condition", "Abnormal", "Setup"];

const tableData: OperateTableType[] = [
  {
    unitNo: 1,
    unitName: "MC_1",
    signals: [
      [
        { id: 1, signal: "Home position", address: "W100.00", status: false },
        { id: 2, signal: "Master check", address: "W100.01", status: false },
      ],
      [],
      [
        { id: 5, signal: "Tool change", address: "W300.00", status: false },
        { id: 6, signal: "Part supply", address: "W300.01", status: false },
      ],
    ],
  },
  {
    unitNo: 2,
    unitName: "MC_1",
    signals: [
      [
        { id: 1, signal: "Home position", address: "W100.00", status: false },
        { id: 2, signal: "Master check", address: "W100.01", status: false },
      ],
      [
        { id: 3, signal: "Work NG", address: "W200.00", status: false },
        { id: 4, signal: "Fault stop", address: "W200.01", status: false },
      ],
      [
        { id: 5, signal: "Tool change", address: "W300.00", status: false },
        { id: 6, signal: "Part supply", address: "W300.01", status: false },
      ],
    ],
  },
];

// TODO install MQTT package
// TODO send signal when trigger to MQTT broker
// TODO receive signal from MQTT subscribe and listen to change signal vm/new MC status
// TODO create caption label in ThreeJS canvas

const SignalInterface = () => {
  const [client, setClient] = useState<mqtt.MqttClient>();
  const [tableBody, setTableBody] = useState<JSX.Element[]>([]);

  const triggerSignal = (unit: number, signal: string) => {
    console.log("trigger signal ", unit, signal);
  };

  useEffect(() => {
    setClient(MQTTConnection("127.0.0.1", 8083));
  }, []);

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        console.log("Connected");
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
      });
      client.on("reconnect", () => {
        console.warn("Reconnecting");
      });
      client.on("disconnect", () => {
        console.error("Disconnected");
      });
      client.on("message", (topic, message) => {
        const payload = { topic, message: JSON.parse(message.toString()) };
        console.log(payload);
      });
      client.subscribe("test");
    }
  }, [client]);

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
                  title={signalTypes[idxType]}
                >
                  {signalTypes[idxType]}
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
                  onClick={() => triggerSignal(unit.unitNo, signal.signal)}
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
