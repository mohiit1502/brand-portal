import React, {memo, useMemo} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {useSortBy, useTable} from "react-table";
import {TOGGLE_ACTIONS, toggleModal} from "../../actions/modal-actions";
import Http from "../../utility/Http";
import "./MemoizedTable.component.scss";

const MemoizedTable = props => {
  const {classColMap, data, fetchComplete} = props;
  const columns = useMemo(() => props.columns, []);
  const { getTableBodyProps,  headerGroups,  rows,  prepareRow } = useTable({ columns, data}, useSortBy);
  const opts = {getTableBodyProps,  headerGroups,  rows,  prepareRow}

  const showClaimDetails = async function (row) {
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
  };

  const getHeaders = () => {
    return headerGroups.map((headerGroup, j) => {
      return (
        <div className="table-row row align-items-center" style={{height: "unset"}} key={`trh${j}`} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(header =>
            <div className={`table-head-cell col ${classColMap[header.id]}`} key={`trth${header.id}`} {...header.getHeaderProps(header.getSortByToggleProps())}>
              { header.render("Header") }
            </div>
          )}
        </div>
      );
    })
  }

  const getBody = () => {
    return rows.map(row => {
      prepareRow(row);
      return (
        <div className="table-row row" key={`tr${row.id}`} {...row.getRowProps()}>
          {row.cells.map((cell, k) => {
            return (
              <div className={`table-body-cell col ${classColMap[cell.column.id]}`} key={`td${k}`}>
                {cell.column.id === "caseNumber" ? <span className="cursor-pointer text-primary" onClick={() => showClaimDetails(row)}>{cell.value}</span> : cell.value}
                {cell.column.id === "createByName" && cell.row.original.company && <span className="company-name ml-2 border font-size-12 text-uppercase p-1">{cell.row.original.company}</span>}
              </div>
            )})
          }
        </div>
      )
    })
  }

  const Template = props => (<div className="table-responsive h-100">
    <div className="custom-table h-100">
      <div className="table-header pt-4">{getHeaders()}</div>
      <div className="table-body pt-4" {...getTableBodyProps()}>{getBody()}</div>
    </div>
  </div>)

  return (
    <div className={`c-MemoizedTable${!fetchComplete ? " loader" : ""}`}>
      <Template {...opts}/>
    </div>
  );
};

MemoizedTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  fetchComplete: PropTypes.bool,
  template: PropTypes.func,
  templateProps: PropTypes.object,
  toggleModal: PropTypes.func
};

const mapDispatchToProps = {
  toggleModal
};

export default memo(connect(null, mapDispatchToProps)(MemoizedTable));
