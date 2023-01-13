import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { useStateContext } from "../../contexts/ContextProvider";

const DropDown = (props) => {
  const { currentMode } = useStateContext();
  return (
    <div className="w-28/ border-1 border-color px-2 py-1 rounded-md">
      <DropDownListComponent
        id="time"
        fields={{ text: "Time", value: "Id" }}
        style={{ border: "none", color: currentMode === "Dark" && "white" }}
        value="1"
        dataSource={props.dropdownData}
        popupHeight="220px"
        popupWidth="120px"
      />
    </div>
  );
};

export default DropDown;
