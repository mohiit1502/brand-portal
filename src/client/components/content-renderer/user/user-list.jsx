import React from "react";
import { connect } from "react-redux";
import "../../../styles/content-renderer/user/user-list.scss";
import { useTable } from "react-table";
import PropTypes from "prop-types";
import CustomTable from "../../table/custom-table";


class UserList extends React.Component {

  constructor (props) {
    super(props);
  }

  componentDidMount() {

  }


  render () {

    let i = 1;
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
              <div className="row action-row align-items-center">
                <div className="col-6">
                  <div className="btn btn-primary btn-sm px-3">
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
                <div className="col-lg-1 col-2 text-center">
                  <span className="filter-btn"> <strong>|</strong> &nbsp;&nbsp; Filter</span>
                </div>
              </div>
              <div className="row user-list-row align-items-start">
                <div className="col pt-4 h-100">
                  <div className="row user-list-table-row h-90">
                    <div className="col h-100 overflow-auto">
                      <CustomTable />
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

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  dispatch => ({dispatch})
)(UserList);
