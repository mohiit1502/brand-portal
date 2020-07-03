import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import sortIcon from "../../../../images/sort.svg";
import "../../../../styles/custom-components/table/custom-table.scss";
import Http from "../../../../utility/Http";
import CustomInput from "../../custom-input/custom-input";

const UserApprovalTable = function(props) {

  const { getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps } = props;
  const {fetchRolesForUser, fetchBrandsForUser, setSelectInputValue, setMultiSelectInputValue} = templateProps;

  const actions = (user, actionList) => {
    return actionList.map((action, i) => {
      return (<img key={i} src={action.icon} className="cursor-pointer mr-3" onClick={() => {
        if (action.type === "approve") {
          user.approvalInProgress = true;
          fetchRolesForUser(user);
          fetchBrandsForUser(user);
        } else {
          action.callback(user);
        }
      }}/>);
    });
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
                    headerGroup.headers.map((header, i) => {
                      return (
                        <div className="table-head-cell col" key={`trth${header.id}`} {...header.getHeaderProps(header.getSortByToggleProps())}>
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
                      return (<div className="table-body-cell col" key={`td${k}`}>
                        {
                          cell.column.id === "actions" ? actions(row.original, cell.value) : cell.value
                        }
                      </div>);
                    })
                  }
                  {
                    row.original.approvalInProgress &&
                    <div className="table-body-cell text-right col-12 my-1">
                      <div className="row text-left">
                        <div className="col-4"/>
                        <div className="col-4">
                          <CustomInput key={"role"}
                                       inputId={"role"}
                                       formId={`${row.original.id}`} label={row.original.role.label}
                                       required={row.original.role.required} value={row.original.role.value}
                                       type={row.original.role.type} pattern={row.original.role.pattern}
                                       onChangeEvent={setSelectInputValue} disabled={row.original.role.disabled}
                                       dropdownOptions={row.original.role.options}/>
                        </div>
                        <div className="col-4">
                          <CustomInput key={"brands"}
                                       inputId={"brands"}
                                       formId={`${row.original.id}`} label={row.original.brands.label}
                                       required={row.original.brands.required} value={row.original.brands.value}
                                       type={row.original.brands.type} pattern={row.original.brands.pattern}
                                       onChangeEvent={setMultiSelectInputValue} disabled={row.original.brands.disabled}
                                       dropdownOptions={row.original.brands.options}/>
                        </div>
                      </div>
                    </div>
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

UserApprovalTable.propTypes = {
  getTableBodyProps: PropTypes.func,
  headerGroups: PropTypes.array,
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
  templateProps: PropTypes.object,
  fetchRolesForUser: PropTypes.func,
  fetchBrandsForUser: PropTypes.func
};

export default connect()(UserApprovalTable);

