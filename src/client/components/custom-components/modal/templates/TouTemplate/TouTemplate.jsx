import React from 'react';
import PropTypes from 'prop-types';
import './TouTemplate.component.scss';
import {TOGGLE_ACTIONS} from "../../../../../actions/modal-actions";

const TouTemplate = props => {
  return (
    <div className="c-TouTemplate modal show" id="singletonModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header font-weight-bold align-items-center">
            TERMS OF USE
            <button type="button" className="close text-white" aria-label="Close" onClick={() => props.toggleModal(TOGGLE_ACTIONS.HIDE)}>
              <span className="close-btn" aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body text-center">
            Terms of Use
          </div>
        </div>
      </div>
    </div>
  );
};

TouTemplate.propTypes = {
  data: PropTypes.object,
  meta: PropTypes.object,
  modal: PropTypes.object
};

export default TouTemplate;
