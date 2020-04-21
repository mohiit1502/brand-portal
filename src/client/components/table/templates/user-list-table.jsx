import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";


const UserListTable = function(props) {

  const { getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps } = props;
  const { Dropdown } = templateProps;

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
                        { header.render("Header") }
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
                        cell.column.id === "username" && cell.row.original.company &&
                        <span className="company-name ml-2 border font-size-12 p-1">{cell.row.original.company}</span>
                      }
                      {
                        cell.column.id === "status" && cell.row.values.role.toLowerCase() !== "super admin" &&
                        <Dropdown/>
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

// UserListTable.propTypes = {
//   getTableBodyProps: PropTypes.object,
//   headerGroups: PropTypes.object,
//   rows: PropTypes.object,
//   prepareRow: PropTypes.object
// };

export default connect()(UserListTable);


// row.cells.map((cell, i) =>
//   cell.render(table => {
//       return (
//         <td key={`td${i}`} {...cell.getCellProps()}>
//           {
//             Array.isArray(table.cell.value) ? table.cell.value.join(", ") : table.cell.value
//           }
//           {
//             cell.column.id === "username" && table.row.original.company &&
//             <span className="company-name ml-2 border font-size-12 p-1">{table.row.original.company}</span>
//           }
//           {
//             cell.column.id === "status" && table.row.values.role.toLowerCase() !== "super admin" &&
//             {/*<Dropdown/>*/}
//           }
//         </td>
//       );
//     }
//   )
// )
