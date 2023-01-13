import "./Upload.css";
import DropFileInput from "./drop_file_input/DropFileInput";
import { useState } from "react";

const allowedFiles = ["csv", "xlsx", "xls"];


const Upload = () => {
  const [allowedSubmit, setAllowedSubmit] = useState(true);
  const [fileList, setFileList] = useState([]);

  const onFileChange = (files) => {
    const filesAllowedList = [];
    files.forEach((file) => {
      filesAllowedList.push(
        allowedFiles
          .map((fileExtension) => {
            return file.name.includes(fileExtension);
          })
          .some((item) => item === true)
      );
    });

    setAllowedSubmit(!filesAllowedList.some((item) => item === false));
  };

  return (
    <div className="upload-page ">
      <div className="upload-page__body ">
        <div className="upload-page__body__box">
          <h2 className="upload-page__body__box__header">
            Drop your files below
          </h2>
          <DropFileInput
            onFileChange={(files) => onFileChange(files)}
            success={allowedSubmit}
            fileList={fileList}
            setFileList={setFileList}
          />
        </div>
      </div>
    </div>
  );
};

export default Upload;
