import React from "react";
import { connect } from "react-redux";
import HomeHeader from "./headers/home-header";
import Leftnav from "./left-nav/left-nav";
import ContentRenderer from "./content-renderer/content-renderer";
import PropTypes from "prop-types";
import "../styles/home.scss";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="view-container home-container">
        <HomeHeader {...this.props}/>
        <Leftnav {...this.props}/>
        <ContentRenderer {...this.props}/>
      </div>
    );
  }
}

Home.propTypes = {
  location: PropTypes.object
};

export default connect()(Home);
