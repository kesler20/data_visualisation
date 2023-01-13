import React, { useRef } from "react";
import PropTypes from "prop-types";
import "./DropFileInput.css";
import { useStateContext } from "../../../contexts/ContextProvider";
import { ImageConfig } from "../ImageConfig";
import uploadImg from "../../../assets/cloud-upload-regular-240.png";
import CustomizedSnackbar from "../../../components/buttons/PopUpBtn";

const DropFileInput = (props) => {
  const { currentColor, setUserFiles, userFiles, user } = useStateContext();
  const { fileList, setFileList } = props;

  const wrapperRef = useRef(null);
  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  // add files
  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [...fileList, newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  // remove files
  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  // submit files
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("user_files", file);
      console.log(file.name, file.size);
      uploadData(formData, file.name, file.size);
    });
  };

  const updateUserFiles = (filename, username, fileContent, fileSize) => {
    setUserFiles((prevState) => {
      return prevState.filter((file) => file.resource_name !== filename);
    });

    setUserFiles((prevState) => {
      return [
        ...prevState,
        {
          resource_size: `${fileSize} bytes`,
          accountID: username,
          topic: "userFiles",
          resource_name: filename,
          resourceID: `${username.toUpperCase()}/u/${filename}`,
          resource_content: fileContent,
        },
      ];
    });
  };

  const uploadData = async (formData, filename, fileSize) => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL_PROD}/userFiles/WRITE`, {
      headers: new Headers({
        "X-JWT": "Bearer " + localStorage.getItem("jwtToken"),
      }),
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          res
            .json()
            .then((res) => {
              updateUserFiles(
                filename,
                user.username,
                JSON.parse(res),
                fileSize
              );
            })
            .catch((e) => {
              console.log(e, res);
            });
        }
      })
      .catch((e) => {
        console.log(e, res);
      });
  };

  return (
    <form>
      <div
        ref={wrapperRef}
        className="drop-file-input"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="drop-file-input__label">
          <img src={uploadImg} alt="" />
          <p>Drag & Drop your files here</p>
        </div>
        <input type="file" value="" onChange={onFileDrop} />
      </div>
      {fileList.length > 0 ? (
        <div className="drop-file-preview">
          <p className="drop-file-preview__title">Ready to upload</p>
          {fileList.map((item, index) => (
            <div key={index} className="drop-file-preview__item">
              <img
                src={
                  ImageConfig[item.type.split("/")[1]] || ImageConfig["default"]
                }
                alt=""
              />
              <div className="drop-file-preview__item__info">
                <p>{item.name}</p>
                <p>{item.size}B</p>
              </div>
              <span
                className="drop-file-preview__item__del"
                onClick={() => fileRemove(item)}
              >
                x
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="flex mt-5 justify-center">
        <CustomizedSnackbar
          successMsg={"File uplaoded successfully!"}
          errorMsg={"The uploaded file is not supported 😞"}
          onBtnClicked={(e) => handleSubmit(e)}
          success={props.success}
          customClasses="flex mt-5 justify-center"
          CustomBtn={
            <button
              type="submit"
              style={{
                backgroundColor: currentColor,
                color: "white",
                borderRadius: "10px",
              }}
              className="text-44 p-3 w-24 hover:drop-shadow-xl"
            >
              Submit
            </button>
          }
        />
      </div>
    </form>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
