/* eslint-disable max-statements */
import React, {useState} from "react";
import PropTypes from "prop-types";
import CustomInput from "../custom-components/custom-input/custom-input";
import * as images from "../../images";
import "./UrlItemList.component.scss";

const UrlItemList = props => {
  const [itemList, updateItemList] = useState(props.itemList);
  const [itemUrlId, setItemUrlId] = useState(0);
  const [enableAddItem, setEnableAddItem] = useState(true);

  const addToItemList = () => {

    const newItemUrl = {...itemList[0].url};
    const newItemSellerName = {...itemList[0].sellerName};

    newItemUrl.inputId = `url-${itemUrlId}`;
    newItemUrl.key = `url-${itemUrlId}`;
    newItemUrl.value = "";
    newItemUrl.disabled = false;
    newItemUrl.isValid = false;
    newItemUrl.subtitle = "";
    newItemUrl.error = "";

    newItemSellerName.inputId = `sellerName-${itemUrlId}`;
    newItemSellerName.key = `sellerName-${itemUrlId}`;
    newItemSellerName.value = "";
    newItemSellerName.disabled = props.isSellerNameDisabled;
    newItemSellerName.dropdownOptions = [];
    newItemSellerName.subtitle = "";
    newItemSellerName.error = "";

    const item = {
      id: `item-${itemUrlId}`,
      url: newItemUrl,
      sellerName: newItemSellerName
    };

    setItemUrlId(itemUrlId + 1);

    const itemListClone = [...itemList];
    itemListClone.push(item);
    updateItemList(itemListClone);
    if (props.onChangeItem && props.parentRef[props.onChangeItem]) {
      props.parentRef[props.onChangeItem](itemListClone);
    }
    if (props.maxItems && itemListClone.length >= props.maxItems) {
      setEnableAddItem(false);
    }
  };

  const removeFromItemList = index => {
    const itemListClone = [...itemList];
    itemListClone.splice(index, 1);
    updateItemList(itemListClone);
    if (props.onChangeItem && props.parentRef[props.onChangeItem]) {
      props.parentRef[props.onChangeItem](itemListClone);
    }
    if (props.maxItems && itemListClone.length <= props.maxItems) {
      setEnableAddItem(true);
    }
  };

  /* eslint-disable react/jsx-handler-names */
  return itemList && itemList.length > 0 ? itemList.map((item, i) => {
    item = {...item};
    return (<div key={i} className="c-UrlItem row item-url-list">
      <div className="col-8">
        <CustomInput key={`url-${i}`} inputId={`url-${i}`} formId={props.formId} label={item.url.label}
          required={item.url.required}
          value={item.url.value} type={item.url.type} bubbleValue = {props.bubbleValue}
          pattern={item.url.pattern}  patternErrorMessage={item.url.patternErrorMessage}
          onChange={props.parentRef[props.onChangeUrl]} validators={item.url.validators}
          disabled={item.url.disabled} error={item.url.error} onInvalid={e => props.onInvalid(e, `urlItems.itemList[${i}].url`, `url-${i}`) || (() => {})}
          preventHTMLRequiredValidation = {item.url.preventHTMLRequiredValidation}
          loader={props.fieldLoader && itemUrlId === i}/>
      </div>
      <div className="col-4">
        <div className="row">
          <div className="col-8">
            <CustomInput key={`sellerName-${i}`} inputId={`sellerName-${i}`} formId={props.formId}
              label={item.sellerName.label}
              required={item.sellerName.required} value={item.sellerName.value} type={item.sellerName.type}
              pattern={item.sellerName.pattern} validators={item.sellerName.validators} error={item.sellerName.error}
              bubbleValue = {props.bubbleValue}
              onChange={props.parentRef[props.onChangeSellerName]} disabled={item.sellerName.disabled} onInvalid={() => {}} preventHTMLRequiredValidation = {item.sellerName.preventHTMLRequiredValidation}
              dropdownOptions = {item.sellerName.type === "multiselect" ? item.sellerName.dropdownOptions : false} />
          </div>
          <div className="col-4">
            {
              i === 0 &&
              <div className={`btn btn-sm btn-block btn-primary${(props.disableAddItem || !enableAddItem) && " disabled" || ""}`} onClick={addToItemList} >
                <img src={images.Plus} className="plus-icon make-it-white"/> Item </div> ||
              <button className="btn btn-sm btn-block cancel-btn text-primary" type="button" onClick={() => removeFromItemList(i)}>Remove</button>
            }
          </div>
        </div>
      </div>
    </div>);
  }) : null;
};

UrlItemList.propTypes = {
  formData: PropTypes.object,
  formId: PropTypes.string,
  items: PropTypes.array,
  patternErrorMessage: PropTypes.string,
  parentRef: PropTypes.object
};

export default UrlItemList;
