import Operation from "@/components/signal/operation/operation";
import Result from "@/components/signal/result";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Signal: NextPage = () => {
  const router = useRouter();
  // const {p} = router.query
  // console.log(p)
  return (
    <div className="main signal custom-scrollbar">
      <div className="sub-header sub-header-1">
        <span>{"Interface Mapping"}</span>
      </div>
      <div className="sub-header sub-header-2">
        <span>{"Machine Signals"}</span>
      </div>
      <main>
        <Result />
        <Operation />
      </main>
    </div>
  );
};

export default Signal;
