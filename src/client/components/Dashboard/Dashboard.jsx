// eslint-disable-next-line filenames/match-regex
import React from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {DashboardHeader, WidgetSectionContainer} from "../index";
import Http from "../../utility/Http";
import widgetConfig from "./../../config/contentDescriptors/widgets";
import AUTH_CONFIG from "../../config/authorizations";
import TABLESMETA from "../../config/tablesMeta";
import "./Dashboard.component.scss";

class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      brand: [],
      claim: [],
      fetchComplete: false
    }
  }

  componentDidMount() {
    Promise.all([
      Http.get(widgetConfig.SECTIONS.CLAIM.API),
      Http.get(widgetConfig.SECTIONS.BRAND.API)
    ]).then(response => {
      let claim = [], brand = [];
      response && response.forEach(responseItem => responseItem.body && responseItem.body.data ? (claim = responseItem.body.data.content) : (brand = responseItem.body.content))
      this.setState({claim, brand, fetchComplete: true})
    });
  }

  render() {
    return (
      <div className="c-Dashboard h-100">
        <DashboardHeader userInfo={this.props.userProfile}/>
        <WidgetSectionContainer
          authConfig={AUTH_CONFIG}
          data={{claim: this.state.claim, brand: this.state.brand}}
          fetchComplete={this.state.fetchComplete}
          sections={widgetConfig.SECTIONS}
          tableMeta={TABLESMETA.TABLES}
          userProfile={this.props.userProfile}
          widgetCommon={widgetConfig.WIDGETCOMMON}
          widgetStack={widgetConfig.WIDGETSALL}
        />
      </div>
    );
  }
}

Dashboard.propTypes = {
  userProfile: PropTypes.object
};

const mapStateToProps = state => {
  return {
    userProfile: state.user.profile
  };
};

export default connect(mapStateToProps)(Dashboard);
