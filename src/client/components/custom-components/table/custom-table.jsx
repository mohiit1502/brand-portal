import React from "react";
import PropTypes from "prop-types";
import {useSortBy, useTable} from "react-table";
import "../../../styles/custom-components/table/custom-table.scss";

const CustomTable = function ({ columns, data, sortHandler, template: Template, templateProps }) {
  columns = React.useMemo(() => columns, []);
  const { getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data}, useSortBy);
  return <Template {...{getTableBodyProps, headerGroups, prepareRow, rows, sortHandler, templateProps}}/>;
};

CustomTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  sortHandler: PropTypes.func,
  template: PropTypes.func,
  templateProps: PropTypes.object
};

export default CustomTable;
