import React from "react";
import { connect } from "react-redux";
import "../../../styles/custom-components/stepper/stepper.scss";
import PropTypes from "prop-types";
import ReactDOMServer from "react-dom/server";

class Tooltip extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <img alt="i" className={this.props.classes} src={this.props.icon} data-toggle="tooltip" data-placement={this.props.placement} data-html="true"
        title={ReactDOMServer.renderToString(this.props.content)}/>
    );
  }
}

Tooltip.propTypes = {
  classes: PropTypes.string,
  placement: PropTypes.string,
  content: PropTypes.node,
  icon: PropTypes.node
};

export  default  connect()(Tooltip);
