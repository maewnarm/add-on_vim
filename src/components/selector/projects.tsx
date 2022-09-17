import React, { useState, useEffect } from "react";
import { Select } from "antd";

const { Option } = Select;

interface SelectorProps {
  set: React.Dispatch<React.SetStateAction<string>>;
}

const ProjectSelector: React.FC<SelectorProps> = (props) => {
  const { set } = props;
  const [projectList, setProjectList] = useState<
    { name: string; value: string }[]
  >([]);

  const loadProjectListData = async () => {
    await fetch(`/api/static/get?filePath=static_projects.json`).then(
      async (res) => {
        const data = JSON.parse(await res.json());
        setProjectList(data);
      }
    );
  };

  useEffect(() => {
    loadProjectListData();
  }, []);

  return (
    <Select
      showSearch
      placeholder="Select project"
      onChange={(value) => set(value)}
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option!.children as unknown as string).includes(input)
      }
      filterSort={(optionA, optionB) =>
        (optionA!.children as unknown as string)
          .toLowerCase()
          .localeCompare((optionB!.children as unknown as string).toLowerCase())
      }
      popupClassName="project-selector__popup"
    >
      {projectList.map((project, idx) => (
        <Option key={idx} value={project.value}>
          {project.name}
        </Option>
      ))}
    </Select>
  );
};

export default ProjectSelector;
