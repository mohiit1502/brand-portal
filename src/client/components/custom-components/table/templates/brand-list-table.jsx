import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import sortIcon from "../../../../images/sort.svg";


const BrandListTable = function(props) {

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
                        cell.column.id === "brandStatus" && (cell.row.values.role === undefined) &&
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

BrandListTable.propTypes = {
  getTableBodyProps: PropTypes.object,
  headerGroups: PropTypes.object,
  rows: PropTypes.object,
  prepareRow: PropTypes.object,
  templateProps: PropTypes.object
};

export default connect()(BrandListTable);
