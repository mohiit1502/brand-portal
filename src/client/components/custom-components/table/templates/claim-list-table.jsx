/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import React, {useState} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import NoRecordsMatch from "../../NoRecordsMatch";
import sortIcon from "../../../../images/sortIcon.svg";
import Http from "../../../../utility/Http";


const ClaimListTable = function(props) {
  const { getTableBodyProps, headerGroups, loader, rows, prepareRow } = props;
  const [claimDetailsloader, setClaimDetailsloader] = useState(false);

  const showClaimDetails = async function (row) {
    // props.toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "ClaimDetailsTemplate", data: {}});
    setClaimDetailsloader(true);
    try {
      const ticketId = row.original && row.original.ticketId;
      const claimDetailsUrl = `/api/claims/${ticketId}`;
      const response = (await Http.get(claimDetailsUrl)).body;
      const meta = { templateName: "ClaimDetailsTemplate", data: response && response.data };
      props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    } catch (e) {
      // eslint-disable-next-line no-undef
      console.log(e);
    }
    setClaimDetailsloader(false);
  };

  const classColMap = {
    sequence: "col-1",
    brandName: "col-2",
    createdBy: "col-3"
  };

  const sortData = (headerId) => {

  }

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
                    // sortByToggleProps.onClick = (e) => {
                    //
                    //   console.log(e);
                    // };
                    // console.log(sortByToggleProps);
                    // console.log(headerProps)
                    return (
                      <div className={`table-head-cell col ${classColMap[header.id]}`} key={`trth${header.id}`} {...header.getHeaderProps(sortByToggleProps)}>
                        { header.render("Header") } {<img  alt="" className="sort-icon" src={sortIcon} /> }
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
            return (
              <div className="table-row row align-items-center" key={`tr${row.id}`} {...row.getRowProps()}>
                {
                  row.cells.map((cell, k) => {
                    return (
                      <div className={`table-body-cell col ${classColMap[cell.column.id]}`} key={`td${k}`}>
                        {
                          cell.column.id === "caseNumber" ? <Link className="cursor-pointer text-primary claim-link" to={`/claims/${cell.value}`} onClick={() => showClaimDetails(row)}>{cell.value}</Link> : cell.value
                        }
                      </div>
                    );
                  })
                }
              </div>
            );
          })
        }
      </div> || (loader ? "" : <NoRecordsMatch message="No records matching the filter and/or search criteria" />)}
    </div>
  );
};

ClaimListTable.propTypes = {
  getTableBodyProps: PropTypes.func,
  headerGroups: PropTypes.array,
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
  templateProps: PropTypes.object,
  toggleModal: PropTypes.func
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(null, mapDispatchToProps)(ClaimListTable);
