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
    const item = {
      id: `item-${itemUrlId}`,
      url: {
        inputId: `url-${itemUrlId}`,
        key: `url-${itemUrlId}`,
        label: "Item URL",
        required: true,
        value: "",
        type: "url",
       // pattern: "https?://.+",
        preventHTMLRequiredValidation: true,
        disabled: false,
        isValid: false,
        subtitle: "",
        error: ""
      },
      sellerName: {
        inputId: `sellerName-${itemUrlId}`,
        key: `sellerName-${itemUrlId}`,
        label: "Seller Name",
        required: true,
        value: "",
        type: props.sellerNameType ?  props.sellerNameType : "text",
        disabled: true,
        dropdownOptions: [],
        subtitle: "",
        error: "",
        preventHTMLRequiredValidation: true,
        validators: {
          validateLength: {
            minLength: 2,
            error: "Minimum length is 2 characters"
          }
        }
      }
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
    // state.form.inputData.itemList.unshift(item);
    // state.form.inputData.itemList.push(item);
    // this.setState(state, () => this.checkToEnableSubmit(this.checkToEnableItemButton));
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

  return itemList && itemList.length > 0 ? itemList.map((item, i) => {
    return (<div key={i} className="c-UrlItem row item-url-list">
      <div className="col-8">
        <CustomInput key={`url-${i}`} inputId={`url-${i}`} formId={props.formId} label={item.url.label}
          required={item.url.required}
          value={item.url.value} type={item.url.type}
          pattern={props.pattern ? props.pattern : "" }  patternErrorMessage={props.patternErrorMessage ? props.patternErrorMessage : "" }
          onChange={props.parentRef[props.onChangeUrl]}
          disabled={item.url.disabled} error={item.url.error} onInvalid={() => {}} preventHTMLRequiredValidation = {item.url.preventHTMLRequiredValidation}
          loader={props.fieldLoader && itemUrlId === i}/>
      </div>
      <div className="col-4">
        <div className="row">
          <div className="col-8">
            <CustomInput key={`sellerName-${i}`} inputId={`sellerName-${i}`} formId={props.formId}
              label={item.sellerName.label}
              required={item.sellerName.required} value={item.sellerName.value} type={item.sellerName.type}
              pattern={item.sellerName.pattern} validators={item.sellerName.validators} error={item.sellerName.error}
              bubbleValue = {props.bubbleValue && props.parentRef[props.bubbleValue] ? props.parentRef[props.bubbleValue] : () => {}}
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
