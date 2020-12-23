import React from "react";
import { connect } from "react-redux";
import "../../../../styles/home/content-renderer/user/user-list.scss";
import PropTypes from "prop-types";
import Dropdown from "../../../custom-components/dropdown/dropdown";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import ClientUtils from "../../../../utility/ClientUtils";
import Http from "../../../../utility/Http";
import {saveUserCompleted} from "../../../../actions/user/user-actions";
import {NOTIFICATION_TYPE, showNotification} from "../../../../actions/notification/notification-actions";
import {dispatchFilter, dispatchWidgetAction} from "./../../../../actions/dashboard/dashboard-actions";
import PaginationNav from "../../../custom-components/pagination/pagination-nav";
import CustomTable from "../../../custom-components/table/custom-table";
import UserListTable from "../../../custom-components/table/templates/user-list-table";
import NoRecordsMatch from "../../../custom-components/NoRecordsMatch/NoRecordsMatch";
import CONSTANTS from "../../../../constants/constants";
import restConfig from "../../../../config/rest";
import AUTH_CONFIG from "../../../../config/authorizations";
import filterIcon from "../../../../images/filterIcon.svg";
import kebabIcon from "../../../../images/kebab-icon.png";
import {FilterType} from "../../../index";

class UserList extends React.Component {

  constructor (props) {
    super(props);

    this.loader = this.loader.bind(this);
    this.createNewUser = this.createNewUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.uiSearch = this.uiSearch.bind(this);
    this.createFilters = this.createFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.paginationCallback = this.paginationCallback.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this);
    const userRole = this.props.userProfile && this.props.userProfile.role.name ? this.props.userProfile.role.name.toLowerCase() : "";
    this.filterMap = {"pending": "Pending Activation", "active": "Active"};

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
      searchText: "",
      showFilters: false,
      loader: false,
      userRole,
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
              this.loader(true);
              const response = Http.put(`/api/users/${data.loginId}/status/${outgoingStatus}`, {}, "", () => this.loader(false));
              response.then(() => {
                this.fetchUserData();
              });
            }
          },
          // TODO comment for MVP, uncomment for sprint 3
          // {
          //   id: 3,
          //   value: CONSTANTS.USER.OPTIONS.DISPLAY.DELETE,
          //   disabled: true,
          //   notMvp: true,
          //   clickCallback: (evt, option, data) => {
          //     const response = Http.delete(`/api/users/${data.loginId}`);
          //     response.then(res => {
          //       this.fetchUserData();
          //     });
          //   }
          // },
          {
            id: 4,
            value: CONSTANTS.USER.OPTIONS.DISPLAY.RESENDINVITE,
            disabled: true,
            clickCallback: (evt, option, data) => {
              this.loader(true);
              Http.post("/api/users/reinvite", {email: data.loginId}, "", () => this.loader(false))
                .then(res => {
                  if (res.body === true) {
                    this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `User ${data.loginId} has been Invited Again`);
                  } else if (res.body === false && res.status === CONSTANTS.STATUS_CODE_SUCCESS) {
                    this.props.showNotification(NOTIFICATION_TYPE.SUCCESS, `User ${data.loginId} has already been activated.`);
                  } else {
                    this.props.showNotification(NOTIFICATION_TYPE.ERROR, `User ${data.loginId} couldn't be invited.`);
                  }
                });
            }
          }
        ]
      },
      userListColumns: [
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
      ]
    };
  }

  loader (enable) {
    this.setState(state => {
      const stateClone = {...state};
      stateClone.loader = enable;
      return stateClone;
    });
  }

  async uiSearch (evt, isFilter, filteredUsers) {
    const searchText = evt ? evt.target.value && evt.target.value.toLowerCase() : this.state.searchText;
    const allUsers = filteredUsers ? filteredUsers : this.state.paginatedList;
    const filteredList = allUsers.filter(user => {
      return user.username.toLowerCase().indexOf(searchText) !== -1
        || user.role.toLowerCase().indexOf(searchText) !== -1
        || user.status.toLowerCase().indexOf(searchText) !== -1
        || user.brands.join(",").toLowerCase().indexOf(searchText) !== -1;
    });
    if (isFilter) {
      this.setState({filteredList, searchText});
    } else {
      this.setState({filteredList, searchText}, () => this.applyFilters(true, filteredList));
    }
  }


  paginationCallback (page) {
    const pageState = {...this.state.page};
    pageState.offset = page.offset;
    pageState.size = page.size;
    const paginatedList = [...page.list];
    const filteredList = [...page.list];
    this.createFilters(paginatedList);

    this.setState({page: pageState, paginatedList, filteredList});
  }

  async fetchUserData () {
    this.loader(true);
    let userList = (await Http.get("/api/users", "", () => this.loader(false))).body;
    // console.log(userList);
    userList = userList.content.map((user, i) => {
      const newUser = {
        id: user.email,
        loginId: user.email,
        username: `${user.firstName} ${user.lastName}`,
        sequence: i + 1,
        brands: user.brands.map(brand => brand.name),
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

    this.setState({userList});
    return userList;
  }

  resetFilters() {
    const filters = [...this.state.filters];
    filters.forEach(filter => {
      filter.filterOptions.forEach(filterOption => {
        filterOption.selected = false;
      });
    });
    const filteredList = [...this.state.paginatedList];
    this.setState({filters, filteredList}, this.uiSearch);
    this.toggleFilterVisibility();
  }

  applyFilters(isSearch, filteredList, showFilter, buttonClickAction) {

    let paginatedList = filteredList ? [...filteredList] : [...this.state.paginatedList];
    this.state.filters.map(filter => {
      const filterOptionsSelected = filter.filterOptions.filter(filterOption => filterOption.selected && filterOption.value !== "all");

      if (filterOptionsSelected.length) {
        const filterId = filter.id;
        if (filterId === "brands") {
          paginatedList = paginatedList.filter(user => {
            let bool = false;
            filterOptionsSelected.map(filterOption => {
              user[filterId].map(brand => bool = bool || brand.toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1);
            });
            return bool;
          });
        } else {
          paginatedList = paginatedList.filter(user => {
            let bool = false;
            filterOptionsSelected.map(filterOption => {
              bool = bool || (!!user[filterId] && user[filterId].toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1);
            });
            return bool;
          });
        }
      }
    });

    if (isSearch) {
      this.setState({filteredList: paginatedList});
    } else {
      this.setState({filteredList: paginatedList}, () => this.uiSearch(null, true, paginatedList));
      // this.setState({filteredList: paginatedList});
      this.toggleFilterVisibility(showFilter);
    }

    if (buttonClickAction) {
      this.props.dispatchFilter({...this.props.filter, "widget-user-summary": ""})
    }
  }

  createFilters(paginatedList) {
    const brandsSet = new Set();
    const rolesSet = new Set();
    const statusSet = new Set();
    const companySet = new Set();
    const userStatuses = Object.values(CONSTANTS.USER.STATUS);
    userStatuses.splice(userStatuses.indexOf(CONSTANTS.USER.STATUS.REJECTED), 1);

    paginatedList.map(user => {
      user.brands.map(brand => {
        brandsSet.add(brand);
      });
      if (user.role) {
        rolesSet.add(user.role);
      }
      if (user.status) {
        statusSet.add(user.status);
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
    const userList = await this.fetchUserData();
    this.checkAndApplyDashboardFilter(userList);
  }

  checkAndApplyDashboardFilter(userList) {
    if (this.props.filter && this.props.filter["widget-user-summary"]) {
      const filterValue = this.filterMap[this.props.filter["widget-user-summary"]]
      this.createFilters(userList);
      this.setState(state => {
        state = {...state};
        const userStatusFilter = state.filters.length > 0 && state.filters.find(filter => filter.id === "status")
        const dashboardFilter = userStatusFilter && userStatusFilter.filterOptions.find(filterOption => filterOption.name === filterValue);
        dashboardFilter && (dashboardFilter.selected = true);
        return state;
      }, () => this.applyFilters(false, userList, false))
      // })
    }
  }

  componentDidUpdate() {
    if (this.props.userEdit.save) {
      this.fetchUserData();
      this.props.saveUserCompleted();
    }
  }

  createNewUser () {
    const meta = { templateName: "CreateUserTemplate" };
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }

  editUser (userData) {
    const meta = { templateName: "CreateUserTemplate", data: {...userData} };
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }

  onFilterChange (filterId, optionId) {
    const state = {...this.state};

    const filter = state.filters[ClientUtils.where(state.filters, {id: filterId})];
    const option = filter.filterOptions[ClientUtils.where(filter.filterOptions, {id: optionId})];
    option.selected = !option.selected;
    if (option.value === "all") {
      filter.filterOptions.forEach(filterOption => {
        filterOption.selected = option.selected;
      });
    } else {
      let boolTrue = true;
      filter.filterOptions.forEach(filterOption => {
        if (filterOption.value !== "all") {
          boolTrue = boolTrue && filterOption.selected;
        }
      });
      const allOption = filter.filterOptions[ClientUtils.where(filter.filterOptions, {value: "all"})];
      allOption.selected = boolTrue;

    }
    this.setState({
      ...state
    });
  }

  changePageSize(size) {

    const page = {...this.state.page};
    page.size = size;
    this.setState({page});

  }

  toggleFilterVisibility (explicitToggle) {
    this.setState(state => {
      state = {...state};
      state.showFilters = explicitToggle !== undefined && typeof explicitToggle !== "object" ? explicitToggle : !state.showFilters;
      return state;
    });
  }

  render () {

    const viewerShip = () => {
      const from = this.state.page.offset * this.state.page.size + 1;
      const to = this.state.page.offset * this.state.page.size + this.state.filteredList.length;
      const total = this.state.userList.length;
      if (this.state.userList.length && to >= from) {
        return (<div>Viewing <span className="count font-weight-bold" >{from} - {to}</span> of {total} {CONSTANTS.USER.SECTION_TITLE_PLURAL}</div>);
      } else if (this.props.claims && this.props.claims.length && to <= from) {
        return (<div>Viewing <span className="count font-weight-bold">0</span> of ${total} ${CONSTANTS.USER.SECTION_TITLE_PLURAL}</div>);
      }
      return "";
    };

    // let useFilter = false;
    // this.state.filters.every(filter => {
    //   const filterOptionsSelected = filter.filterOptions.filter(filterOption => filterOption.selected && filterOption.value !== "all");
    //   useFilter = filterOptionsSelected.length > 0;
    //   return !useFilter;
    // });
    // useFilter = this.state.searchText || useFilter;
    // const pageList = useFilter ? this.state.filteredList : this.state.userList;
    const pageList = this.state.userList;
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
            <div className="col content-col h-100;">
              <div className="row action-row align-items-center mx-0">
                <div className="col-lg-8 col-6 pl-0">
                  <div className={`btn btn-primary btn-sm px-3${!enableUserInvite ? " disabled" : ""}`} onClick={enableUserInvite && this.createNewUser}>
                    Invite User
                  </div>
                </div>
                <div className="col-lg-4 col-6 text-right pr-0">
                  <div className="input-group input-group-sm">
                    <input id="search-box" className="form-control form-control-sm " type="search" placeholder="Search by User Name"
                           onChange={evt => this.uiSearch(evt, false)}/>
                    <div className="input-group-append bg-transparent cursor-pointer" onClick={this.toggleFilterVisibility}>
                      <div className="bg-transparent">
                        <div className="filter-btn pl-4 " >
                          <img src={filterIcon} height="20px"/> Filter
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {this.props.filter && this.props.filter["widget-user-summary"] && this.props.filter["widget-user-summary"] !== "all" &&
              <FilterType filterText={`User is '__filterType__'`} filterMap={this.filterMap} currentFilters={this.props.filter} filterId="widget-user-summary"
                          clearFilterHandler={this.props.dispatchFilter}/>}
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
                                      <li key={option.id} >
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
              <div className={`row user-list-row align-items-start ${this.state.loader && "loader"}`}>
                <div className="col pt-4 h-100">
                  <div className="row user-list-table-row h-90 px-4">
                    <div className="col h-100 overflow-auto">
                      {
                        this.state.filteredList.length > 0 ?
                        <CustomTable data={[...this.state.filteredList]} columns={this.state.userListColumns} template={UserListTable}
                          templateProps={{Dropdown, dropdownOptions: this.state.dropdown, userProfile: this.props.userProfile}}/> : <NoRecordsMatch />
                      }
                    </div>
                  </div>
                  <div className="row user-list-table-manage-row px-4 h-10 align-items-center">
                    <div className="col">
                      { viewerShip() }
                    </div>
                    <div className="col text-center">
                      <PaginationNav list={pageList} offset={this.state.page.offset} size={this.state.page.size} callback={this.paginationCallback}/>
                    </div>
                    <div className="col text-right">
                      {
                        !!this.state.userList.length && <span className="showing-content pr-2">Showing</span>
                      }
                      {!!this.state.userList.length && <button type="button" className="btn btn-sm user-count-toggle-btn dropdown-toggle px-4" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                          {this.state.page.size} {CONSTANTS.USER.SECTION_TITLE_PLURAL} &nbsp;&nbsp;&nbsp;
                        </button>}
                      <div className="dropdown-menu user-count-dropdown-menu">
                        {
                          this.state.page.sizeOptions.map(val => {
                            return (<a key={val} className="dropdown-item"
                              onClick={() => {this.changePageSize(val);}}> {val} {CONSTANTS.USER.SECTION_TITLE_PLURAL} </a>);
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
  userEdit: PropTypes.object,
  userProfile: PropTypes.object,
  widgetAction: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    filter: state.dashboard.filter,
    modal: state.modal,
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

