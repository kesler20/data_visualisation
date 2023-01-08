/**
 * The controller can be used to perform simple control algorithms client side
 *
 * @param {*} client - the client is an instance of a ``<MQTT>`` object used to publish control commands
 */
export default class Controller {
  constructor(client) {
    this.client = client;
  }
  /**
   * This function performs the logic for sending control commands back to the controller client
   *
   * @param {*} client - an instance of ``<MQTT>`` object
   * @param {*} t1a - value of the trend as an integer
   * @param {*} y1a - current value of the measured variable as an integer
   * @param {*} controlStatus - a boolean representing whether the client needs to be controlled or not
   * @param {*} topic - the topic that the control commands will be published to
   * @param {*} controlIntensity - the intensity of the correction selected for controlling the stream
   * @param {*} target - upper and lower bounds [y1a + target, y1a - target]
   * which the check algorithm will use as target to control the random stream within
   */

  check = (
    client,
    t1a,
    y1a,
    controlStatus,
    topic,
    controlIntensity,
    target
  ) => {
    let bound = target;
    let x = 1;
    if (t1a > y1a + bound) {
      x = -1;
    } else if (t1a < y1a - bound) {
      x = 1;
    } else {
      x = 0;
    }

    let payload = { control1: [x, controlIntensity] };
    // avoid to use type coercion
    if (controlStatus === false) {
      payload = { control1: [0, 1] };
    } else {
      console.log(payload);
    }
    let payloadText = JSON.stringify(payload);

    client.publish(topic, payloadText, { qos: 0 }, (error) => {
      if (error) {
        console.log("Publish error: ", error);
      } else {
      }
    });
  };
}
