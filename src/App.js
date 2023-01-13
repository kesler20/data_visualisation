import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider";
import "./App.css";
import { Amplify, Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import Dashboard from "./pages/dashboard/Dashboard";
import User from "./models/User";
import Upload from "./pages/upload/Upload";
import Sidebar from "./components/sidebar/Sidebar";

/**
 * import all the AWS services into the application
 * to make sure that this run follow the steps specified in the dev documentation
 */
Amplify.configure(awsExports);

const App = () => {
  // get global state from the context api
  const { setCurrentColor, setCurrentMode, setUser } = useStateContext();

  // set the color mode of the application to the preferred value
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentColor, setCurrentMode]);

  // save data from the current authenticated user to local storage
  useEffect(() => {
    // save all the local storage data from aws exports to local storage
    Auth.currentAuthenticatedUser()
      .then((userData) => {
        const storageData = userData.storage;
        const keys = Object.keys(storageData);
        keys.forEach((k) => {
          localStorage.setItem(k, storageData[k]);
        });
      })
      .catch((e) => {
        console.log(e);
      });

    // set the username of the authenticated user to local storage
    Auth.currentUserInfo()
      .then((user) => {
        localStorage.setItem("username", user.username);
        console.log("username set");
      })
      .catch((e) => {
        console.log(e);
      });

    // set the json web token to local storage
    // this is used by the api to make api calls
    Auth.currentSession()
      .then((user) => {
        localStorage.setItem("jwtToken", user.accessToken.jwtToken);
        console.log("token set");
      })
      .catch((e) => {
        console.log(e);
      });

    updateUserData();
  }, []);

  /**
   * sets the global user state variable to new User(userData) where userData
   * is the user data from aws exports
   */
  const updateUserData = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    setUser(new User(userData));
  };

  return (
    <BrowserRouter>
      <div className="app__container">
        <Sidebar />
        <div className="app__dashboard">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
export default withAuthenticator(App, true);
