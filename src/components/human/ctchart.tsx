import { HumanContext } from "@/pages/human";
import { CtChartDataType } from "@/types/human";
import { Chart } from "@antv/g2";
import React, { useState, useContext, useEffect } from "react";

const HumanCtChart = () => {
  const { resultData } = useContext(HumanContext);
  const [chart, setChart] = useState<Chart>();
  const [chartData, setChartData] = useState<CtChartDataType[]>([]);

  const createChart = () => {
    const c = new Chart({
      container: "human-ctchart",
      autoFit: true,
      height: 280,
      padding: [30, 20, 30, 95],
    });

    setChart(c);
  };

  const addChartProps = () => {
    if (!chart) return;

    chart.scale({
      name: {
        range: [0, 1],
      },
      HT: {
        min: 0,
        nice: true,
      },
    });
    chart.axis("name", {
      label: {
        style: {
          fontSize: 20,
        },
      },
    });
    chart.axis("HT", {
      label: {
        style: {
          fontSize: 20,
        },
        offset: 35,
      },
      title: {
        text: "Sum HT (s.)",
        autoRotate: true,
        style: {
          fontSize: 20,
          fontWeight: 600,
        },
        offset: 75,
      },
    });
    chart.tooltip({
      showCrosshairs: true,
      shared: true,
      customItems: (items) =>
        items.map((item) => ({
          ...item,
          value: `${
            isNaN(Number(item.value)) ? "-" : Number(item.value).toFixed(1)
          } s.`,
        })),
      domStyles: {
        "g2-tooltip": {
          fontSize: "16px",
        },
        "g2-tooltip-title": {
          fontSize: "20px",
          fontWeight: 700,
        },
      },
    });
    chart
      .line()
      .position("name*HT")
      .label({
        fields: ["HT"],
        cfg: {
          style: {
            fontSize: 20,
            fontWeight: 600,
          },
          content: (content) => `${content.HT} s.`,
        },
      })
      .color("#C84B31")
      .size(4);
    chart.point().position("name*HT").color("#C84B31").size(5);

    chart.render();
  };

  useEffect(() => {
    if (chart) return;

    createChart();
  }, []);

  useEffect(() => {
    if (!chart) return;

    addChartProps();
  }, [chart]);

  useEffect(() => {
    const data: CtChartDataType[] = resultData.map((trialData, idxTrial) => ({
      name: `Trial #${idxTrial + 1}`,
      HT: Math.round(trialData.reduce((sum, cur) => sum + cur, 0) * 10) / 10,
    }));
    console.log(resultData);

    setChartData(data);
  }, [resultData]);

  useEffect(() => {
    if (!chart) return;

    chart.changeData(chartData);
  }, chartData);

  return (
    <div className="human__ctchart">
      <p>Trial result (sum)</p>
      <div className="human__ctchart__wrapper">
        <div id="human-ctchart" />
      </div>
    </div>
  );
};

export default HumanCtChart;
