import { HumanContext } from "@/pages/human";
import { ResultHtChartDataType } from "@/types/human";
import { Chart, registerAction, getActionClass, View } from "@antv/g2";
import React, { useState, useEffect, useContext, useRef } from "react";

interface HumanResultChartProps {
  indexData: number;
}

const HumanResultChart: React.FC<HumanResultChartProps> = (props) => {
  const { indexData } = props;
  const { tableData, resultData } = useContext(HumanContext);
  const [chart, setChart] = useState<Chart>();
  const [chartData, setChartData] = useState<ResultHtChartDataType[]>([]);

  const createChart = () => {
    const c = new Chart({
      container: "human-result-chart",
      autoFit: true,
      height: 350,
      padding: [60, 70, 30, 60],
    });

    setChart(c);
  };

  const addChartProps = () => {
    if (!chart) return;

    const ButtonAction = getActionClass("reset-button");
    registerAction("reset-button", ButtonAction, {
      name: "reset-button",
      text: "Reset view",
    });

    chart.scale("HT", {
      nice: true,
    });
    chart.axis("step", {
      label: {
        style: {
          fontSize: 16,
        },
      },
    });
    chart.axis("HT", {
      label: {
        style: {
          fontSize: 20,
        },
      },
      title: {
        text: "HT (s.)",
        autoRotate: true,
        style: {
          fontSize: 20,
          fontWeight: 600,
        },
      },
    });
    chart.axis("avg", {
      grid: null,
      label: {
        style: {
          fontSize: 20,
        },
      },
      title: {
        text: "Average (s.)",
        autoRotate: true,
        style: {
          fontSize: 20,
          fontWeight: 600,
          fill: "#fdae6b",
        },
        offset: 50,
      },
    });
    chart.legend({
      padding: [10, 0, 10, 0],
      position: "top-right",
      itemName: {
        style: {
          fontSize: 20,
        },
      },
      marker: {
        style: {
          r: 8,
        },
      },
    });
    chart.tooltip({
      showMarkers: false,
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
      .interval({
        intervalPadding: 15,
        columnWidthRatio: 1,
      })
      .position("step*HT")
      .color("name")
      .animate(true)
      .adjust([{ type: "dodge", marginRatio: 0 }]);
    chart.line().position("step*avg").color("#fdae6b").size(3).tooltip(false);
    chart.point().position("step*avg").color("#fdae6b").size(5).shape("circle");

    chart.interaction("brush");
    chart.interaction("element-highlight-by-color");
    chart.interaction("active-region");

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
    if (!chart) return;

    let data: ResultHtChartDataType[] = JSON.parse(JSON.stringify(resultData));

    // reaarage result data of each step
    let trialDataByStep: number[][] = resultData[0]?.map(() => [] as number[]);
    resultData.forEach((trialData, idxTrial) => {
      trialData.forEach((stepData, idxStep) => {
        // put data by step
        trialDataByStep[idxStep].push(stepData);
      });
    });

    // calculate with ignore value == 0
    const averageByStep = trialDataByStep.map((stepData) => {
      const filtered = stepData.filter((data) => data !== 0);
      return (
        Math.round(
          (filtered.reduce((sum, cur) => sum + cur, 0) / filtered.length) * 100
        ) / 100
      );
    });

    resultData.forEach((trialData, idxTrial) => {
      trialData.forEach((stepData, idxStep) => {
        data[(idxTrial + 1) * trialData.length + idxStep] = {
          step: `step ${idxStep + 1}`,
          name: `#${idxTrial + 1}`,
          HT: stepData,
        };
      });
    });

    tableData[indexData]?.forEach((stdData, idxStep) => {
      data[idxStep] = {
        step: `step ${idxStep + 1}`,
        name: "Standard",
        HT: stdData.HT,
      };

      data.push({
        step: `step ${idxStep + 1}`,
        name: "Average",
        avg: averageByStep[idxStep],
      });
    });

    setChartData(data);
  }, [resultData]);

  useEffect(() => {
    if (!chart) return;

    chart.changeData(chartData);
  }, [chartData]);

  return (
    <div className="human__result__chart">
      <p>Summary chart</p>
      <div className="human__result__chart__wrapper">
        <div id="human-result-chart" />
      </div>
    </div>
  );
};

export default HumanResultChart;
