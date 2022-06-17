/* eslint-disable max-statements */
import React, {useState} from "react";
import PropTypes from "prop-types";
import CustomInput from "../custom-components/custom-input/custom-input";
import * as images from "../../images";
import "./UrlItemList.component.scss";
import Tooltip from "../custom-components/tooltip/tooltip";

const UrlItemList = props => {
  const [itemList, updateItemList] = useState(props.itemList);
  const [itemUrlId, setItemUrlId] = useState(0);
  const [enableAddItem, setEnableAddItem] = useState(true);

  const addToItemList = () => {

    const newItemUrl = {...itemList[0].url};
    const newItemSellerName = {...itemList[0].sellerName};
    const newItemOrderNumber = {...itemList[0].orderNumber};

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

    newItemOrderNumber.inputId = `orderNumber-${itemUrlId}`;
    newItemOrderNumber.key = `orderNumber-${itemUrlId}`;
    newItemOrderNumber.value = "";
    newItemOrderNumber.disabled = false;
    newItemOrderNumber.error = "";

    const item = {
      id: `item-${itemUrlId}`,
      url: newItemUrl,
      sellerName: newItemSellerName,
      orderNumber: newItemOrderNumber
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

  const tooltipContent = {
    orderNumberContent: <div>
      <ol className="m-0 p-0">
        <ul className="m-0 pl-3 text-left font-size-12">
          {/*<li>Upload IP Registration Documents or Letter of Authorization</li>*/}
          <li>You can include multiple order numbers using "," to separate them.</li>
        </ul>
      </ol>
    </div>
  };
  const showOrderNumber = props.parentRef.state.form.inputData.claimType.value === "Counterfeit";
  /* eslint-disable react/jsx-handler-names */
  return itemList && itemList.length > 0 ? itemList.map((item, i) => {
    item = {...item};

    return (<div key={i} className="c-UrlItem row item-url-list">
      <div className={showOrderNumber ? "col-6": "col-7"}>
        <CustomInput key={`url-${i}`} inputId={`url-${i}`} formId={props.formId} label={item.url.label}
                     required={item.url.required}
                     value={item.url.value} type={item.url.type} bubbleValue = {props.bubbleValue}
                     pattern={item.url.pattern}  patternErrorMessage={item.url.patternErrorMessage}
                     onChange={props.parentRef[props.onChangeUrl]} validators={item.url.validators}
                     disabled={item.url.disabled} error={item.url.error} onInvalid={e => props.onInvalid(e, `urlItems.itemList[${i}].url`, `url-${i}`) || (() => {})}
                     preventHTMLRequiredValidation = {item.url.preventHTMLRequiredValidation}
                     loader={props.fieldLoader && itemUrlId === i}/>
      </div>
      <div className={showOrderNumber ? "col-6": "col-5"}>
        <div className="row">
          <div className={showOrderNumber ? "col-4" : "col-8"}>
            <CustomInput key={`sellerName-${i}`} inputId={`sellerName-${i}`} formId={props.formId}
                         label={item.sellerName.label}
                         required={item.sellerName.required} value={item.sellerName.value} type={item.sellerName.type}
                         pattern={item.sellerName.pattern} validators={item.sellerName.validators} error={item.sellerName.error}
                         bubbleValue = {props.bubbleValue} listClasses = {item.sellerName.listClasses}
                         onChange={props.parentRef[props.onChangeSellerName]} disabled={item.sellerName.disabled} onInvalid={() => {}} preventHTMLRequiredValidation = {item.sellerName.preventHTMLRequiredValidation}
                         dropdownOptions = {item.sellerName.type === "multiselect" ? item.sellerName.dropdownOptions : false} />
          </div>
          {
            (props.formId !== "webform") && showOrderNumber &&
            <div className="col-6">
                <CustomInput key={`orderNumber-${i}`} inputId={`orderNumber-${i}`} formId={props.formId}
                             label={item.orderNumber.label}
                             required={item.orderNumber.required} value={item.orderNumber.value}
                             type={item.orderNumber.type}
                             pattern={item.orderNumber.pattern} validators={item.orderNumber.validators}
                             error={item.orderNumber.error} bubbleValue={props.bubbleValue}
                             onChange={props.parentRef[props.onChangeOrderNumber]} disabled={item.orderNumber.disabled}
                             onInvalid={e => props.onInvalid(e, `urlItems.itemList[${i}].orderNumber`, `orderNumber-${i}`) || (() => {})}
                             preventHTMLRequiredValidation={item.orderNumber.preventHTMLRequiredValidation}/>

            </div>
          }
          {/*tooltipContent={tooltipContent[props.itemList[0].orderNumber.tooltipContentKey]}*/}
          {/*<div>*/}
          {/*  <Tooltip*/}
          {/*    content={tooltipContent[props.itemList[0].orderNumber.tooltipContentKey]}*/}
          {/*    icon={images[props.itemList[0].orderNumber.icon]}/>*/}
          {/*</div>*/}
          <div className={showOrderNumber ? "col-2" : "col-4"}>
            {
              i === 0 &&
              <div className={`btn btn-sm btn-block btn-primary${(props.disableAddItem || !enableAddItem) && " disabled" || ""}`} onClick={addToItemList} >
                <img src={images.Plus} className="plus-icon make-it-white"/></div> ||
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
