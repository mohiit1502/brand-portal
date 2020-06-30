import React from "react";
import { connect } from "react-redux";
import "../../../../styles/home/content-renderer/user/user-list.scss";
import PropTypes from "prop-types";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import ClientUtils from "../../../../utility/ClientUtils";
import Http from "../../../../utility/Http";
import filterIcon from "../../../../images/filter-sc.svg";
import greenCircleCheck from "../../../../images/green-circle-check.svg";
import redCircleCross from "../../../../images/red-circle-cross.svg";
import {saveUserCompleted} from "../../../../actions/user/user-actions";
import PaginationNav from "../../../custom-components/pagination/pagination-nav";
import CustomTable from "../../../custom-components/table/custom-table";
import UserApprovalTable from "../../../custom-components/table/templates/user-approval-table";

class UserList extends React.Component {

  constructor (props) {
    super(props);

    this.createNewUser = this.createNewUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.createFilters = this.createFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.paginationCallback = this.paginationCallback.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this);
    this.fetchRolesForUser = this.fetchRolesForUser.bind(this);
    this.fetchBrandsForUser = this.fetchBrandsForUser.bind(this);

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
      userListColumns: [
        {
          Header: "FULL NAME",
          accessor: "username"
        },
        {
          Header: "EMAIL",
          accessor: "loginId"
        },
        {
          Header: "PHONE NUMBER",
          accessor: "phone"
        },
        {
          Header: "REQUEST DATE",
          accessor: "requestDate"
        },
        {
          Header: "APPROVAL ACTION",
          accessor: "actions"
        }
      ]
    };
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

  async approveUser(user, role, brand) {
    console.log(user, role, brand);
  }

  async rejectUser(user) {
    console.log(user);
  }

  async fetchUserData () {
    let userList;//= (await Http.get("/api/users")).body;

    userList = [
      {
        id: 1,
        loginId: "email1@gmail.com",
        name: "shubhansh1 sahai 1",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 2,
        loginId: "email2@gmail.com",
        name: "shubhansh2 sahai 2",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 3,
        loginId: "email3@gmail.com",
        name: "shubhansh3 sahai 3",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 4,
        loginId: "email4@gmail.com",
        name: "shubhansh4 sahai 4",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 1,
        loginId: "email1@gmail.com",
        name: "shubhansh1 sahai 1",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 2,
        loginId: "email2@gmail.com",
        name: "shubhansh2 sahai 2",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 3,
        loginId: "email3@gmail.com",
        name: "shubhansh3 sahai 3",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 4,
        loginId: "email4@gmail.com",
        name: "shubhansh4 sahai 4",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 1,
        loginId: "email1@gmail.com",
        name: "shubhansh1 sahai 1",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 2,
        loginId: "email2@gmail.com",
        name: "shubhansh2 sahai 2",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 3,
        loginId: "email3@gmail.com",
        name: "shubhansh3 sahai 3",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      },
      {
        id: 4,
        loginId: "email4@gmail.com",
        name: "shubhansh4 sahai 4",
        requestDate: "03/03/2020",
        phone: "9898989898",
        status: "pending"
      }
    ];
    userList = userList.map((user, i) => {
      const newUser = {
        id: user.id,
        loginId: user.loginId,
        username: user.name,
        requestDate: user.requestDate,
        phone: user.phone,
        sequence: i + 1,
        status: user.status,
        actions: [
          {
            icon: redCircleCross,
            callback: this.rejectUser,
            type: "reject"
          },
          {
            icon: greenCircleCheck,
            callback: this.approveUser,
            type: "approve"
          }
          ],
        role: {
          label: "Set Role",
          required: true,
          value: "",
          type: "select",
          pattern: null,
          disabled: false,
          options: []
        },
        brands: {
          label: "Assign Brand",
          required: true,
          value: "",
          type: "multiselect",
          pattern: null,
          disabled: false,
          options: []
        },
        original: user
      };

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
    const statusSet = new Set();

    paginatedList.map(user => {
      if (user.status) {
        statusSet.add(user.status);
      }
    });

    const statusFilter = {
      id: "status",
      name: "User Status",
      filterOptions: Array.from(statusSet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const filters = [statusFilter];
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

  fetchRolesForUser (user) {
    const filteredList = [...this.state.filteredList];
    const index = ClientUtils.where(filteredList, {id: user.id});
    filteredList[index].role.options = [
      {value: "Administrator"},
      {value: "Reporter"}
    ];
    //filteredList[index].roles = filteredList[index].roles.map(v => {v.value = v.name; });
    return this.setState({filteredList});

    // return Http.get("/api/newUser/roles")
    //   .then(res => {
    //     const filteredList = [...this.state.filteredList];
    //     const index = ClientUtils.where(filteredList, {id: user.id});
    //     filteredList[index].roles = res.body.roles;
    //     filteredList[index].roles = filteredList[index].roles.map(v => {v.value = v.name; });
    //     this.setState({filteredList});
    //   });
  }

  fetchBrandsForUser (user) {
    const filteredList = [...this.state.filteredList];
    const index = ClientUtils.where(filteredList, {id: user.id});
    filteredList[index].brands.options = [
      {value: "Brand A"},
      {value: "Brand B"}
    ];
    //filteredList[index].brands = filteredList[index].brands.map(v => {v.value = v.name; });
    return this.setState({filteredList});

    // return Http.get("/api/newUser/brands")
    //   .then(res => {
    //     const filteredList = [...this.state.filteredList];
    //     const index = ClientUtils.where(filteredList, {id: user.id});
    //     filteredList[index].brands = res.body;
    //     filteredList[index].brands = filteredList[index].brands.map(v => {v.value = v.name; });
    //     this.setState({filteredList});
    //   });

  }

  prepareUserApproval(user) {
    this.fetchRolesForUser(user);
    this.fetchBrandsForUser(user);
  }

  setSelectInputValue (value, key) {
    if (value) {
      // this.setState(state => {
      //   state = {...state};
      //   state.form.inputData[key].value = value;
      //   return {
      //     ...state
      //   };
      // });
    }
  }

  setMultiSelectInputValue (selectedList, key, optionId) {
    if (selectedList && optionId) {
      // this.setState(state => {
      //   state = {...state};
      //   state.form.inputData[key].value = selectedList.join(", ");
      //   return {
      //     ...state
      //   };
      // });
    }
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
          <div className="row content-header-row p-4 h-10 mx-0">
            <div className="col">
              <h3>User Approval List</h3>
            </div>
          </div>
          <div className="row content-row p-4 h-90">
            <div className="col content-col h-100;">
              <div className="row action-row align-items-center">
                <div className="col-lg-8 col-6" />
                <div className="col-lg-4 col-6 text-right">
                  <div className="input-group input-group-sm d-block">
                    <div className="input-group-append bg-transparent cursor-pointer float-right" onClick={this.toggleFilterVisibility}>
                      <div className="bg-transparent">
                        <div className="filter-btn pl-4 pr-2" >
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
                        <CustomTable data={[...this.state.filteredList]} columns={this.state.userListColumns} template={UserApprovalTable}
                          templateProps={{
                            fetchRolesForUser: this.fetchRolesForUser, fetchBrandsForUser: this.fetchBrandsForUser,
                            setSelectInputValue: this.setSelectInputValue, setMultiSelectInputValue: this.setMultiSelectInputValue
                          }}/>
                      }
                    </div>
                  </div>

                  <div className="row user-list-table-manage-row h-10 align-items-center mx-4">
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

