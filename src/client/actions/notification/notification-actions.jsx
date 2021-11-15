const NOTIFICATION_TYPE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
};
const defaultSuccessMessage = "Action Successful";
const defaultErrorMessage = "Action Failed";

const showNotification = (notificationType, message, variant) => {
  if (!message) {
    message = notificationType === NOTIFICATION_TYPE.SUCCESS ? defaultSuccessMessage : defaultErrorMessage;
  }
  variant = !variant ? "variant1" : variant;
  return { type: "SHOW_NOTIFICATION", value: { notificationType, message, variant} };
};

const hideNotification = () => {
  return { type: "HIDE_NOTIFICATION"};
};
export {showNotification, hideNotification, NOTIFICATION_TYPE};
