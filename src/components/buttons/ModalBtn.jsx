import * as React from "react";
import Modal from "@mui/material/Modal";

/**
 * This component allows you to create a modal pop up effect by passing
 * a CustomBtn and a CustomModal as well as the customClass property used to
 * style the button div
 */
const NestedModal = (props) => {
  const { CustomBtn, customClasses, CustomModal } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className={customClasses} onClick={handleOpen}>
        {CustomBtn}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        {CustomModal}
      </Modal>
    </div>
  );
};

export default NestedModal;
