/* eslint-disable no-unused-expressions */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import sortIcon from "../../../../images/sortIcon.svg";
import sortIconUp from "../../../../images/sort_ascend.svg";
import sortIconDown from "../../../../images/sort_descend.svg";
import CONSTANTS from "../../../../constants/constants";
import AUTH_CONFIG from "./../../../../config/authorizations";
import NoRecordsMatch from "../../NoRecordsMatch";

const BrandListTable = function(props) {

  const { getTableBodyProps, headerGroups, sortHandler, templateProps: {loader}, rows,  prepareRow, templateProps } = props;
  const { Dropdown, dropdownOptions, userProfile, columnsMeta } = templateProps;
  const classColMap = {
    sequence: "col-1"
  };
  const sortStateAscending = CONSTANTS.SORTSTATE.ASCENDING;
  const sortStateReset = CONSTANTS.SORTSTATE.RESET;

  const updateDDOptions = (index, values, ddOptions) => {
    const statusPending = CONSTANTS.BRAND.TRADEMARK.STATUS.PENDING.toLowerCase();
    const statusVerified = CONSTANTS.BRAND.TRADEMARK.STATUS.ACCEPTED.toLowerCase();
    const statusSuspended = CONSTANTS.BRAND.STATUS.SUSPENDED.toLowerCase();
    if (index !== -1) {
      const toggleStatusDropdown = ddOptions[index];
      const incoming = values.trademarkStatus ? values.trademarkStatus.toLowerCase() : "";
      const toggleStatusDropdownCloned = {...toggleStatusDropdown};
      ddOptions[index] = toggleStatusDropdownCloned;
      (incoming === statusVerified || incoming === statusPending) && (toggleStatusDropdownCloned.value = CONSTANTS.BRAND.TRADEMARK.OPTIONS.DISPLAY.DEACTIVATETRADEMARK);
      incoming === statusSuspended && (toggleStatusDropdownCloned.value = CONSTANTS.BRAND.TRADEMARK.OPTIONS.DISPLAY.ACTIVATETRADEMARK);
    }
  };

  const getOptionsConfigMap = () => {
    return {
        [CONSTANTS.BRAND.OPTIONS.DISPLAY.EDITBRAND]: "EDIT",
        [CONSTANTS.BRAND.OPTIONS.DISPLAY.ADDTRADEMARK]: "ADD",
        [CONSTANTS.BRAND.TRADEMARK.OPTIONS.DISPLAY.EDITTRADEMARK]: "EDITCHILD",
        [CONSTANTS.BRAND.TRADEMARK.OPTIONS.DISPLAY.DEACTIVATETRADEMARK]: "DEACTIVATECHILD"
    };
  };

  const generateDropDownOptionsDynamic = (options, values, isParentRow) => {
    // Clone dd options
    const optionsCloned = {...options};
    optionsCloned.dropdownOptions = [...optionsCloned.dropdownOptions];
    const optionsConfigMap = getOptionsConfigMap();
    optionsCloned.dropdownOptions = optionsCloned.dropdownOptions.filter(option => isParentRow ? option.parentOnly : option.childOnly);

    // Get Changeable Options
    const displaySuspended = CONSTANTS.BRAND.TRADEMARK.OPTIONS.DISPLAY.DEACTIVATETRADEMARK.toLowerCase();
    const displayReactivate = CONSTANTS.BRAND.TRADEMARK.OPTIONS.DISPLAY.ACTIVATETRADEMARK.toLowerCase();
    const toggleStatusDropdownIndex = optionsCloned.dropdownOptions.findIndex(dropDownOption => {
      const currentDDOption = dropDownOption.value.toLowerCase();
      return currentDDOption === displaySuspended || currentDDOption === displayReactivate;
    });

    // Based on state of record update option
    updateDDOptions(toggleStatusDropdownIndex, values, optionsCloned.dropdownOptions);

    // Enable/Disable DD Options
    optionsCloned.dropdownOptions.forEach(option => {
      const i = optionsCloned.dropdownOptions.findIndex(opt => opt === option);
      const optionCloned = {...option};
      optionsCloned.dropdownOptions[i] = optionCloned;
      // Disable option based on authorizations
      const configObj = AUTH_CONFIG.BRANDS[optionsConfigMap[optionCloned.value]];
      const enabledStatuses = configObj.STATUS;
      const dependency = values[configObj.DEPENDENCY];
      const statusBasedEnable = !enabledStatuses || enabledStatuses.includes(dependency);
      optionCloned.disabled = !statusBasedEnable;
    });
    return optionsCloned;
  };

  const shouldShowOptions = (cell, isParentRow, values) => {
    const status = values[isParentRow ? "brandStatus" : "trademarkStatus"];
    const matchStatus = isParentRow ? AUTH_CONFIG.BRANDS.SHOW_PARENT_OPTIONS.STATUS : AUTH_CONFIG.BRANDS.SHOW_CHILD_OPTIONS.STATUS
    const roleBasedAccess = AUTH_CONFIG.BRANDS[isParentRow ? "SHOW_PARENT_OPTIONS" : "SHOW_CHILD_OPTIONS"].ROLES.map(role => role.toLowerCase()).includes(userProfile && userProfile.role ? userProfile.role.name.toLowerCase() : "")
    const statusBasedAccess = status === undefined || matchStatus === undefined || matchStatus.map(status1 => status1.toLowerCase()).includes(status.toLowerCase());
    return roleBasedAccess && statusBasedAccess;
  }

  return (
    <div className="custom-table brand-list-table px-0 h-100">

      <div className="table-header">
        {
          headerGroups.map((headerGroup, j) => {
            return (
              <div className="table-row row align-items-center" key={`trh${j}`} {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map(header => {
                    const canSort = columnsMeta.find(meta => meta.accessor === header.id).canSort !== false;
                    const sortByToggleProps = header.getSortByToggleProps();
                    sortByToggleProps.onClick = () => sortHandler(header);
                    let sortIcondisplay;
                    if (header.sortState.level ===  sortStateReset) {
                        sortIcondisplay = sortIcon;
                    } else if (header.sortState.level === sortStateAscending) {
                        sortIcondisplay = sortIconDown;
                    } else {
                        sortIcondisplay = sortIconUp;
                    }
                    return (
                      <div className={`table-head-cell col ${classColMap[header.id]}`} key={`trth${header.id}`} {...header.getHeaderProps(sortByToggleProps)}>
                        { header.render("Header") }
                        {
                          canSort && <img className={"sort-icon"} src={sortIcondisplay} />
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
      {rows.length > 0 &&
        <div className="table-body" {...getTableBodyProps()}>
          {
            rows.map(row => {
              const isParentRow = !!row.original.parent;
              prepareRow(row);
              const {values} = row;
              return (
                <div className={`table-row ${isParentRow ? " parent-row" : ""} row align-items-center`} key={`tr${row.id}`} {...row.getRowProps()}>
                  {
                    row.cells.map((cell, k) => {
                      const showOptions = shouldShowOptions(cell, isParentRow, values);
                      return (
                        <div className={`table-body-cell col ${classColMap[cell.column.id]}`} key={`td${k}`}>
                          {
                            isParentRow ? (cell.column.id === "brandName" ? cell.value : null) : (cell.column.id === "brandName" ? null : (Array.isArray(cell.value) ? cell.value.join(", ") : cell.value))
                          }
                          {
                            // cell.column.id === "brandStatus" && (cell.row.values.role === undefined) &&
                            cell.column.id === "trademarkStatus"
                            && showOptions
                            && <span className="float-right">
                              &nbsp;&nbsp;
                              <Dropdown
                                options={generateDropDownOptionsDynamic(dropdownOptions, row.original, isParentRow)}
                                data={row.original}
                                hideEllipsis={!showOptions}/>
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
        </div> || (loader ? "" : <NoRecordsMatch message="No records matching the filter and/or search criteria" />)
      }
    </div>
  );
};

BrandListTable.propTypes = {
  getTableBodyProps: PropTypes.func,
  headerGroups: PropTypes.array,
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
  sortHandler: PropTypes.func,
  templateProps: PropTypes.object,
  userProfile: PropTypes.object
};

export default connect()(BrandListTable);
