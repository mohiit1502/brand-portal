import React from "react";
import { connect } from "react-redux";


class LoginRedirect extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    alert();
  }

  render() {
    return (
      <div/>
    );
  }
}


LoginRedirect.propTypes = {};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(LoginRedirect);
