import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import './ContactUsForm.component.scss';
import ContentRenderer from "../../utility/ContentRenderer";
import Validator from "../../utility/validationUtil";
import Helper from "../../utility/helper";
import Http from "../../utility/Http";
import {NOTIFICATION_TYPE, showNotification} from "../../actions/notification/notification-actions";
import {toggleModal} from "../../actions/modal-actions";
import {saveBrandInitiated} from "../../actions/brand/brand-actions";

class ContactUsForm extends React.Component{
  constructor(props) {
    super(props);

    const functions = ["onChange","bubbleValue","handleSubmit","resetForm","setSelectInputValue"]
    functions.forEach(func => {this[func] = this[func].bind(this)});

    this.validateState = Validator.validateState.bind(this);
    this.fieldRenderer = ContentRenderer.getFieldRenders.bind(this);
    this.onInvalid = Validator.onInvalid.bind(this);
    this.loader = Helper.loader.bind(this);

    this.state = {
      form: {
        inputData: this.props.contactUsForm.fields,
        ...this.props.contactUsForm.formConfig
      }
    }
  }

  componentDidMount() {
    this.resetForm();
  }

  resetForm(){
    const form = {...this.state.form};
    form.inputData.area.value = "";
    form.inputData.title.value = "";
    form.inputData.details.value = "";
    this.setState({form});
  }

  setSelectInputValue (value, key) {
    if (value) {
      this.setState(state => {
        state = {...state};
        state.form.inputData[key].value = value;
        return {
          ...state
        };
      });
    }
  }

  onChange(event,key){
    let targetVal = "";
    if(key === "area"){
      targetVal = event;
    }else if(event && event.target){
      targetVal = event.target.value;
    }
    this.setState(state => {
      state = {...state};
      state.form.inputData[key].value = targetVal;
      return state;
    });

  }

  bubbleValue (evt, key, error) {
    console.log("Bubble value is called",evt,key,error)
    const targetVal = evt.target.value;
    this.setState(state => {
      state = {...state};
      state.form.inputData[key].value = targetVal;
      state.form.inputData[key].error = error;
      return state;
    });
  }

  checkEnableSubmit(){
    console.log("Check enable submit")
    console.log(this.state);
    const form = {...this.state.form}
    const isSubmitEnabled =  form.inputData.area.value && form.inputData.title.value
            && form.inputData.details.value;
    form.inputData.sendActions.buttons.send.disabled = !isSubmitEnabled;
    this.setState({form});

    console.log("Check enable submit")
    console.log(this.state);
  }

  handleSubmit(evt){
    evt.preventDefault();
    this.validateState();
    if(!this.validateState()){
      let form = {...this.state.form};
      console.log(this.state.form);
      this.loader("form",true);
      const url = form.api;
      const area = form.inputData.area.value;
      const title = form.inputData.title.value;
      const details = form.inputData.details.value;
      const payload = {area,title,details};
      return Http.post(url,payload).then(res => {
          this.props.showNotification(NOTIFICATION_TYPE.SUCCESS,"Request successfully submitted. Our agents will process your request");
          this.resetForm();
          this.loader("form",false);
        }
      ).catch(err => {
        this.loader("form", false);
        this.props.showNotification(NOTIFICATION_TYPE.ERROR,"Sorry request cannot be processed at the moment");
        console.log(err);

      })
    }
  }

  render(){
    console.log(this.state)
    console.log("====================render of contact us ====================",this.fieldRenderer())
    return (
      <form onSubmit={this.handleSubmit} className={`contact-us-form`}>
        {this.fieldRenderer()}
      </form>
    )
  };
};

ContactUsForm.propTypes = {
  showNotification: PropTypes.func
};

const mapStateToProps = state => {
  return {
    contactUsForm: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.CONTACTUS
  };
}

const mapDispatchToProps = {
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactUsForm);
