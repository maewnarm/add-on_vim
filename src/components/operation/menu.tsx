import { MachineSignalType, SignalType } from "@/types/setting";
import { Button, Divider, message, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { OperationContext } from "./operation";

interface MenuProps {
  targetId: number;
  machineSignals: MachineSignalType;
}

const Menu: React.FC<MenuProps> = (props) => {
  const { targetId } = props;
  const { project_data } = useContext(OperationContext);
  const [isShow, setIsShow] = useState(false);
  const [signals, setSignals] = useState<SignalType>({});

  function onButtonClick(text: string) {
    message.info(
      <span>
        Send signal: <b>{text}</b> from{" "}
        <b>{project_data[targetId]?.machine_name}</b>
      </span>,
      3
    );
  }

  useEffect(() => {
    setSignals(project_data[targetId]?.signals);
  }, [targetId, project_data]);

  useEffect(() => {
    const menu = document.getElementById("menu");
    menu?.classList.toggle("hide", !isShow);
  }, [isShow]);

  return (
    <div id="menu">
      <div className="menu-wrapper">
        <p>{`Menu: ${project_data[targetId]?.machine_name}` || "No signals"}</p>
        <div className="menu-button">
          <Space direction="vertical">
            {signals &&
              Object.entries(signals).map(([cat, signals], idx) => (
                <div key={idx}>
                  {idx !== Object.keys(signals).length && (
                    <Divider orientation="left" style={{ margin: "5px 0" }}>
                      {cat}
                    </Divider>
                  )}
                  <div className="menu-button-signal">
                    {signals.map((signal, idx_) => (
                      <Button
                        key={idx_}
                        shape="round"
                        type={cat === "Setup" ? "default" : "primary"}
                        danger={cat === "Abnormal"}
                        onClick={() => onButtonClick(signal.signal_name)}
                      >
                        {signal.signal_name}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
          </Space>
        </div>
      </div>
      <div className="menu-show-button" onClick={() => setIsShow(!isShow)}>
        {isShow ? ">" : "<"}
      </div>
    </div>
  );
};

export default Menu;
