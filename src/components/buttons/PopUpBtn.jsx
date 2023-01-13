import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * This component gives the functionality to a btn to pop up an error
 * or a success message
 *
 * @param {*} successMsg - the success message being returned
 * @param errorMsg - the success message being returned
 * @param CustomBtn - the button (react component) that will trigger the effect,
 * @param onBtnClicked - this is called when the
 * customized btn is clicked to allow it to trigger any side effects,
 * @param success - this toggles whether the alert displayed is a success of a failed message,
 * @param - these are the classes used to style the div containing the button,
 */
const CustomizedSnackbar = (props) => {
  const {
    successMsg,
    errorMsg,
    CustomBtn,
    onBtnClicked,
    success,
    customClasses,
  } = props;

  const [open, setOpen] = React.useState(false);

  const handleClick = (e) => {
    setOpen(true);
    onBtnClicked(e);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <div className={customClasses} onClick={(e) => handleClick(e)}>
        {CustomBtn}
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        {success ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMsg}
          </Alert>
        ) : (
          <Alert severity="error" onClose={handleClose} sx={{ width: "100%" }}>
            {errorMsg}
          </Alert>
        )}
      </Snackbar>
    </Stack>
  );
};

export default CustomizedSnackbar;
