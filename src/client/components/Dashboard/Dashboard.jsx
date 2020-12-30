// eslint-disable-next-line filenames/match-regex
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {dispatchFilter} from "../../actions/dashboard/dashboard-actions";
import {DashboardHeader, WidgetContainer} from "../index";
import {showNotification} from "../../actions/notification/notification-actions";
import Http from "../../utility/Http";
import widgetConfig from "./../../config/contentDescriptors/widgets";
import AUTH_CONFIG from "../../config/authorizations";
// import TABLESMETA from "../../config/tablesMeta";
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
      fetchComplete: false
    }
  }

  componentDidMount() {
    Http.get(widgetConfig.API.replace("__orgId__", this.props.userProfile.organization.id), null, null, this.props.showNotification, null, "Unable to complete request!")
      .then(response => {
        // console.log(response);
        if (response.body && response.body.errors && response.body.errors.length > 0) {
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
        this.props.currentFilters["orgId"] = this.props.userProfile.organization.id;
        this.props.currentFilters["widget-claims-by-type"] = {dateRange: "last30days"};
        this.props.currentFilters["widget-claims-by-brand"] = {dateRange: "last30days"};
        this.props.currentFilters["widget-claims-by-user"] = {dateRange: "last30days"};
        const filters = {...this.props.currentFilters};
        this.props.dispatchFilter(filters);
      })
      .catch(e => {
        console.log(e)
        this.setState({
          fetchComplete: true
        })
      });
  }

  render() {
    return (
      <div className="c-Dashboard h-100">
        <DashboardHeader userInfo={this.props.userProfile}/>
        <WidgetContainer
          authConfig={AUTH_CONFIG}
          currentFilters={this.props.currentFilters}
          data={this.state.data}
          fetchComplete={this.state.fetchComplete}
          widgets={widgetConfig.WIDGETS}
          userProfile={this.props.userProfile}
          widgetCommon={widgetConfig.WIDGETCOMMON}
          widgetStack={widgetConfig.WIDGETTYPES}
        />
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
