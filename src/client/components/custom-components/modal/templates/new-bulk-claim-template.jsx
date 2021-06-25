/* eslint-disable no-undef */
/* eslint-disable no-console */
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import ContentRenderer from "../../../../utility/ContentRenderer";
import {NOTIFICATION_TYPE, showNotification} from "../../../../actions/notification/notification-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import * as Excel from "exceljs/dist/exceljs.min.js";
import Http from "../../../../utility/Http";
import DocumentActions from "../../../../utility/docOps";
import "../../../../styles/custom-components/modal/templates/new-bulk-claim-template.scss";
import CustomTable from "../../table/custom-table";
import claimListTable from "../../table/templates/claim-list-table";
import CONSTANTS from "../../../../constants/constants";
import Helper from "../../../../utility/helper";
import Validator from "../../../../utility/validationUtil";


class NewBulkClaimTemplate extends React.Component {
  constructor(props) {
    super(props);
    const functions = ["getBrands", "gotoUploadPage", "handleSubmit", "handleUpload", "onChange", "resetTemplate", "undertakingtoggle"];
    functions.forEach(name => this[name] = this[name].bind(this));
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    const bulkClaimUploadConfiguration = this.props.bulkClaimUploadConfiguration ? this.props.bulkClaimUploadConfiguration : {};
    this.adaptRowResponse = DocumentActions.adaptRowResponse.bind(this);
    this.validateState = Validator.validateState.bind(this);
    this.PAGES = {
      UPLOAD: "UPLOAD",
      SUBMIT: "SUBMIT"
    };
    this.state = {
      section: {...bulkClaimUploadConfiguration.sectionConfig},
      form: {
        inputData: bulkClaimUploadConfiguration.fields,
        ...bulkClaimUploadConfiguration.formConfig
      },
      page: "UPLOAD",
      claimDetails: [],
      isParsingDone: false,//bulkClaimUploadConfiguration.formConfig && bulkClaimUploadConfiguration.formConfig.isParsingDone,
      claimTypes: ["Counterfeit", "Trademark", "Patent", "Copyright"],
      columns: [
        {
          Header: "BRAND_NAME",
          accessor: "brandName",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "CLAIM_TYPE",
          accessor: "claimType",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "CLAIM_TYPE_IDENTIFIER",
          accessor: "claimTypeIdentifier",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "ITEM_URL",
          accessor: "itemUrl",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "SELLER_NAME",
          accessor: "sellerName",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET,
            type: CONSTANTS.SORTSTATE.DATETYPE
          }
        },
        {
          Header: "COMMENTS",
          accessor: "comments",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "ERROR",
          accessor: "error",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        }
      ],
      PAGES: {
        UPLOAD: "UPLOAD",
        SUBMIT: "SUBMIT"
      }
    };
  }

  componentDidMount() {
    this.getBrands();
  }

  undertakingtoggle (evt, undertaking, index) {
    const state = {...this.state};
    state.form.inputData[evt.target.id].selected = !state.form.inputData[evt.target.id].selected;
    this.setState({
      ...state
    });
  }

  gotoUploadPage() {
    this.setState(state => {
      state = {...state};
      state.claimDetails = [];
      state.page = this.PAGES.UPLOAD;
      state.isParsingDone = false;
      state.form.inputData.dragAndDrop.display = true;
      state.form.inputData.emailId.error = "";  //todo: this may not be required
      state.form.inputData.signature.error = ""; //todo: this may not be required
      return {
        ...state
      };
    });
  }

  onChange (evt, key, error) {
    const form = {...this.state.form};
    form.inputData[key].value = evt && evt.target && evt.target ? evt.target.value : evt;
    form.inputData[key].error = error;
    //form.isParsingDone = true;
    //form.inputData.bulkUploadActions.buttons.send1.disabled = !form.inputData.bulkUploadActions.buttons.submit.disabled;
    // this.setState(state => {
    //   state = {...state};
    //   state.form.inputData[key].value = evt.target && evt.target ? evt.target.value : evt;
    //   state.form.inputData[key].error = error;
    //   state.form.inputData["bulkUploadActions"]["buttons"].submit.disabled = true;
    //   state = {...state};
    //     //state.form.inputData[key].value = targetVal;
    //   return state;
      // return {
      //   ...state
      // };
   // });
    this.setState({...form});
  }

  async handleParsing (selectedFile) {
      const result = await new Promise((resolve, reject) => {
      const wb = new Excel.Workbook();
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      const submittedClaims = [];
      reader.onload = () => {
          const buffer = reader.result;
          wb.xlsx.load(buffer).then(workbook => {
          const bulkUploadSheet = workbook.getWorksheet(this.state.form.claimDetailsSheetName || "Bulk Upload Sheet");
          !bulkUploadSheet && reject("error");
          bulkUploadSheet.eachRow((row, rowIndex) => {
              if (rowIndex !== 1) {
                const singleClaimDetails = this.adaptRowResponse(row, this.state.form.excelColumnMapping);
                if (singleClaimDetails) {
                  submittedClaims.push(singleClaimDetails);
                } else {
                  console.log("Error in Claim details");
                }
              }
          });
          console.log(submittedClaims);
          submittedClaims.length > 0 ? resolve(submittedClaims) : reject(submittedClaims);
        });
      };
     });
    return result;
  }

  getItemsIDs(claims) {
    const itemIds = [];
    const items = claims.map(item =>  item.itemUrl);
    items.map(itemUrl => {
      if (itemUrl) {
        itemIds.push(Helper.getItemsIDFromURL(itemUrl));
      }
    });
    return itemIds;
  }

  iqsQueryUtil(dataList) {
    const uniqueDataList = Array.from(new Set(dataList));
    let query = "";
    uniqueDataList.forEach(item => query = `${query ? query : "("}${query ? "," : ""}'${item}'`);
    query = `${query})`;
    console.log(query);
    return query;
  }

  getItemSellerMapping(sellerDetails) {
    const itemSellersMap = {};
    sellerDetails.forEach(seller => {
      if (!itemSellersMap[seller["offer.US_WMT_DOTCOM_ITEM_ID"]]) {
        itemSellersMap[seller["offer.US_WMT_DOTCOM_ITEM_ID"]] = [seller["rollupoffer.partnerDisplayName"]];
      } else {
        itemSellersMap[seller["offer.US_WMT_DOTCOM_ITEM_ID"]].push(seller["rollupoffer.partnerDisplayName"]);
      }
    });
    return itemSellersMap;
  }

  validateClaimType(claimType) {
    return this.state.claimTypes.includes(claimType);
  }

  validateIndividualClaim(claim, brandDetails, itemSellersMap) {
      const itemId = Helper.getItemsIDFromURL(claim.itemUrl);
      const claimType = claim.claimType;
      const claimTypeIdentifier = claim.claimTypeIdentifier;
      if (!this.validateClaimType(claimType)) {
        claim.error = "Error in Claim Type";  //todo: Change Error message
        return;
      }
      if (brandDetails) {
          if ((claimType === "Counterfeit") || (claimType === "Trademark")) {
            claim.error = claimTypeIdentifier !== brandDetails.trademarkNumber ? "Enter Valid Claim Type Identifier" : "";
          } else if (claimType === "Patent") {
            claim.error = !claimTypeIdentifier ? "Enter Valid Claim Type Identifier" : ""; //todo: Change Error message
          }
      } else {
        claim.error = "Brand Details not found"; //todo: Change Error message
      }
      if (claim.error) return;
      if (itemSellersMap[itemId]) {
        const sellers = itemSellersMap[itemId];
        claim.error = sellers.includes(claim.sellerName) ? "" : "Seller not found"; //todo: Change Error message
      } else {
        claim.error = "Item not found"; //todo: Change Error message
      }
}

  validateItems(claimDetails, brandDetails, itemSellersMap) {
    claimDetails.map(claim => {
      if (!claim.error) {
        const brandName = claim.brandName;
        const brandDetailsIdentified = brandDetails.find(brandItem => brandItem.brandName === brandName);
        this.validateIndividualClaim(claim, brandDetailsIdentified, itemSellersMap);
     }
    });
  }

  async getBrands () {
    return Http.get("/api/brands?brandStatus=ACCEPTED", null, null, this.props.showNotification, null, "Request failed, please try again.")
      .then(res => {
        const state = {...this.state};
        state.brands = res.body.content;
        this.setState(state);
      }).catch(err => {
        console.log(err);
        throw err;
      });
  }

  resetTemplate () {
    this.setState(state => {
      state = {...state};
      state.claimDetails = [];
      state.form.inputData.dragAndDrop.value = "";
      state.form.inputData.emailId.value = "";
      state.form.inputData.user_undertaking_1.selected = false;
      state.form.inputData.user_undertaking_2.selected = false;
      state.form.inputData.user_undertaking_3.selected = false;
      state.form.inputData.user_undertaking_4.selected = false;
      state.form.inputData.signature.value = "";
      state.form.inputData.emailId.error = "";
      state.form.inputData.signature.error = "";
      state.form.inputData.dragAndDrop.error = "";
      state.form.inputData.dragAndDrop.display = true;
      return {
        ...state
      };
    }, () => this.props.toggleModal(TOGGLE_ACTIONS.HIDE));
  }

  handleUpload(evt) {
      evt.preventDefault();
      if (!this.state.form.inputData.dragAndDrop.value) {
        this.setState(state => {
          state.form.inputData.dragAndDrop.error = state.form.inputData.dragAndDrop.invalidError;
          return {
            ...state
          };
        });
        return;
      } else {
        this.setState({loader: true});
        evt.preventDefault();
        const parsingStart = Date.now();
        console.log("BULK UPLOAD:Parsing start time", parsingStart);
        const inputFile = this.state.form.inputData.dragAndDrop.value;
        this.handleParsing(inputFile).then(data => {
          console.log("BULK UPLOAD:Parsing ending time", Date.now());
          console.log("BULK UPLOAD:Total Parsing time", Date.now() - parsingStart);
          console.log(data);

          //todo: Add check for data

          const itemsIds = this.getItemsIDs(data);
          const sellers = data.filter(claim => claim.sellerName ? claim.sellerName : false).map(claim => claim.sellerName);
          const itemsIDs = this.iqsQueryUtil(itemsIds);
          const sellerIds = this.iqsQueryUtil(sellers);
          const query = {itemsIDs, sellerIds};
          Http.get("/api/bulk/sellers", query, null, null, null, "Request failed, please try again.")
          .then(res => {
            console.log(res.body);
            const sellerDetails = res.body;
            const itemSellersMap = this.getItemSellerMapping(sellerDetails);
            console.log(itemSellersMap);
            //const brandDetails = this.getBrands();   todo: call for brands
            this.validateItems(data, this.state.brands, itemSellersMap);
            console.log("Total Time:", Date.now() - parsingStart);
            this.setState(state => {
              state = {...state};
              state.claimDetails = data;
              state.page = this.PAGES.SUBMIT;
              state.loader = false;
              state.isParsingDone = true;
              state.form.inputData.dragAndDrop.display = false;
              return {
                ...state
              };
            });
          }).catch(err => {
            console.log(err);
            console.log("Total Time:", Date.now() - parsingStart);
            this.setState(state => {
              state = {...state};
              state.loader = false;
              state.form.inputData.dragAndDrop.error = "Please Enter Valid File";
              return {
                ...state
              };
            });
          });
        }).catch(e => {
          console.log(e);
          this.setState(state => {
            state = {...state};
            state.loader = false;
            state.form.inputData.dragAndDrop.error = "Please Enter Valid File";
            return {
              ...state
            };
          });
        });
      }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    console.log(evt);
    if (!this.validateState()) {
      return;
    }
  }

  render() {
    const section = this.state.section;
    const form = this.state.form;
    return (
      <div className={`modal new-bulk-claim-modal show ${this.state.loader ? " loader" : ""}}`} id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header font-weight-bold align-items-center">
              {
                  section.sectionTitle
              }
              <button type="button" className="close text-white" aria-label="Close" onClick={this.resetTemplate}>
                <span className="close-btn" aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body text-left${this.state.loader ? " loader" : ""}`}>
            {
              this.state.page === this.PAGES.SUBMIT &&
              (this.state.claimDetails && this.state.claimDetails.length > 0) ?
              <div className="" style={{overflowY: "scroll", height: "16rem"}}>
              <CustomTable sortHandler={ () => {}} data={[...this.state.claimDetails]} columns={this.state.columns} template={claimListTable}
                templateProps={{Dropdown: [], dropdownOptions: [], loader: false}}/>
              </div> : <div> </div>
            }
              <form onSubmit={this.handleSubmit} className="h-100">
                  {this.getFieldRenders()}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    bulkClaimUploadConfiguration: state.content && state.content.metadata && state.content.metadata.SECTIONSCONFIG && state.content.metadata.SECTIONSCONFIG.BULKCLAIMUPLOAD,
    modal: state.modal
  };
};

const mapDispatchToProps = {
  toggleModal,
  showNotification
};

NewBulkClaimTemplate.propTypes = {
  toggleModal: PropTypes.func,
  modal: PropTypes.object,
  showNotification: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewBulkClaimTemplate);
