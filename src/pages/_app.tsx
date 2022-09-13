import "@/styles/app.scss";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "@/components/layout";
import React, { useState, useMemo, useEffect } from "react";
import mqtt from "mqtt";
import { MQTTConnection } from "@/lib/mqtt";

type MainContextTypes = {
  mqttClient: mqtt.MqttClient | undefined;
};

export const defaultMainContext: MainContextTypes = {
  mqttClient: undefined,
};

export const MainContext = React.createContext(defaultMainContext);

function MyApp({ Component, pageProps }: AppProps) {
  const [client, setClient] = useState<mqtt.MqttClient>();
  const context = useMemo(
    () => ({
      mqttClient: client,
    }),
    [client]
  );

  useEffect(() => {
    setClient(MQTTConnection("broker.emqx.io", 8083));
  }, []);

  useEffect(() => {
    if (!client) return;

    client.on("connect", () => {
      console.log("MQTT Connected");
    });
    client.on("error", (err) => {
      console.error("MQTT Connection error: ", err);
    });
    client.on("reconnect", () => {
      console.warn("MQTT Reconnecting");
    });
    client.on("disconnect", () => {
      console.error("Disconnected");
    });
  }, [client]);
  
  return (
    <MainContext.Provider value={context}>
      <Layout>
        <Head>
          <title>DX Automation Apps</title>
        </Head>
        <Component {...pageProps} />
      </Layout>
    </MainContext.Provider>
  );
}

export default MyApp;
