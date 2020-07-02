import React from "react";
import { connect } from "react-redux";
import HomeHeader from "../custom-components/headers/home-header";
import Leftnav from "../custom-components/left-nav/left-nav";
import ContentRenderer from "./content-renderer/content-renderer";
import PropTypes from "prop-types";
import "../../styles/home/home.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
     return (
        <div className="view-container home-container">
          <HomeHeader {...this.props}/>
          <div className="mx-n3">
              <Leftnav {...this.props}/>
              <ContentRenderer {...this.props}/>
          </div>
        </div>
      );
  }
}

Home.propTypes = {
  location: PropTypes.object,
  isOnboarded: PropTypes.bool
};

export default connect()(Home);
