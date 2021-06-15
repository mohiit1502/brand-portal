/* eslint-disable no-undef */
/* eslint-disable no-console */
import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import ContentRenderer from "../../../../utility/ContentRenderer";
import {NOTIFICATION_TYPE, showNotification} from "../../../../actions/modal-actions";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import * as Excel from "exceljs/dist/exceljs.min.js";
import Http from "../../../../utility/Http";
import "../../../../styles/custom-components/modal/templates/new-bulk-claim-template.scss";


class NewBulkClaimTemplate extends React.Component {
  //
  constructor(props) {
    super(props);
    const functions = ["checkToEnableSubmit", "handleSubmit", "onChange"];  //todo: remove checkToEnableSubmit
    functions.forEach(name => this[name] = this[name].bind(this));
    this.getFieldRenders = ContentRenderer.getFieldRenders.bind(this);
    const bulkClaimUploadConfiguration = this.props.bulkClaimUploadConfiguration ? this.props.bulkClaimUploadConfiguration : {};
    this.state = {
      section: {...bulkClaimUploadConfiguration.sectionConfig},
      form: {
        inputData: bulkClaimUploadConfiguration.fields,
        ...bulkClaimUploadConfiguration.formConfig
      }
    };
  }

  //todo: remove this
  checkToEnableSubmit(callback) {
    const form = {...this.state.form};
    const bool = form.inputData.dragAndDrop.value && !form.inputData.dragAndDrop.error;
    form.isSubmitDisabled = !bool;
    form.inputData.bulkUploadActions.buttons.submit.disabled = !bool;
    this.setState({form}, callback && callback());
  }

  onChange (key, value, error) {
    const form = this.state.form;
    form.inputData[key].value = value;
    form.inputData[key].error = error;
    this.setState({form}, this.checkToEnableSubmit);
  }

  async handleParsing (selectedFile) {
      const excelMapping = {
        BRAND_ID: 1,
        CLAIM_TYPE: 2,
       CLAIM_TYPE_IDENTIFIER: 3,
        ITEM_URL: 4,
        SELLER_NAME: 5,
        COMMENTS: 6
      };
      const result = await new Promise(resolve => {
      const wb = new Excel.Workbook();
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      const submittedClaims = [];
      reader.onload = () => {
          const buffer = reader.result;
          wb.xlsx.load(buffer).then(workbook => {
          const bulkUploadSheet = workbook.getWorksheet(this.state.form.claimDetailsSheetName || "Bulk Upload Sheet");
          bulkUploadSheet.eachRow((row, rowIndex) => {
              if (rowIndex !== 1) {
                const singleClaimDetails = this.processClaimDetails(row, this.state.form.excelColumnMapping);
                if (singleClaimDetails) {
                  submittedClaims.push(singleClaimDetails);
                } else {
                  console.log("Error in Claim details");
                }
              }
          });
          console.log(submittedClaims);
          resolve(submittedClaims);
        });
      };
     });
    return result;
  }
  //todo: change name to adaptRowResponse
  processClaimDetails (row, excelMapping) { //todo: move to docops.js
    const claimDetails = {};
    let hasError = false;
    Object.keys(excelMapping).forEach(key => {
        if (typeof row.values[excelMapping[key]] === "string" || typeof row.values[excelMapping[key]] === "number") {
            claimDetails[key] = row.values[excelMapping[key]];
        } else if (typeof row.values[excelMapping[key]] === "object" && row.values[excelMapping[key]].result) {
            claimDetails[key] = row.values[excelMapping[key]].result;
        } else if (typeof row.values[excelMapping[key]] === "object" && row.values[excelMapping[key]].text) {
          claimDetails[key] = row.values[excelMapping[key]].text;
      } else {
          hasError = true;
          claimDetails.ERROR = "InComplete Information";
        }
    });
    return claimDetails;
    //return !hasError ? claimDetails : undefined;
  }

  getItemsID(itemUrl) {
    if (itemUrl.endsWith("/")) {
      itemUrl = itemUrl.substring(0, itemUrl.length - 1);
    }
    const slash = itemUrl.lastIndexOf("/");
    const qMark = itemUrl.lastIndexOf("?") === -1 ? itemUrl.length : itemUrl.lastIndexOf("?");

    const itemID = itemUrl.substring(slash + 1, qMark);
    return itemID;
    consolelog(itemID);
  }

  getItemsIDs(claims) {
    const itemIDs = [];
    const items = claims.map(item =>  item.ITEM_URL);
    items.map(itemUrl => {
      if (itemUrl) {
        itemIDs.push(this.getItemsID(itemUrl));
      }
    });
    return itemIDs;
  }

  //todo: creatIQSUtil for nct,nbct(bulk)
  iqsQueryUtil(dataList) { //todo:
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

  validateItems(claimDetails, itemSellersMap) {
    claimDetails.map(claim => {
      if (!claim.ERROR) {
        const itemId = this.getItemsID(claim.ITEM_URL);
        if (itemSellersMap[itemId]) {
          const sellers = itemSellersMap[itemId];
          claim.ERROR = sellers.includes(claim.SELLER_NAME) ? "" : "Seller not found";
        } else {
          claim.ERRROR = "Item not found";
        }
     }
    });
  }

  handleSubmit(evt) {
      evt.preventDefault();
      const parsingStart = Date.now();
      console.log("BULK UPLOAD:Parsing start time", parsingStart);
      const inputFile = this.state.form.inputData.dragAndDrop.value;
      this.handleParsing(inputFile).then(parsedInput => {
        console.log("BULK UPLOAD:Parsing ending time", Date.now());
        console.log("BULK UPLOAD:Total Parsing time", Date.now() - parsingStart);
        console.log(parsedInput);
        const itemsIds = this.getItemsIDs(parsedInput);
        const sellers = parsedInput.filter(claim => claim.SELLER_NAME ? claim.SELLER_NAME : false).map(claim => claim.SELLER_NAME);   //todo: changing name
        const itemsIDs = this.iqsQueryUtil(itemsIds);
        const sellerIds = this.iqsQueryUtil(sellers);
        const query = {itemsIDs, sellerIds};
        Http.get("/api/bulk/sellers", query, null, null, null, "Request failed, please try again.")
        .then(res => {
          console.log(res.body);
          const sellerDetails = res.body;
          const itemSellersMap = this.getItemSellerMapping(sellerDetails);
          console.log(itemSellersMap);
        this.validateItems(parsedInput, itemSellersMap);
        console.log(parsedInput);
        console.log("Total Time:", Date.now() - parsingStart);
        }).catch(err => {
          console.log(err);
          console.log("Total Time:", Date.now() - parsingStart);
        });
      }).catch(e => {
        console.log(e);
      });
  }

  render() {
    const section = this.state.section;
    const form = this.state.form;
    return (
      <div className="modal new-bulk-claim-modal show" id="singletonModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header font-weight-bold align-items-center">
            {
                section.sectionTitle
            }
              <button type="button" className="close text-white" aria-label="Close" onClick={() => this.props.toggleModal(TOGGLE_ACTIONS.HIDE)}>
                <span className="close-btn" aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className={`modal-body text-left${this.state.loader && " loader"}`}>
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

//todo:
//import createPropsSelector from reselect.immutable.helper
//const mapStateToProps = createPropsSelector({
//   bulkClaimUploadConfiguration: getBulkConfig;
// });
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
  modal: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewBulkClaimTemplate);

//items.forEach(seller => query = `${query ? query : "("}${query ? "," : ""}'${seller}'`)
  // handleParsing () {
  //   try {
  //     const inputFile = this.state.form.inputData.dragAndDrop.value;
  //     console.log(inputFile);
  //     // if ((inputFile.size >= 50000) || inputFile.name.split(".").pop() !== "xlsx") {
  //     //   throw "Please provide valid file";
  //     // }
  //     let parsingStartTime = Date.now();
  //     this.processBulkUploadFile(inputFile).then(data => {
  //       return data;
  //     }).catch ( e => {
  //       return {};
  //     });
  //     // const payload = await this.processBulkUploadFile(inputFile);
  //     // console.log("Parsing TIme:", Date.now() - parsingStartTime);
  //     // return payload;
  //     // let start = Date.now();
  //     // Http.post("/api/bulkClaims", payload)
  //     // .then(res => {
  //     //   console.log("time for getting success server response", Date.now() - start);
  //     //   console.log(res);
  //     // })
  //     // .catch(e => {
  //     //   console.log("Time for getting failure server response", Date.now() - start);
  //     //   console.log("Error in Claim Submission", e);
  //     // });

  //     // //testing
  //     // let blob = new Blob([JSON.stringify(payload)], {type: "text"});
  //     // start = Date.now();
  //     // Http.post("/api/bulkClaims", blob)
  //     // .then(res => {
  //     //   console.log("time for getting success server response", Date.now() - start);
  //     //   console.log(res);
  //     // })
  //     // .catch(e => {
  //     //   console.log("Time for getting failure server response", Date.now() - start);
  //     //   console.log("Error in Claim Submission", e);
  //     // });
  //     // //testing end
  //   } catch (e) {
  //     console.log("Parsing Error", e);
  //   }
  // };
