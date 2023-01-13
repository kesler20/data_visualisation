import React, { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import Button from "../buttons/Button";
import { useStateContext } from "../../contexts/ContextProvider";
import { Link } from "react-router-dom";
import NestedModal from "../buttons/ModalBtn";
import {
  HtmlEditor,
  Image,
  Inject,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";
import Header from "../header/Header";
import { EditorData } from "../../default_data/dummy";
import NotificationModel from "../../models/NotificationModel";

const NotificationBar = ({ index, item }) => {
  return (
    <>
      <div></div>
      <div>
        <p className="font-semibold dark:text-gray-200">{item.message}</p>
        <p className="text-gray-500 text-sm dark:text-gray-400">
          {" "}
          {item.description}{" "}
        </p>
      </div>
    </>
  );
};

const NotificationModal = ({ currentColor, notificationModel }) => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl shadow-lg absolute top-[35%] left-0 w-[95%] md:w-[700px] md:h-[450px] md:top-1/3 md:left-1/3">
      <div className="flex justify-between items-center ml-4 mr-4">
        <Header category="App" title={notificationModel.message} />
        <button
          type="button"
          onClick={() => alert("Permission Denied")}
          style={{
            backgroundColor: currentColor,
            color: "white",
            borderRadius: "10px",
          }}
          className="text-44 p-3 w-24 hover:drop-shadow-lg mr-5"
        >
          Edit
        </button>
      </div>
      <RichTextEditorComponent value={notificationModel.getContent()}>
        <EditorData />
        <Inject services={[HtmlEditor, Toolbar, Image, QuickToolbar]} />
      </RichTextEditorComponent>
    </div>
  );
};

const Notification = () => {
  const { currentColor, notificationData } = useStateContext();

  const [notifications, setNotifications] = useState(notificationData);
  useEffect(() => {
    setNotifications(
      notificationData.map((notification) => {
        return new NotificationModel(notification.content);
      })
    );
  }, []);

  return (
    <div className="nav-item absolute left-0 md:left-[64%] top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-[98%] md:w-96">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">
            Notifications
          </p>
          <button
            type="button"
            className="text-white text-xs rounded p-1 px-2 bg-orange-theme "
          >
            {" "}
            {notifications.length} New
          </button>
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="mt-5 ">
        {notifications.map((item, index) => {
          return (
            <NestedModal
              CustomBtn={<NotificationBar index={index} item={item} />}
              customClasses={
                "hover:bg-[rgb(248,248,252)] flex items-center leading-8 gap-5 border-b-1 border-color p-3 cursor-pointer"
              }
              CustomModal={
                <NotificationModal
                  currentColor={currentColor}
                  notificationModel={item}
                />
              }
            />
          );
        })}
        <Link to={"/editor"} className="mt-5">
          <Button
            color="white"
            bgColor={currentColor}
            text="Send a Notification"
            borderRadius="10px"
            width="full"
          />
        </Link>
      </div>
    </div>
  );
};

export default Notification;
