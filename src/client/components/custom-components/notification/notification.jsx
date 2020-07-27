import React from "react";
import { connect } from "react-redux";
import {toggleModal} from "../../../actions/modal-actions";
import {saveBrandCompleted} from "../../../actions/brand/brand-actions";
import PropTypes from "prop-types";
import "../../../styles/custom-components/notification/notification.scss";
import NotificationSuccessImg from "../../../images/verified.svg";
import NotificationFailureImg from "../../../images/red-circle-cross.svg";
import TimesSuccess from "../../../images/times-success.svg";
import TimesFailure from "../../../images/times-failure.svg";
import {hideNotification, NOTIFICATION_TYPE} from "../../../actions/notification/notification-actions";
import $ from "jquery";


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
    this.setState({type: notification.notificationType, message: notification.message});
    $(".toast").toast(action);
    this.props.hideNotification();
  }


  render() {
    const statusClass = this.state.type === NOTIFICATION_TYPE.SUCCESS ? this.statusClassOptions.SUCCESS : this.statusClassOptions.ERROR;
    const notificatioImage = this.state.type === NOTIFICATION_TYPE.SUCCESS ? NotificationSuccessImg : NotificationFailureImg;
    const closeIcon = this.state.type === NOTIFICATION_TYPE.SUCCESS ? TimesSuccess : TimesFailure;
    return (
      <div className={`toast custom-toast ${statusClass}`} role="alert" aria-live="assertive" aria-atomic="true" data-delay={2500}>
        <div className="toast-body">
          <div className="row align-items-center justify-content-center">
            <div className="col-2 text-center">
              <img src={notificatioImage}/>
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
  toggleModal,
  saveBrandCompleted,
  hideNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification);


