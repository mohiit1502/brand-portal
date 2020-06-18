import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import sortIcon from "../../../../images/sort.svg";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";


const ClaimListTable = function(props) {
  const { getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps } = props;
  const { Dropdown, dropdownOptions } = templateProps;

  const showClaimDetails = function (row) {
    const meta = { templateName: "ClaimDetailsTemplate", data: row.original };
    props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  };

  return (
    <div className="table-responsive">
      <table className="custom-table table table-sm">

        <thead>
        {
          headerGroups.map((headerGroup, j) => {
            return (
              <tr key={`trh${j}`} {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map(header => {
                    return (
                      <th key={`trth${header.id}`} {...header.getHeaderProps(header.getSortByToggleProps())}>
                        { header.render("Header") } {<img  alt="" className="sort-icon" src={sortIcon} /> }
                      </th>
                    );
                  })
                }
              </tr>
            );
          })
        }
        </thead>

        <tbody {...getTableBodyProps()}>
        {
          rows.map(row => {
            prepareRow(row);
            return (
              <tr key={`tr${row.id}`} {...row.getRowProps()}>
                {
                  row.cells.map((cell, k) => {
                    return (<td key={`td${k}`}>
                      {
                        cell.column.id === "caseNumber" ? <a className="cursor-pointer text-primary" onClick={() => showClaimDetails(row)}>{cell.value}</a> : cell.value
                      }
                    </td>);
                  })
                }
              </tr>
            );
          })
        }
        </tbody>
      </table>
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
