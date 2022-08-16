import React, { useContext, useEffect, useState } from "react";
import { message, Modal, Spin, Tag } from "antd";
import {
  SignalModalProps,
  SignalType,
  SignalDataType,
  AllSignalDataType,
} from "@/types/setting";
import { machines_signals, signals, signal_categories } from "@prisma/client";
import fetcher from "@/lib/fetcher";
import { OperationContext } from "../operation/operation";
import { handleLoadProjectData } from "src/functions/loadData";

interface ModalSignalSettingProps {
  settingProps: SignalModalProps;
}

const ModalSignalSetting: React.FC<ModalSignalSettingProps> = ({
  settingProps,
}) => {
  const { visible, project_id, machine_id, setVisible } = settingProps;
  const { set } = useContext(OperationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [allSignals, setAllSignals] = useState<AllSignalDataType>({});
  const [currentSignals, setCurrentSignals] = useState<SignalType>({});
  const [newSignals, setNewSignals] = useState<SignalType>({});

  const loadSignals = async () => {
    setIsLoading(true);
    const allSignals: (signals & { signal_category: signal_categories })[] =
      await fetcher("/api/loadSignals");

    if (!allSignals) {
      message.error(`Response 'loadSignals' was error.`);
      setIsLoading(false);
      return;
    }

    let allsignals: AllSignalDataType = {};
    allSignals.forEach(
      ({
        signal_id,
        signal_name,
        signal_category_id,
        signal_category: { category },
      }) => {
        if (allsignals[category]) {
          allsignals = {
            ...allsignals,
            [category]: [
              ...allsignals[category],
              {
                signal_id: signal_id,
                signal_name: signal_name,
                signal_category_id: signal_category_id,
              },
            ],
          };
        } else {
          allsignals = {
            ...allsignals,
            [category]: [
              {
                signal_id: signal_id,
                signal_name: signal_name,
                signal_category_id: signal_category_id,
              },
            ],
          };
        }
      }
    );

    setAllSignals(allsignals);

    const signals: (machines_signals & {
      signal: signals & { signal_category: signal_categories };
    })[] = await fetcher(
      "/api/loadMachinesSignals?" +
        new URLSearchParams({
          machine_id: machine_id.toString(),
        })
    );

    if (!signals) {
      message.error(`Response 'loadMachinesSignals' was error.`);
      setIsLoading(false);
      return;
    }

    let curSignals: SignalType = {};
    signals.forEach(
      ({
        machine_signal_id,
        signal_id,
        signal: {
          signal_name,
          signal_category: { category, signal_category_id },
        },
      }) => {
        if (curSignals[category]) {
          curSignals = {
            ...curSignals,
            [category]: [
              ...curSignals[category],
              {
                machine_signal_id: machine_signal_id,
                signal_id: signal_id,
                signal_name: signal_name,
                signal_category_id: signal_category_id,
              },
            ],
          };
        } else {
          curSignals = {
            ...curSignals,
            [category]: [
              {
                machine_signal_id: machine_signal_id,
                signal_id: signal_id,
                signal_name: signal_name,
                signal_category_id: signal_category_id,
              },
            ],
          };
        }
      }
    );
    setCurrentSignals(curSignals);
    setNewSignals(curSignals);
    setIsLoading(false);
  };

  function filterChangedSignal(
    initiate: SignalType,
    filtering: SignalType
  ): SignalType {
    return Object.fromEntries(
      Object.entries(initiate).map(([cat, signals]) => {
        const filteringSignalId = filtering[cat]
          ? filtering[cat].map((signal) => signal.signal_id)
          : [];
        const filteredSignal = signals.filter(
          (signal) => !filteringSignalId.includes(signal.signal_id)
        );
        return [cat, filteredSignal];
      })
    );
  }

  const handleSelect = (category: string, signal: SignalDataType) => {
    const selectedSignal = newSignals[category]
      ? newSignals[category].find(
          (curSignal) => curSignal.signal_id === signal.signal_id
        )
      : undefined;
    let newSignal = {};
    if (selectedSignal) {
      // have -> delete
      const signalCategory = newSignals[category].filter(
        (sig) => sig.signal_id !== signal.signal_id
      );
      newSignal = {
        ...newSignals,
        [category]: signalCategory,
      };
    } else {
      // not have -> add
      newSignal = {
        ...newSignals,
        [category]: newSignals[category]
          ? [...newSignals[category], signal]
          : [signal],
      };
    }
    setNewSignals(newSignal);
  };

  const handleOk = async () => {
    setIsLoading(true);
    const addedSignals = filterChangedSignal(newSignals, currentSignals);
    const deletedSignals = filterChangedSignal(currentSignals, newSignals);

    const addedSignalText = Object.entries(addedSignals)
      .filter(([_, signals]) => signals.length > 0)
      .map(([_, signals]) =>
        signals.map((signal) => [machine_id, signal.signal_id])
      )
      .flat();
    const deletedSignalText = Object.entries(deletedSignals)
      .filter(([_, signals]) => signals.length > 0)
      .map(([_, signals]) => signals.map((signal) => signal.machine_signal_id))
      .flat();

    const modifySignalsBody = {
      addedSignalText: addedSignalText,
      deletedSignalText: deletedSignalText,
    };
    const modifiedSignals = await fetcher("/api/modifyMachinesSignals", {
      method: "PUT",
      body: JSON.stringify(modifySignalsBody),
    });

    if (!modifiedSignals) {
      message.error(`Response 'modifiedSignals' was error.`);
      setIsLoading(false);
      return;
    }

    await handleLoadProjectData(project_id, set);

    message.success("Modify signals succeed");
    setVisible(false);
    setIsLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    async function InitialLoad() {
      await loadSignals();
    }
    InitialLoad();
  }, [visible]);

  return (
    <>
      <Modal
        title="Signals setting"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Spin tip="Loading ..." spinning={isLoading} size="large">
          <div className="modal-signal-setting">
            {Object.entries(allSignals).map(([cat, signals], idx) => {
              const newSignalsId = newSignals[cat]
                ? newSignals[cat].map((sig) => sig.signal_id)
                : [];
              return (
                <div key={idx} className={`modal-signal-setting__${cat}`}>
                  <p>{cat}</p>
                  {signals.map((signal, idx) => {
                    const selected = newSignalsId.includes(signal.signal_id);
                    return (
                      <Tag
                        key={idx}
                        color={
                          !selected
                            ? "default"
                            : cat === "Auto condition"
                            ? "blue"
                            : cat === "Abnormal"
                            ? "volcano"
                            : "green"
                        }
                        onClick={() => handleSelect(cat, signal)}
                      >
                        {signal.signal_name}
                      </Tag>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalSignalSetting;
