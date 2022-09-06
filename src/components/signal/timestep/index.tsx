import { Chart } from "@antv/g2";
import React, { useState, useEffect } from "react";

type StepChartDataTypes = {
  signal: string;
  time: number;
  value: number;
};

const demoData: StepChartDataTypes[] = [
  { signal: "signal01", time: 1, value: 0 },
  { signal: "signal01", time: 2, value: 1 },
  { signal: "signal01", time: 3, value: 1 },
  { signal: "signal01", time: 4, value: 1 },
  { signal: "signal01", time: 5, value: 0 },
  { signal: "signal01", time: 6, value: 0 },
  { signal: "signal02", time: 1, value: 1 },
  { signal: "signal02", time: 2, value: 1 },
  { signal: "signal02", time: 3, value: 1 },
  { signal: "signal02", time: 4, value: 1 },
  { signal: "signal02", time: 5, value: 0 },
  { signal: "signal02", time: 6, value: 0 },
];

const TimeStepline = () => {
  const [stepChart, setStepChart] = useState<Chart>();
  const [stepChartRaw, setStepChartRaw] =
    useState<StepChartDataTypes[]>(demoData);
  const [stepChartData, setStepChartData] = useState<StepChartDataTypes[]>([]);

  const createStepChart = () => {
    if (stepChart) return;

    const c = new Chart({
      container: "stepline",
      autoFit: true,
      height: 200,
      padding: [20,30,50,40]
    });
    setStepChart(c);
  };

  const addStepChartProps = () => {
    if (!stepChart) return;

    stepChart.data(stepChartData);
    stepChart.scale("time", {
      range: [0, 1],
      nice: true,
    });
    stepChart.scale("value", {
      nice: true,
      tickInterval: 1,
      formatter: (value) => (value % 2 ? "on" : "off"),
    });
    stepChart.legend({
      padding: [10,10,0,10],
      itemName: {
        style: {
          fontSize: 20
        }
      }
    })
    stepChart.line().position("time*value").shape("hv").color("signal");
    stepChart.render();
  };

  const offsetSignalData = () => {
    // get unique signal
    const signals = [...new Set(stepChartRaw.map((d) => d.signal))];

    // offset value
    let offset: { [signal: string]: number } = {};
    signals.forEach((signal, idx) => (offset[signal] = idx));
    console.log("offset : ",offset)
    let chartData: StepChartDataTypes[] = JSON.parse(JSON.stringify(stepChartRaw));
    chartData = chartData.map((data) => {
      data.value += 2 * offset[data.signal];
      return data 
    });
    setStepChartData(chartData);
  };

  useEffect(() => {
    createStepChart();
  }, []);

  useEffect(() => {
    if (!stepChart) return;

    addStepChartProps();
  }, [stepChart]);

  useEffect(() => {
    offsetSignalData();
  }, [stepChartRaw]);

  return (
    <div
      id="stepline"
      className="operation__interface__stepline__graph"
      style={{ height: 200 }}
    />
  );
};

export default TimeStepline;
