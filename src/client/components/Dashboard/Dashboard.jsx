// eslint-disable-next-line filenames/match-regex
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {dispatchFilter} from "../../actions/dashboard/dashboard-actions";
import {DashboardHeader, GenericErrorPage, WidgetContainer} from "../index";
import {showNotification} from "../../actions/notification/notification-actions";
import Http from "../../utility/Http";
import Helper from "../../utility/helper";
import widgetConfig from "./../../config/contentDescriptors/widgets";
import AUTH_CONFIG from "../../config/authorizations";
import "./Dashboard.component.scss";
import mixpanel from "../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../constants/mixpanelConstants";
import { TOGGLE_ACTIONS, toggleModal } from "../../actions/modal-actions";

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    const {modalsMeta, toggleModal} = props;
    this.state = {
      data: {
        brand: {},
        claim: {},
        user: {},
        claimsByType: [],
        claimsByBrands: [],
        claimsByUsers: []
      },
      error: false,
      fetchComplete: false
    };
    // toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "StatusModalTemplate", ...modalsMeta.GO_TO_USER_PROFILE});

  }

  componentDidMount() {
    const url = widgetConfig.API;
    const user = this.props.userProfile;
    const interpolatedUrl = Helper.getParamsEncoded(url, user);
    // interpolatedUrl = url && user && user.role && url.replace("__orgId__", user.organization.id).replace("__emailId__", user.email).replace("__role__", user.role.name);
    Http.get(interpolatedUrl, null, null, this.props.showNotification, null, "Unable to complete request!")
      .then(response => {
        // console.log(response);
        const filters = {...this.props.currentFilters};
        filters.orgId = user.organization.id;
        filters.emailId = user.email;
        filters.role = user.role && user.role.name;
        if (response.body && response.body.errors && response.body.errors.length > 0) {
          this.props.dispatchFilter(filters);
          /* eslint-disable no-throw-literal */
          throw "error";
        }
        const data = response.body && response.body.data;
        this.setState({
          data: {
            claim: data.claimsInfo,
            brand: data.brandsInfo,
            user: data.usersInfo,
            claimsByType: data.reportedClaimsType && data.reportedClaimsType,
            claimsByBrands: data.topReportedBrands,
            claimsByUsers: data.topReporters
          },
          fetchComplete: true
        });
        filters["widget-claims-by-type"] = {dateRange: "last30days"};
        filters["widget-claims-by-brand"] = {dateRange: "last30days"};
        filters["widget-claims-by-user"] = {dateRange: "last30days"};
        this.props.dispatchFilter(filters);
      })
      .catch(() => {
        this.setState({
          error: true,
          fetchComplete: true
        });
      });
      const mixpanelPayload = { WORK_FLOW: "MY_DASHBOARD"};
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.VIEW_DASHBOARD_WORKFLOW.VIEW_DASHBOARD, mixpanelPayload);
      
    }

  render() {
    return (
      <div className="c-Dashboard h-100">
        <DashboardHeader userInfo={this.props.userProfile}/>
        {!this.state.error ? <WidgetContainer
          authConfig={AUTH_CONFIG}
          currentFilters={this.props.currentFilters}
          data={this.state.data}
          fetchComplete={this.state.fetchComplete}
          widgets={widgetConfig.WIDGETS}
          userProfile={this.props.userProfile}
          widgetCommon={widgetConfig.WIDGETCOMMON}
          widgetStack={widgetConfig.WIDGETTYPES}
        /> : <GenericErrorPage generic />}
      </div>
    );
  }
}

Dashboard.propTypes = {
  currentFilters: PropTypes.object,
  dispatchFilter: PropTypes.func,
  showNotification: PropTypes.func,
  userProfile: PropTypes.object
};

const mapDispatchToProps = {
  dispatchFilter,
  showNotification
};

const mapStateToProps = state => {
  return {
    currentFilters: state.dashboard.filter,
    userProfile: state.user.profile
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
