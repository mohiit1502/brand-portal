import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import './ContactUsForm.component.scss';
import ContentRenderer from "../../utility/ContentRenderer";
import Validator from "../../utility/validationUtil";
import Helper from "../../utility/helper";
import Http from "../../utility/Http";
import {NOTIFICATION_TYPE, showNotification} from "../../actions/notification/notification-actions";

class ContactUsForm extends React.Component{
  constructor(props) {
    super(props);

    const functions = ["onChange","handleSubmit","resetForm","setSelectInputValue"]
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
    };

    this.state.form.inputData.area.tooltipContent = (
      <div className="py-2">
        <b className="position-absolute text-white tooltip-close-button">x</b>
        <p className="mt-2 pl-2 text-left font-size-12">
          <b>Technical Support:</b> Select if you are facing an issue with a system functionality.<br/>
          <br />
          <b>Claim Support:</b> Select if you need help with a specific claim.<br />
          <br/>
          <b>User Management Support:</b> Select if you need help with managing current or new users.<br />
          <br/>
          <b>Follow-Up:</b> Select if you want to follow up on an open ticket.<br />
          <br/>
          <b>IP Management Support:</b> Select if you need help with managing your brands.<br />
        </p>
      </div>);
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

  checkEnableSubmit(){
    const form = {...this.state.form}
    const isSubmitEnabled =  form.inputData.area.value && form.inputData.title.value
            && form.inputData.details.value;
    form.inputData.sendActions.buttons.send.disabled = !isSubmitEnabled;
    this.setState({form});
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
          if(res.body){
            this.resetForm();
            this.props.showNotification(NOTIFICATION_TYPE.SUCCESS,form.successNotificationMessage);
          }else{
            this.props.showNotification(NOTIFICATION_TYPE.ERROR,form.failedNotificationMessage);
          }
          this.loader("form",false);
        }
      ).catch(err => {
        this.loader("form",false);
        this.props.showNotification(NOTIFICATION_TYPE.ERROR,form.failedNotificationMessage);
        console.log(err);
      })
    }
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit} className={`contact-us-form ${this.state.form.loader ? "loader" : ""}`} >
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
