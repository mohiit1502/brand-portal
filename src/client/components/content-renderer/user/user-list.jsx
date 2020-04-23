import React from "react";
import { connect } from "react-redux";
import "../../../styles/content-renderer/user/user-list.scss";
import PropTypes from "prop-types";
import CustomTable from "../../table/custom-table";
import dummydata from "./dummydata.js";
import UserListTable from "../../table/templates/user-list-table";
import Dropdown from "../../dropdown/dropdown";
import {TOGGLE_ACTIONS, toggleModal} from "../../../actions/modal-actions";

class UserList extends React.Component {

  constructor (props) {
    super(props);

    this.createNewUser = this.createNewUser.bind(this);

    this.state = {
      userList: [],
      dropdown: {
        buttonText: ";;;",
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

  async fetchUserData () {
    const userList = await dummydata;
    this.setState({userList});
  }

  async componentDidMount() {
    this.fetchUserData();
  }

  componentDidUpdate(prevProps) {
    //console.log(prevProps.userEdit.save, this.props.userEdit.save);
  }

  createNewUser () {
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, { templateName: "CreateUserTemplate" });
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
                      <div className="input-group-text bg-transparent">@</div>
                    </div>
                    <input id="search-box" className="form-control form-control-sm border-left-0 shadow-none" type="search" placeholder="Search by User Name" />
                  </div>
                </div>
                <div className="col-lg-1 col-2 text-center cursor-pointer" data-toggle="dropdown">
                  <span className="filter-btn" > <strong>|</strong> &nbsp;&nbsp; Filter</span>

                </div>
                <div className="col-12 filter-dropdown-column">
                  <div className="dropdown-menu dropdown-menu-right mt-n4 no-border-radius mr-4 px-5 w-100">
                    <div className="row filter-headers-row align-items-center border-bottom py-3">
                      <div className="col">
                        <span className="filters-header-text">Filters</span>
                      </div>
                      <div className="col text-right">
                        <div className="btn filter-btns clear-btn text-primary mx-4">Clear All Filters</div>
                        <div className="btn filter-btns apply-btn btn-sm btn-primary mr-4 px-3">Apply Filters </div>
                        <span className="filter-close-btn">&times;</span>
                      </div>
                    </div>
                    <div className="row filter-content-row py-3">
                      <div className="col company-col">
                        <div className="filter-col-header">
                          Company
                        </div>
                        <ul className="filter-col-list pl-0 mt-2">
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                All
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                Mark Monitor
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                ESeal
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col role-col">
                        <div className="filter-col-header">
                          Role
                        </div>
                        <ul className="filter-col-list pl-0 mt-2">
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                All
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                Super Admin
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                Admin
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                Reporter
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col brand-col">
                        <div className="filter-col-header">
                          Associated Brands
                        </div>
                        <ul className="filter-col-list pl-0 mt-2">
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                All
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                Mark Monitor
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                ESeal
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col status-col">
                        <div className="filter-col-header">
                          Profile Status
                        </div>
                        <ul className="filter-col-list pl-0 mt-2">
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" value="" id="defaultCheck1" name="profileStatusRadio"/>
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                All
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" value="" id="defaultCheck1" name="profileStatusRadio"/>
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                Active
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" value="" id="defaultCheck1" name="profileStatusRadio"/>
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                Inactive
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="form-check">
                              <input className="form-check-input" type="radio" value="" id="defaultCheck1" name="profileStatusRadio"/>
                              <label className="form-check-label" htmlFor="defaultCheck1">
                                Suspended
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="row user-list-row align-items-start">
                <div className="col pt-4 h-100">
                  <div className="row user-list-table-row h-90">
                    <div className="col h-100 overflow-auto">
                      {
                        this.state.userList.length &&
                        <CustomTable data={this.state.userList} columns={this.state.userListColumns} template={UserListTable}
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
    userEdit : state.userEdit
  };
};

const mapDispatchToProps = {
  toggleModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);
