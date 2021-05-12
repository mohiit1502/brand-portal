/* eslint-disable filenames/match-regex */
import React from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import ContentRenderer from "../../utility/ContentRenderer";
import './WebForm.component.scss';


class WebForm extends React.Component {
  constructor(props) {
    super(props);
    const functions = ["onChange", "setSelectInputValue", "undertakingtoggle", "getClaimTypes", "selectHandlersLocal", "checkToEnableSubmit", "customChangeHandler", "getItemListFromChild"];
    functions.forEach(name => this[name] = this[name].bind(this));
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    const webformConfiguration = this.props.webformConfiguration ? this.props.webformConfiguration : {}
    this.state = {
      section: {...webformConfiguration.sectionConfig},
      form: {
        ...webformConfiguration.formConfig,
        inputData: {...webformConfiguration.fields}
        // underwritingChecked: false,
      }
    };
  }

  componentDidMount() {
    this.getClaimTypes();
  }

  getClaimTypes () {
    const state = {...this.state};
    const form = state.form;
    const options = [
      {claimType: "trademark", label: "Trademark", claimTypeIdentifierLabel: "Trademark Number", companyNameIdentifierLabel: "Trademark Company Name", ownerNameIdentifierLabel: "Trademark Owner Name"},
      {claimType: "patent", label: "Patent", claimTypeIdentifierLabel: "Patent Number", companyNameIdentifierLabel: "Patent Company Name", ownerNameIdentifierLabel: "Patent Owner Name"},
      {claimType: "counterfeit", label: "Counterfeit", claimTypeIdentifierLabel: "Trademark Number", companyNameIdentifierLabel: "Rights Owner Company Name", ownerNameIdentifierLabel: "Rights Owner Name"},
      {claimType: "copyright", label: "Copyright", claimTypeIdentifierLabel: "Copyright Number", companyNameIdentifierLabel: "Copyright Company Name", ownerNameIdentifierLabel: "Copyright Owner Name"}
    ];
        form.inputData.claimTypeIdentifier.claimTypesWithMeta = options;
        form.inputData.claimTypeIdentifier.dropdownOptions = options && options.map(v => ({value: v.label}));
        this.setState(state);
  }

  getItemListFromChild(itemList) {
    this.setState(state => {
      state = {...state};
      state.form.inputData.urlItems.itemList = [...itemList]
      return {
        ...state
      };
    });
  }

  onChange (evt, key) {
    if (evt && evt.target) {
      const targetVal = evt.target.value;
      let index = -1;
      if (key.split("-")[0] === "url" || key.split("-")[0] === "sellerName" && key.split("-")[1]) {
        index = Number(key.split("-")[1]);
        key = key.split("-")[0];
      }

      this.setState(state => {
        state = {...state};
        if (index > -1) {
          if (key.split("-")[0] === "url") {
            state.form.inputData.urlItems.itemList[index].sellerName.value = "";
            state.form.inputData.urlItems.itemList[index].sellerName.disabled = false;
            state.form.inputData.urlItems.itemList[index][key].value = targetVal;
            state.form.inputData.urlItems.disableAddItem = true;
          } else  {
            state.form.inputData.urlItems.itemList[index][key].value = targetVal;
            state.form.inputData.urlItems.itemList[index][key].error = "";
            state.form.inputData.urlItems.itemList[index].url.error = "";
            state.form.inputData.urlItems.disableAddItem = false;
          }
        } else {
          state.form.inputData[key].value = targetVal;
          state.form.inputData[key].error = "";
        }
        return {
          ...state
        };
      }, this.checkToEnableSubmit);
      // evt.persist();
      // if (index > -1) {
      //   this.itemUrlDebounce(evt, index);
      // }
    }
  }
  selectHandlersLocal (key, state, value) {
    return state;
  }

  customChangeHandler (value) {
    const form = this.state.form;
    const claimTypesWithMeta = form.inputData.claimTypeIdentifier.claimTypesWithMeta;
    const matchedClaimTypeWithMeta = claimTypesWithMeta.find(claimTypeWithMeta => claimTypeWithMeta.label === value);
    if (matchedClaimTypeWithMeta) {
      form.inputData.companyName.label = matchedClaimTypeWithMeta.companyNameIdentifierLabel;
      form.inputData.ownerName.label = matchedClaimTypeWithMeta.ownerNameIdentifierLabel;
      form.claimTypeSelected = true;
      this.setState({form});
    }
  }

  setSelectInputValue (value, key) {
    if (value) {
      let index = -1;
      if (key.split("-")[0] === "sellerName" && key.split("-")[1]) {
        index = Number(key.split("-")[1]);
        key = key.split("-")[0];
      }
      this.setState(state => {
        state = {...state};
        state = this.selectHandlersLocal(key, state, value);
        // if (index > -1) {
        //   state.form.inputData.itemList[index][key].value = value;
        //   state.form.inputData.itemList[index][key].error = "";
        //   state.form.inputData.itemList[index].url.error = "";
        // } else {
        //   state.form.inputData[key].value = value;
        // }

        return {
          ...state
        };
      }, () => this.checkToEnableSubmit());
    }
  }

  checkToEnableSubmit(callback) {
    const form = {...this.state.form};

    const bool = form.inputData.claimTypeIdentifier.value &&
      form.inputData.brandName.value &&
      (form.inputData.claimTypeIdentifier.required ? form.inputData.claimTypeIdentifier.value : true) &&
      form.inputData.itemList.reduce((boolResult, item) => !!(boolResult && item.url.value && !item.url.error && item.sellerName.value && item.sellerName.value.length > 0 && !item.sellerName.error), true) &&
      form.inputData.comments.value && !form.inputData.comments.error &&
      form.undertakingList.reduce((boolResult, undertaking) => !!(boolResult && undertaking.selected), true) &&
      form.inputData.signature.value;

    form.isSubmitDisabled = !bool;
    this.setState({form}, callback && callback());
  }

  undertakingtoggle (evt, undertaking, index) {
    const state = {...this.state};
    state.form.inputData[evt.target.id].selected = !state.form.inputData[evt.target.id].selected;
    this.setState({
      ...state
    }, this.checkToEnableSubmit);
  }
  render() {
    return (
      <div className='c-WebForm'>
        <div className="row h3 header">
          Walmart IP Services
        </div>
        <div className="row justify-content-center">
        <div className="col-lg-10 col-md-8 col-12 pl-3 pr-0">
          <div className="row title-row mb-4 pl-2">
              <div className="web-form-title">
                {this.state.section.sectionTitle}
              </div>
          </div>
          <form className="web-form mb-4 mx-5 px-5" >
            { this.getFieldRenders()}
          </form>
        </div>
      </div>
      </div>
    );
  }

}

WebForm.propTypes = {

};

const mapStateToProps = state => {
  return {
  webformConfiguration: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.WEBFORM
  };
};


export default connect(mapStateToProps)(WebForm);
