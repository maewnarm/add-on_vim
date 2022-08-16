import { MotionContext } from "@/pages/motion";
import { Chart } from "@antv/g2";
import React, { useEffect, useState } from "react";

interface StdTimechartProps {
  id: number;
  intervalTime_ms: number;
  subCount: number;
  targetSecond: number;
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
  value: [number, number];
};

const StdTimechart: React.FC<StdTimechartProps> = (props) => {
  const { id, intervalTime_ms, subCount, targetSecond, stdData } = props;
  // const { count, stepCount } = React.useContext(MotionContext);
  const [chart, setChart] = useState<Chart>();
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [timeRangeData, setTimeRangeData] = useState<[number, number][]>([]);
  const chartStdData = stdData.reduce((acc, data) => {
    const last = acc.length < 1 ? [0, 0] : acc[acc.length - 1].value;
    const sum = last[1];
    return [
      ...acc,
      {
        index: data.index + 1,
        name: data.name,
        value: [sum, sum + data.value],
      } as ChartDataType,
    ];
  }, [] as ChartDataType[]);
  const createChart = () => {
    if (!chart) {
      const c = new Chart({
        container: `timechart-${id}`,
        autoFit: true,
        padding: [40, 20, 10, 40],
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
          const val: number[] = data[0]?.value.split("-");
          return (
            val &&
            `(${data[0]?.data.index})  ${title}: ${(val[1] - val[0]).toFixed(
              1
            )} s.`
          );
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
        title: {
          text: "Time (s)",
          autoRotate: true,
          offset: 28,
          style: {
            fill: "#000",
            fontWeight: 700,
          },
        },
      })
      .scale("name", {
        nice: true,
        tickCount: 20,
      })
      .scale("value", {
        nice: true,
        tickInterval: 1,
        max: Math.ceil(targetSecond),
        formatter: (value) => value.toFixed(1),
      })
      .interaction("element-active")
      .interval()
      .animate(false)
      // .adjust("stack")
      .position("name*value")
      .color("#888");
    chart.render();
  };

  useEffect(() => {
    // setChartData(chartStdData);

    // store time range value
    setTimeRangeData(chartStdData.map((data) => data.value));
    // delete time range value
    let emptyChartData = [...chartStdData];
    emptyChartData = emptyChartData.map((data) => ({ ...data, value: [0, 0] }));

    setChartData(emptyChartData);

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

  useEffect(() => {
    const target = timeRangeData;
    let data = [...chartData];
    const mul = intervalTime_ms / 1000;
    let rangeIndex = 0;
    let subCountSecond = Math.round(subCount * mul * 10) / 10;

    if (subCountSecond === targetSecond) {
      return;
    }

    if (subCount === 0) {
      // reset data
      data.forEach((_, idx) => (data[idx].value = [0, 0]));
    }

    target.every((range, idx) => {
      if (subCountSecond > range[0] && subCountSecond <= range[1]) {
        rangeIndex = idx;
        return false;
      }

      return true;
    });

    if (!data[rangeIndex]) return;

    data[rangeIndex].value = [
      target[rangeIndex] ? target[rangeIndex][0] : 0,
      target[rangeIndex] ? subCountSecond : 0,
    ];

    if (!chart) return;

    chart.changeData(data);
  }, [subCount]);

  return (
    <div className="std-timechart custom-scrollbar">
      <span className="y-label">Step</span>
      <div className="std-timechart__wrapper">
        <div
          id={`timechart-${id}`}
          className="std-timechart__wrapper__chart"
          style={{ height: 200, width: 330 }}
        />
      </div>
    </div>
  );
};

export default StdTimechart;
