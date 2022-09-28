import mqtt from "mqtt";
export const MQTTConnection = (host: string, port: number) => {
  console.info("start MQTT Connection to host: ", host, ", port: ", port);
  const url = `ws://${host}:${port}/mqtt`;
  const options: mqtt.IClientOptions = {
    host: host,
    port: port,
    clientId: `mqttjs_+${Math.random().toString(16).substring(2, 8)}`,
    keepalive: 30,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: "WillMsg",
      payload: "MQTT Connection Closed abnormally ...",
      qos: 0,
      retain: false,
    },
    rejectUnauthorized: false,
  };

  return mqtt.connect(url, options);
};

export const MQTTDisconnect = (client: mqtt.MqttClient) => {
  let disconnected = false;
  if (client) {
    client.end(false, undefined, () => {
      disconnected = true;
    });
  }
  return disconnected;
};
