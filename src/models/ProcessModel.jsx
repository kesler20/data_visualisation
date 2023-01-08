import DatabaseApi from "../APIs/DatabaseApi";

/**
 * A process is a collection of clients, the process model is used to
 * connect the backend and the backend, the lcoal storage and the application state context
 */
export default class ProcessModel {
  /**
   * the main properties of the class are:
   * - db
   * - processDataSchema
   * ---
   * the processDataSchema can be updated by calling the ``updateProcess()`` method
   * this will retrieve the data from local storage and reconstruct the object
   * ---
   * @param {*} processDataSchema - this is an object containing all the clients and their data
   *
   * the form of the schema is:
   * ```javascript
   * const processDataSchema = {
   *   clientID : [{ x_value : 1000, total_1 : 980 },...],
   *   ...
   * }
   * ```
   */
  constructor(processDataSchema) {
    this.db = new DatabaseApi("processData");
    this.processDataSchema = processDataSchema;
  }

  /**
   * this method updates the instance of the process model by loading all
   * the current data stored in local storage
   * @returns this
   */
  updateProcess() {
    const clients = this.db.readResourceFromLocalStorage("clients");
    clients.forEach((client) => {
      this.processDataSchema[client.readTopic] =
        this.db.readResourceFromLocalStorage(
          `${client.readTopic}/json-database`
        );
    });
    return this;
  }

  /**
   * this method returns an array containing all the data from the clients
   * stored in the current processDataSchema
   *
   * @returns totalData - an array or objects containing the data of the clients
   */
  getAllData() {
    const keys = Object.keys(this.processDataSchema);
    const arrayOfArrays = keys.map((k) => {
      return this.processDataSchema[k];
    });
    const arrayOfArraysVals = [];
    arrayOfArrays.forEach((arr) => {
      arr.forEach((val) => {
        arrayOfArraysVals.push(val);
      });
    });
    return arrayOfArraysVals;
  }
}
