import Standardized from "@/components/motion/std/standardized";
import StdTable from "@/components/motion/std/table";
import StdTimechart from "@/components/motion/std/timechart";
import { LeftOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { useRouter } from "next/router";
import React from "react";

const Motion = () => {
  const router = useRouter();
  return (
    <div className="main motion">
      <header>
        <a className="back" onClick={() => router.back()}>
          <LeftOutlined />
          Back
        </a>
        <p>
          Add-on Virtual Interface Mapping
          <br/>
          <span>[Lean Cardboard + e-Motion]</span>
          <br/>
          <p className="sub">{`(Human + Karakuri + Automation)`}</p>
        </p>
      </header>
      <div className="motion__wrapper">
        <div className="motion__std custom-scrollbar">
          <div className="motion__std__stdized">
            <p>Standardized</p>
            <div className="motion__std__stdized__inner">
              <div className="motion__std__stdized__inner__element">
                <Standardized id={1}/>
              </div>
            </div>
          </div>
        </div>
        <div className="motion__divider" />
        <div className="motion__virtual">
          <div className="motion__virtual__live"></div>
          <div className="motion__virtual__std">
            <div className="motion__virtual__std__original"></div>
            <div className="motion__virtual__std__record"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Motion;
