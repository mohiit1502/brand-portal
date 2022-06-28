import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import ContentRenderer from "../../utility/ContentRenderer";
import * as images from "../../images";
import "./FieldSet.component.scss";

const FieldSet = props => {
  const [itemList, updateItemList] = useState(props.itemList);
  // const [currentItemId, setCurrentItemId] = useState(0);
  const [enableAddItem, setEnableAddItem] = useState(false);
  const [maxItemsAdded, setMaxItemsAdded] = useState(false);
  useEffect(() => {
    if (itemList) {
      if (itemList.length === 0) {
        addToItemList(true);
      } else {
        const itemListClone = JSON.parse(JSON.stringify(itemList));
        let maxCol = -1, lastField;
        itemListClone.map((item, i) => {
          if (i === 0) {
            Object.values(item.fieldSet).forEach(field => {
              if (field.layout) {
                let column = +field.layout.split(".")[1];
                if (column > maxCol) {
                  maxCol = column;
                  lastField = field;
                }
              }
            });
            const span = +lastField.layout.split(".")[2] + 1;
            lastField.layout = lastField.layout.substring(0, lastField.layout.lastIndexOf(".") + 1) + span;
          }
        });
        updateItemList(itemListClone);
      }
    }
  }, []);

  const addToItemList = isFirst => {
    const newItem = JSON.parse(JSON.stringify(props.itemListTemplate));
    const index = itemList.length + 1;
    const item = {
      id: `item-${index}`,
      fieldSet: newItem
    };

    let maxCol = -1, lastField;
    Object.values(newItem).forEach(field => {
      field.inputId = `${field.inputId}-${index}`;
      field.id = field.inputId;
      field.key = field.inputId;
    });
    if (isFirst) {
      Object.values(newItem).forEach(field => {
        if (field.layout) {
          let column = +field.layout.split(".")[1];
          if (column > maxCol) {
            maxCol = column;
            lastField = field;
          }
        }
      });
      if (lastField) {
        const span = +lastField.layout.split(".")[2] + 1;
        lastField.layout = lastField.layout.substring(0, lastField.layout.lastIndexOf(".") + 1) + span;
      }
    }

    // setCurrentItemId(currentItemId + 1);

    const itemListClone = [...itemList];
    itemListClone.push(item);
    updateItemList(itemListClone);
    if (props.onChangeItem && props.parentRef[props.onChangeItem]) {
      props.parentRef[props.onChangeItem](itemListClone);
    }
    setEnableAddItem(false);
    if (props.maxItems && itemListClone.length === props.maxItems) {
      setMaxItemsAdded(true);
    }
  };

  props.parentRef && (props.parentRef.checkToEnableAddItemButton = () => {
    const enableAddItemButton = itemList && itemList.length > 0 && itemList.every(item => Object.values(item.fieldSet).every(field => (!field.required || !!field.value) && !field.error));
    setEnableAddItem(enableAddItemButton);
  });

  const removeFromItemList = index => {
    const itemListClone = [...itemList];
    itemListClone.splice(index, 1);
    updateItemList(itemListClone);
    if (props.onChangeItem && props.parentRef[props.onChangeItem]) {
      props.parentRef[props.onChangeItem](itemListClone);
    }
    props.parentRef.checkToEnableAddItemButton();
    if (props.maxItems && itemListClone.length <= props.maxItems) {
      setMaxItemsAdded(false);
    }
  };

  const disableAddItems = !enableAddItem || maxItemsAdded;
  /* eslint-disable react/jsx-handler-names */
  return <div className="c-FieldSetContainer">{
    itemList && itemList.length > 0 ? itemList.map((item, i) => {
      const thisClone = {...props.parentRef};
      thisClone.state = {...thisClone.state};
      thisClone.state.form = {...thisClone.state.form};
      thisClone.state.form.inputData = item.fieldSet;
      return <div key={i} className="c-FieldSet row item-list">
        {ContentRenderer.getFieldRenders.call(thisClone)}
        {i !== 0 && <div className="col-1"><button className="btn btn-sm btn-block p-0" type="button" onClick={() => removeFromItemList(i)}>
          <img src={images.RedCross} /> {props.removeLabel }
        </button></div>}
      </div>
    }) : null
  }
  <div className="offset-8 col-4 px-0">
    {
      <button type="button" className={`btn btn-sm btn-block btn-outline-primary${disableAddItems && " disabled" || ""}`}
        onClick={e => addToItemList(false)} disabled={disableAddItems}>
        <img src={images.Plus} className={`plus-icon${!disableAddItems ? " make-it-white" : ""}`}/> {props.addLabel || "Item"} </button>
    }
  </div>
  </div>;
};

FieldSet.propTypes = {
  formData: PropTypes.object,
  formId: PropTypes.string,
  items: PropTypes.array,
  patternErrorMessage: PropTypes.string,
  parentRef: PropTypes.object
};

export default FieldSet;
