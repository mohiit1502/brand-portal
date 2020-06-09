import React from "react";
import { connect } from "react-redux";
import "../../../../styles/home/content-renderer/user/user-list.scss";
import PropTypes from "prop-types";
import CustomTable from "../../../custom-components/table/custom-table";
import UserListTable from "../../../custom-components/table/templates/user-list-table";
import Dropdown from "../../../custom-components/dropdown/dropdown";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import ClientUtils from "../../../../utility/ClientUtils";
import Http from "../../../../utility/Http";
import searchIcon from "../../../../images/18-px-search.svg";
import filterIcon from "../../../../images/filter-sc.svg";
import burgerIcon from "../../../../images/group-23.svg";
import {saveUserCompleted} from "../../../../actions/user/user-actions";
import PaginationNav from "../../../custom-components/pagination/pagination-nav";

class UserList extends React.Component {

  constructor (props) {
    super(props);

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

    this.state = {
      page: {
        offset: 0,
        size: 10,
        sizeOptions: [5, 10, 15, 20, 30]
      },
      userList: [],
      paginatedList: [],
      filteredList: [],
      filters: [],
      showFilters: false,
      dropdown: {
        buttonText: burgerIcon,
        dropdownOptions: [
          {
            id: 1,
            value: "Edit User Profile",
            clickCallback: (evt, option, data) => {
              this.editUser(data.original);
            }
          },
          {
            id: 2,
            value: "Suspend User Profile",
            clickCallback: (evt, option, data) => {
              const response = Http.put(`/api/users/${data.loginId}/status/SUSPEND`);
              response.then(res => {
                this.fetchUserData();
              });
            }
          },
          {
            id: 3,
            value: "Delete User Profile",
            clickCallback: (evt, option, data) => {
              const response = Http.delete(`/api/users/${data.loginId}`);
              response.then(res => {
                this.fetchUserData();
              });
            }
          },
          {
            id: 4,
            value: "Resend Invite",
            clickCallback (evt) {
              console.log(4);
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

  async uiSearch (evt) {
    const searchText = evt.target.value && evt.target.value.toLowerCase();
    const allUsers = this.state.paginatedList;
    const filteredList = allUsers.filter(user => {
      return user.username.toLowerCase().indexOf(searchText) !== -1;
    });
    this.setState({filteredList});
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
    let userList = (await Http.get("/api/users")).body;

    userList = userList.records.map((user, i) => {
      const newUser = {
        id: user.id,
        loginId: user.loginId,
        username: `${user.firstName} ${user.lastName}`,
        sequence: i + 1,
        brands: user.brands.map(brand => brand.name),
        status: user.enabled ? "Active" : "Inactive",
        original: user
      };

      if (user.role && user.role.name) {
        newUser.role = user.role.name;
      }

      if (user.properties && user.properties.isThirdParty) {
        newUser.company = user.properties.companyName;
      }
      return newUser;
    });

    this.setState({userList});
  }

  resetFilters() {
    const filters = [...this.state.filters];
    filters.forEach(filter => {
      filter.filterOptions.forEach(filterOption => {
        filterOption.selected = false;
      });
    });
    const filteredList = [...this.state.paginatedList];
    this.setState({filters, filteredList});
    this.toggleFilterVisibility();
  }

  applyFilters() {

    let paginatedList = [...this.state.paginatedList];
    this.state.filters.map(filter => {
      const filterOptionsSelected = filter.filterOptions.filter(filterOption => filterOption.selected && filterOption.value !== "all");

      if (filterOptionsSelected.length) {
        const filterId = filter.id;
        if (filterId === "brands") {
          paginatedList = paginatedList.filter(user => {
            let bool = false;
            filterOptionsSelected.map(filterOption => {
              user[filterId].map(brand => {
                bool = bool || brand.toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1;
              });
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

    this.setState({filteredList: paginatedList});
    this.toggleFilterVisibility();
  }

  createFilters(paginatedList) {
    const brandsSet = new Set();
    const rolesSet = new Set();
    const statusSet = new Set();
    const companySet = new Set();

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
      filterOptions: Array.from(statusSet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
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
    this.fetchUserData();
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

  toggleFilterVisibility () {
    this.setState(state => {
      state = {...state};
      state.showFilters = !state.showFilters;
      return state;
    });
  }

  render () {

    const viewerShip = () => {
      const from = this.state.page.offset * this.state.page.size + 1;
      const to = this.state.page.offset * this.state.page.size + this.state.filteredList.length;
      const total = this.state.userList.length;
      if (this.state.userList.length && to >= from) {
        return `Viewing ${from} - ${to} of ${total} Users`;
      } else if (this.state.userList.length && to <= from) {
        return `Viewing 0 of ${total} Users`;
      }
      return "";
    };

    return (
      <div className="row user-list-content h-100">
        <div className="col h-100">
          <div className="row content-header-row p-4 h-10">
            <div className="col">
              <h3>User List</h3>
            </div>
          </div>
          <div className="row content-row p-4 h-90">
            <div className="col content-col h-100;">
              <div className="row action-row align-items-center">
                <div className="col-lg-8 col-6">
                  <div className="btn btn-primary btn-sm px-3" onClick={this.createNewUser}>
                    Invite User
                  </div>
                </div>
                <div className="col-lg-4 col-6 text-right">
                  <div className="input-group input-group-sm">
                    <div className="input-group-prepend bg-transparent">
                      <div className="input-group-text bg-transparent">
                        <img src={searchIcon} className="Group-23" />
                      </div>
                    </div>
                    <input id="search-box" className="form-control form-control-sm border-left-0 shadow-none" type="search" placeholder="Search by User Name"
                      onChange={this.uiSearch}/>
                    <div className="input-group-append bg-transparent cursor-pointer" onClick={this.toggleFilterVisibility}>
                      <div className="bg-transparent">
                        <div className="filter-btn pl-4 pr-2" > <strong className="mr-2">|</strong>
                          <img src={filterIcon} height="20px"/> Filter
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row filter-dropdown-row">
                <div className={`col-12 filter-dropdown-column ${this.state.showFilters ? "show" : ""}`}>
                  <div className="custom-dropdown-menu mt-n4 no-border-radius px-5 w-100">
                    <div className="row filter-headers-row align-items-center border-bottom py-3">
                      <div className="col">
                        <span className="filters-header-text">Filters</span>
                      </div>
                      <div className="col text-right">
                        <div className="btn filter-btns clear-btn text-primary mx-4" onClick={this.resetFilters}>Clear All Filters</div>
                        <div className="btn filter-btns apply-btn btn-sm btn-primary mr-4 px-3" onClick={this.applyFilters}>Apply Filters </div>
                        <span className="filter-close-btn cursor-pointer" onClick={this.toggleFilterVisibility}>&times;</span>
                      </div>
                    </div>
                    <div className="row filter-content-row py-3">
                      {
                        this.state.filters.map(filter => {

                          return (
                            <div key={filter.id} className={`col ${filter.id}-col`}>
                              <div className="filter-col-header">
                                {filter.name}
                              </div>
                              <ul className="filter-col-list pl-0 mt-2">
                                {
                                  filter.filterOptions.map(option => {
                                    return (
                                      <li key={option.id} >
                                        <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="" id={`${filter.id}-${option.id}`} checked={option.selected}
                                            onChange={evt => {this.onFilterChange(filter.id, option.id);}}/>
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
              <div className="row user-list-row align-items-start">
                <div className="col pt-4 h-100">
                  <div className="row user-list-table-row h-90">
                    <div className="col h-100 overflow-auto">
                      {
                        this.state.filteredList.length > 0 &&
                        <CustomTable data={[...this.state.filteredList]} columns={this.state.userListColumns} template={UserListTable}
                          templateProps={{Dropdown, dropdownOptions: this.state.dropdown}}/>
                      }
                    </div>
                  </div>

                  <div className="row user-list-table-manage-row h-10 align-items-center mx-0">
                    <div className="col">
                      { viewerShip() }
                    </div>
                    <div className="col text-center">
                      <PaginationNav list={this.state.userList} offset={this.state.page.offset} size={this.state.page.size} callback={this.paginationCallback}/>
                    </div>
                    <div className="col text-right">

                      {
                        !!this.state.userList.length && <button type="button" className="btn btn-sm user-count-toggle-btn dropdown-toggle px-4" data-toggle="dropdown"
                          aria-haspopup="true" aria-expanded="false">
                          Show {this.state.page.size} Users &nbsp;&nbsp;&nbsp;
                        </button>
                      }

                      <div className="dropdown-menu user-count-dropdown-menu">
                        {
                          this.state.page.sizeOptions.map(val => {
                            return (<a key={val} className="dropdown-item"
                              onClick={() => {this.changePageSize(val);}}> Show {val} Users </a>);
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
    );
  }
}

UserList.propTypes = {
  toggleModal: PropTypes.func,
  saveUserCompleted: PropTypes.func,
  userEdit: PropTypes.object
};

const mapStateToProps = state => {
  return {
    modal: state.modal,
    userEdit: state.userEdit
  };
};

const mapDispatchToProps = {
  toggleModal,
  saveUserCompleted
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);

