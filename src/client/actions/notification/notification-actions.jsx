const NOTIFICATION_TYPE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
};
const defaultSuccessMessage = "Action Successful";
const defaultErrorMessage = "Action Failed";

const showNotification = (notificationType, message) => {
  if (!message) {
    message = notificationType === NOTIFICATION_TYPE.SUCCESS ? defaultSuccessMessage : defaultErrorMessage;
  }
  return { type: "SHOW_NOTIFICATION", value: { notificationType, message } };
};

export {showNotification, NOTIFICATION_TYPE};
