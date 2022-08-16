import React, { useEffect, useState } from "react";
import {
  SignalModalProps,
  TableSettingSignalType,
  EdittingMachineModalProps,
} from "@/types/setting";
import ModalSignalSetting from "./settingSignal";
import type { ColumnsType } from "antd/lib/table";
import { Button, Form, Input, message, Popconfirm, Table } from "antd";
import fetcher from "@/lib/fetcher";
import { machines } from "@prisma/client";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import EdittingMachine from "./edittingMachine";

interface SignalTableProps {
  projectId: string | string[];
}

const SignalTable: React.FC<SignalTableProps> = ({ projectId }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [edittingProps, setEdittingProps] = useState<EdittingMachineModalProps>(
    {
      visible: false,
      project_id: 0,
      machine_id: 0,
      machine_name: "",
      setVisible: () => {},
    }
  );
  const [settingProps, setSettingProps] = useState<SignalModalProps>({
    visible: false,
    project_id: 0,
    machine_id: 0,
    setVisible: () => {},
  });
  const [signalTableData, setSignalTableData] = useState<
    TableSettingSignalType[]
  >([]);

  const columns: ColumnsType<TableSettingSignalType> = [
    {
      key: "machine_id",
      title: "ID",
      dataIndex: "machine_id",
    },
    {
      key: "machine_name",
      title: "Machine",
      dataIndex: "machine_name",
    },
    {
      key: "operation",
      title: "Setting",
      dataIndex: "operation",
      // @ts-ignore
      render: (_, { machine_id, machine_name }) => (
        <div className="operation-cell">
          <a
            onClick={() =>
              setEdittingProps({
                ...edittingProps,
                visible: true,
                machine_id: machine_id,
                machine_name: machine_name,
                setVisible: setEdittingVisible,
              })
            }
          >
            Edit
          </a>
          <a
            onClick={() =>
              setSettingProps({
                ...settingProps,
                visible: true,
                project_id: parseInt(projectId.toString()),
                machine_id: machine_id,
                setVisible: setSettingVisible,
              })
            }
          >
            Signals
          </a>
          <Popconfirm
            title="Are you sure to delete"
            onConfirm={() => handleDelete(machine_id)}
          >
            <a>Delete</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const setEdittingVisible = (visible: boolean) => {
    setEdittingProps({
      ...edittingProps,
      visible: visible,
    });
  };

  const setSettingVisible = (visible: boolean) => {
    setSettingProps({
      ...settingProps,
      visible: visible,
    });
  };

  const handleDelete = async (machine_id: number) => {
    setIsLoading(true);
    const deletedMachine: machines = await fetcher("/api/deleteMachine", {
      method: "DELETE",
      body: JSON.stringify({ machine_id: machine_id }),
    });

    if (!deletedMachine) {
      message.error(`Response 'deleteProject' was error.`);
      return;
    }

    await loadMachines();
    message.success(`Deleted machine name : ${deletedMachine.machine_name}`);
    setIsLoading(false);
  };

  const loadMachines = async () => {
    setIsLoading(true);
    const machines: machines[] = await fetcher(
      "/api/loadMachines?" +
        new URLSearchParams({
          projectId: projectId.toString(),
        })
    );

    if (!machines) {
      message.error(`Response 'loadMachines' was error.`);
      setIsLoading(false);
      return;
    }

    setSignalTableData(
      machines.map(({ machine_id, machine_name }, idx) => ({
        key: idx,
        machine_id: machine_id,
        machine_name: machine_name,
      }))
    );
    setIsLoading(false);
  };

  const onFinish = async (values: any) => {
    // create Machine
    const body = {
      machine_name: values.machineName,
      project_id: parseInt(projectId.toString()),
    };
    const createdMachine: machines = await fetcher("/api/createMachine", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!createdMachine) {
      message.error(`Response 'createMachine' was error.`);
      return;
    }

    await loadMachines();
    message.success(`Created project name : ${createdMachine.machine_name}`);
  };

  useEffect(() => {
    async function InitialLoad() {
      await loadMachines();
    }
    InitialLoad();
  }, []);

  return (
    <div className="signal-table">
      <div className="signal-table__header">
        <LeftOutlined onClick={() => router.back()} />
        <p>Signal settings</p>
      </div>
      <Table
        columns={columns}
        dataSource={signalTableData}
        bordered
        loading={isLoading}
      />
      <div className="signal-table__create">
        <p>Add new project</p>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="machineName" label="Machine name" required>
            <Input allowClear />
          </Form.Item>
          <div className="project-table__create__button">
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </div>
        </Form>
      </div>
      <ModalSignalSetting settingProps={settingProps} />
      <EdittingMachine edittingProps={edittingProps} reload={loadMachines} />
    </div>
  );
};

export default SignalTable;
