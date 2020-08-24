import React from "react";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import sortIcon from "../../../../images/sort.svg";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import Http from "../../../../utility/Http";


const ClaimListTable = function(props) {
  const { getTableBodyProps,  headerGroups,  rows,  prepareRow } = props;

  const showClaimDetails = async function (row) {
    props.toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "ClaimDetailsTemplate", data: {}});
    const ticketId = row.original && row.original.ticketId;
    const claimDetailsUrl = `/api/claims/${ticketId}`;
    const response = (await Http.get(claimDetailsUrl)).body;
    const meta = { templateName: "ClaimDetailsTemplate", data: response && response.data };
    props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  };

  const classColMap = {
    sequence: "col-1",
    brandName: "col-2",
    createdBy: "col-3"
  };

  return (
    <div className="table-responsive">
      <div className="custom-table">

        <div className="table-header">
          {
            headerGroups.map((headerGroup, j) => {
              return (
                <div className="table-row row align-items-center" key={`trh${j}`} {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.map(header => {
                      return (
                        <div className={`table-head-cell col ${classColMap[header.id]}`} key={`trth${header.id}`} {...header.getHeaderProps(header.getSortByToggleProps())}>
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
                            cell.column.id === "caseNumber" ? <Link className="cursor-pointer text-primary" to={`/claims/${cell.value}`} onClick={() => showClaimDetails(row)}>{cell.value}</Link> : cell.value
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
      </div>
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
