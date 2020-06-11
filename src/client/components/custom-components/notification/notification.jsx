import React from "react";
import { connect } from "react-redux";
import {toggleModal} from "../../../actions/modal-actions";
import {saveBrandCompleted} from "../../../actions/brand/brand-actions";
import PropTypes from "prop-types";
import "../../../styles/custom-components/notification/notification.scss";
import NotificationSuccessImg from "../../../images/verified.svg";
import TimesSuccess from "../../../images/times-success.svg";
import {NOTIFICATION_TYPE} from "../../../actions/notification/notification-actions";

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
      message: "",
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.updateNotification(this.props.notification);
    }
  }

  updateNotification(notification) {
    console.log(notification);
    const action = notification.show ? "show" : "hide";
    this.setState({type: notification.notificationType, message: notification.message});
    $(".toast").toast(action);
  }


  render() {
    const statusClass = this.state.type === NOTIFICATION_TYPE.SUCCESS ? this.statusClassOptions.SUCCESS : this.statusClassOptions.ERROR;
    return (
      <div className={`toast custom-toast ${statusClass}`} role="alert" aria-live="assertive" aria-atomic="true" data-delay={111500}>
        <div className="toast-body">
          <div className="row align-items-center justify-content-center">
            <div className="col-2 text-center">
              <img src={NotificationSuccessImg}/>
            </div>
            <div className="col-8 text-left">
              <span className="ml-3">
                {this.state.message}
              </span>
            </div>
            <div className="col-2 text-center">
              <img src={TimesSuccess} type="button" data-dismiss="toast" aria-label="Close" />
            </div>
          </div>
        </div>
      </div>
    );
  }

}


Notification.propTypes = {
  show: PropTypes.bool,
  notification: PropTypes.object
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
  saveBrandCompleted
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification);


