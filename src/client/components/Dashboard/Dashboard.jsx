// eslint-disable-next-line filenames/match-regex
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {dispatchFilter} from "../../actions/dashboard/dashboard-actions";
import {DashboardHeader, WidgetContainer} from "../index";
import {showNotification} from "../../actions/notification/notification-actions";
import Http from "../../utility/Http";
import Helper from "../../utility/helper";
import widgetConfig from "./../../config/contentDescriptors/widgets";
import AUTH_CONFIG from "../../config/authorizations";
import * as images from "./../../images";
import "./Dashboard.component.scss";

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
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
    }
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
        filters["orgId"] = user.organization.id;
        filters["emailId"] = user.email;
        filters["role"] = user.role && user.role.name;
        if (response.body && response.body.errors && response.body.errors.length > 0) {
          this.props.dispatchFilter(filters);
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
        })
        filters["widget-claims-by-type"] = {dateRange: "last30days"};
        filters["widget-claims-by-brand"] = {dateRange: "last30days"};
        filters["widget-claims-by-user"] = {dateRange: "last30days"};
        this.props.dispatchFilter(filters);
      })
      .catch(e => {
        console.log(e)
        this.setState({
          error: true,
          fetchComplete: true
        })
      });
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
        /> : <div className="page-error text-center">
          <img className="error-image" src={images.PageError} alt="Page Error" />
          <h4 className="page-error-header font-weight-bold">Oops. Something went wrong.</h4>
          <p className="page-error-message">Try to refresh this page or try again later.</p>
        </div>}
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
}

const mapStateToProps = state => {
  return {
    currentFilters: state.dashboard.filter,
    userProfile: state.user.profile
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
