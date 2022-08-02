import Operation from "@/components/operation/operation";
import Result from "@/components/result";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  // const {p} = router.query
  // console.log(p)
  return (
    <div className="main home">
      <header>
        <p>Add-on Virtual Interface Mapping</p>
      </header>
      <div className="menu">
        <p>Menu</p>
        <Link href="/signal">Signal machine</Link>
        <Link href="/motion">Human motion</Link>
      </div>
    </div>
  );
};

export default Home;
