import React, { useState, useEffect, useRef, useContext } from "react";
import { Form, Table, Input, Popconfirm, Button, message } from "antd";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/lib/form";
import {
  EditableRowProps,
  MachineSignalDataType,
  MachineSignalType,
  SignalType,
  TableProjectDataItem,
  TableProjectDataType,
} from "@/types/setting";
import { OperationContext } from "../operation/operation";
import { useRouter } from "next/router";
import { projects, signal_categories } from "@prisma/client";
import fetcher from "@/lib/fetcher";
import { ProjectToSignalCategoryType } from "@/types/data";
import { handleLoadProjectData } from "src/functions/loadData";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof TableProjectDataItem;
  record: TableProjectDataItem;
  handleSave: (record: TableProjectDataItem) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form?.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form?.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("save failed:", errInfo);
    }
  };

  const blur = () => {
    toggleEdit();
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={blur} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ProjectTable: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { set } = useContext(OperationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState<TableProjectDataType[]>([]);

  const loadProjects = async () => {
    setIsLoading(true);
    const projects: projects[] = await fetcher("/api/loadProjects");

    if (!projects) {
      message.error(`Response 'loadProject' was error.`);
      setIsLoading(false);
      return;
    }

    setDataSource(
      projects.map(({ project_id, project_name }, idx) => ({
        key: idx,
        project_id: project_id,
        project_name: project_name,
      }))
    );
    setIsLoading(false);
  };

  const handleDelete = async (project_id: number) => {
    setIsLoading(true);
    const deletedProject: projects = await fetcher("/api/deleteProject", {
      method: "DELETE",
      body: JSON.stringify({ project_id: project_id }),
    });

    if (!deletedProject) {
      message.error(`Response 'deleteProject' was error.`);
      return;
    }

    await loadProjects();
    message.success(`Deleted project name : ${deletedProject.project_name}`);
    setIsLoading(false);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Project name",
      dataIndex: "project_name",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "project_id",
      // @ts-ignore
      render: (_, { project_id, project_name }) =>
        dataSource.length >= 1 ? (
          <div className="operation-cell">
            <a
              onClick={() =>
                handleLoadProjectData(project_id, set)
              }
            >
              Load
            </a>
            <a
              onClick={() =>
                router.push({ pathname: "/", query: { p: project_id } })
              }
            >
              Setting
            </a>
            <Popconfirm
              title="Are you sure to delete"
              onConfirm={() => handleDelete(project_id)}
            >
              <a>Delete</a>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  const handleSave = (row: TableProjectDataType) => {
    console.log("save new row data:", row);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TableProjectDataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const onFinish = async (values: any) => {
    // create Project
    const body = {
      project_name: values.projectName,
    };
    const createdProject: projects = await fetcher("/api/createProject", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!createdProject) {
      message.error(`Response 'createProject' was error.`);
      return;
    }

    await loadProjects();
    message.success(`Created project name : ${createdProject.project_name}`);
  };

  useEffect(() => {
    async function InitialLoad() {
      await loadProjects();
    }
    InitialLoad();
  }, []);

  return (
    <div className="project-table">
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        loading={isLoading}
      />
      <div className="project-table__create">
        <p>Add new project</p>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="projectName" label="Project name" required>
            <Input allowClear />
          </Form.Item>
          <div className="project-table__create__button">
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProjectTable;
