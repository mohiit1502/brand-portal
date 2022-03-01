import React, {useState} from "react";
import "./Banner.component.scss";

const Banner = (props) => {

  const [expand,setExpand] = useState(false);

  const func = (evt) => {
    evt.preventDefault()
    setExpand(!expand);
  }

  return (
    <div className="c-Banner mb-4">
      <div className={`banner-body pl-4 pr-2 py-2`}>
        <div className={`banner-content pl-2 col-11`}>
          <strong>We do not support unauthorized reseller claims.</strong>
          Walmart runs a unified catalog that allows resellers to make offers on a single listing.
          {expand ? ` For unauthorized reseller claims, you may contact the seller directly to resolve the matter. The contact information can be accessed by clicking the specific seller’s name found on the listing.` : ""}
        </div>
        <span className={`col-1 pl-3 pr-0`}><a className={`see-more-button`} onClick={func} href={`#`}>{expand ? `See less` : `See more`}</a></span>
      </div>
    </div>
  );
};

Banner.propTypes = {

};

export default Banner;
