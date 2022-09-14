import {
  CloseCircleFilled,
  PauseCircleFilled,
  PlayCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";
import { Chart } from "@antv/g2";
import { debounce } from "debounce";
import { Button, InputNumber } from "antd";
import React, { useEffect, useMemo, useState, useRef, useContext } from "react";
import TimerCountdown from "../timer/timerCountdown";
import { OperationContext } from "./operation/operation";
import { MainContext } from "@/pages/_app";

type MORChartDataType = {
  name: string;
  type: string;
  value: number;
};

type CTChartDataType = {
  index: number;
  ct: number;
};

export const defaultMachineSignalContext = {
  setCountFunction: (count: number) => { },
  setPlanFunction: (plan: number) => { },
  actualAmount: 0,
  setActualFunction: (plan: number) => { },
};

export const MachineSignalContext = React.createContext(
  defaultMachineSignalContext
);

// TODO fix debounce to real debouncing
// TODO initial ct chart to show target
// TODO hide overflow of MOR chart

const Result = () => {
  const mul = 0.1; // interval 100 ms / standard interval 1000 ms
  const { mqttClient } = useContext(MainContext);
  const { projectName } = useContext(OperationContext);
  const [morChart, setMorChart] = useState<Chart>();
  const [ctChart, setCtChart] = useState<Chart>();
  const [morChartData, setMorChartData] = useState<MORChartDataType[]>([]);
  const [ctChartData, setCtChartData] = useState<CTChartDataType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ctSelected, setCtSelected] = useState(0);
  const [count, setCount] = useState(0);
  const lastCount = useRef<number>(Date.now());
  const [targetHour, setTargetHour] = useState(1);
  const [targetMinute, setTargetMinute] = useState(0);
  const [targetCt, setTargetCt] = useState(10);
  const [targetMOR, setTargetMOR] = useState(95);
  const [currentTime, setCurrentTime] = useState("");
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(false);
  const [stop, setStop] = useState(false);
  // result data
  const [resultMOR, setResultMOR] = useState("-");
  const [resultLoss, setResultLoss] = useState("-");
  const [resultCt, setResultCt] = useState("-");
  const [plan, setPlan] = useState(0);
  const [actual, setActual] = useState(0);
  const [amountColor, setAmountColor] = useState("blue");
  const addActual = useRef(() => { });
  const addCtChartData = useRef(
    (payload: { topic: string; message: any }) => { }
  );
  const reRender = useMemo(
    () =>
      debounce(() => {
        if (!ctChart) return;

        ctChart.clear();
        addCTChartProps();
        ctChart.render();
      }, 1000),
    [targetCt]
  );

  const context = useMemo(
    () => ({
      setCountFunction: setCount,
      setPlanFunction: setPlan,
      actualAmount: actual,
      setActualFunction: setActual,
    }),
    [actual]
  );

  const createMORChart = () => {
    if (!morChart) {
      const c = new Chart({
        container: "morchart",
        autoFit: true,
        height: 400,
      });
      setMorChart(c);
    }
  };

  const addMORChartProps = () => {
    if (!morChart) return;

    morChart.coordinate();
    morChart.data(morChartData);
    morChart.scale("value", {
      nice: true,
      maxLimit: 100,
    });
    morChart.axis("value", {
      label: {
        style: {
          fontSize: 20,
          fill: "black",
        },
      },
    });
    morChart.axis("name", {
      label: {
        style: {
          fontSize: 20,
          fill: "black",
        },
      },
    });
    morChart.legend({
      position: "top-right",
      itemName: {
        style: {
          fontSize: 20,
          fill: "black",
        },
      },
      offsetY: -8,
    });
    morChart.tooltip({
      shared: true,
      showMarkers: false,
      position: "right",
      showTitle: false,
      customItems: (items) => {
        const newItems = items.map((item) => {
          const edited = { ...item };
          edited.value = `${edited.value}%`;
          return edited;
        });
        return newItems;
      },
      domStyles: {
        "g2-tooltip": {
          fontSize: "20px",
        },
      },
    });
    morChart
      .interval()
      .adjust("stack")
      .position("name*value")
      .color({ fields: ["type"], values: ["#D61C4E", "#277BC0"] })
      .style({
        lineWidth: 1,
        stroke: "000",
        offset: 0,
      })
      .label("value*type", (val, t) => {
        const color = t === "MOR" ? "blue" : "pink";
        const shadow = t === "MOR" ? "#ffffffd0" : "#000000d0";
        if (val < 0) {
          return null;
        }
        return {
          position: "middle",
          offset: 0,
          content: `${val}%`,
          style: {
            fill: color,
            fontSize: 30,
            fontWeight: 600,
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 2,
            shadowColor: shadow,
            stroke: shadow,
            lineWidth: 1,
          },
        };
      });
    morChart.render();
  };

  const createCTChart = () => {
    if (!ctChart) {
      const c = new Chart({
        container: "ctchart",
        autoFit: true,
        height: 400,
        padding: [50, 20, 40, 30],
      });
      setCtChart(c);
    }
  };

  const addCTChartProps = () => {
    if (!ctChart) return;

    // ctChart.data(ctChartData);
    ctChart.scale({
      ct: {
        min: 0,
        nice: true,
      },
      index: {
        min: 0,
        // max: ctChartData.length,
        nice: true,
      },
    });
    ctChart.line().position("index*ct").color("#2C3639");
    ctChart
      .point()
      .position("index*ct")
      .color("#2C3639")
      .shape("circle")
      .size(7);
    ctChart.axis("index", {
      label: null,
      title: {
        text: "CT Trend",
        position: "bottom",
        offset: 0,
        style: {
          fontSize: 20,
          fill: "black",
        },
      },
    });
    ctChart.axis("ct", {
      label: {
        style: {
          fontSize: 20,
          fill: "black",
        },
      },
    });
    ctChart.tooltip({
      showTitle: false,
      showCrosshairs: true,
      crosshairs: {
        type: "x",
      },
      customItems: (items) => {
        const newItems = items.map((item) => {
          const edited = { ...item };
          edited.value = `${edited.value} s.`;
          return edited;
        });
        return newItems;
      },
      domStyles: {
        "g2-tooltip-list-item": {
          fontSize: "20px",
        },
      },
    });
    ctChart.annotation().line({
      start: ["min", targetCt],
      end: ["max", targetCt],
      style: {
        stroke: "red",
        lineWidth: 1,
        lineDash: [3, 3],
      },
      text: {
        position: "end",
        style: {
          fill: "red",
          fontSize: 18,
          fontWeight: 600,
        },
        content: `CT Target : ${targetCt}s.`,
        offsetY: -5,
        offsetX: -120,
      },
    });
    // @ts-ignore
    ctChart.on("element:click", (ev) => {
      const { data } = ev.data;
      // console.log("click");
      // console.log(data.ct);
      setIsModalVisible(true);
      setCtSelected(data.ct);
    });
    ctChart.render();
  };

  function startTimer() {
    setPlay(true);
    setPause(false);
    setStop(false);
  }

  function pauseTimer() {
    setPlay(false);
    setPause(true);
    setStop(false);
  }

  function stopTimer() {
    setPlay(false);
    setPause(false);
    setStop(true);
  }

  const setAddActualFunction = useMemo(() => {
    addActual.current = () => setActual(actual + 1);
  }, [actual]);

  const setAddCtChartDataFunction = useMemo(() => {
    addCtChartData.current = (payload: { topic: string; message: any }) => {
      // set ct chart data
      const currentData = [...ctChartData];
      currentData.push({
        index: currentData.length,
        ct: payload.message.ct,
      });
      setCtChartData(currentData);
    };
  }, [ctChartData]);

  useEffect(() => {
    createMORChart();
    createCTChart();
  }, []);

  useEffect(() => {
    if (!mqttClient) return;

    mqttClient.on("message", (topic, message) => {
      const payload = { topic, message: JSON.parse(message.toString()) };
      const [, , , type, data] = topic.split("/");
      console.log(type, data);
      if (type !== "result") return;

      if (data === "actual") {
        console.log("result actual input");
        addActual.current();
        addCtChartData.current(payload);
      }
    });
    mqttClient.subscribe(
      `${process.env.NEXT_PUBLIC_TOPIC_UUID}/${projectName}/from_mc/result/actual`
    );
  }, [mqttClient, projectName]);

  useEffect(() => {
    if (!morChart) return;

    addMORChartProps();
  }, [morChart]);

  useEffect(() => {
    if (!ctChart) return;

    addCTChartProps();
  }, [ctChart]);

  useEffect(() => {
    if (!morChart) return;

    morChart.changeData(morChartData);
  }, [morChartData]);

  useEffect(() => {
    if (!ctChart) return;

    // calculate average ct
    const avgCt =
      ctChartData.reduce((acc, { ct }) => acc + ct, 0) / ctChartData.length;
    setResultCt(avgCt.toFixed(2));

    ctChart.changeData(ctChartData);
  }, [ctChartData]);

  useEffect(() => {
    reRender();
  }, [targetCt]);

  useEffect(() => {
    if (!play) return;

    lastCount.current = Date.now();
  }, [play]);

  useEffect(() => {
    // set current time format
    const h = Math.floor((count * mul) / 3600).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
    });
    const m = Math.floor(((count * mul) % 3600) / 60).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
    });
    const s = Math.floor((count * mul) % 60).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
    });
    setCurrentTime(`${h}:${m}:${s}`);

    // calculate plan
    const targetInSecond = targetHour * 3600 + targetMinute * 60;
    const planAmount = Math.floor((targetInSecond - count * mul) / targetCt);
    setPlan(planAmount);
  }, [count]);

  useEffect(() => {
    if (actual === 0) return;

    const currentTime = Date.now();
    const ct =
      Math.round((Math.abs(lastCount.current - currentTime) / 1000) * 10) / 10;
    addCtChartData.current({ topic: "", message: { ct: ct } })
    lastCount.current = currentTime;
  }, [actual]);

  useEffect(() => {
    // calculate mor
    let mor = 0;
    if (actual > 0 && plan === 0) {
      mor = 100;
    } else if (actual === 0 && plan === 0) {
      mor = 0;
    } else {
      mor = (actual / plan) * 100;
    }
    let loss = plan === 0 ? 0 : 100 - mor;
    mor = Math.round(mor * 10) / 10;
    loss = Math.round(loss * 10) / 10;
    setResultMOR(mor.toFixed(1));
    setResultLoss(loss.toFixed(1));
    setMorChartData([
      {
        name: "Result",
        type: "Loss",
        value: loss,
      },
      {
        name: "Result",
        type: "MOR",
        value: mor,
      },
    ]);

    // calculate result color
    const color = mor >= targetMOR ? "blue" : "red";
    setAmountColor(color);
  }, [plan, actual]);

  return (
    <MachineSignalContext.Provider value={context}>
      <div className="result">
        <div className="result__detail">
          <div className="result__target">
            <div className="result__target__wrapper">
              <p>Run time target : </p>
              <div className="result__target__input">
                <InputNumber
                  addonAfter="hour"
                  value={targetHour}
                  onChange={(value) => setTargetHour(value)}
                  disabled={play || pause}
                  formatter={(value) => {
                    let val: number | undefined = value;
                    if (typeof val === "string") val = parseInt(val);
                    return `${val?.toLocaleString("en-US", {
                      minimumIntegerDigits: 2,
                    })}`;
                  }}
                />
                <InputNumber
                  addonAfter="minute"
                  value={targetMinute}
                  onChange={(value) => setTargetMinute(value)}
                  disabled={play || pause}
                  formatter={(value) => {
                    let val: number | undefined = value;
                    if (typeof val === "string") val = parseInt(val);
                    return `${val?.toLocaleString("en-US", {
                      minimumIntegerDigits: 2,
                    })}`;
                  }}
                />
              </div>
              <p>MOR target : </p>
              <div className="result__target__input">
                <InputNumber
                  addonAfter="%"
                  value={targetMOR}
                  step={1}
                  onChange={(value) => setTargetCt(value)}
                  disabled={play || pause}
                />
              </div>
              <p>CT target : </p>
              <div className="result__target__input">
                <InputNumber
                  addonAfter="sec"
                  value={targetCt}
                  step={0.1}
                  onChange={(value) => setTargetCt(value)}
                  disabled={play || pause}
                  formatter={(value) => {
                    let val: number | undefined = value;
                    if (typeof val === "string") val = parseInt(val);
                    return `${val?.toLocaleString("en-US", {
                      minimumIntegerDigits: 2,
                      minimumFractionDigits: 1,
                    })}`;
                  }}
                />
              </div>
            </div>
          </div>
          <div className="result__running">
            <div className="result__running__wrapper">
              <div className="result__running__time">
                <div className="result__running__time__button">
                  <Button
                    shape="round"
                    type={play ? "primary" : "default"}
                    icon={<PlayCircleFilled />}
                    onClick={() => startTimer()}
                  >
                    start
                  </Button>
                  <Button
                    shape="round"
                    type={pause ? "primary" : "default"}
                    icon={<PauseCircleFilled />}
                    onClick={() => pauseTimer()}
                  >
                    pause
                  </Button>
                  <Button
                    shape="round"
                    type={stop ? "primary" : "default"}
                    icon={<CloseCircleFilled />}
                    onClick={() => stopTimer()}
                  >
                    stop
                  </Button>
                  <Button
                    shape="round"
                    type={"default"}
                    icon={<PlusCircleFilled />}
                    onClick={() => addActual.current()}
                  >
                    Add
                  </Button>
                </div>
                <p>
                  Running time : <span>{currentTime}</span>
                </p>
                <TimerCountdown
                  context={MachineSignalContext}
                  intervalTime_ms={100}
                  start={play}
                  pause={pause}
                  stop={stop}
                  targetHour={targetHour}
                  targetMinute={targetMinute}
                  showTimer={false}
                />
              </div>
              <div className="result__running__mor">
                <p>MOR : </p>
                <div className="result__running__mor__value">
                  <p>{resultMOR}</p>
                  <p style={{ marginLeft: 8 }}>%</p>
                </div>
              </div>
              <div className="result__running__loss">
                <p>Loss : </p>
                <div className="result__running__loss__value">
                  <p>{resultLoss}</p>
                  <p style={{ marginLeft: 8 }}>%</p>
                </div>
              </div>
              <div className="result__running__amount">
                <p>Amount : </p>
                <div
                  className="result__running__amount__value"
                  style={{ color: amountColor }}
                >
                  <p>{actual}</p>
                  <p>/</p>
                  <p>{plan}</p>
                  <p>pcs.</p>
                </div>
              </div>
              <div className="result__running__ct">
                <p>Avg CT : </p>
                <div className="result__running__ct__value">
                  <p>{resultCt}</p>
                  <p style={{ marginLeft: 8 }}>s.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="result__graph">
          <div
            id="morchart"
            className="result__graph__mor"
            style={{ width: 250, height: 320 }}
          />
          <div
            id="ctchart"
            className="result__graph__ct"
            style={{ height: 320 }}
          />
        </div>
      </div>
    </MachineSignalContext.Provider>
  );
};

export default Result;
