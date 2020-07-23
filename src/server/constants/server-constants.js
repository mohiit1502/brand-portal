export default require("electrode-confippet").config.$("APP_CONFIG");
export const IQS_URL = "http://itemsetupquerysvc.prod.nxgensearch.catdev.glb.prod.walmart.com/item-setup-query-service-app/services/uber/v1/search?responseGroup=INDEX&cursorMark=*&rowCount=100&query=item_id:__itemId__";
export const CONSTANTS = {
    STATUS_CODE_SUCCESS: 200,
    STATUS_CODE_NOT_FOUND: 404
};
