/* eslint-disable no-unused-expressions */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import sortIcon from "../../../../images/sort.svg";
import CONSTANTS from "../../../../constants/constants";
import AUTH_CONFIG from "./../../../../config/authorizations";

const BrandListTable = function(props) {

  const { getTableBodyProps,  headerGroups,  rows,  prepareRow, templateProps } = props;
  const { Dropdown, dropdownOptions, userProfile } = templateProps;
  const classColMap = {
    sequence: "col-1"
  };

  const updateDDOptions = (index, values, ddOptions) => {
    const statusPending = CONSTANTS.BRAND.STATUS.PENDING.toLowerCase();
    const statusVerified = CONSTANTS.BRAND.STATUS.VERIFIED.toLowerCase();
    const statusSuspended = CONSTANTS.BRAND.STATUS.SUSPENDED.toLowerCase();
    if (index !== -1) {
      const toggleStatusDropdown = ddOptions[index];
      const incoming = values.brandStatus ? values.brandStatus.toLowerCase() : "";
      const toggleStatusDropdownCloned = {...toggleStatusDropdown};
      ddOptions[index] = toggleStatusDropdownCloned;
      (incoming === statusVerified || incoming === statusPending) && (toggleStatusDropdownCloned.value = CONSTANTS.BRAND.OPTIONS.DISPLAY.SUSPEND);
      incoming === statusSuspended && (toggleStatusDropdownCloned.value = CONSTANTS.BRAND.OPTIONS.DISPLAY.REACTIVATE);
    }
  };

  const generateDropDownOptionsDynamic = (options, values) => {
    const optionsCloned = {...options};
    const dropDownOptionsCloned = [...optionsCloned.dropdownOptions];
    optionsCloned.dropdownOptions = dropDownOptionsCloned;
    const displaySuspended = CONSTANTS.BRAND.OPTIONS.DISPLAY.SUSPEND.toLowerCase();
    const displayReactivate = CONSTANTS.BRAND.OPTIONS.DISPLAY.REACTIVATE.toLowerCase();
    const toggleStatusDropdownIndex = dropDownOptionsCloned.findIndex(dropDownOption => {
      const currentDDOption = dropDownOption.value.toLowerCase();
      return currentDDOption === displaySuspended || currentDDOption === displayReactivate;
    });
    updateDDOptions(toggleStatusDropdownIndex, values, dropDownOptionsCloned);
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
              const status = row && row.original && row.original.brandStatus;
              const negativeStatuses = [CONSTANTS.BRAND.STATUS.REJECTED.toLowerCase(), CONSTANTS.BRAND.STATUS.PENDING.toLowerCase()];
              const {values} = row;
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
                            // cell.column.id === "brandStatus" && (cell.row.values.role === undefined) &&
                            cell.column.id === "brandStatus"
                              && AUTH_CONFIG.BRANDS.SHOW_OPTIONS.ROLES.map(role => role.toLowerCase()).includes(userProfile && userProfile.role ? userProfile.role.name.toLowerCase() : "")
                              && (values.brandStatus === undefined || AUTH_CONFIG.BRANDS.SHOW_OPTIONS.STATUS.map(status1 => status1.toLowerCase()).includes(values.brandStatus.toLowerCase()))
                              && <span className="float-right">
                                &nbsp;&nbsp;
                                <Dropdown
                                  options={generateDropDownOptionsDynamic(dropdownOptions, values)}
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

BrandListTable.propTypes = {
  getTableBodyProps: PropTypes.func,
  headerGroups: PropTypes.array,
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
  templateProps: PropTypes.object,
  userProfile: PropTypes.object
};

export default connect()(BrandListTable);
