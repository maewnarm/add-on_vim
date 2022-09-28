import { LeftOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="navbar">
      <Tooltip title="Home">
        <a className="back" onClick={() => router.push("/")}>
          <LeftOutlined />
          <img src="/denso-vector-logo.svg" alt="denso-logo" />
        </a>
      </Tooltip>
      <span className="title">DX Engineer - Add-on Development</span>
    </div>
  );
};

export default Navbar;
