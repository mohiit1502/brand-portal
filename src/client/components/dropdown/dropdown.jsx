import React from "react";
import { connect } from "react-redux";
import "../../styles/dropdown/dropdown.scss";
import PropTypes from "prop-types";

class Dropdown extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="dropdown custom-dropdown d-inline-block">

        <span className="dropdown-toggle-btn cursor-pointer" data-toggle="dropdown"> &nbsp; <img src={this.props.options.buttonText} /> </span>

        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {
            this.props.options.dropdownOptions.map((option, i) => {
              return (
                <a key={i} id={option.id}className="dropdown-item" onClick={option.clickCallback}>{option.value}</a>
              );
            })
          }
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  options: PropTypes.object
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(Dropdown);
