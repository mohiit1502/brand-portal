/* eslint-disable no-nested-ternary */
/* eslint-disable max-params */
import React from "react";
import * as imagesAll from "./../images";

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
                            {image ? <img className={this.commonImageClass} src={imagesAll[image]} onClick={() => this.commonImageClass && this.commonClickHandler({ show: true, imageSrc: image })} /> : <i>Image PlaceHolder</i>}
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

    getContent(content, node, partialClass, isPartial) {
        if (node.startsWith("partial")) {
            const partial = content[node];
            const partialRenders = Object.keys(partial).map(partialNodeKey => {
                const node1 = partial[partialNodeKey];
                if (partialNodeKey.startsWith("chunk")) {
                    return <span>{node1}</span>;
                } else if (partialNodeKey.startsWith("anchor")) {
                    return <a href={node1.href}>{node1.text}</a>;
                } else {
                    return null;
                }
            });
            return isPartial ? <span className={partialClass}>{partialRenders}</span> : <div className={partialClass}>{partialRenders}</div>;
        } else if (node.startsWith("para")) {
            return <p>{content[node]}</p>;
        } else if (node.startsWith("list")) {
            return this.getListContent(content[node]);
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
        const styles = { maxHeight: expandPreState ? "100%" : expanded && accPanelNode ? accPanelNode.scrollHeight + 24 : 0 }
        return (
            <div className={classes} style={styles}>
                {answer && Object.keys(answer).map(node => this.getContent(answer, node, "c-HelpMain__partial"))}
            </div>
        );
    }

    setContentData(content) {
        this.content = content;
    }

    getContentData() {
        return this.content;
    }
}
