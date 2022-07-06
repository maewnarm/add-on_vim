import ProjectTable from "./projectTable";
import { useRouter } from "next/router";
import SignalTable from "./signalTable";
import { ProjectType } from "@/types/data";

export const SettingTable:React.FC = () => {
  const router = useRouter();
  const { p } = router.query;

  return (
    <div className="setting-table">
      {!!!p && <ProjectTable/>}
      {!!p && <SignalTable projectId={p}/>}
    </div>
  );
};
