import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CustomInput from "../custom-components/custom-input/custom-input";
import * as images from "../../images";
import './UrlItemList.component.scss';

const UrlItemList = props => {
  const [itemList, updateItemList] = useState(props.items);
  const [itemUrlId, setItemUrlId] = useState(0);

  const addToItemList = () => {
    const item = {
      id: `item-${itemUrlId}`,
      url: {
        label: "Item URL",
        required: true,
        value: "",
        type: "url",
        pattern: "https?://.+",
        disabled: false,
        isValid: false,
        subtitle: "",
        error: ""
      },
      sellerName: {
        label: "Seller Name",
        required: true,
        value: "",
        type: "multiselect",
        // type: "select",
        pattern: null,
        disabled: true,
        options: [],
        subtitle: "",
        error: "",
        validators: {
          validateLength: {
            minLength: 3,
            error: "Minimum length is 3 characters"
          }
        }
      }
    };
    setItemUrlId(itemUrlId + 1);
    const itemListClone = [...itemList];
    itemListClone.push(item);
    updateItemList(itemListClone);
    // state.form.inputData.itemList.unshift(item);
    // state.form.inputData.itemList.push(item);
    // this.setState(state, () => this.checkToEnableSubmit(this.checkToEnableItemButton));
  };

  const removeFromItemList = (index) => {
    const itemListClone = [...itemList];
    itemListClone.splice(index, 1)
    updateItemList(itemListClone);
  };

  return itemList && itemList.length > 0 ? itemList.map((item, i) => {
    return <div key={i} className="c-UrlItem row item-url-list">
      <div className="col-8">
        <CustomInput key={`url-${i}`} inputId={`url-${i}`} formId={props.formId} label={item.url.label}
                     required={item.url.required}
                     value={item.url.value} type={item.url.type} pattern={item.url.pattern} onChange={props.onChange}
                     disabled={item.url.disabled}
                     dropdownOptions={item.url.options} error={item.url.error}
                     loader={props.fieldLoader && props.currentItem === i}/>
      </div>
      <div className="col-4">
        <div className="row">
          <div className="col-8">
            <CustomInput key={`sellerName-${i}`} inputId={`sellerName-${i}`} formId={props.formId}
                         label={item.sellerName.label}
                         required={item.sellerName.required} value={item.sellerName.value} type={item.sellerName.type}
                         pattern={item.sellerName.pattern}
                         onChange={props.setSelectInputValue} disabled={item.sellerName.disabled}
                         dropdownOptions={item.sellerName.options}/>
          </div>
          <div className="col-4">
            {
              i === 0 &&
              <div className={`btn btn-sm btn-block btn-primary${props.disableAddItem && " disabled" || ""}`} onClick={addToItemList} >
                <img src={images.Plus} className="plus-icon make-it-white"/> Item </div> ||
              <button className="btn btn-sm btn-block cancel-btn text-primary" type="button" onClick={() => removeFromItemList(i)}>Remove</button>
            }
          </div>
        </div>
      </div>
    </div>
  }) : null;
};

UrlItemList.propTypes = {
  formId: PropTypes.string,
  items: PropTypes.array
};

export default UrlItemList;
