/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-params */
import React from "react";
import * as imagesAll from "./../images";
import CustomInput from "../components/custom-components/custom-input/custom-input";
import Helper from "./helper";
import CONSTANTS from "../constants/constants";
import { Tile } from "../components";

export default class ContentRenderer {

  constructor(content, commonImageClass, commonClickHandler) {
    this.data = content;
    this.commonImageClass = commonImageClass;
    this.commonClickHandler = commonClickHandler;
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
        return <li key={key}>{step}</li>;
      } else if ("partial" in step) {
        return <li>{Object.keys(step).map(node => this.getContent(step, node, "", true))}</li>;
      } else {
        return (
          <li key={key}>
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

  getContent(content, node, classes, isPartial) {
    if (node.startsWith("partial")) {
      const partial = content[node];
      const partialRenders = Object.keys(partial).map(partialNodeKey => {
        const node1 = partial[partialNodeKey];
        if (partialNodeKey.startsWith("chunk")) {
          return <span className={classes ? classes : ""}>{node1}</span>;
        } else if (partialNodeKey.startsWith("anchor")) {
          return <a href={node1.href} className={classes ? classes : ""} >{node1.text}</a>;
        } else {
          return null;
        }
      });
      return isPartial ? <span className={classes ? classes : ""}>{partialRenders}</span> :
        <div className={classes ? classes : ""}>{partialRenders}</div>;
    } else if (node.startsWith("para")) {
      if (typeof (content[node]) === "string") {
        return (<p className={classes ? classes : ""}>{content[node]}</p>);
      } else {
        return <p className={content[node].classes ? content[node].classes : ""}>{content[node].text}</p>;
      }
    } else if (node.startsWith("list")) {
      return this.getListContent(content[node]);
    } else if (node.startsWith("header")) {
      return <div className={content[node].classes ? content[node].classes : ""}>{content[node].title}</div>;
    } else  if (node.startsWith("buttonsPanel")) {
      return (<div className={content[node].classes ? content[node].classes : ""}>
        {
          Object.keys(content[node].buttons).map((button, key) => this.getContent(content[node].buttons, button))
        }
      </div>);
    } else if (node.startsWith("button")) {
      return (
        <button type="button" className={content[node].classes ? content[node].classes : ""} key={content[node].key} 
        onClick={content[node].onClick ? this[content[node].onClick]: () => {}}>
          {content[node].buttonText}
        </button>
      );
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
      return <a href={metaData.href} className={metaData.href.classes ? metaData.href.classes : ""} >{metaData.text}</a>;
    } else if (node.startsWith("contentBlock")) {
      return (
        <div className={content[node].classes ? content[node].classes: ""}>
          {
            Object.keys(content[node].subContents).map((subContent, key) => {
              return this.getContent(content[node].subContents, subContent);
            })
          }
        </div>
      );
    } else {
      return null;
    }
  }

  // eslint-disable-next-line complexity
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


  static layoutFields (inputData, id) {
    const laidoutFields = [];
    inputData && Object.keys(inputData).forEach(id => {
      const field = inputData[id];
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

    laidoutFields.filter(item => item.length !== 0);

    laidoutFields && laidoutFields.forEach(row => {
      row.sort((item1, item2) => item1.order > item2.order);
    });

    return laidoutFields && laidoutFields.map((fieldRow, key1) => {
      if (this && this.state.form.excludeRowContainer) {
        return ContentRenderer.getFieldRendersLaid.call(this, id, key1, fieldRow);
      } else {
        const rowClass = fieldRow[0] && fieldRow[0].field.containerClasses;
        return fieldRow[0] && fieldRow[0].field.excludeRowContainer ? ContentRenderer.getFieldRendersLaid.call(this, id, key1, fieldRow)
          : (
              <div className={`form-row${rowClass ? ` ${  rowClass}` : ""}`} key={key1}>
                {ContentRenderer.getFieldRendersLaid.call(this, id, key1, fieldRow)}
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

  static getFieldRenders() {
    try {
      const form = {...this.state.form};
      const section = {...this.state.section};
      if (form.conditionalRenders) {
        const conditionalRenders = [];
        Object.keys(form.conditionalRenders).map(fragmentKey => {
          const fragmentId = form.conditionalRenders[fragmentKey].id;
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
    } catch (e) { console.log(e);}
  }

  static evaluateRenderDependency (renderCondition) {
    let shouldRender = true;
    if (renderCondition) {
      renderCondition = JSON.parse(renderCondition);
      const keyLocator = ContentRenderer.getValueLocator.call(this, renderCondition.keyLocator);
      const key = Helper.search(renderCondition.keyPath, keyLocator);
      const value = renderCondition.valueLocator ? Helper.search(renderCondition.valuePath, ContentRenderer.getValueLocator.call(this, renderCondition.valueLocator)) : renderCondition.value;
      shouldRender = key === value;
    }
    return shouldRender;
  }

  static getValueLocator (locator) {
    switch (locator) {
      case "parentRef":
        return this;
      case "CONSTANTS":
        return CONSTANTS;
      case "state":
        return this.state;
      case "props":
        return this.props;
    }
  }


  setContentData(content) {
    this.content = content;
  }

  getContentData() {
    return this.content;
  }
}
