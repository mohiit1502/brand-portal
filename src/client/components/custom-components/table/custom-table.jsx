import React from "react";
import PropTypes from "prop-types";
import {useSortBy, useTable} from "react-table";
import "../../../styles/custom-components/table/custom-table.scss";


//
// const Table = function ({ columns, data, Template, templateProps }) {
//   const { getTableBodyProps,  headerGroups,  rows,  prepareRow } = useTable({ columns, data}, useSortBy);
//
//   return <Template {...{getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps}}/>;
// };

const CustomTable = function ({ columns, data, sortableData, template: Template, templateProps }) {
  columns = React.useMemo(() => columns, []);
  const { getTableBodyProps,  headerGroups,  rows,  prepareRow } = useTable({ columns, data}, useSortBy);
  return <Template {...{getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps}}/>;
  // return <Table columns={columns} data={props.data} templateProps={props.templateProps} Template={props.template}/>;
};

CustomTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  sortableData: PropTypes.array,
  template: PropTypes.func,
  templateProps: PropTypes.object
};

export default CustomTable;
