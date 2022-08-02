import { Chart } from "@antv/g2";
import React, { useEffect, useState } from "react";

interface StdTimechartProps {
  id: number
  stdData: StdDataType[];
}

type StdDataType = {
  index: number;
  name: string;
  value: number;
};

type ChartDataType = {
  index: number;
  name: string;
  value: number[];
};

const StdTimechart: React.FC<StdTimechartProps> = (props) => {
  const { id,stdData } = props;
  const [chart, setChart] = useState<Chart>();
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const chartStdData = stdData.reduce((acc, data) => {
    console.log(acc);
    const last = acc.length === 0 ? [0, 0] : acc[acc.length - 1].value;
    const sum = last[1];
    console.log(sum);
    return [
      ...acc,
      {
        index: data.index + 1,
        name: data.name,
        value: [sum, sum + data.value],
      },
    ];
  }, [] as ChartDataType[]);
  console.log(chartStdData);
  const createChart = () => {
    if (!chart) {
      const c = new Chart({
        container: `timechart-${id}`,
        autoFit: true,
        padding: [35, 10, 10, 30],
      });
      setChart(c);
    }
  };

  const addChartProps = () => {
    if (!chart) return;

    chart.coordinate("rect").reflect("y").transpose();
    chart
      .legend(false)
      .tooltip({
        customContent: (title, data) => {
          const val:number[] = data[0]?.value.split("-");
          return val && `(${data[0]?.data.index})  ${title}: ${(val[1] - val[0]).toFixed(1)} s.`;
        },
        showMarkers: false,
        domStyles: {
          "g2-tooltip": {
            padding: "0.4rem 0.2rem",
            fontWeight: 500,
          },
          "g2-tooltip-value": {},
        },
      })
      .axis("name", {
        animateOption: {
          update: {
            duration: 100,
            easing: "easeLinear",
          },
        },
        label: {
          formatter: (_, __, idx) => idx + 1,
        },
      })
      .axis("value", {
        animateOption: {
          update: {
            duration: 100,
            easing: "easeLinear",
          },
        },
        label: {
          style: {
            fill: "black",
            fontSize: 12,
          },
        },
        title:{
          text: "Time",
          autoRotate: true,
          offset: 28,
          style: {
            fill: "#000",
            fontWeight: 700,
          }
        }
      })
      .scale("value", {
        nice: true,
        tickCount: 10,
        formatter: (value) => value.toFixed(1),
      })
      .interaction("element-active")
      .interval()
      // .adjust("stack")
      .position("name*value")
      .color("type*name", (type, name) => {
        if (type === "noshow") {
          return "#ffffff00";
        } else {
          return "#000";
        }
      });
    chart.render();
  };

  useEffect(() => {
    setChartData(chartStdData);
    createChart();
  }, []);

  useEffect(() => {
    if (chart) {
      addChartProps();
    }
  }, [chart]);

  useEffect(() => {
    if (!chart) return;
    chart.changeData(chartData);
  }, [chartData]);

  return (
    <div className="std-timechart custom-scrollbar">
      <div className="std-timechart__wrapper">
        <div
          id={`timechart-${id}`}
          className="std-timechart__wrapper__chart"
          style={{ height: 200 }}
        />
      </div>
    </div>
  );
};

export default StdTimechart;
