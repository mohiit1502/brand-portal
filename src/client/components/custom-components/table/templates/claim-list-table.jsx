/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import React, {useState} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import NoRecordsMatch from "../../NoRecordsMatch";
import sortIcon from "../../../../images/sortIcon.svg";
import sortIconUp from "../../../../images/sort_ascend.svg";
import sortIconDown from "../../../../images/sort_descend.svg";
import Http from "../../../../utility/Http";
import CONSTANTS from "../../../../constants/constants";
import MIXPANEL_CONSTANTS from "../../../../constants/mixpanelConstants";
import mixpanel from "../../../../utility/mixpanelutils";

const ClaimListTable = function(props) {
  const { getTableBodyProps, headerGroups, sortHandler, templateProps: {loader}, rows, prepareRow } = props;
  const [claimDetailsloader, setClaimDetailsloader] = useState(false);
  const sortStateAscending = CONSTANTS.SORTSTATE.ASCENDING;
  const sortStateReset = CONSTANTS.SORTSTATE.RESET;

  const showClaimDetails = async function (row) {
    // props.toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "ClaimDetailsTemplate", data: {}});
    const mixpanelPayload = {
      API: "/api/claims/",
      WORK_FLOW: "VIEW_CLAIM_LIST",
      CLAIM_STATUS: row.original.claimStatus,
      BRAND_NAME: row.original.brandName,
      CLAIM_NUMBER: row.original.caseNumber,
      CLAIM_TYPE: row.original.claimType,
      CLAIM_CREATED_BY: row.original.createdBy
    };
    setClaimDetailsloader(true);
    try {
      const ticketId = row.original && row.original.ticketId;
      const claimDetailsUrl = `/api/claims/${ticketId}`;
      const response = (await Http.get(claimDetailsUrl)).body;
      const meta = { templateName: "ClaimDetailsTemplate", DISPLAY_DASHBOARD: true, data: response && response.data };
      props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
      mixpanelPayload.API_SUCCESS = true;
    } catch (e) {
      // eslint-disable-next-line no-undef
      console.log(e);
      mixpanelPayload.API_SUCCESS = false;
      mixpanelPayload.ERROR = e.message ? e.message : e;
    } finally {
      mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIM_LIST_WORKFLOW.VIEW_CLAIM_DETAILS, mixpanelPayload);
    }
    setClaimDetailsloader(false);
  };

  const classColMap = {
    sequence: "col-1",
    brandName: "col-2",
    createdBy: "col-3"
  };

  return (
    <div className={`custom-table px-0 h-100${claimDetailsloader ? " loader" : ""}`}>
      <div className="table-header">
        {
          headerGroups.map((headerGroup, j) => {
            return (
              <div className="table-row row align-items-center" key={`trh${j}`} {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map(header => {
                    const sortByToggleProps = header.getSortByToggleProps();
                    sortByToggleProps.onClick = () => sortHandler(header);
                    let sortIcondisplay;
                    if (header.sortState.level ===  sortStateReset) {
                        sortIcondisplay = sortIcon;
                    } else if (header.sortState.level === sortStateAscending) {
                      sortIcondisplay = sortIconDown;
                    } else {
                        sortIcondisplay = sortIconUp;
                    }
                    return (
                      <div className={`table-head-cell col ${classColMap[header.id]}`} key={`trth${header.id}`} {...header.getHeaderProps(sortByToggleProps)}>
                        { header.render("Header") }
                        {
                          <img className={"sort-icon"} src={sortIcondisplay} />
                        }
                      </div>
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
      {rows.length > 0 &&
        <div className="table-body" {...getTableBodyProps()}>
          {
            rows.map(row => {
              prepareRow(row);
              return (<div className="table-row row align-items-center" key={`tr${row.id}`} {...row.getRowProps()}>
                  {row.cells.map((cell, k) => {
                    return (<div className={`table-body-cell col ${classColMap[cell.column.id]}`} key={`td${k}`}>
                        {cell.column.id === "caseNumber" ? <Link className="cursor-pointer claim-link" to={`/claims/${cell.value}`} onClick={() => showClaimDetails(row)}>{cell.value}</Link>
                          : cell.column.id === "claimStatus" ? <span className={`claim-status ${cell.value}`} >{cell.value}</span> : cell.value}
                      </div>);
                  })}
                </div>);
            })
          }
        </div> || (loader ? "" : <NoRecordsMatch message="No records matching the filter and/or search criteria" />)
      }
    </div>
  );
};

ClaimListTable.propTypes = {
  getTableBodyProps: PropTypes.func,
  headerGroups: PropTypes.array,
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
  sortHandler: PropTypes.func,
  templateProps: PropTypes.object,
  toggleModal: PropTypes.func
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(null, mapDispatchToProps)(ClaimListTable);
