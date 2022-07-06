import fetcher from "@/lib/fetcher";
import { SignalCategoryDataType, SignalDataType } from "@/types/setting";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { signals, signal_categories } from "@prisma/client";
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import type { ColumnsType } from "antd/lib/table";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const { Option } = Select;

const Signals = () => {
  const router = useRouter();
  const [form_cats] = Form.useForm();
  const [form_signals] = Form.useForm();
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isSignalLoading, setIsSignalLoading] = useState(false);
  const [categories, setCategories] = useState<SignalCategoryDataType[]>([]);
  const [signals, setSignals] = useState<
    (SignalDataType & SignalCategoryDataType)[]
  >([]);

  const categoryColumns: ColumnsType<SignalCategoryDataType> = [
    {
      key: "signal_category_id",
      title: "ID",
      dataIndex: "signal_category_id",
    },
    {
      key: "category",
      title: "Category",
      dataIndex: "category",
    },
    {
      key: "operation",
      title: "Operations",
      render: (_, { signal_category_id }) => (
        <div className="operation-cell">
          <Popconfirm
            title="Are you sure to delete"
            onConfirm={() => handleDeleteCategory(signal_category_id)}
          >
            <a>Delete</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const signalColumns: ColumnsType<SignalDataType & SignalCategoryDataType> = [
    {
      key: "signal_id",
      title: "ID",
      dataIndex: "signal_id",
    },
    {
      key: "category",
      title: "Category",
      dataIndex: "category",
    },
    {
      key: "signal_name",
      title: "Signal name",
      dataIndex: "signal_name",
    },
    {
      key: "operations",
      title: "Operations",
      dataIndex: "operations",
      render: (_, { signal_id }) => (
        <div className="operation-cell">
          <Popconfirm
            title="Are you sure to delete"
            onConfirm={() => handleDeleteSignal(signal_id)}
          >
            <a>Delete</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const loadCategories = async () => {
    setIsCategoryLoading(true);
    const categories: signal_categories[] = await fetcher(
      "/api/loadCategories"
    );

    if (!categories) {
      message.error(`Response 'loadCategories' was error.`);
      setIsCategoryLoading(false);
      return;
    }

    setCategories(categories);
    setIsCategoryLoading(false);
  };

  const loadSignals = async () => {
    setIsSignalLoading(true);
    const signals: (signals & { signal_category: signal_categories })[] =
      await fetcher("/api/loadSignals");

    if (!signals) {
      message.error(`Response 'loadSignals' was error.`);
      setIsSignalLoading(false);
      return;
    }

    setSignals(
      signals.map(
        ({
          signal_id,
          signal_name,
          signal_category_id,
          signal_category: { category },
        }) => ({
          signal_id: signal_id,
          signal_name: signal_name,
          signal_category_id: signal_category_id,
          category: category,
        })
      )
    );
    setIsSignalLoading(false);
  };

  const onCategoryFinish = async (values: any) => {
    // check repeated
    const check = categories.find((cat) => cat.category === values.category);
    if (!!check) {
      message.error(
        `New category was repeated (${values.category}), please use other name`
      );
      return;
    }

    const createdCategory: signal_categories = await fetcher(
      "/api/createCategory",
      {
        method: "POST",
        body: JSON.stringify({
          category: values.category,
        }),
      }
    );

    if (!createdCategory) {
      message.error(`Response 'createCategory' was error.`);
      return;
    }

    await loadCategories();
    message.success(`Created category name : ${createdCategory.category}`);
  };

  const onSignalFinish = async (values: any) => {
    // check repeated
    const check = signals.find((sig) => sig.signal_name === values.signalName);
    if (!!check) {
      message.error(
        `New signal was repeated (${values.signalName}), please use other name`
      );
      return;
    }

    const createdSignal: signals = await fetcher("/api/createSignal", {
      method: "POST",
      body: JSON.stringify({
        signal_name: values.signalName,
        signal_category_id: values.categoryId,
      }),
    });

    if (!createdSignal) {
      message.error(`Response 'createSignal' was error.`);
      return;
    }

    await loadSignals();
    message.success(`Created signal name : ${createdSignal.signal_name}`);
  };

  const handleDeleteCategory = async (category_id: number) => {
    const deletedCategory: signal_categories = await fetcher(
      "/api/deleteCategory",
      {
        method: "DELETE",
        body: JSON.stringify({ category_id: category_id }),
      }
    );

    if (!deletedCategory) {
      message.error(`Response 'deleteCategory' was error.`);
      return;
    }

    await loadCategories();
    await loadSignals();
    message.success(`Deleted category name : ${deletedCategory.category}`);
  };

  const handleDeleteSignal = async (signal_id: number) => {
    const deletedSignal: signals = await fetcher("/api/deleteSignal", {
      method: "DELETE",
      body: JSON.stringify({ signal_id: signal_id }),
    });

    if (!deletedSignal) {
      message.error(`Response 'deleteSignal' was error.`);
      return;
    }

    await loadSignals();
    message.success(`Deleted signal name : ${deletedSignal.signal_name}`);
  };

  useEffect(() => {
    async function InitialLoad() {
      await loadCategories();
      await loadSignals();
    }
    InitialLoad();
  }, []);

  return (
    <div className="signals">
      <div className="signals__back" onClick={() => router.back()}>
        <ArrowLeftOutlined />
        <p>Back</p>
      </div>
      <h2>Signal categories</h2>
      <Table
        rowKey={(record) => record.signal_category_id}
        columns={categoryColumns}
        dataSource={categories}
        bordered
        loading={isCategoryLoading}
      />
      <div className="signals__form form-category">
        <Form form={form_cats} onFinish={onCategoryFinish}>
          <Form.Item name="category" label="Category name">
            <Input allowClear />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form>
      </div>
      <Divider />
      <h2>Signals</h2>
      <Table
        rowKey="signal_id"
        columns={signalColumns}
        dataSource={signals}
        bordered
        loading={isSignalLoading}
      />
      <div className="signals__form form-signals">
        <Form form={form_signals} onFinish={onSignalFinish}>
          <Form.Item name="categoryId" label="Category">
            <Select placeholder="Select category" allowClear>
              {categories.map((cat, idx) => (
                <Option key={idx} value={cat.signal_category_id}>
                  {cat.category}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="signalName" label="Signal name">
            <Input allowClear />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Signals;
