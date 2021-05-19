import React from "react";
import PropTypes from "prop-types";
import "./WebformLandingPage.component.scss";
import ContentRenderer from "../../utility/ContentRenderer";

const WebformLandingPage = props => {

  const contents = [
    {
    header: "Walmart Brand Portal",
    body: {
      para1: "You can report any legitimate claims of intellectual property infringement for items listed on Walmart.com, including claims of copyright, trademark, patent, and counterfeit.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.",
      para2: "Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements."
    },
    button: {
      buttonText: "Register",
      key: "register",
      classes: "btn btn-sm btn-primary"
    }
  },  {
    header: "DMCA IP Claim Form",
    body: {
      para1: "You can report any legitimate claims of intellectual property infringement for items listed on Walmart.com, including claims of copyright, trademark, patent, and counterfeit.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.",
      para2: "Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements.Please note that violations of exclusive distribution agreements are not the subject of IP infringement, and Walmart will not take action to enforce such agreements."
    },
    button: {
      buttonText: "Submit IP claim",
      key: "submit_claim",
      classes: "btn btn-sm  btn-primary"
    }
  }
];
  const contentRenderer = new ContentRenderer();
  const contentRenders = contents.map(content => Object.keys(content).map(node => {
    if (node.startsWith("header")) {
      return (<div className="content-header">{content.header}</div>);
    } else if (node.startsWith("button")) {
      return (<div className="content-button  text-right pl-5"><button type="button" className={content[node].classes} key={content[node].key} >{content[node].buttonText}</button></div>);
    } else {
      return (Object.keys(content[node]).map(subcontent => {
        return contentRenderer.getContent(content[node], subcontent);
      }));
    }
  }));

  return (
    <div className="c-WebformLandingPage">
      <div className="row h3 header">
        Walmart IP Services
      </div>
      <div className="row h4 header ml-3">
        Submit IP claims
      </div>
      <div className="px-5">{contentRenders}</div>
    </div>
  );
};

WebformLandingPage.propTypes = {

};

export default WebformLandingPage;
