import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ClientUtils from "../../utility/ClientUtils";
import Http from "../../utility/Http";


class LoginRedirect extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    const props = ClientUtils.getQueryParams(this.props.location);

    if (!props.code) {
      //redirect to login again.
    }
    Http.post("/api/login/access-token", {code: props.code})
      .then(res => {
        window.console.log(res);
      })
      .catch(err => {
        window.console.log(err);
      });
  }

  render() {
    return (
      <div/>
    );
  }
}


LoginRedirect.propTypes = {
  location: PropTypes.object
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(LoginRedirect);
