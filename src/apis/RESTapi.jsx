import { Amplify, API } from "aws-amplify";

/**
 * This is an implementation of a RESTful Api using the fetch api
 *
 * to test this class you can call the update fetch function
 *
 * __Common Successful Response messages__
 * | Response | Status  | Description |
 * | -------- | ----------- | ----------- |
 * | OK | 200 | Standard response for successful HTTP requests |
 * | Created | 201 | server does'nt have a current representation and the PUT request successfully creates one |
 * | Updated | 204 | if the server has a current representation and is successfully modified |
 *
 * __Common Unsuccessful Response messages__
 * | Response | Status  | Description |
 * | -------- | ----------- | ----------- |
 * | Unauthorized | 401 |  authentication is required and has failed |
 * | Forbidden | 403 | the request was successful but the user may not have the necessary permissions for a resource |
 *
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes for more information
 * as a quick reference:
 * ```bash
 * 100 - Continue
 * 101 - Switching Protocols
 * 102 - Processing
 * 103 - Early Hints
 * 200 - OK
 * 201 - Created
 * 202 - Accepted
 * 203 * - Non-Authoritative information implemented since HTTP/1.1
 * 204 - No Content
 * 205 - Reset content
 * 206 - Partial content
 * 207 * - Multi-Status
 * 208 - Already Reported
 * 226 - IM Used
 * 300 - Multiple Choices
 * 301 - Moved Permanently
 * 302 - Found
 * 303 - See Other
 * 304 - Not Modified
 * 305 - Use Proxy
 * 306 - Swtich Proxy
 * 307 - Temportary redirect
 * 308 - Permanent Redirect
 * 400 - Bad Request
 * 401 - Unauthorised
 * 402 - Payment Required
 * 403 - Forbidden
 * 404 - Not Found
 * 405 - Method Not Allowed
 * 406 - Not Acceptanble
 * 407 - Proxy Authentification Required
 * 408 - Request Timeout
 * 409 - Conflict
 * 410 - Gone
 * 411 - Lenght Required
 * 412 - Precondition
 * 413 - Payload too large
 * 414 - URI Too long
 * 415 - Unsupported Media Type
 * 416 - Range Not Satisfiable
 * 417 - Excpectation Failed
 * 421 - Misdirected Request
 * 422 - Unpocessable Entity
 * 423 - Locked
 * 424 - Failed Dependency
 * 425 - Too Early
 * 426 - Upgrade Required
 * 428 - Preconditon Required
 * 429 - Too Many Requests
 * 431 - Request Header Fiels Too large
 * 451 - Unavailable for lega reasons
 * 500 - internal sever error
 * 501 - Not implemented
 * 502 - Bad Gateway
 * 503 - Service Unavailable
 * 504 - Gateway Timeout
 * 505 - HTTP Version Not Supproted
 * 506 - Variant also negotiates
 * 507 - insufficient storage
 * 508 - loop depected
 * 510 - Not Extnended
 * 511 - Network Authentication Required
 * ```
 */
export default class RESTfulApiInterface {
  /**
   * The constructor does not take any arguments however the default parameters are
   * ```txt
   * baseUrl : `${process.env.REACT_APP_BACKEND_URL_DEV}`
   * jwtToken : "Bearer " + localStorage.getItem("jwtToken")
   * extraParams : { headers: {} }
   * ```
   * the properties can be updated using functions to handle invalid parameters
   * the functions which can be used to update those parameters are:
   * ```javascript
   * updateEndpoint()
   * updateJWToken()
   * updateExtraParams()
   * ```
   */
  constructor() {
    // run any api configuration logic
    this.configure();
    this.baseUrl = `${process.env.REACT_APP_BACKEND_URL_DEV}`;
    this.jwtToken = "Bearer " + localStorage.getItem("jwtToken");
    this.extraParams = {};
    this.apiName = `${process.env.REACT_APP_AWS_API_NAME}`;
  }

  /**
   * This function is used to update the baseUrl which will be used to make HTTP calls
   * @param {*} URL - string which will be used as baser url
   */
  updateEndpoint(URL) {
    this.baseUrl = URL;
  }
  /**
   * This function is used to update the jason web token which will be used to authenticate HTTP calls
   * @param {*} jwtToken - string which will be used as baser jwtToken
   */
  updateJWToken(jwtToken) {
    this.jwtToken = jwtToken;
  }

  /**
   * Update the extra parameters that will be used for your HTTP calls
   * @param {*} extraParams - this is an object of the form:
   * ```javascript
   * const extraParams = {
   *    headers: {},
   *    response: true,
   *    queryStringParameters: {
   *     name: "param",
   *   },
   *   'responseType': 'blob'
   * };
   * ```
   */
  updateExtraParams(extraParams) {
    this.extraParams = extraParams;
  }

  /**
   * Depending on the implementation of the api this function will configure the class
   * to use the desired implementation of a RESTful api
   */
  configure() {
    Amplify.configure({
      // OPTIONAL - if your API requires authentication
      Auth: {
        // REQUIRED - Amazon Cognito Identity Pool ID
        identityPoolId: "eu-west-2:7c693303-e17d-4ba7-9a79-e5fd9c4c7c9c",
        // REQUIRED - Amazon Cognito Region
        region: `${process.env.REACT_APP_AWS_REGION}`,
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: "eu-west-2_j4Zg2mOG4",
        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: "378l9madeohjb7age1vifka2uh",
      },
      API: {
        endpoints: [
          {
            name: "api69251376",
            endpoint: `${process.env.REACT_APP_AWS_API_ENDPOINT}`,
          },
        ],
      },
    });
  }

  /**
   * This will send an HTTP PUT request to the ``baseUrl/resourceEndpoint`` endpoint
   * The HTTP PUT request method creates a new resource or replaces a representation of the target resource
   * with the request payload
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   * @param {*} resource - this is the object that will be posted to the specified backend
   *
   * @returns {*} statusCode - a ``<Promise>`` containing the status code of the request
   *
   * Side Effects:
   * - the URL and the response from the backend are logged to the console
   *
   * ### Dev Information
   * - the status code and the backend response will be logged to the console
   * - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   *
   * If you send the same PUT request multiple times, the result will remain the same but
   * if you send the same POST request multiple times, you will receive different results.
   * PUT method is idempotent whereas POST method is not idempotent
   * @see https://stackoverflow.com/questions/630453/what-is-the-difference-between-post-and-put-in-http
   * for more information
   */
  putResource(resourceEndpoint, resource) {}

  /**
   * This will send an HTTP GET request to the ``baseUrl/resourceEndpoint`` endpoint
   * The HTTP GET request method retrieves a resource from its representational target
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   *
   * @returns {*} {statusCode, resource} - a ``<Promise>`` containing the status code and
   * the resource returned by the server of the request
   *
   * ### Dev Information
   *  - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   */
  getResource(resourceEndpoint) {
    const path =
      resourceEndpoint === ""
        ? this.baseUrl
        : `${this.baseUrl}/${resourceEndpoint}`;

    return API.get(this.apiName, path, this.extraParams);
  }

  /**
   * This will send an HTTP UPDATE request to the ``baseUrl/resourceEndpoint`` endpoint
   * The HTTP UPDATE request method retrieves a resource from its representational target
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   *
   * @param {*} resourceKey - string specifying the unique identifier of the resource to be updated
   *
   * @returns {*} {statusCode} - a ``<Promise>`` containing the status code of the request
   *
   * ### Dev Information
   * - the status code and the backend response will be logged to the console
   * - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   */
  updateResource(resourceEndpoint, resourceKey) {}

  /**
   * This will send an HTTP GET request to the ``baseUrl/resourceEndpoint/READ`` endpoint
   * The HTTP GET request method retrieves a resource from its representational target
   *
   * @param {*} resourceEndpoint - string specifying the endpoint where the backend
   * allows users to consume the specified resource of the form ``topic/resourceCategory``
   *
   * @param {*} resourceKey - string specifying the unique identifier of the resource to be deleted
   *
   * @returns {*} {statusCode} - a ``<Promise>`` containing the status code of the request
   *
   * ### Dev Information
   * - the status code and the backend response will be logged to the console
   * - to access the data within the response use .then(res => store(res)) on the response
   * - the status code is a value of the key statusCode
   */
  deleteResource(resourceEndpoint, resourceKey) {}
}
