import React from "react";
import { connect } from "react-redux";

class ContentRenderer extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return "Content";
  }
}

export  default  connect()(ContentRenderer);
