import TimerUp from "@/components/timer/timerup";
import { CaretRightOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { TableDataType } from "./standardized";

interface StdTableProps {
  tableData: TableDataType[]
}

const StdTable:React.FC<StdTableProps> = (props) => {
  const {tableData} = props

  return (
    <div className="std-table custom-scrollbar">
      <div className="std-table__wrapper">
        <div className="std-table__wrapper__table">
          <table>
            <thead>
              <tr>
                <th rowSpan={2}></th>
                <th rowSpan={2}>Step</th>
                <th rowSpan={2}>Operation</th>
                <th rowSpan={2}>Standard</th>
                <th colSpan={5}>Trial</th>
              </tr>
              <tr>
                <th>#1</th>
                <th>#2</th>
                <th>#3</th>
                <th>#4</th>
                <th>#5</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, idx) => (
                <tr
                  key={idx}
                  className="step-row"
                  id={`row-${idx + 1}`}
                >
                  <td>
                    <CaretRightOutlined />
                  </td>
                  <td>{idx + 1}</td>
                  <td>
                    <Tooltip
                      title={data.operation}
                      placement="topLeft"
                      mouseEnterDelay={0.5}
                      mouseLeaveDelay={0}
                    >
                      {data.operation}
                    </Tooltip>
                  </td>
                  <td>{data.HT > 0 ? data.HT.toFixed(1) : ""}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  {/* <td>{data.MT > 0 ? data.MT.toFixed(1) : ""}</td>
                  <td>{data.WT > 0 ? data.WT.toFixed(1) : ""}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StdTable;
