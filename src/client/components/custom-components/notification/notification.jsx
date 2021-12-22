/* eslint-disable no-nested-ternary */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import $ from "jquery";
import { saveBrandCompleted } from "../../../actions/brand/brand-actions";
import { hideNotification, NOTIFICATION_TYPE } from "../../../actions/notification/notification-actions";
import CONSTANTS from "../../../constants/constants";
import * as images from "./../../../images";
import "../../../styles/custom-components/notification/notification.scss";


class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.updateNotification = this.updateNotification.bind(this);
    this.getVariant1 = this.getVariant1.bind(this);
    this.getVariant2 = this.getVariant2.bind(this);
    this.getNotification = this.getNotification.bind(this);

    this.statusClassOptions = {
      SUCCESS: "custom-toast-success",
      ERROR: "custom-toast-error"
    };

    this.state = {
      type: NOTIFICATION_TYPE.SUCCESS,
      message: "",
      notificationImage: ""
    };
  }

  componentDidUpdate() {
    if (this.props.notification.show) {
      this.updateNotification(this.props.notification);
    }
  }

  updateNotification(notification) {
    const action = notification.show ? "show" : "hide";
    const toastElement = $(".toast");
    const notificationImage = notification.notificationImage;
    const type = notification.notificationType;
    const message = notification.message;
    this.setState({ type, message, notificationImage });
    toastElement.toast({ delay: CONSTANTS.NOTIFICATIONPOPUP.DATADELAY });
    toastElement.toast(action);
    this.props.hideNotification(notification.variant);
  }

  getVariant1(statusClass, notificationImage, closeIcon) {
    return (<div className={`toast c-notification variant1 ${statusClass}`} role="alert"
      aria-live="assertive" aria-atomic="true" data-delay={CONSTANTS.NOTIFICATIONPOPUP.DATADELAY}>
      <div className="toast-body">
        <div className="row align-items-center justify-content-center">
          <div className="col-2 text-center">
            <img src={notificationImage} />
          </div>
          <div className="col-8 text-left">
            <div className="ml-3">
              {this.state.message}
            </div>
          </div>
          <div className="col-2 text-center">
            <img src={closeIcon} type="button" data-dismiss="toast" aria-label="Close" />
          </div>
        </div>
      </div>
    </div>
    );
  }

  getVariant2(statusClass, notificationImage) {
    return (
      <div className="toast c-notification variant2">
        <div className="row">
          <img className="col-2 pl-4 notification-icon" src={notificationImage} />
          <span className="col-6 pl-0 text-left">{this.state.message}</span>
          <div className="col-4 text-right">
            <span className="closebtn-style pt-2 d-block" data-dismiss="toast" aria-label="Close">&times;</span>
          </div>
          {/* <img src={closeIcon} type="button" data-dismiss="toast" aria-label="Close" /> */}
          <span className="timer-bar position-absolute"></span>
        </div>
      </div>
    );
  }

  getNotification(statusClass, notificationImage, closeIcon) {
    const variant = this.props.notification.variant;
    switch (variant) {
      case "variant1":
        return this.getVariant1(statusClass, notificationImage, closeIcon);
      case "variant2":
        return this.getVariant2(statusClass, notificationImage, closeIcon);
      default:
        return this.getVariant1(statusClass, notificationImage, closeIcon);
    }
  }

  render() {
    const statusClass = this.state.type === NOTIFICATION_TYPE.SUCCESS ? this.statusClassOptions.SUCCESS : this.statusClassOptions.ERROR;
    const notificationImage = this.state.notificationImage ? images[this.state.notificationImage] :
      this.state.type === NOTIFICATION_TYPE.SUCCESS ? images[CONSTANTS.NOTIFICATIONPOPUP.SUCCESSIMAGE] : images[CONSTANTS.NOTIFICATIONPOPUP.FAILUREIMAGE];
    const closeIcon = this.state.type === NOTIFICATION_TYPE.SUCCESS ? images[CONSTANTS.NOTIFICATIONPOPUP.CLOSEBUTTONSUCCESS] : images[CONSTANTS.NOTIFICATIONPOPUP.CLOSEBUTTONFAILURE];
    return this.getNotification(statusClass, notificationImage, closeIcon);
  }

}


Notification.propTypes = {
  show: PropTypes.bool,
  notification: PropTypes.object,
  hideNotification: PropTypes.func
};

const mapStateToProps = state => {
  return {
    modal: state.modal,
    brandEdit: state.brandEdit,
    notification: state.notification
  };
};

const mapDispatchToProps = {
  // toggleModal,
  saveBrandCompleted,
  hideNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification);


