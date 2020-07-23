/* eslint-disable no-unused-expressions */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import sortIcon from "../../../../images/sort.svg";
import CONSTANTS from "../../../../constants/constants";
import AUTH_CONFIG from "./../../../../config/authorizations";

const UserListTable = function(props) {

  const { getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps } = props;
  const { Dropdown, dropdownOptions, userProfile } = templateProps;
  const classColMap = {
    userName: "col-3",
    sequence: "col-1",
    status: "col-2",
    role: "col-2"
  };

  const updateDDOptions = (index, values, ddOptions) => {
    const statusPending = CONSTANTS.USER.STATUS.PENDING.toLowerCase();
    const statusActive = CONSTANTS.USER.STATUS.ACTIVE.toLowerCase();
    const statusSuspended = CONSTANTS.USER.STATUS.SUSPENDED.toLowerCase();
    if (index !== -1) {
      const toggleStatusDropdown = ddOptions[index];
      const incoming = values.status ? values.status.toLowerCase() : "";
      const toggleStatusDropdownCloned = {...toggleStatusDropdown};
      ddOptions[index] = toggleStatusDropdownCloned;
      (incoming === statusActive || incoming === statusPending) && (toggleStatusDropdownCloned.value = CONSTANTS.USER.OPTIONS.DISPLAY.SUSPEND);
      incoming === statusSuspended && (toggleStatusDropdownCloned.value = CONSTANTS.USER.OPTIONS.DISPLAY.REACTIVATE);
    }
  };

  const getOptionsConfigMap = () => {
    return {
        [CONSTANTS.USER.OPTIONS.DISPLAY.EDIT]: "EDIT",
        [CONSTANTS.USER.OPTIONS.DISPLAY.SUSPEND]: "SUSPEND",
        [CONSTANTS.USER.OPTIONS.DISPLAY.REACTIVATE]: "REACTIVATE",
        [CONSTANTS.USER.OPTIONS.DISPLAY.DELETE]: "DELETE",
        [CONSTANTS.USER.OPTIONS.DISPLAY.RESENDINVITE]: "REINVITE"
    };
  };

  const generateDropDownOptionsDynamic = (options, values) => {
    const optionsCloned = {...options};
    const optionsConfigMap = getOptionsConfigMap();
    const dropDownOptionsCloned = [...optionsCloned.dropdownOptions];
    optionsCloned.dropdownOptions = dropDownOptionsCloned;
    const displaySuspended = CONSTANTS.USER.OPTIONS.DISPLAY.SUSPEND.toLowerCase();
    const displayReactivate = CONSTANTS.USER.OPTIONS.DISPLAY.REACTIVATE.toLowerCase();
    const toggleStatusDropdownIndex = dropDownOptionsCloned.findIndex(dropDownOption => {
      const currentDDOption = dropDownOption.value.toLowerCase();
      return currentDDOption === displaySuspended || currentDDOption === displayReactivate;
    });
    updateDDOptions(toggleStatusDropdownIndex, values, dropDownOptionsCloned);
    dropDownOptionsCloned.forEach(option => {
      const i = dropDownOptionsCloned.findIndex(opt => opt === option);
      const optCloned = {...option};
      dropDownOptionsCloned[i] = optCloned;
      const operatableRoles = optionsConfigMap[optCloned.value] && AUTH_CONFIG.USERS[optionsConfigMap[optCloned.value]]
        && AUTH_CONFIG.USERS[optionsConfigMap[optCloned.value]][userProfile.role.name]
        && AUTH_CONFIG.USERS[optionsConfigMap[optCloned.value]][userProfile.role.name].map(role => role.toLowerCase());
        if (operatableRoles) {
          const statusBasedEnable = !AUTH_CONFIG.USERS[optionsConfigMap[optCloned.value]].STATUS
            || (AUTH_CONFIG.USERS[optionsConfigMap[optCloned.value]].STATUS && AUTH_CONFIG.USERS[optionsConfigMap[optCloned.value]].STATUS.includes(values.status));
          optCloned.disabled = optCloned.notMvp || !operatableRoles.includes(values.role ? values.role.toLowerCase() : "") || !statusBasedEnable;
        }
    });
    return optionsCloned;
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
              const status = row && row.original && row.original.status;
              const negativeStatuses = [CONSTANTS.USER.STATUS.PENDING.toLowerCase(), CONSTANTS.USER.STATUS.REJECTED.toLowerCase()];
              const {values} = row;
              let ddOptions;
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
                            cell.column.id === "username" && cell.row.original.company &&
                            <span className="company-name ml-2 border font-size-12 text-uppercase p-1">{cell.row.original.company}</span>
                          }
                          {
                            cell.column.id === "status"
                              && (values.role === undefined || AUTH_CONFIG.USERS.SHOW_OPTIONS.ROLES.map(role => role.toLowerCase()).includes(userProfile && userProfile.role ? userProfile.role.name.toLowerCase() : ""))
                              && CONSTANTS.USER.ROLES.SUPERADMIN.toLowerCase() !== values.role.toLowerCase()
                              && (values.status === undefined || AUTH_CONFIG.USERS.SHOW_OPTIONS.STATUS.map(status1 => status1.toLowerCase()).includes(values.status.toLowerCase()))
                              && (ddOptions = generateDropDownOptionsDynamic(dropdownOptions, values)) && 
                                <span className="float-right">
                                  &nbsp;&nbsp;
                                  <Dropdown
                                    options={ddOptions}
                                    data={row.original}
                                    hideEllipsis={negativeStatuses.includes(status ? status.toLowerCase() : "")} />
                                  &nbsp;&nbsp;
                                </span>
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
  templateProps: PropTypes.object,
  userProfile: PropTypes.object
};

export default connect()(UserListTable);

