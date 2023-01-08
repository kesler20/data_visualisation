/**
 * The user interface for the AWS amplify application stores information
 * regarding the credentials and authorization
 *
 * Properties:
 * * username - username of the user set by AWS
 * * jwtToken - json web token generated by the auth category of AWS
 * this is accessed from local storage using the "jwtToken" key and it should conform to the standard
 * @see https://jwt.io/introduction
 */
export default class User {
  constructor(userData) {
    this.username = userData.username;
    this.userEmail = userData.attributes.email;
    this.token = userData.signInUserSession.idToken.jwtToken;
    this.localStorageData = userData.storage;
  }
}