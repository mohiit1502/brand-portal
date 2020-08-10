import React from "react";
import PropTypes from "prop-types";
import FaqSingle from "./../FaqSingle";
import "./LoginFaq.component.scss";

const LoginFaq = props => {
  const {faq} = props;
  const contentRendered =  faq.items.map((item, index) => {
    item.id = `loginfaq-${index}`;
    return <FaqSingle key={index} data={item} />;
  });

  return (
    <div id={faq.id} className="c-LoginFaq">
      <div className="c-LoginFaq__header h4">{faq.header}</div>
      <div className="c-LoginFaq__content">
        {contentRendered}
      </div>
    </div>
  );
};

LoginFaq.propTypes = {
  faq: PropTypes.object
};

export default LoginFaq;