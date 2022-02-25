/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-nested-ternary, max-params, no-unused-expressions, no-magic-numbers, max-statements, complexity */
import React from "react";
import * as imagesAll from "./../images";
import CustomInput from "../components/custom-components/custom-input/custom-input";
import Helper from "./helper";
import CONSTANTS from "../constants/constants";
import { Tile } from "../components";

export default class ContentRenderer {

  constructor(content, commonImageClass, commonClickHandler, contentOnClickHandler) {
    this.data = content;
    this.commonImageClass = commonImageClass;
    this.commonClickHandler = commonClickHandler;
    this.contentOnClickHandler = contentOnClickHandler;
  }
  insertImages(images) {
    const colClass = images && images.length === 1 ? "col-8" : "col-6";
    return (<div className="row">
      {
        images && images.map((image, key) => {
          return (
            <div className={colClass} key={key}>
              {image ? <img className={this.commonImageClass} src={imagesAll[image]}
                onClick={() => this.commonImageClass && this.commonClickHandler({
                              show: true,
                              imageSrc: image
                            })}/> : <i>Image PlaceHolder</i>}
            </div>
          );
        })
      }
    </div>);
  }

  processNodeDetails(nodeDetails) {
    return nodeDetails.steps && nodeDetails.steps.map((step, key) => {
      if (typeof step === "string") {
        return <li className={nodeDetails.liClasses ? nodeDetails.liClasses : ""} key={key}>{step}</li>;
      } else if ("partial" in step) {
        return <li>{Object.keys(step).map(node => this.getContent(step, node, "", true))}</li>;
      } else {
        return (
          <li className={nodeDetails.liClasses ? nodeDetails.liClasses : ""} key={key}>
            {step.main}
            {step.subList && this.getListContent(step.subList)}
            {step.image && this.insertImages(step.image)}
          </li>
        );
      }
    });
  }

  getListContent(nodeDetails) {
    const isOl = nodeDetails.type === "ol";
    if (isOl) {
      return <ol type={nodeDetails.subType}>{this.processNodeDetails(nodeDetails)}</ol>;
    } else {
      return <ul className="dashed">{this.processNodeDetails(nodeDetails)}</ul>;
    }
  }

  getPartialContent(content, node, classes, isPartial) {
    const partial = content[node];
    const partialRenders = Object.keys(partial).map(partialNodeKey => {
      const node1 = partial[partialNodeKey];
      if (partialNodeKey.startsWith("chunk")) {
        if (typeof node1 === "string") {
          return <span className={classes ? classes : ""}>{node1}</span>;
        } else {
          const chunkClass = node1.classes;
          const chunkText = ContentRenderer.implementDynamicReplacements(node1.dynamicReplacementConfig, node1.text);
          return <span className={`${classes ? classes : ""}${chunkClass ? " "+chunkClass : ""}`}>{chunkText}</span>;
        }
      } else if (partialNodeKey.startsWith("anchor")) {
        return <a href={node1.href} className={classes ? classes : node1.classes ? node1.classes : ""} >{node1.text}</a>;
      } else {
        return null;
      }
    });
    return isPartial ? <span className={classes ? classes : ""}>{partialRenders}</span> :
      <div className={classes ? classes : ""}>{partialRenders}</div>;
  }

  static implementDynamicReplacements(dynamicReplacements, text) {
    dynamicReplacements && Object.keys(dynamicReplacements).forEach(key => {
      const regex = new RegExp(key, "g");
      text = text.replace(regex, dynamicReplacements[key]);
    });
    return text;
  }
  getContent(content, node, classes, isPartial) {
    if (node.startsWith("partial")) {
      return this.getPartialContent(content, node, classes, isPartial);
    } else if (node.startsWith("para")) {
      let text = typeof (content[node]) === "string" ? content[node] : content[node].text;
      const dynamicReplacements = content[node] && content[node].dynamicReplacementConfig;
      text = ContentRenderer.implementDynamicReplacements(dynamicReplacements, text);
      if (typeof (content[node]) === "string") {
        return (<p className={classes ? classes : ""}>{text}</p>);
      } else {
        return <p className={content[node].classes ? content[node].classes : ""}>{text}</p>;
      }
    } else if (node.startsWith("list")) {
      return this.getListContent(content[node]);
    } else if (node.startsWith("header")) {
      return <div className={content[node].classes ? content[node].classes : ""}>{content[node].title}</div>;
    } else  if (node.startsWith("buttonsPanel")) {
      return (<div className={content[node].classes ? content[node].classes : ""}>
        {
          Object.keys(content[node].buttons).map(button => this.getContent(content[node].buttons, button))
        }
      </div>);
    } else if (node.startsWith("button")) {
      const handler = content[node].onClick ? typeof content[node].onClick === "function" ? content[node].onClick : this[content[node].onClick] : () => {};

      return <button type="button" className={content[node].classes ? content[node].classes : ""} key={content[node].key}
                     onClick={handler}
                     href={content[node].href ? content[node].href : ""} value={content[node].value ? content[node].value : 0} >
              {content[node].icon && <img src={imagesAll[content[node].icon]} alt={content[node].icon} className = "mr-2" style={{width: "1.3rem", height: "1.3rem"}}/>}
              {content[node].buttonText}
            </button>;
    } else if (node.startsWith("customDivider")) {
      return <hr className={content[node].classes ? content[node].classes : ""}/>;
    } else if (node.startsWith("tilesContainer")) {
      return (<div className={`row display-flex ${content[node].classes ? content[node].classes : ""}`}>
        {
          content[node].tiles.map((tile, key) => this.getContent(tile, `tile-${key}`))
        }
      </div>);
    } else if (node.startsWith("tile")) {
      return <Tile key={node} data={content} contentRenderer={this} />;
    } else if (node.startsWith("anchor")) {
      const metaData = content[node];
      return (<React.Fragment>
        <a href={metaData.href} className={metaData.classes ? metaData.classes : ""} >{metaData.text}
        {metaData.image && imagesAll[metaData.image] ? <img className="d-inline-block" src={imagesAll[metaData.image]}/> : ""}
        </a>
      </React.Fragment>);
    } else {
      return null;
    }
  }

  // Accordion specific rendering
  generateContentDOM(expanded, expandPreState) {
    const accNode = document.getElementById(this.data.id);
    const accButtonNode = accNode && accNode.getElementsByClassName("c-Accordion__button-container");
    const accPanelNode = accButtonNode && accButtonNode.length > 0 && accButtonNode[0].nextElementSibling;
    const answer = this.data.answer;
    const classes = `c-Accordion__panel${expanded ? " expanded" : ""}`;
    const styles = {maxHeight: expandPreState ? "100%" : expanded && accPanelNode ? accPanelNode.scrollHeight + 24 : 0};
    return (
      <div className={classes} style={styles}>
        {answer && Object.keys(answer).map(node => this.getContent(answer, node, "c-HelpMain__partial"))}
      </div>
    );
  }

  //////// ====================== Changes for form field renders (only) ========================= /////
  static getFieldRenders() {
    try {
      const form = {...this.state.form};
      form.inputData = {...form.inputData};
      const section = {...this.state.section};
      this.conditionalFields = ["header", "label", "placeholder", "required", "validators", "value", "disabled"];
      Object.keys(form.inputData).forEach(key => form.inputData[key] = ContentRenderer.hookConditionInterceptor.call(this, form.inputData[key]))
      if (form.conditionalRenders) {
        const conditionalRenders = [];
        Object.keys(form.conditionalRenders).map(fragmentKey => {
          const fragmentFields = form.conditionalRenders[fragmentKey].complyingFields;
          const fragmentCondition = form.conditionalRenders[fragmentKey].condition;
          const path = `${fragmentCondition.locator}.${fragmentCondition.flag}`;
          const flagValue = Helper.search(path, this.state);
          if (flagValue === fragmentCondition.value) {
            const inputData = {...form.inputData};
            Object.keys(form.inputData).forEach(key => !fragmentFields.includes(key) && delete inputData[key]);
            conditionalRenders.push(ContentRenderer.layoutFields.call(this, inputData, form.id || section.id));
          }
        });
        return conditionalRenders;
      } else {
        return ContentRenderer.layoutFields.call(this, form.inputData, form.id || section.id);
      }
      /* eslint-disable no-empty */
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  static layoutFields (inputData, idIncoming) {
    let laidoutFields = [];
    inputData && Object.keys(inputData).forEach(id => {
      const field = {...inputData[id]};
      let layout = inputData[id].layout;
      layout = field.layout && field.layout.indexOf(".") > -1 && layout.split(".");
      if (layout) {
        const row = layout[0];
        const order = layout[1];
        const span = layout[2];
        let currentRowArray = laidoutFields[row - 1];
        if (!currentRowArray) {
          for (let i = 0; i < row; i++) {
            !laidoutFields[i] && laidoutFields.push([]);
          }
          currentRowArray = laidoutFields[row - 1];
        }
        const fieldMeta = {row, order, span, field};
        currentRowArray.push(fieldMeta);
      } else {
        const currentRowArray = [];
        const fieldMeta = {field};
        laidoutFields.push(currentRowArray);
        currentRowArray.push(fieldMeta);
      }
    });

    laidoutFields = laidoutFields.filter(item => item.length !== 0);
    laidoutFields && laidoutFields.sort((row1, row2) => row1[0].row > row2[0].row);
    laidoutFields && laidoutFields.forEach(row => {
      row.sort((item1, item2) => item1.order > item2.order);
    });

    return laidoutFields && laidoutFields.map((fieldRow, key1) => {
      if (this && this.state.form.excludeRowContainer) {
        return ContentRenderer.getFieldRendersLaid.call(this, idIncoming, key1, fieldRow);
      } else {
        const rowClass = fieldRow[0] && fieldRow[0].field.containerClasses;
        return fieldRow[0] && fieldRow[0].field.excludeRowContainer ? ContentRenderer.getFieldRendersLaid.call(this, idIncoming, key1, fieldRow)
          : (
              <div className={`form-row${rowClass ? ` ${  rowClass}` : ""}`} key={key1}>
                {ContentRenderer.getFieldRendersLaid.call(this, idIncoming, key1, fieldRow)}
              </div>
            );
      }
    });
  }

  static getFieldRendersLaid(id, key1, fieldRow) {
    return fieldRow && fieldRow.map((fieldMeta, key2) => {
      fieldMeta = {...fieldMeta};
      const colClass = `${fieldMeta.field.colClasses ? fieldMeta.field.colClasses : ""}${fieldMeta.span === "0" || !fieldMeta.span ? " col" : ` col-${  fieldMeta.span}`}`;
      const shouldRender = ContentRenderer.evaluateRenderDependency.call(this, fieldMeta.field.renderCondition);
      if (shouldRender) {
        return fieldMeta.field.excludeColContainer ? ContentRenderer.getCustomComponent.call(this, fieldMeta.field, id)
          : <div className={`${colClass}`} key={`${key1  }-${  key2}`}>
              {ContentRenderer.getCustomComponent.call(this, fieldMeta.field, id)}
            </div>;
      }
      return null;
    });
  }

  static getCustomComponent (field, id) {
    const {prebounceChangeHandler, changeHandlerArg, customChangeHandler, onChange, onInvalid, onKeyPress, ...rest} = field;

    return (<CustomInput formId={id}
      customChangeHandler={this[customChangeHandler] ? this[customChangeHandler].bind(this) : this.customChangeHandler && this.customChangeHandler.bind(this)}
      onChange={this[onChange] ? changeHandlerArg ? evt => this[onChange](evt, changeHandlerArg) : this[onChange] : this.onChange}
      onInvalid={this[onInvalid] ? this[onInvalid].bind(this) : this.onInvalid && this.onInvalid.bind(this)}
      onKeyPress={this[onKeyPress] ? this[onKeyPress].bind(this) : this.onKeyPress && this.onKeyPress.bind(this)}
      prebounceChangeHandler={this[prebounceChangeHandler] && this[prebounceChangeHandler].bind(this)}
      bubbleValue={this.bubbleValue} parentRef={this} {...rest} />);
  }

  static hookConditionInterceptor (field, conditionalFields) {
    field = {...field};
    const iterationSet = conditionalFields ? conditionalFields : Object.keys(field);
    const self = this;
    iterationSet.forEach(key => {
      const conditionObj = field[key];
      if (self.conditionalFields.indexOf(key) > -1 && typeof conditionObj === "object") {
        if ("condition" in conditionObj) {
          const dependencyObj = conditionObj.condition.find(obj => {
            return obj.subCondition
              ? obj.subCondition.reduce((agg, objPart) => agg && ContentRenderer.evaluateRenderDependencySubPart.call(self, objPart, "dependencyValue"), true)
              : ContentRenderer.evaluateRenderDependencySubPart.call(self, obj, "dependencyValue")
          });
          field[key] = dependencyObj ? dependencyObj.value : conditionObj.default
        } else if (key === "validators") {
          field.validators = JSON.parse(JSON.stringify(field.validators));
          Object.keys(field.validators).forEach(validator => {
            const validationObj = field.validators[validator];
            if ("evaluator" in validationObj) {
              const conditionObj = validationObj.evaluator;
              const dependencyObj = conditionObj.condition.find(obj => {
                return typeof obj === "object" && obj.length
                  ? obj.reduce((agg, objPart) => agg && ContentRenderer.evaluateRenderDependencySubPart.call(self, objPart, "dependencyValue"), true)
                  : ContentRenderer.evaluateRenderDependencySubPart.call(self, obj, "dependencyValue")
              });
              if (dependencyObj && dependencyObj.setFields && typeof dependencyObj.setFields === "object" && dependencyObj.setFields.length) {
                dependencyObj.setFields.forEach(fieldConfig => validationObj[fieldConfig.field] = fieldConfig.value)
              }
            }
          });
        }
      }
    });
    return field;
  }

  static evaluateRenderDependencySubPart (condition, matchValueFieldName, searchObj) {
    const keyLocator = searchObj || ContentRenderer.getValueLocator.call(this, condition.keyLocator);
    let currentValue = Helper.search(condition.keyPath, keyLocator);
    currentValue = currentValue && typeof currentValue === "string" ? currentValue.toLowerCase() : currentValue;
    const matchValue = condition.valueLocator ? Helper.search(condition.valuePath, ContentRenderer.getValueLocator.call(this, condition.valueLocator)) : condition[matchValueFieldName];
    return typeof matchValue === "object" ? matchValue.indexOf(currentValue) > -1 : condition.hasValue ? !!currentValue : currentValue === matchValue;
  }

  static evaluateRenderDependencyPart (renderCondition) {
    let shouldRender;
    renderCondition = JSON.parse(renderCondition);
    if (renderCondition.length) {
      shouldRender = renderCondition.reduce((acc, condition) => {
        const evaluation = ContentRenderer.evaluateRenderDependencySubPart.call(this, condition, "value");
        return acc && evaluation;
      }, true);
    } else {
      shouldRender = ContentRenderer.evaluateRenderDependencySubPart.call(this, renderCondition, "value");
    }
    return shouldRender;
  }

  static evaluateRenderDependency (renderCondition) {
    let shouldRender = true;
    if (renderCondition) {
      if (renderCondition.indexOf("||") > -1) {
        const renderConditionArray = renderCondition.split("||");
        shouldRender = renderConditionArray.some(renderCondition => ContentRenderer.evaluateRenderDependencyPart.call(this, renderCondition))
      } else {
        shouldRender = ContentRenderer.evaluateRenderDependencyPart.call(this, renderCondition);
      }
    }
    return shouldRender;
  }

  static getValueLocator (locator) {
    switch (locator) {
      case "CONSTANTS":
        return CONSTANTS;
      case "state":
        return this.state;
      case "props":
        return this.props;
      case "parentRef":
      default:
        return this;

    }
  }
}
