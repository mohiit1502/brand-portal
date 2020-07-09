import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import sortIcon from "../../../../images/sort.svg";


const UserListTable = function(props) {

  const { getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps } = props;
  const { Dropdown, dropdownOptions } = templateProps;
  const classColMap = {
    userName: "col-3",
    sequence: "col-1",
    status: "col-2",
    role: "col-2"
  };

  return (
    <div className="table-responsive h-100">
      <div className="custom-table h-100">

        <div className="table-header">
          {
            headerGroups.map((headerGroup, j) => {
              return (
                <div className="table-row row align-items-center" key={`trh${j}`} {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.map(header => {
                      return (
                        <div className={`table-head-cell col ${classColMap[header.id]}`} key={`trth${header.id}`} {...header.getHeaderProps(header.getSortByToggleProps())}>
                          { header.render("Header") } {<img className="sort-icon" src={sortIcon} /> }
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
                            Array.isArray(cell.value) ? cell.value.join(", ") : cell.value
                          }
                          {
                            cell.column.id === "username" && cell.row.original.original.companyName &&
                            <span className="company-name ml-2 border font-size-12 text-uppercase p-1">{cell.row.original.original.companyName}</span>
                          }
                          {
                            cell.column.id === "status" && (cell.row.values.role === undefined || cell.row.values.role.toLowerCase() !== "super admin") &&
                            <span className="float-right">&nbsp;&nbsp;<Dropdown options={dropdownOptions} data={row.original}/>&nbsp;&nbsp;</span>

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

UserListTable.propTypes = {
  getTableBodyProps: PropTypes.func,
  headerGroups: PropTypes.array,
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
  templateProps: PropTypes.object
};

export default connect()(UserListTable);

