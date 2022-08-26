import { Chart } from "@antv/g2";
import React, { useEffect, useState } from "react";

const Result = () => {
  const [barChart, setBarChart] = useState<Chart>();
  const [lineChart, setLineChart] = useState<Chart>();

  const createBarChart = () => {
    if (!barChart) return;

    const barchart = new Chart({
      container: "barchart",
      autoFit: true,
      height: 500,
    });
  };

  useEffect(() => {
    createBarChart();
  }, []);

  return (
    <div className="result">
      <div className="result__running">
        <p>
          Running time: <span>01:00:00</span> s.
        </p>
      </div>
      <div className="result__mor">
        <p>MOR : </p>
        <div className="result__mor__value">
          <p>100.0</p>
          <p>%</p>
        </div>
      </div>
      <div className="result__loss">
        <p>Loss : </p>
        <div className="result__loss__value">
          <p>100.0</p>
          <p>%</p>
        </div>
      </div>
      <div className="result__ct">
        <p>CT : </p>
        <div className="result__ct__value">
          <p>12.3</p>
          <p>s.</p>
        </div>
      </div>
      <div className="result__graph">
        <div
          id="barchart"
          className="result__graph__bar"
          style={{ width: 300, height: 500 }}
        >MOR chart</div>
        <div
          id="linechart"
          className="result__graph__chart"
          style={{ width: 300, height: 500 }}
        >CT chart</div>
      </div>
    </div>
  );
};

export default Result;
