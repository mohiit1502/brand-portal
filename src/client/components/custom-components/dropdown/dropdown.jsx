import React from "react";
import { connect } from "react-redux";
import "../../../styles/custom-components/dropdown/dropdown.scss";
import PropTypes from "prop-types";

class Dropdown extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    const {data, hideEllipsis, options} = this.props;
    return (
      <div className="dropdown custom-dropdown d-inline-block">

        <span className={`dropdown-toggle-btn cursor-pointer${hideEllipsis ? " hide" : ""}`} data-toggle="dropdown"><img src={options.buttonText} /> </span>

        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {
            options.dropdownOptions.map((option, i) => {
              return (
                <a key={i} id={option.id}className="dropdown-item" onClick={e => {option.clickCallback(e, option, data);}}>{option.value}</a>
              );
            })
          }
        </div>
      </div>
    );
  }
}

Dropdown.propTypes = {
  hideEllipsis: PropTypes.bool,
  options: PropTypes.object,
  data: PropTypes.object
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(Dropdown);
