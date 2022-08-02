import Operation from "@/components/operation/operation";
import Result from "@/components/result";
import { LeftOutlined } from "@ant-design/icons";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const Signal: NextPage = () => {
  const router = useRouter();
  // const {p} = router.query
  // console.log(p)
  return (
    <div className="main signal">
      <header>
        <a className="back" onClick={() => router.back()}>
          <LeftOutlined />
          Back
        </a>
        <p>
          Add-on Virtual Interface Mapping - <span>Signal machine</span>
        </p>
      </header>
      <main>
        <Result />
        <Operation />
      </main>
    </div>
  );
};

export default Signal;
