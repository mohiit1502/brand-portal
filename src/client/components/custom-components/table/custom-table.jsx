import React from "react";
import "../../../styles/custom-components/table/custom-table.scss";
import {useSortBy, useTable} from "react-table";

import PropTypes from "prop-types";


const Table = function ({ columns, data, Template, templateProps }) {
  const { getTableBodyProps,  headerGroups,  rows,  prepareRow } = useTable({ columns, data}, useSortBy);

  return <Template {...{getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps}}/>;
};

const CustomTable = function (props) {
  const columns = React.useMemo(
    () => props.columns,
    []
  );

  return <Table columns={columns} data={props.data} templateProps={props.templateProps} Template={props.template}/>;
};

CustomTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  template: PropTypes.func,
  templateProps: PropTypes.object
};

export default CustomTable;
