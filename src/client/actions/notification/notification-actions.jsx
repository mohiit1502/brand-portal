const NOTIFICATION_TYPE = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
};
const defaultSuccessMessage = "Action Successful";
const defaultErrorMessage = "Action Failed";

const showNotification = (notificationType, message, variant, notificationImage) => {
  if (!message) {
    message = notificationType === NOTIFICATION_TYPE.SUCCESS ? defaultSuccessMessage : defaultErrorMessage;
  }
  variant = !variant ? "variant1" : variant;
  return { type: "SHOW_NOTIFICATION", value: { notificationType, message, variant, notificationImage} };
};

const hideNotification = variant => {
  variant = !variant ? "variant1" : variant;
  return { type: "HIDE_NOTIFICATION", value: { variant} };
};
export {showNotification, hideNotification, NOTIFICATION_TYPE};
