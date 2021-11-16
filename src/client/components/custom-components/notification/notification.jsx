import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import $ from "jquery";
import {saveBrandCompleted} from "../../../actions/brand/brand-actions";
import {hideNotification, NOTIFICATION_TYPE} from "../../../actions/notification/notification-actions";
import CONSTANTS from "../../../constants/constants";
import * as images from "./../../../images";
import "../../../styles/custom-components/notification/notification.scss";


class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.updateNotification = this.updateNotification.bind(this);

    this.statusClassOptions = {
      SUCCESS: "custom-toast-success",
      ERROR: "custom-toast-error"
    };

    this.state = {
      type: NOTIFICATION_TYPE.SUCCESS,
      message: ""
    };
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    if (this.props.notification.show) {
      this.updateNotification(this.props.notification);
    }
  }

  updateNotification(notification) {
    const action = notification.show ? "show" : "hide";
    const toastElement = $(".toast");
    this.setState({type: notification.notificationType, message: notification.message});
    toastElement.toast({delay: CONSTANTS.NOTIFICATIONPOPUP.DATADELAY});
    toastElement.toast(action);
    this.props.hideNotification();
  }

  render() {
    const statusClass = this.state.type === NOTIFICATION_TYPE.SUCCESS ? this.statusClassOptions.SUCCESS : this.statusClassOptions.ERROR;
    const notificationImage = this.state.type === NOTIFICATION_TYPE.SUCCESS ? images[CONSTANTS.NOTIFICATIONPOPUP.SUCCESSIMAGE] : images[CONSTANTS.NOTIFICATIONPOPUP.FAILUREIMAGE];
    const closeIcon = this.state.type === NOTIFICATION_TYPE.SUCCESS ? images[CONSTANTS.NOTIFICATIONPOPUP.CLOSEBUTTONSUCCESS] : images[CONSTANTS.NOTIFICATIONPOPUP.CLOSEBUTTONFAILURE];
    return (
      <div className={`toast custom-toast ${statusClass}`} role="alert" aria-live="assertive" aria-atomic="true" data-delay={CONSTANTS.NOTIFICATIONPOPUP.DATADELAY}>
        <div className="toast-body">
          <div className="row align-items-center justify-content-center">
            <div className="col-2 text-center">
              <img src={notificationImage}/>
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


