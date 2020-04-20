import React from "react";
import "../../styles/table/custom-table.scss";
import {useSortBy, useTable} from "react-table";


const Table = function ({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  }, useSortBy);

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
                  row.cells.map((cell, i) =>
                    cell.render(table =>
                      (
                        <td key={`td${i}`} {...cell.getCellProps()}>
                          {
                            Array.isArray(table.cell.value) ? table.cell.value.join(", ") : table.cell.value
                          }
                          {
                            cell.column.id === "username" && table.row.original.company &&
                            <span className="company-name ml-2 border font-size-12 p-1">{table.row.original.company}</span>
                          }
                        </td>
                      )
                    )
                  )
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

const CustomTable = function () {
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        accessor: "sequence",
        canSort: true
      },
      {
        Header: "USER NAME",
        accessor: "username"
      },
      {
        Header: "ROLE",
        accessor: "role"
      },
      {
        Header: "ASSOCIATED BRANDS",
        accessor: "brands"
      },
      {
        Header: "PROFILE STATUS",
        accessor: "status"
      }
    ],
    []
  );


  const data = React.useMemo(
    () => [
      {
        sequence: "1",
        username: "XShubhansh Sahai",
        role: "super Admin",
        brands: [ "Adidas", "NIKE" ],
        status: "Active",
        company: "ESEAL"
      },
      {
        sequence: "2",
        username: "HShubhansh Sahai",
        role: "admin",
        brands: [ "NIKE" ],
        status: "Active"
      },
      {
        sequence: "3",
        username: "KShubhansh Sahai",
        role: "z - admin",
        brands: [ "NIKE", "Nike Inc", "Nike Air Max", "Air Force 1", "Bauer Hockey" ],
        status: "Active",
        company: "MARK MONITOR"
      },
      {
        sequence: "4 ",
        username: "CShubhansh Sahai",
        role: "admin",
        brands: [ "NIKE" ],
        status: "Active"
      },
      {
        sequence: "1",
        username: "XShubhansh Sahai",
        role: "super Admin",
        brands: [ "Adidas", "NIKE" ],
        status: "Active",
        company: "ESEAL"
      },
      {
        sequence: "2",
        username: "HShubhansh Sahai",
        role: "admin",
        brands: [ "NIKE" ],
        status: "Active"
      },
      {
        sequence: "3",
        username: "KShubhansh Sahai",
        role: "z - admin",
        brands: [ "NIKE", "Nike Inc", "Nike Air Max", "Air Force 1", "Bauer Hockey" ],
        status: "Active",
        company: "MARK MONITOR"
      },
      {
        sequence: "4 ",
        username: "CShubhansh Sahai",
        role: "admin",
        brands: [ "NIKE" ],
        status: "Active"
      },
      {
        sequence: "1",
        username: "XShubhansh Sahai",
        role: "super Admin",
        brands: [ "Adidas", "NIKE" ],
        status: "Active",
        company: "ESEAL"
      },
      {
        sequence: "2",
        username: "HShubhansh Sahai",
        role: "admin",
        brands: [ "NIKE" ],
        status: "Active"
      },
      {
        sequence: "3",
        username: "KShubhansh Sahai",
        role: "z - admin",
        brands: [ "NIKE", "Nike Inc", "Nike Air Max", "Air Force 1", "Bauer Hockey" ],
        status: "Active",
        company: "MARK MONITOR"
      },
      {
        sequence: "4 ",
        username: "CShubhansh Sahai",
        role: "admin",
        brands: [ "NIKE" ],
        status: "Active"
      },
      {
        sequence: "1",
        username: "XShubhansh Sahai",
        role: "super Admin",
        brands: [ "Adidas", "NIKE" ],
        status: "Active",
        company: "ESEAL"
      },
      {
        sequence: "2",
        username: "HShubhansh Sahai",
        role: "admin",
        brands: [ "NIKE" ],
        status: "Active"
      },
      {
        sequence: "3",
        username: "KShubhansh Sahai",
        role: "z - admin",
        brands: [ "NIKE", "Nike Inc", "Nike Air Max", "Air Force 1", "Bauer Hockey" ],
        status: "Active",
        company: "MARK MONITOR"
      },
      {
        sequence: "4 ",
        username: "CShubhansh Sahai",
        role: "admin",
        brands: [ "NIKE" ],
        status: "Active"
      }

    ],
    []
  );


  return (
    <Table columns={columns} data={data} />
  );
};

export default CustomTable;
