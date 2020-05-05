import React from "react";
import { connect } from "react-redux";
import "../../../styles/content-renderer/user/user-list.scss";
import PropTypes from "prop-types";
import CustomTable from "../../table/custom-table";
import dummydata from "./dummydata.js";
import UserListTable from "../../table/templates/user-list-table";
import Dropdown from "../../dropdown/dropdown";
import {TOGGLE_ACTIONS, toggleModal} from "../../../actions/modal-actions";
import ClientUtils from "../../../utility/ClientUtils";
import Http from "../../../utility/Http";
import searchIcon from "../../../images/18-px-search.svg";
import burgerIcon from "../../../images/group-23.svg";
class UserList extends React.Component {

  constructor (props) {
    super(props);

    this.createNewUser = this.createNewUser.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.uiSearch = this.uiSearch.bind(this);
    this.createFilters = this.createFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.applyFilters = this.applyFilters.bind(this);

    this.state = {
      userList: [],
      filteredList: [],
      filters: [
        {
          id: "company",
          name: "Company",
          filterOptions: [
            {
              id: 0,
              name: "All",
              value: "all",
              selected: false
            },
            {
              id: 1,
              name: "Mark Monitor",
              value: "Mark Monitor",
              selected: false
            },
            {
              id: 2,
              name: "ESeal",
              value: "ESeal",
              selected: false
            }
          ]
        },
        {
          id: "role",
          name: "Role",
          filterOptions: [
            {
              id: 0,
              name: "All",
              value: "all",
              selected: false
            },
            {
              id: 1,
              name: "Super Admin",
              value: "Super Admin",
              selected: false
            },
            {
              id: 2,
              name: "Admin",
              value: "Admin",
              selected: false
            },
            {
              id: 3,
              name: "Reporter",
              value: "Reporter",
              selected: false
            }
          ]
        },
        {
          id: "brands",
          name: "Associated Brands",
          filterOptions: [
            {
              id: 0,
              name: "All",
              value: "all",
              selected: false
            },
            {
              id: 1,
              name: "Nike",
              value: "Nike",
              selected: false
            },
            {
              id: 2,
              name: "Air Max",
              value: "Air Max",
              selected: false
            },
            {
              id: 3,
              name: "Air Force",
              value: "Air Force",
              selected: false
            },
            {
              id: 4,
              name: "Air Force 1",
              value: "Air Force 1",
              selected: false
            }
          ]
        },
        {
          id: "status",
          name: "Profile Status",
          filterOptions: [
            {
              id: 0,
              name: "All",
              value: "all",
              selected: false
            },
            {
              id: 1,
              name: "Active",
              value: "Active",
              selected: false
            },
            {
              id: 2,
              name: "Inactive",
              value: "Inactive",
              selected: false
            },
            {
              id: 3,
              name: "Suspended",
              value: "Suspended",
              selected: false
            }
          ]
        }
      ],
      dropdown: {
        buttonText: burgerIcon,
        dropdownOptions: [
          {
            id: 1,
            value: "Edit User Profile",
            clickCallback (evt) {
              console.log(1);
            }
          },
          {
            id: 2,
            value: "Suspend User Profile",
            clickCallback (evt) {
              console.log(2);
            }
          },
          {
            id: 3,
            value: "Delete User Profile",
            clickCallback (evt) {
              console.log(3);
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
    const allUsers = this.state.userList;
    const filteredList = allUsers.filter(user => {
      return user.username.toLowerCase().indexOf(searchText) !== -1;
    });
    this.setState({filteredList});
  }

  async fetchUserData () {
    let userList = await Http.get("/api/users");

    userList = userList.records.map((user, i) => {
      const newUser = {
        id: user.id,
        loginId: user.loginId,
        username: `${user.firstName} ${user.lastName}`,
        sequence: i + 1,
        role: user.role.name,
        brands: user.brands.map(brand => brand.name),
        status: user.enabled ? "Active" : "Inactive"
      };
      if (user.properties && user.properties.isThirdParty) {
        newUser.company = user.properties.companyName;
      }
      return newUser;
    });

    const filteredList = [...userList];

    const filters = this.createFilters(userList);

    this.setState({userList, filteredList});
  }

  resetFilters() {
    const filters = [...this.state.filters];
    filters.forEach(filter => {
      filter.filterOptions.forEach(filterOption => {
        filterOption.selected = false;
      });
    });
    const filteredList = [...this.state.userList];
    this.setState({filters, filteredList});
  }

  applyFilters() {
    let userList = [...this.state.userList];
    this.state.filters.map(filter => {
        const filterOptionsSelected = filter.filterOptions.filter(filterOption => filterOption.selected && filterOption.value!=="all");
        console.log(filterOptionsSelected)

        if (filterOptionsSelected.length) {
          const filterId = filter.id;
          if (filterId === "brands") {
            userList = userList.filter(user => {
              let bool = false;
              filterOptionsSelected.map(filterOption => {
                user[filterId].map(brand => {
                  bool = bool || brand.toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1;
                });
              });
              return bool;
            });
          } else {
            userList = userList.filter(user => {
              let bool = false;
              filterOptionsSelected.map(filterOption => {
                bool = bool || (!!user[filterId] && user[filterId].toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1);
              });
              return bool;
            });
          }
        }
    });

    this.setState({filteredList: userList});
  }

  createFilters(userList) {
    const brandsSet = new Set();
    const rolesSet = new Set();
    const statusSet = new Set();
    const companySet = new Set();

    userList.map(user => {
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

  }

  createNewUser () {
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, { templateName: "CreateUserTemplate" });
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

  render () {

    return (
      <div className="row user-list-content h-100">
        <div className="col h-100">
          <div className="row content-header-row h-10">
            <div className="col">
              <h3>User List</h3>
            </div>
          </div>
          <div className="row content-row h-90">
            <div className="col h-100">
              <div className="row action-row align-items-center dropdown">
                <div className="col-6">
                  <div className="btn btn-primary btn-sm px-3" onClick={this.createNewUser}>
                    New User
                  </div>
                </div>
                <div className="col-lg-5 col-4 text-right">
                  <div className="input-group input-group-sm">
                    <div className="input-group-prepend bg-transparent">
                      <div className="input-group-text bg-transparent">
                        <img src={searchIcon} className="Group-23" />
                      </div>
                    </div>
                    <input id="search-box" className="form-control form-control-sm border-left-0 shadow-none" type="search" placeholder="Search by User Name"
                      onChange={this.uiSearch}/>
                  </div>
                </div>
                <div className="col-lg-1 col-2 text-center cursor-pointer" data-toggle="dropdown">
                  <span className="filter-btn" > <strong>|</strong> &nbsp;&nbsp; Filter</span>

                </div>
                <div className="col-12 filter-dropdown-column">
                  <div className="dropdown-menu dropdown-menu-right mt-n4 no-border-radius px-5 w-100">
                    <div className="row filter-headers-row align-items-center border-bottom py-3">
                      <div className="col">
                        <span className="filters-header-text">Filters</span>
                      </div>
                      <div className="col text-right">
                        <div className="btn filter-btns clear-btn text-primary mx-4" onClick={this.resetFilters}>Clear All Filters</div>
                        <div className="btn filter-btns apply-btn btn-sm btn-primary mr-4 px-3" onClick={this.applyFilters}>Apply Filters </div>
                        <span className="filter-close-btn">&times;</span>
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

                  <div className="row user-list-table-manage-row h-10 align-items-center">
                    <div className="col">
                      Viewing 1 - 10 of 100 Users
                    </div>
                    <div className="col text-center">
                      <nav>
                        <ul className="pagination pagination-sm justify-content-center align-items-center m-0">
                          <li className="page-item">
                            <a className="page-link" href="#" aria-label="Previous">
                              <span aria-hidden="true"> &lt; </span>
                            </a>
                          </li>
                          <li className="page-item active"><a className="page-link" href="#">1</a></li>
                          <li className="page-item"><a className="page-link" href="#">2</a></li>
                          <li className="page-item"><a className="page-link" href="#">3</a></li>
                          <li className="page-item">
                            <a className="page-link" href="#" aria-label="Next">
                              <span aria-hidden="true"> &gt; </span>
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                    <div className="col text-right">

                      <button type="button" className="btn btn-sm user-count-toggle-btn dropdown-toggle px-4" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        Show 10 Users &nbsp;&nbsp;&nbsp;
                      </button>
                      <div className="dropdown-menu user-count-dropdown-menu">
                        <a className="dropdown-item" >Show 10 Users</a>
                        <a className="dropdown-item" >Show 20 Users</a>
                        <a className="dropdown-item" >Show 30 Users</a>
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
  toggleModal: PropTypes.func
};

const mapStateToProps = state => {
  return {
    modal: state.modal,
    userEdit: state.userEdit
  };
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);
