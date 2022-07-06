import Operation from "@/components/operation/operation";
import Result from "@/components/result";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  // const {p} = router.query
  // console.log(p)
  return (
    <div className="vim">
      <header>
        <p>Add-on Virtual Interface Mapping</p>
      </header>
      <main>
        <Result />
        <Operation />
      </main>
    </div>
  );
};

export default Home;
