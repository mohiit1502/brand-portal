import React, {useState} from "react";
import PropTypes from "prop-types";
import "./Banner.component.scss";

const Banner = (props) => {
  const {content, innerClasses, theme, variant} = props;
  const [expand,setExpand] = useState(false);

  const func = (evt) => {
    evt.preventDefault()
    setExpand(!expand);
  }

  const getVariant = () => {
    switch (variant) {
      case undefined:
      case "v1":
        return <>
          <div className={`banner-content pl-2 col-11`}>
            <strong>We do not support unauthorized reseller claims. </strong>
            Walmart runs a unified catalog that allows resellers to make offers on a single listing.<br/>
            {expand ? `For unauthorized reseller claims, you may contact the seller directly to resolve the matter. The contact information can be accessed by clicking the specific seller’s name found on the listing.` : ""}
          </div>
          <span className={`col-1 pl-3 pr-0`}><a className={`see-more-button`} onClick={func} href={`#`}>{expand ? `See less` : `See more`}</a></span>
        </>;
      case "v2":
        return <div className={`banner-content pl-2`}>
          {content.text}
          </div>
    }
  }

  return (
    <div className={`c-Banner mb-4${innerClasses ? " " + innerClasses : ""}${theme ? " " + theme : ""}`}>
      <div className={`banner-body pl-4 pr-2 py-2${theme ? " " + theme : ""}`}>
        {getVariant()}
      </div>
    </div>
  );
};

Banner.propTypes = {
  classes: PropTypes.string,
  content: PropTypes.object,
  theme: PropTypes.string,
  variant: PropTypes.string
};

export default Banner;
