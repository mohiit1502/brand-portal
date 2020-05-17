import "bootstrap";
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import $ from "jquery";
import {TOGGLE_ACTIONS} from "../../actions/modal-actions";
import CreateUserTemplate from "../../components/modal/templates/create-user-template";

class CustomModal extends React.Component {


  constructor (props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    const toggleAction = this.props.modal.enable ? TOGGLE_ACTIONS.SHOW : TOGGLE_ACTIONS.HIDE;
    this.toggleModal(toggleAction);
  }


  fetchTemplate(key) {
    switch (key) {
      case "CreateUserTemplate" : return CreateUserTemplate;
    }
    return null;
  }

  toggleModal(toggleAction) {
    return $(".modal").modal(toggleAction);
  }

  render () {
    const CustomComponent = this.fetchTemplate(this.props.modal.template);
    return (
      CustomComponent && <CustomComponent toggleModal={this.toggleModal} data={this.props.modal.data}/>
    );
  }
}
CustomModal.propTypes = {
  modal: PropTypes.object
};

const mapStateToProps = state => {
  return {
    modal: state.modal
  };
};

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(CustomModal);

