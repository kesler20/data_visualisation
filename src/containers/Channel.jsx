import React, { useEffect } from "react";

const Channel = () => {
  useEffect(() => {
    if (clientCommand !== "") {
      const topic = "sofia-silent";
      const clientID = "sofia-silent-mqtt-client";

      const mqttApi = new MQTTApi(clientID);

      // connect client to ws
      mqttApi.onConnect(() => {
        // subscribe to the topic
        mqttApi.subscribeClient(topic, () => {
          console.log("connected to sofia-silent");
        });

        // log any messages
        mqttApi.onMessage((msg) => {
          console.log(msg);
        });

        // publish new commands when the command state is updated
        mqttApi.publishMessage(topic, command);
        console.log(`${clientID} publish ${command}`);
      }, []);

      // unsubscribe the client when the component unmounts
      return mqttApi.unsubscribeClient(topic);
    }
  }, [clientCommand]);

  return <div></div>;
};

export default Channel;
