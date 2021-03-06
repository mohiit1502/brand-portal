import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import Cookies from "electrode-cookies";

import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import {saveUserCompleted} from "../../../../actions/user/user-actions";
import {NOTIFICATION_TYPE, showNotification} from "../../../../actions/notification/notification-actions";
import {dispatchFilter, dispatchWidgetAction} from "../../../../actions/dashboard/dashboard-actions";

import Dropdown from "../../../custom-components/dropdown/dropdown";
import CustomTable from "../../../custom-components/table/custom-table";
import UserListTable from "../../../custom-components/table/templates/user-list-table";
import NoRecordsMatch from "../../../custom-components/NoRecordsMatch/NoRecordsMatch";
import {FilterType, Paginator} from "../../../index";

import SortUtil from "../../../../utility/SortUtil";
import SearchUtil from "../../../../utility/SearchUtil";
import FilterUtil from "../../../../utility/FilterUtil";
import mixpanel from "../../../../utility/mixpanelutils";
import ClientUtils from "../../../../utility/ClientUtils";
import Http from "../../../../utility/Http";

import filterIcon from "../../../../images/filterIcon.svg";
import kebabIcon from "../../../../images/kebab-icon.png";
import AUTH_CONFIG from "../../../../config/authorizations";
import MIXPANEL_CONSTANTS from "../../../../constants/mixpanelConstants";
import CONSTANTS from "../../../../constants/constants";
import restConfig from "../../../../config/rest";
import "../../../../styles/home/content-renderer/user/user-list.scss";

class UserList extends React.Component {

  /* eslint-disable max-statements */
  constructor (props) {
    super(props);

    this.loader = this.loader.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.createFilters = this.createFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this);
    this.updateListAndFilters = this.updateListAndFilters.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.multiSort = SortUtil.multiSort.bind(this);
    this.uiSearch = SearchUtil.uiSearch.bind(this);
    this.applyFilters = FilterUtil.applyFilters.bind(this);
    const userRole = this.props.userProfile && this.props.userProfile.role.name ? this.props.userProfile.role.name.toLowerCase() : "";
    this.filterMap = {pending: "Pending Activation", active: "Active"};
    this.sortAndNormalise = SortUtil.sortAndNormalise.bind(this);

    this.state = {
      page: {
        offset: 0,
        size: 10,
        // eslint-disable-next-line no-magic-numbers
        sizeOptions: [5, 10, 15, 20, 30]
      },
      userList: [],
      paginatedList: [],
      filteredList: [],
      filters: [],
      appliedFilter: [],
      searchText: "",
      showFilters: false,
      loader: false,
      nonBlockingLoader: false,
      userRole,
      unsortedList: [],
      dropdown: {
        buttonText: kebabIcon,
        dropdownOptions: [
          {
            id: 1,
            value: CONSTANTS.USER.OPTIONS.DISPLAY.EDIT,
            disabled: true,
            clickCallback: (evt, option, data) => {
              this.editUser(data.original);
            }
          },
          {
            id: 2,
            value: CONSTANTS.USER.OPTIONS.DISPLAY.SUSPEND,
            disabled: true,
            clickCallback: (evt, option, data) => {
              const outgoingStatus = data.status && data.status === CONSTANTS.USER.OPTIONS.PAYLOAD.SUSPEND
                                      ? CONSTANTS.USER.OPTIONS.PAYLOAD.ACTIVE : CONSTANTS.USER.OPTIONS.PAYLOAD.SUSPEND;
              this.loader("loader", true);
              const mixpanelPayload = {
                API: "/api/users/",
                WORK_FLOW: "VIEW_USER_LIST",
                SELECTED_USER_EMAIL: data.id,
                SELECTED_USER_UPDATED_STATUS: outgoingStatus,
                SELECTED_USER_ROLE: data.role,
                SELECTED_USER_NAME: data.username,
                SELECTED_USER_BRANDS: data.brands
              };
              const response = Http.put(`/api/users/${data.loginId}/status/${outgoingStatus}`, {}, "", () => this.loader("loader", false));
              response.then(() => {
                this.fetchUserData();
                mixpanelPayload.API_SUCCESS = true;
                mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_LIST_WORKFLOW.UPDATE_USER_STATUS, mixpanelPayload);
              });
            }
          },
          {
            id: 4,
            value: CONSTANTS.USER.OPTIONS.DISPLAY.RESENDINVITE,
            disabled: true,
            clickCallback: (evt, option, data) => {
              this.loader("loader", true);
              const mixpanelPayload = {
                API: "/api/users/reinvite",
                WORK_FLOW: "VIEW_USER_LIST",
                SELECTED_USER_EMAIL: data.id,
                SELECTED_USER_STATUS: data.status,
                SELECTED_USER_ROLE: data.role,
                SELECTED_USER_NAME: data.username,
                SELECTED_USER_BRANDS: data.brands
              };
              Http.post("/api/users/reinvite", {email: data.loginId}, {clientType: Cookies.get("client_type")}, () => this.loader("loader", false))
                .then(res => {
                  if (res.body === true) {
                    this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `User ${data.loginId} has been Invited Again`);
                  } else if (res.body === false && res.status === CONSTANTS.STATUS_CODE_SUCCESS) {
                    this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `User ${data.loginId} has already been activated.`);
                  } else {
                    this.props.showNotification(NOTIFICATION_TYPE.ERROR, `User ${data.loginId} couldn"t be invited.`);
                  }
                  mixpanelPayload.API_SUCCESS = true;
                })
                .catch(e => {
                  mixpanelPayload.API_SUCCESS = false;
                  mixpanelPayload.ERROR = e.message ? e.message : e;
                })
                .finally(() => {
                  mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_LIST_WORKFLOW.RESEND_INVITE, mixpanelPayload);
                });
            }
          }
        ]
      },
      identifier: "users",
      columns: [
        {
          Header: "#",
          accessor: "sequence",
          canSort: false,
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET,
            type: CONSTANTS.SORTSTATE.NUMERICTYPE
          }
        },
        {
          Header: "USER NAME",
          accessor: "username",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "ROLE",
          accessor: "role",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "ASSOCIATED BRANDS",
          accessor: "brands",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET,
            type: CONSTANTS.SORTSTATE.ARRAYTYPE
          }
        },
        {
          Header: "DATE ADDED",
          accessor: "dateAdded",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET,
            type: CONSTANTS.SORTSTATE.DATETYPE
          }
        },
        {
          Header: "PROFILE STATUS",
          accessor: "status",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        }
      ],
      columnPriority: 0
    };
  }

  loader (type, enable) {
    this.setState(state => {
      const stateClone = {...state};
      stateClone[type] = enable;
      return stateClone;
    });
  }

  getDateFromTimeStamp(timestamp) {
    try {
    const dateParts = timestamp.split("T");
      let dateString;
      if (dateParts && dateParts[0]) {dateString = dateParts[0];}
      return moment(dateString).format("MM-DD-YYYY");
      /* eslint-disable no-empty */
    } catch (e) {}
      return "";
  }

  /* eslint-disable no-unused-expressions */
  async fetchUserData () {
    !this.props.users ? this.loader("loader", true) : this.loader("nonBlockingLoader", true);
    let userList = (await Http.get("/api/users", "", () => {
      this.loader("loader", false);
      this.loader("nonBlockingLoader", false);
    })).body;
    userList = userList.content.map((user, i) => {
      const newUser = {
        id: user.email,
        loginId: user.email,
        username: `${user.firstName} ${user.lastName}`,
        sequence: i + 1,
        brands: user.brands.map(brand => brand.name),
        dateAdded: this.getDateFromTimeStamp(user.createTs),
        status: user.status,
        original: user
      };

      if (user.role && user.role.name) {
        newUser.role = user.role.name;
      }

      if (user.type.toLowerCase() === "thirdparty") {
        newUser.company = user.companyName;
      }
      return newUser;
    });

    if (this.props.widgetAction) {
      this.createNewUser();
      this.props.dispatchWidgetAction(false);
    }

    this.setState({userList, unsortedList: userList}, () => this.checkAndApplyDashboardFilter(userList));
    return this.multiSort();
  }

  resetFilters() {
    const filters = [...this.state.filters];
    filters.forEach(filter => {
      filter.filterOptions.forEach(filterOption => {
        filterOption.selected = false;
      });
    });
    const userList = [...this.state.userList];
    let i = 1;
    userList.forEach(user => {
      user.sequence = i++;
    });
    this.setState({filters, filteredList: userList, unsortedList: userList, appliedFilter: []}, () => {
      this.uiSearch();
      this.props.dispatchFilter({...this.props.filter, "widget-user-summary": ""});
    });
    this.toggleFilterVisibility();
  }

  clearFilter(filterID, optionID) {
    this.onFilterChange(filterID, optionID);
    this.applyFilters(false, null, null, true);
    this.toggleFilterVisibility();
  }

  createFilters(paginatedList) {
    const brandsSet = new Set();
    const rolesSet = new Set();
    const statusSet = new Set();
    const companySet = new Set();
    const userStatuses = Object.values(CONSTANTS.USER.STATUS);
    userStatuses.splice(userStatuses.indexOf(CONSTANTS.USER.STATUS.REJECTED), 1);
    userStatuses.splice(userStatuses.indexOf(CONSTANTS.USER.STATUS.PENDING_SUPPLIER), 1);
    userStatuses.splice(userStatuses.indexOf(CONSTANTS.USER.STATUS.PENDING_SELLER), 1);

    paginatedList.map(user => {
      user.brands.map(brand => {
        brandsSet.add(brand);
      });
      if (user.role) {
        rolesSet.add(user.role);
      }
      if (user.status) {
        statusSet.add(CONSTANTS.USER.VALUES.STATUS[user.status] || user.status);
      }

      if (user.company) {
        companySet.add(user.company);
      }
    });

    const companyFilter = {
      id: "company",
      name: "Company",
      filterOptions: Array.from(companySet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const brandsFilter = {
      id: "brands",
      name: "Associated Brands",
      filterOptions: Array.from(brandsSet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const rolesFilter = {
      id: "role",
      name: "Role",
      filterOptions: Array.from(rolesSet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const statusFilter = {
      id: "status",
      name: "Profile Status",
      filterOptions: Array.from(userStatuses, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const filters = [companyFilter, rolesFilter, brandsFilter, statusFilter];
    filters.forEach(filter => {
      if (filter.filterOptions.length) {
        const all = {
          id: 0,
          name: "All",
          value: "all",
          selected: false
        };
        filter.filterOptions.unshift(all);
      }
    });
    this.setState({filters});
  }

  async componentDidMount() {
    if (this.props.users) {
      this.checkAndApplyDashboardFilter(this.props.users);
    }
    const userList = await this.fetchUserData();
    this.checkAndApplyDashboardFilter(userList);
    const mixpanelPayload = { WORK_FLOW: "VIEW_USER_LIST" };
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_LIST_WORKFLOW.VIEW_USERS, mixpanelPayload);
  }

  /* eslint-disable no-unused-expressions */
  checkAndApplyDashboardFilter(userList) {
    const filterValue = this.filterMap[this.props.filter["widget-user-summary"]];
    this.createFilters(userList);
    const stateCloned = {...this.state};
    const userStatusFilter = stateCloned.filters.length > 0 && stateCloned.filters.find(filter => filter.id === "status");
    const dashboardFilter = userStatusFilter && userStatusFilter.filterOptions.find(filterOption => filterOption.name === filterValue);
    if (this.props.filter && this.props.filter["widget-user-summary"]) {
      this.setState(() => {
        dashboardFilter && (dashboardFilter.selected = true);
        return stateCloned;
      }, () => this.applyFilters(false, userList, false, true));
      // })
    } else {
      this.setState(() => {
        let i = 1;
        userStatusFilter && userStatusFilter.filterOptions.forEach(filterOption => {
          filterOption.selected = false;
        });
        userList.forEach(user => {
          user.sequence = i++;
        });
        return stateCloned;
      }, () => this.applyFilters(false, userList, false, false));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userEdit.save || this.props.userEdit.get("save")) {
      this.fetchUserData();
      this.props.saveUserCompleted();
    }
    if (prevProps.filter["widget-user-summary"] !== this.props.filter["widget-user-summary"]) {
      this.checkAndApplyDashboardFilter(this.state.userList);
    }
  }
  mixpanelAddNewTemplateUtil = (meta, payload) => {
    const templateName = meta.templateName;
    const eventName = MIXPANEL_CONSTANTS.ADD_NEW_TEMPLATE_MAPPING[templateName];
    mixpanel.trackEvent(eventName, payload);
  }
  createNewUser () {
    const meta = { templateName: "CreateUserTemplate" };
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    const mixpanelPayload = { WORK_FLOW: "VIEW_USER_LIST" };
    this.mixpanelAddNewTemplateUtil(meta, mixpanelPayload);
  }

  editUser (userData) {
    const meta = { templateName: "CreateUserTemplate", data: {...userData} };
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    const mixpanelPayload = {
      WORK_FLOW: "VIEW_USER_LIST",
      SELECTED_USER_EMAIL: userData.email,
      SELECTED_USER_ROLE: userData.role.name,
      SELECTED_USER_STATUS: userData.status,
      SELECTED_USER_TYPE: userData.type
  };
  mixpanel.trackEvent(MIXPANEL_CONSTANTS.USER_LIST_WORKFLOW.EDIT_USER_PROFILE, mixpanelPayload);
  }

  onFilterChange (filterId, optionId) {
    const state = {...this.state};

    const filter = state.filters[ClientUtils.where(state.filters, {id: filterId})];
    const option = filter && filter.filterOptions[ClientUtils.where(filter.filterOptions, {id: optionId})];
    option && (option.selected = !option.selected);
    if (option && option.value === "all") {
      filter.filterOptions.forEach(filterOption => {
        filterOption.selected = option.selected;
      });
    } else {
      let boolTrue = true;
      filter && filter.filterOptions.forEach(filterOption => {
        if (filterOption.value !== "all") {
          boolTrue = boolTrue && filterOption.selected;
        }
      });
      const allOption = filter && filter.filterOptions[ClientUtils.where(filter.filterOptions, {value: "all"})];
      allOption && (allOption.selected = boolTrue);

    }
    this.setState({
      ...state
    });
  }

  toggleFilterVisibility (explicitToggle) {
    this.setState(state => {
      state = {...state};
      state.showFilters = explicitToggle !== undefined && typeof explicitToggle !== "object" ? explicitToggle : !state.showFilters;
      return state;
    });
  }

  updateListAndFilters(paginatedList) {
    this.setState({paginatedList});
  }

  /* eslint-disable react/jsx-handler-names, complexity */
  render () {
    const users = this.state.filteredList ? this.state.filteredList : this.state.userList;
    const enableSectionAccess = restConfig.AUTHORIZATIONS_ENABLED ? this.state.userRole && AUTH_CONFIG.USERS.SECTION_ACCESS.map(role => role.toLowerCase()).includes(this.state.userRole) : true;
    const enableUserInvite = restConfig.AUTHORIZATIONS_ENABLED ? this.state.userRole && Object.keys(AUTH_CONFIG.USERS.INVITE).map(role => role.toLowerCase()).includes(this.state.userRole) : true;
    return enableSectionAccess ? (
      <div className="row user-list-content h-100">
        <div className="col h-100">
          <div className="row content-header-row p-4 h-10 mx-0">
            <div className="col">
              <h3>Authorized User List</h3>
            </div>
          </div>
          <div className="row content-row p-4 h-90 mx-0">
            <div className="col content-col pb-4 h-100;">
              <div className="row action-row align-items-center mx-0">
                <div className="col-lg-8 col-6 pl-0">
                  <div className={`btn btn-primary btn-sm px-3${!enableUserInvite ? " disabled" : ""}`} onClick={enableUserInvite && this.createNewUser}>
                    Invite User
                  </div>
                </div>
                <div className="col-lg-4 col-6 text-right pr-0">
                  <div className="input-group input-group-sm">
                    {this.state.nonBlockingLoader && <div className="list-loader mr-3 mt-1 loader" style={{width: "1.5rem"}} />}
                    <input id="search-box" className="form-control form-control-sm " type="search" placeholder="Search by User Details"
                      onChange={evt => this.uiSearch(evt, false)}/>
                    <div className="input-group-append bg-transparent cursor-pointer" onClick={this.toggleFilterVisibility}>
                      <div className="bg-transparent">
                        <div className="filter-btn pl-4 " >
                          <img alt="Filter" src={filterIcon} height="20px"/> Filter
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*{this.props.filter && this.props.filter["widget-user-summary"] && this.props.filter["widget-user-summary"] !== "all" &&*/}
              {/*<FilterType filterText={`Profile Status is "__filterType__"`} filterMap={this.filterMap} currentFilters={this.props.filter} filterId="widget-user-summary"*/}
              {/*            clearFilterHandler={this.props.dispatchFilter}/>}*/}
              <div className="row filter-dropdown-row">
                <div className={`col-12 ml-4 pr-0 filter-dropdown-column ${this.state.showFilters ? "show" : ""}`}>
                  <div className="custom-dropdown-menu mt-n4 no-border-radius px-5 w-100">
                    <div className="row filter-headers-row align-items-center py-3">
                      <div className="col">
                        <span className="filters-header-text font-weight-bold font-size-20">Filters</span>
                      </div>
                      <div className="col text-right">
                        <div className="btn filter-btns clear-btn text-primary mx-4 font-weight-bold" onClick={this.resetFilters}>Clear All Filters</div>
                        <div className="btn filter-btns apply-btn btn-sm btn-primary mr-4 px-3 font-weight-bold" onClick={() => this.applyFilters(false, null, null, true)}>Apply Filters </div>
                        <span className="filter-close-btn cursor-pointer" onClick={this.toggleFilterVisibility}>&times;</span>
                      </div>
                    </div>
                    <div className="row filter-content-row py-3">
                      {
                        this.state.filters.map(filter => {

                          return (
                            <div key={filter.id} className={`col ${filter.id}-col`}>
                              <div className="filter-col-header font-weight-bold">
                                {filter.name}
                              </div>
                              <ul className="filter-col-list pl-0 mt-2">
                                {
                                  filter.filterOptions.map(option => {
                                    return (
                                      <li className="my-2" key={option.id} >
                                        <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="" id={`${filter.id}-${option.id}`} checked={option.selected}
                                            onChange={() => {this.onFilterChange(filter.id, option.id);}}/>
                                          <label className="form-check-label" htmlFor={`${filter.id}-${option.id}`}>
                                            {option.name}
                                          </label>
                                        </div>
                                      </li>
                                    );
                                  })
                                }
                              </ul>
                            </div>
                          );
                        })
                      }
                    </div>

                  </div>
                </div>
              </div>
              <div className="filter-pin-row">
                <FilterType filters ={this.state.appliedFilter} clearFilter={this.clearFilter}/>
              </div>
              {/*<FilterType filters ={this.state.appliedFilter} clearFilter={this.clearFilter}/>*/}
              <div className={`row user-list-row align-items-start ${this.state.loader && "loader"}`}>
                <div className="col pt-4 h-100">
                  <div className="row user-list-table-row h-90 px-4">
                    <div className="col h-100">
                      {
                        this.state.userList ?
                        <CustomTable sortHandler={this.sortAndNormalise} data={[...this.state.paginatedList]} columns={this.state.columns} template={UserListTable}
                          templateProps={{Dropdown, dropdownOptions: this.state.dropdown, userProfile: this.props.userProfile, loader: this.state.loader}} />
                          : (!this.state.loader && <NoRecordsMatch message="No Records Found matching search and filters provided." />)
                      }
                    </div>
                  </div>
                </div>
              </div>
              <Paginator createFilters={this.createFilters} paginatedList={this.state.paginatedList} records={users} section="USER" updateListAndFilters={this.updateListAndFilters} />
            </div>
          </div>
        </div>
      </div>
    ) : <p>Access Denied</p>;
  }
}

UserList.propTypes = {
  dispatchFilter: PropTypes.func,
  dispatchWidgetAction: PropTypes.func,
  filter: PropTypes.object,
  toggleModal: PropTypes.func,
  saveUserCompleted: PropTypes.func,
  showNotification: PropTypes.func,
  users: PropTypes.array,
  userEdit: PropTypes.object,
  userProfile: PropTypes.object,
  widgetAction: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    filter: state.dashboard.filter,
    modal: state.modal,
    users: state.userEdit.get("userList"),
    userEdit: state.userEdit,
    userProfile: state.user.profile,
    widgetAction: state.dashboard.widgetAction
  };
};

const mapDispatchToProps = {
  dispatchFilter,
  dispatchWidgetAction,
  toggleModal,
  saveUserCompleted,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);

