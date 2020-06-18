import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import sortIcon from "../../../../images/sort.svg";


const UserListTable = function(props) {

  const { getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps } = props;
  const { Dropdown, dropdownOptions } = templateProps;

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
                        { header.render("Header") } {<img className="sort-icon" src={sortIcon} /> }
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
                        Array.isArray(cell.value) ? cell.value.join(", ") : cell.value
                      }
                      {
                        cell.column.id === "username" && cell.row.original.original.properties.companyName &&
                        <span className="company-name ml-2 border font-size-12 text-uppercase p-1">{cell.row.original.original.properties.companyName}</span>
                      }
                      {
                        cell.column.id === "status" && (cell.row.values.role === undefined || cell.row.values.role.toLowerCase() !== "super admin") &&
                          <span className="float-right">&nbsp;&nbsp;<Dropdown options={dropdownOptions} data={row.original}/>&nbsp;&nbsp;</span>

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

UserListTable.propTypes = {
  getTableBodyProps: PropTypes.func,
  headerGroups: PropTypes.array,
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
  templateProps: PropTypes.object
};

export default connect()(UserListTable);

