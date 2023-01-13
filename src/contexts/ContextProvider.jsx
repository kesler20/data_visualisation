import {
  convertFilesToEditableFormat,
  convertFilesToReadableFormat,
} from "../models/DataProcessing";
import React, { createContext, useContext, useState, useEffect } from "react";
import DatabaseApi from "../APIs/DatabaseApi";
import { defaultUserClients } from "../default_data/clientData";
import { initialNotifications } from "../default_data/dummy";
import ProcessModel from "../models/ProcessModel";
import NotificationModel from "../models/NotificationModel";
import { initialDashboard } from "../default_data/dashboardDefaultData";
import RESTfulApiInterface from "../APIs/RESTfulApi";
import Controller from "../models/Controller";
import User from "../models/User";

// load all the models
export const db = new DatabaseApi();
export const process = new ProcessModel({});
export const api = new RESTfulApiInterface();
export const controller = new Controller();
export const allowedUsers = ["kesler20","copmeister"]

// initialize the state context api
const StateContext = createContext();
const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

/**
 * the ContextProvider wraps around the app when is instantiated in the index.js file
 * it is used tio hold the global state of the application which need to be sharable across different containers
 */
export const ContextProvider = ({ children }) => {
  /**
   * custom hook to store values which persist in storage and the state of the context
   * @param {*} defaultValue
   * @param {*} key
   * @returns
   */
  const useStoredValue = (defaultValue, key) => {
    const [value, setValue] = useState(() => {
      const storedState = db.readResourceFromLocalStorage(key);
      console.log(
        `global state - ${key}`,
        storedState.length === 0 ? defaultValue : storedState
      );
      return storedState.length === 0 ? defaultValue : storedState;
    });
    useEffect(() => {
      db.createResourceInLocalStorage(key, value);
    }, [key, value]);
    return [value, setValue];
  };

  //presentational states
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [activePage, setActivePage] = useState("");

  // functions for handling representational state changes
  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };
  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };
  const handleClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: true });
  };

  //data flow states
  const [userFiles, setUserFiles] = useStoredValue([], "userFiles");
  const [clients, setClients] = useStoredValue(defaultUserClients, "clients");
  const [dashboards, setDashboards] = useStoredValue(
    [initialDashboard],
    "dashboards"
  );

  const [processData, setProcessData] = useStoredValue([], "processData");
  const [notificationData, setNotificationData] = useStoredValue(
    initialNotifications,
    "notifications"
  );
  const [tabularFiles, setTabularFiles] = useStoredValue([], "tabularFiles");
  const [readableUserFiles, setReadableUserFiles] = useStoredValue(
    [],
    "readableUserFiles"
  );

  // singletones
  const [user, setUser] = useState(
    new User({
      username: "default user",
      attributes: { email: "useradmin@gmail.com" },
      signInUserSession: { idToken: { jwtToken: "" } },
      storage: { clients: [], userFiles: [] },
    })
  );

  //--------------------------------------------//
  //                                            //
  // HANDLE SIDE EFFECTS AFTER COMPONENT MOUNTS //
  //                                            //
  //--------------------------------------------//

  /**
   * load all the user resources to local storage
   */
  /**
   * whenever a resource which can be changed from the backend
   * changes load the resource from the backend to the leocal storage]#
   * to make sure that the backend and l;ocal storage are in sync
   */
  useEffect(() => {
    if (
      userFiles !== [] ||
      clients !== defaultUserClients ||
      dashboards !== [initialDashboard] ||
      notificationData !== initialNotifications
    ) {
      getResourceFromStorage("userFiles", []);
      getResourceFromStorage("clients", defaultUserClients);
      getResourceFromStorage("dashboards", [initialDashboard]);
      getResourceFromStorage(
        "processData",
        process.updateProcess().getAllData()
      );
      getResourceFromStorage("notifications", initialNotifications);
      getTabularFiles();
      getReadableUserFiles();
    }
  }, [userFiles, clients, dashboards, notificationData]);

  /**
   * this method looks for the resource first in local storage than in the backend
   * if the resource is found in the database this will update the local storage
   *
   * @param {*} resourceKey - the name of the resource to look for this can be:
   * - userFiles,
   * - clients,
   * - dashboards,
   * - processData
   * @param {*} resourceKey - the default value that we want to store to localStorage
   * if there are no instances of the resource saved in the database
   */
  const getResourceFromStorage = async (resourceKey, defaultValue) => {
    // look for the resource in local storage
    const resourceFromStorage = db.readResourceFromLocalStorage(resourceKey);
    if (resourceFromStorage.length === 0) {
      // if they are not there get them from backend
      let resourceFromDatabase = await db.readResourceFromDatabase(resourceKey);

      if (resourceFromDatabase.length === 0) {
        db.createResourceInLocalStorage(resourceKey, defaultValue);
      } else {
        db.createResourceInLocalStorage(resourceKey, resourceFromDatabase);
        // if the database is updated updated the state to reflect that
        if (resourceKey === "userFiles") {
          setUserFiles(
            resourceFromDatabase.map((resource) => {
              return resource;
            })
          );
        }
      }
    }
  };

  // the following two functions are used to manipulate the user files stored in the database
  /**
   * convert the userFiles resource ion local storage to readable files
   * create the readableFiles resource in local storage
   */
  const getReadableUserFiles = () => {
    let readableFiles = convertFilesToReadableFormat(
      db.readResourceFromLocalStorage("userFiles")
    );
    db.createResourceInLocalStorage("readableUserFiles", readableFiles);
  };

  /**
   * convert the userFiles resource ion local storage to tabular files
   * create the tabularFIles resource in local storage
   */
  const getTabularFiles = () => {
    let tabularFiles = convertFilesToEditableFormat(
      db.readResourceFromLocalStorage("userFiles")
    );
    db.createResourceInLocalStorage("tabularFiles", tabularFiles);
  };

  /**
   * this method is used to handle the feature submitted via the editor page
   * @param {*} e
   */
  const handleFeatureSubmit = (notification) => {
    // changing the format of the list and pushing each item to the notificationData array
    notificationData.push(notification);
    setNotificationData(
      notificationData.map((component) => {
        return new NotificationModel(component.content);
      })
    );
    db.saveResourceToLocalStorage("notifications", notification);
  };

  return (
    <StateContext.Provider
      value={{
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        currentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
        activePage,
        setActivePage,
        handleFeatureSubmit,
        notificationData,
        setNotificationData,
        processData,
        setProcessData,
        userFiles,
        setUserFiles,
        clients,
        setClients,
        dashboards,
        setDashboards,
        user,
        setUser,
        tabularFiles,
        setTabularFiles,
        setReadableUserFiles,
        readableUserFiles,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

// TODO: find the way top store processData to the database and apply the same resource workflow to it
