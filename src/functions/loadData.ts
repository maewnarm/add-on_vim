import { ProjectDataContextType } from "@/components/operation/operation";
import fetcher from "@/lib/fetcher";
import { ProjectToSignalCategoryType } from "@/types/data";
import { MachineSignalType, SignalType } from "@/types/setting";
import { signal_categories } from "@prisma/client";
import { message } from "antd";

export const handleLoadProjectData = async (
  project_id: number,
  set: (proj: ProjectDataContextType) => void
) => {
  let project_name = "";
  const projectSignals: ProjectToSignalCategoryType[] = await fetcher(
    "/api/loadProjectSignals?" +
      new URLSearchParams({
        project_id: project_id.toString(),
      })
  );

  const signalCategories: signal_categories[] = await fetcher(
    "/api/loadCategories"
  );

  if (!projectSignals || !signalCategories) {
    message.error(
      `Response 'loadProjectSignals' or 'loadCategories' was error.`
    );
    set({
      project_id: 0,
      project_name: "",
      project_data: {},
      isLoading: false,
    });
    return;
  }

  const byMachineId = projectSignals.reduce(
    (acc, { machine_id, ...rest }) => ({
      ...acc,
      [machine_id]: acc[machine_id] ? [...acc[machine_id], rest] : [rest],
    }),
    {} as {
      [machine_id: number]: {
        project_id: number;
        project_name: string;
        machine_name: string;
        machine_signal_id: number;
        signal_id: number;
        signal_name: string;
        signal_category_id: number;
        category: string;
      }[];
    }
  );

  const projectData: MachineSignalType = Object.fromEntries(
    Object.entries(byMachineId).map(([machine_id, data]) => {
      project_name = data[0].project_name;
      return [
        machine_id,
        {
          project_id: data[0].project_id,
          project_name: data[0].project_name,
          machine_name: data[0].machine_name,
          signals: signalCategories.reduce(
            (acc, { category }) => ({
              ...acc,
              [category]: data.filter((signal) => signal.category === category),
            }),
            {} as SignalType
          ),
        },
      ];
    })
  );
  console.log(projectData);

  set({
    project_id: project_id,
    project_name: project_name,
    project_data: projectData,
    isLoading: false,
  });
};
