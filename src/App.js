import { Amplify, Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import { useEffect } from "react";
import RESTfulApiInterface from "./apis/RESTapi";
import awsmobile from "./aws-exports"

Amplify.configure(awsExports);

const App = ({ signOut, user }) => {

  const getUserData = async () => {

    const user = await Auth.currentAuthenticatedUser();
    console.log("user", user);
    const token = user.signInUserSession.idToken.jwtToken;
    console.log("token", token);

    const requestInfo = { headers: { Authorization: token } };
    
    const api = new RESTfulApiInterface();
    api.updateEndpoint("/https://api.github");
    api.updateExtraParams(requestInfo)
    const response = await api.getResource("").then((res) => {
      console.log(res) 
    }).catch((e) => {
      console.log(e)
    })

  }
  useEffect(() => {
    console.log(awsmobile.aws_cognito_identity_pool_id)
    getUserData()
  });
  return (
    <>
      <h1 className="text-blue-500">Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </>
  );
};

export default withAuthenticator(App);
