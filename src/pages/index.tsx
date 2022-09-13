import { ApiOutlined, IdcardOutlined, SmileOutlined } from "@ant-design/icons";
import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="main home">
      <div className="menu">
        <p className="menu__main">Menu</p>
        <div className="menu__sub">
          <p>Virtual Simulation</p>
          <Link href="/motion">
            <a>
              <IdcardOutlined />
              <span>e-Motion</span>
            </a>
          </Link>
        </div>
        <div className="menu__sub">
          <p>Interface Mapping</p>
          <Link href="/signal">
            <a>
              <ApiOutlined />
              <span>Signal Interface</span>
            </a>
          </Link>
          <Link href="/human">
            <a>
              <SmileOutlined />
              <span>Human Interface</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
