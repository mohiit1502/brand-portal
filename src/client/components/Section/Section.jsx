import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import $ from "jquery";
import {TOGGLE_ACTIONS, toggleModal} from "../../actions/modal-actions";
import {showNotification} from "../../actions/notification/notification-actions";
import Tooltip from "../custom-components/tooltip/tooltip";
import ContentRenderer from "../../utility/ContentRenderer";
import * as images from "../../images";
import "./Section.component.scss";
import Helper from "../../utility/helper";

const Section = props => {
  const {config: {header, body, footer, innerClasses, layoutClasses}, modalsMeta, parent, toggleModal} = props;
  const getTooltipContent = content => content.map(text => {
    return <div className="py-2">
      <p className="mt-2 pl-2 text-left font-size-12">{text}</p>
    </div>
  });

  useEffect(() => {
    try {
      $("[title]")
        .on("mouseenter", () => $(".tooltip").removeClass("move-beneath"))
        .tooltip();
      $("body")
        .on("click", ".tooltip-close-button", () => $(".tooltip").addClass("move-beneath"))
        .on("mouseleave", ".tooltip, [title]", () => $(".tooltip").addClass("move-beneath"));
    } catch (e) {}
  }, [])

  const buttonRenders = footer && footer.buttons && footer.buttons.map(button => {
    const shouldRender = ContentRenderer.evaluateRenderDependency.call(parent, button.renderCondition);
    return shouldRender ? <span className={`${button.classes ? button.classes : ""}`} onClick={() => runAction(button.action, button.actionParams)}>{button.text}</span> : null;
  }).filter(footer => footer);

  const runAction = (action, actionParams) => {
    switch (action) {
      case "displayModal":
        const modal = actionParams.modal;
        const title = actionParams.title;
        let params;
        if (typeof modal === "string") {
          params = actionParams;
        } else if (typeof modal === "object") {
          params = modal.find(conf => conf.value === Helper.search(conf.key, parent));
        }
        const meta = {templateName: params.modal, ...(params.configName ? modalsMeta[params.configName] : {}), title};
        actionParams.context && (meta.context = actionParams.context);
        actionParams.subContext && (meta.subContext = actionParams.subContext);
        toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    }
  }

  const evaluateRenderFooter = footer => !footer.renderCondition || ContentRenderer.evaluateRenderDependency.call(parent, footer.renderCondition);

  return (
    <div className={`c-Section${layoutClasses ? " " + layoutClasses : ""}`}>
      <div className={`${innerClasses ? " " + innerClasses : ""}`}>
        {body && <div className={`c-SectionBox${body.classes ? " " + body.classes : ""}`}>
          {header && <header className={header.classes}>
            {header.text}
            {header.tooltip && <Tooltip classes="ml-3" content={getTooltipContent(header.tooltip)}
              icon={images.Question}/>}
          </header>}
          {ContentRenderer.getSectionRenders.call(parent, body.content)}
        </div>}
        {footer && evaluateRenderFooter(footer) && <footer
          className={`${footer.classes ? " " + footer.classes : ""}${buttonRenders ? buttonRenders.length > 1 ? " justify-content-between" : " justify-content-around" : ""}`}>
          {footer.text && <span onClick={() => runAction(footer.action, footer.actionParams)}>{footer.text}</span>}
          {footer.buttons ? buttonRenders : null}
        </footer>}
      </div>
    </div>
  );
};

Section.propTypes = {
  config: PropTypes.object,
  data: PropTypes.object,
  modalsMeta: PropTypes.object,
  parent: PropTypes.object,
  toggleModal: PropTypes.func
};

const mapStateToProps = state => {
  return {
    modalsMeta: state.content.metadata ? state.content.metadata.MODALSCONFIG : {}
  };
};

const mapDispatchToProps = {
  showNotification,
  toggleModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Section);
