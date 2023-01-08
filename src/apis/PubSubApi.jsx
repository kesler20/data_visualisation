import { Amplify, PubSub } from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub";
import { CONNECTION_STATE_CHANGE, ConnectionState } from "@aws-amplify/pubsub";
import { Hub } from "aws-amplify";

// Apply plugin with configuration
Amplify.addPluggable(
  new AWSIoTProvider({
    aws_pubsub_region: "<YOUR-IOT-REGION>",
    aws_pubsub_endpoint:
      "wss://xxxxxxxxxxxxx.iot.<YOUR-IOT-REGION>.amazonaws.com/mqtt",
  })
);

Auth.currentCredentials().then((info) => {
  const cognitoIdentityId = info.identityId;
});

const sub1 = PubSub.subscribe("myTopicA").subscribe({
  next: (data) => console.log("Message received", data),
  error: (error) => console.error(error),
  complete: () => console.log("Done"),
});

sub1.unsubscribe();
// You will no longer get messages for 'myTopicA'

Hub.listen("pubsub", (data) => {
  const { payload } = data;
  if (payload.event === CONNECTION_STATE_CHANGE) {
    const connectionState = payload.data.connectionState;
    console.log(connectionState);
  }
});

await PubSub.publish(["myTopic1", "myTopic2"], {
  msg: "Hello to all subscribers!",
});
