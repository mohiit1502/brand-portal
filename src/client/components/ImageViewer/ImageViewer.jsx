/* eslint-disable filenames/match-regex */
import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {CSSTransition} from "react-transition-group";
import jQuery from "jquery";
import {toggleImageViewer} from "../../actions/content/content-actions";
import * as imagesAll from "./../../images";
import "./ImageViewer.component.scss";

const ImageViewer = props => {

  const toggleModal = () => {
    const modalElements = jQuery(".modal");
    const backdrop = jQuery(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
    const options = {
      backdrop: "static",
      keyboard: false,
      show: props.viewerState.show
    };
    modalElements.modal(options);
    if (!props.viewerState.show) {
      backdrop.remove();
    }
    return modalElements;
  };

  useEffect(() => {
    toggleModal();
  }, [props.viewerState]);

  return (
    <div className="c-ImageViewer">
      <CSSTransition
        in={props.viewerState.show}
        timeout={400}
        classNames="c-ImageViewer"
        unmountOnExit
      >
        <div className="modal show" id="imageViewerModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <button type="button" className="close" aria-label="Close" onClick={() => props.toggleImageViewDispatcher({show: false, imageSrc: ""})}>
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="modal-body">
                <img className="c-ImageViewer__image" src={imagesAll[props.viewerState.imageSrc]} />
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

ImageViewer.propTypes = {
  viewerState: PropTypes.bool,
  toggleImageViewDispatcher: PropTypes.func
};

const mapStateToProps = state => {
  return {
    viewerState: state.content.viewerState
  };
};

const mapDispatchToProps = {
  toggleImageViewDispatcher: toggleImageViewer
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageViewer);
