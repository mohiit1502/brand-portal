import {CustomInterval} from "./timer-utils";
import Http from "./Http";
import exceljsMin from "exceljs/dist/exceljs.min";
import mixpanel from "../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../constants/mixpanelConstants";

export default class DocumentActions {

  static displayProgressAndUpload (evt, key) {
    try {
      const file = evt.target.files[0];
      const filename = file.name;
      const interval = new CustomInterval(4, (value, active) => {
        const form = {...this.state.form};
        form.inputData[key].uploadPercentage = value;
        form.inputData[key].filename = filename;
        if (!active) {
          form.inputData[key].uploadPercentage = 100;
        }
        this.setState({form});
      });
      interval.start();
      const form = {...this.state.form};
      form.inputData[key].uploading = true;
      form.inputData.companyOnboardingActions.buttons.clear.disabled = true;
      this.setState({form}, (() => DocumentActions.uploadDocument.call(this, file, interval, key)));
    } catch (err) {
      const form = {...this.state.form};
      form.inputData[key].uploading = false;
      form.inputData.companyOnboardingActions.buttons.clear.disabled = false;
      this.setState({form});
      console.log(err);
    }
  }

  static async uploadDocument (file, interval, type) {
    const mixpanelPayload = {
      DOCUMENT_TYPE: type,
      FILE_TYPE: file.type,
      FILE_SIZE: file.size,
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    try {
      const urlMap = {businessRegistrationDoc: "/api/company/uploadBusinessDocument", additionalDoc: "/api/company/uploadAdditionalDocument"};
      mixpanelPayload.API = urlMap[type];
      this.checkToEnableSubmit();
      const formData = new FormData();
      formData.append("file", file);
      // const uploadResponse = (await Http.postAsFormData(urlMap[type], formData)).body;
      const uploadResponse = (await Http.postAsFormData(urlMap[type], formData, null, null, this.props.showNotification)).body;
      interval.stop();
      window.setTimeout(() => {
        const updatedForm = {...this.state.form};
        updatedForm.inputData[type].uploading = false;
        updatedForm.inputData.companyOnboardingActions.buttons.clear.disabled = false;
        updatedForm.inputData[type].id = uploadResponse.id;
        this.setState({updatedForm}, this.checkToEnableSubmit);
      }, 700);
      mixpanelPayload.API_SUCCESS = true;
    } catch (e) {
      console.log(e);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = e.message ? e.message : e;
    }
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.FILE_UPLOAD_EVENTS.UPLOAD_DOCUMENT, mixpanelPayload);
  }

  static cancelSelection(docKey) {
    const state = {...this.state};
    const form = {...state.form};
    state.form = form;
    form.inputData[docKey].id = "";
    form.inputData[docKey].uploading = false;
    form.inputData.companyOnboardingActions.buttons.clear.disabled = false;
    form.inputData[docKey].uploadPercentage = 0;
    form.inputData[docKey].filename = "";
    form.inputData[docKey].error = "";
    this.setState(state);
    const mixpanelPayload = {
      DOCUMENT_TYPE: docKey,
      WORK_FLOW: "COMPANY_ONBOARDING"
    };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.FILE_UPLOAD_EVENTS.CANCEL_DOCUMENT, mixpanelPayload);
  }

  static adaptRowResponse (row, excelMapping) {
    const rowDetails = {};
    let hasError = false;
    Object.keys(excelMapping).forEach(key => {
        if (typeof row.values[excelMapping[key]] === "string" || typeof row.values[excelMapping[key]] === "number") {
          rowDetails[key] = row.values[excelMapping[key]];
        } else if (typeof row.values[excelMapping[key]] === "object" && row.values[excelMapping[key]].result) {
          rowDetails[key] = row.values[excelMapping[key]].result;
        } else if (typeof row.values[excelMapping[key]] === "object" && row.values[excelMapping[key]].text) {
          rowDetails[key] = row.values[excelMapping[key]].text;
      } else {
          hasError = true;
        }
    });
    if (Object.keys(rowDetails).length > 0) {
      rowDetails.error = hasError ? "InComplete Details" : "";
      return rowDetails;
    } else {
      return undefined;
    }
  }

  static processBulkUpload (selectedFile, brands, maxRowCount) {
    const brandDetails = brands;
    const start = Date.now();
    const claimType = ["Counterfeit,Trademark,Patent,Copyright"];
    const wb = new exceljsMin.Workbook();
    fetch(selectedFile)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        wb.xlsx.load(buffer).then(workbook => {
        DocumentActions.generateHiddenForm(workbook, brandDetails);
        DocumentActions.generateBulkUploadForm(workbook, {brandDetails, claimType}, maxRowCount);

        let writeTime = Date.now();
        workbook.xlsx.writeBuffer().then(data => {
          console.log("TIME FOR writing  EXCEL:", Date.now() - writeTime);
          const blob = new Blob([data], { type: this.blobType });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);    //enhancements possible
          link.download = `test-${+new Date()}.xlsx`;
          link.click();
          const end = Date.now();
          console.log("TIME FOR GENERATING EXCEL:", end - start);
          console.log("Entire time taken:", Date.now() - window.start);
          console.log("Number of brands:", brandDetails.length);
          console.log("Number of  in inputs", 100);
        });
        const end = Date.now();
        });
      })
    .catch(err => {
          return err.Message;
      });
}

static generateHiddenForm = (workbook, brandDetails) => {
let start = Date.now();
const testSheet = workbook.getWorksheet("test"); //todo: change name of hidden file
let brandCount = 3;
brandDetails.forEach(brand => {
     testSheet.getCell(`A${brandCount}`).value = brand.brandName;
     testSheet.getCell(`B${brandCount}`).value = brand.trademarkNumber;
     testSheet.getCell(`C${brandCount}`).value = brand.trademarkNumber;
     brandCount++;
});
testSheet.protect("the-password").then(() => {
     console.log("protected"); //todo: change password
 });
console.log("time for Hidden form generation", Date.now() - start);
}

static generateBulkUploadForm = (workbook, { brandDetails, claimType}, maxRows) => {
        let start = Date.now();
        //let brands_ = ['"test1 test321,test2,test3,test4,test4,test4"'];
        let brands = brandDetails.map(brand =>  brand.brandName ? brand.brandName : false);
        const totalBrands = brands.length;

        //brands = brands.slice(0,16);
        brands = brands.toString();
        brands = [`"${brands}"`];
        const updateSheet = workbook.getWorksheet("Bulk Upload Sheet");
        for (let v = 2; v <= maxRows; v++) {
            updateSheet.getCell(`A${v}`).dataValidation = {
                type: "list",
                allowBlank: false,
                formulae: brands,
                showErrorMessage: false
            };
            updateSheet.getCell(`B${v}`).dataValidation = {
                type: "list",
                allowBlank: false,
                formulae: claimType,
                showErrorMessage: false
            };
            updateSheet.getCell(`C${v}`).value = {
                formula: `IFERROR(INDEX(test!$B$3:$C$${totalBrands + 2},MATCH(A${v},test!$A$3:$A$${totalBrands + 2},0),MATCH(B${v},test!$B$2:$C$2,0)),\"\")`
            };
        }
        console.log("time for bulk sheet generation", Date.now() - start);
  }
}
