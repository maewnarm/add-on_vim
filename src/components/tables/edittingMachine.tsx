import fetcher from "@/lib/fetcher";
import { EdittingMachineModalProps } from "@/types/setting";
import { machines } from "@prisma/client";
import { Button, Form, Input, message, Modal } from "antd";
import React from "react";

interface EdittingMachineProps {
  edittingProps: EdittingMachineModalProps;
  reload: () => Promise<void>;
}

const EdittingMachine: React.FC<EdittingMachineProps> = ({
  edittingProps,
  reload,
}) => {
  const { visible, machine_id, machine_name, setVisible } = edittingProps;
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    // update machine name
    const updatedMachine: machines = await fetcher("/api/updateMachine", {
      method: "PUT",
      body: JSON.stringify({
        machine_id: machine_id,
        machine_name: values.machineName,
      }),
    });

    if (!updatedMachine) {
      message.error(`Response 'updateMachine' was error.`);
      return;
    }

    message.success(`Updated machine name : ${updatedMachine.machine_name}`);
    await reload();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Modal
        title="Machine Editting"
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Back
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="machineName" label="Machine name" required>
            <Input defaultValue={"asda"} allowClear />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EdittingMachine;
