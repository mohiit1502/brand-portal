import React from "react";
import { connect } from "react-redux";
import "../../../../styles/home/content-renderer/claim/claim-list.scss";
import PropTypes from "prop-types";
import Dropdown from "../../../custom-components/dropdown/dropdown";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import ClientUtils from "../../../../utility/ClientUtils";
import Http from "../../../../utility/Http";
import searchIcon from "../../../../images/18-px-search.svg";
import filterIcon from "../../../../images/filter-sc.svg";
import ContentPasteIcon from "../../../../images/content-paste.svg";
import PaginationNav from "../../../custom-components/pagination/pagination-nav";
import {showNotification} from "../../../../actions/notification/notification-actions";
import {dispatchWidgetAction} from "./../../../../actions/dashboard/dashboard-actions";
import {dispatchClaims} from "./../../../../actions/claim/claim-actions";
import CustomTable from "../../../custom-components/table/custom-table";
import ClaimListTable from "../../../custom-components/table/templates/claim-list-table";
import CONSTANTS from "../../../../constants/constants";
import helper from "./../../../../utility/helper";

class ClaimList extends React.Component {

  constructor (props) {
    super(props);

    this.addNewClaim = this.addNewClaim.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.createFilters = this.createFilters.bind(this);
    this.fetchClaims = this.fetchClaims.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.paginationCallback = this.paginationCallback.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this);
    this.uiSearch = this.uiSearch.bind(this);

    this.state = {
      page: {
        offset: 0,
        size: 10,
        sizeOptions: [5, 10, 15, 20, 30]
      },
      showFilters: false,
      claimList: [],
      paginatedList: [],
      filteredList: [],
      filters: [],
      loader: false,
      searchText: "",
      claimListColumns: [
        {
          Header: "#",
          accessor: "sequence",
          canSort: true
        },
        {
          Header: "CLAIM NUMBER",
          accessor: "caseNumber"
        },
        {
          Header: "CLAIM TYPE",
          accessor: "claimType"
        },
        {
          Header: "BRAND",
          accessor: "brandName"
        },
        {
          Header: "CLAIM BY",
          accessor: "createdByName"
        },
        {
          Header: "CLAIM DATE",
          accessor: "claimDate"
        },
        {
          Header: "CLAIM STATUS",
          accessor: "claimStatus"
        }
        // {
        //   Header: "CLAIM STATUS DETAILS",
        //   accessor: "statusDetails"
        // }
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

  componentDidMount() {
    let location = this.props.history.location.pathname;
    location = location.endsWith("/") ? location.substring(0, location.length - 1) : location;
    const isClaimDetailPath = new RegExp(CONSTANTS.REGEX.CLAIMDETAILSPATH).test(location);
    if (isClaimDetailPath) {
      const ticketId = location.substring(location.indexOf("/claims/") + 8);
      this.showClaimDetails(ticketId);
    }
    this.fetchClaims();
  }

  async showClaimDetails (ticketId) {
    try {
      // this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {templateName: "ClaimDetailsTemplate", data: {}});
      const claimDetailsUrl = `/api/claims/${ticketId}`; 
      const response = (await Http.get(claimDetailsUrl)).body;
      const meta = { templateName: "ClaimDetailsTemplate", data: response && response.data };
      this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
    } catch (e) {
      if (e.status === 404) {
        const meta = { templateName: "ClaimDetailsTemplate", data: {error: true, ticketId} };
        this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
      }
    }
  }

  componentDidUpdate() {
    // if (prevProps.history.location.pathname !== this.props.history.location.pathname) {
    //   const location = this.props.history.location.pathname;
    //   const isClaimDetailPath = new RegExp(CONSTANTS.REGEX.CLAIMDETAILSPATH).test(location);
    //   if (isClaimDetailPath) {
    //     const ticketId = location.substring(location.indexOf("/claims/") + 8);
    //     this.showClaimDetails(ticketId);
    //   }
    // }
  }

  async fetchClaims () {
    this.loader(true);
    const response = (await Http.get("/api/claims", "", () => this.loader(false))).body;

    let claimList = [];

    if (response.data.content && response.data.content) {
      claimList = response.data.content.map((brand, i) => {
        const newClaim = { ...brand, sequence: i + 1 };
        newClaim.original = brand;
        const firstName = brand.firstName ? helper.toCamelCaseIndividual(brand.firstName) : "";
        const lastName = brand.lastName ? helper.toCamelCaseIndividual(brand.lastName) : "";
        newClaim.createdByName = firstName + " " + lastName;
        newClaim.statusDetails = newClaim.statusDetails && newClaim.statusDetails !== "null" ? newClaim.statusDetails : "";
        return newClaim;
      });
    }

    if (this.props.widgetAction) {
      this.addNewClaim();
      this.props.dispatchWidgetAction(false);
    }

    this.props.dispatchClaims({claimList});
  }

  addNewClaim () {
    const meta = { templateName: "NewClaimTemplate" };
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }

  async uiSearch (evt, isFilter, filteredClaims) {
    const searchText = evt ? evt.target.value && evt.target.value.toLowerCase() : this.state.searchText;
    const allClaims = filteredClaims ? filteredClaims : this.state.paginatedList;
    const filteredList = allClaims.filter(claim => {
      return claim.caseNumber.toLowerCase().indexOf(searchText) !== -1
        || claim.claimType.toLowerCase().indexOf(searchText) !== -1
        || claim.brandName.toLowerCase().indexOf(searchText) !== -1
        || claim.createdByName.toLowerCase().indexOf(searchText) !== -1
        || claim.claimDate.toLowerCase().indexOf(searchText) !== -1
        || claim.claimStatus.toLowerCase().indexOf(searchText) !== -1;
    });
    if (isFilter) {
      this.setState({filteredList, searchText});
    } else {
      this.setState({filteredList, searchText}, () => this.applyFilters(true, filteredList));
    }
  }

  toggleFilterVisibility () {
    this.setState(state => {
      state = {...state};
      state.showFilters = !state.showFilters;
      return state;
    });
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

  createFilters(paginatedList) {

    const brandsSet = new Set();
    const statusSet = new Set();
    const claimBySet = new Set();
    const claimTypeSet = new Set();

    paginatedList.map(claim => {
      brandsSet.add(claim.brandName);
      statusSet.add(claim.claimStatus);
      claimBySet.add(claim.createdBy);
      claimTypeSet.add(claim.claimType);

    });

    const brandsFilter = {
      id: "brandName",
      name: "Brand",
      filterOptions: Array.from(brandsSet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const statusFilter = {
      id: "claimStatus",
      name: "Claim Status",
      filterOptions: Array.from(statusSet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const claimTypeFilter = {
      id: "claimType",
      name: "Claim Type",
      filterOptions: Array.from(claimTypeSet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const claimByFilter = {
      id: "createdBy",
      name: "Claim By",
      filterOptions: Array.from(claimBySet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const filters = [ brandsFilter, statusFilter, claimTypeFilter, claimByFilter];

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

  applyFilters(isSearch, filteredList) {

    let paginatedList = filteredList ? [...filteredList] : [...this.state.paginatedList];
    this.state.filters.map(filter => {
      const filterOptionsSelected = filter.filterOptions.filter(filterOption => filterOption.selected && filterOption.value !== "all");

      if (filterOptionsSelected.length) {
        const filterId = filter.id;
        paginatedList = paginatedList.filter(user => {
          let bool = false;
          filterOptionsSelected.map(filterOption => {
            bool = bool || (!!user[filterId] && user[filterId].toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1);
          });
          return bool;
        });

      }
    });

    if (isSearch) {
      this.setState({filteredList: paginatedList});
    } else {
      this.setState({filteredList: paginatedList}, () => this.uiSearch(null, true, paginatedList));
      this.toggleFilterVisibility();
    }
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

  paginationCallback (page) {

    const pageState = {...this.state.page};
    pageState.offset = page.offset;
    pageState.size = page.size;
    const paginatedList = [...page.list];
    const filteredList = [...page.list];
    this.createFilters(paginatedList);

    this.setState({page: pageState, paginatedList, filteredList});
  }

  changePageSize(size) {

    const page = {...this.state.page};
    page.size = size;
    this.setState({page});

  }

  render () {

    const viewerShip = () => {
      const from = this.state.page.offset * this.state.page.size + 1;
      const to = this.state.page.offset * this.state.page.size + this.state.filteredList.length;
      const total = this.props.claims && this.props.claims.length;
      if (this.props.claims && this.props.claims.length && to >= from) {
        return `Viewing ${from} - ${to} of ${total} ${CONSTANTS.CLAIM.SECTION_TITLE_PLURAL}`;
      } else if (this.props.claims && this.props.claims.length && to <= from) {
        return `Viewing 0 of ${total} ${CONSTANTS.CLAIM.SECTION_TITLE_PLURAL}`;
      }
      return "";
    };

    return (
      <div className="row user-list-content h-100">
        <div className="col h-100">

          <div className="row content-header-row p-4 h-10 mx-0">
            <div className="col">
              <h3>My Claims</h3>
            </div>
          </div>
          <div className="row content-row p-4 h-90">
            <div className="col content-col h-100;">
              <div className="row action-row align-items-center mx-0">
                <div className="col-lg-8 col-6">
                  <div className="btn btn-primary btn-sm px-3" onClick={this.addNewClaim}>
                    New Claim
                  </div>
                </div>
                <div className="col-lg-4 col-6 text-right">
                  <div className="input-group input-group-sm">
                    <div className="input-group-prepend bg-transparent">
                      <div className="input-group-text bg-transparent">
                        <img src={searchIcon} className="Group-23" />
                      </div>
                    </div>
                    <input id="search-box" className="form-control form-control-sm border-left-0 shadow-none" type="search" placeholder="Search by Claim Number"
                           onChange={evt => this.uiSearch(evt, false)}/>
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
                        <div className="btn filter-btns apply-btn btn-sm btn-primary mr-4 px-3" onClick={() => this.applyFilters(false)}>Apply Filters </div>
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
              <div className={`row user-list-row align-items-start${this.state.loader && " loader"}`}>
                <div className="col pt-4 h-100">
                  <div className="row user-list-table-row h-90">
                    <div className="col h-100 overflow-auto">
                      {
                        this.state.filteredList.length > 0 &&
                        <CustomTable data={[...this.state.filteredList]} columns={this.state.claimListColumns} template={ClaimListTable}
                                     templateProps={{Dropdown, dropdownOptions: this.state.dropdown}}/> ||
                        <div className="row align-items-center h-100">
                          <div className="col text-center">
                            <img src={ContentPasteIcon} height={80}/>
                            <br/><br/>
                            <div className="h4">No Claim History</div>
                            <div>You can submit a claim by clicking the "New Claim" button</div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                  <div className="row user-list-table-manage-row h-10 align-items-center mx-4">
                    <div className="col">
                      { viewerShip() }
                    </div>
                    <div className="col text-center">
                      <PaginationNav list={this.props.claims ? this.props.claims : []} offset={this.state.page.offset} size={this.state.page.size} callback={this.paginationCallback}/>
                    </div>
                    <div className="col text-right">

                      {
                        !!(this.props.claims && this.props.claims.length) && <button type="button" className="btn btn-sm user-count-toggle-btn dropdown-toggle px-4" data-toggle="dropdown"
                          aria-haspopup="true" aria-expanded="false">
                          Show {this.state.page.size} {CONSTANTS.CLAIM.SECTION_TITLE_PLURAL} &nbsp;&nbsp;&nbsp;
                        </button>
                      }

                      <div className="dropdown-menu user-count-dropdown-menu">
                        {
                          this.state.page.sizeOptions.map(val => {
                            return (<a key={val} className="dropdown-item"
                              onClick={() => {this.changePageSize(val);}}> Show {val} {CONSTANTS.CLAIM.SECTION_TITLE_PLURAL} </a>);
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

ClaimList.propTypes = {
  claims: PropTypes.array,
  dispatchClaims: PropTypes.func,
  dispatchWidgetAction: PropTypes.func,
  history: PropTypes.object,
  toggleModal: PropTypes.func,
  showNotification: PropTypes.func,
  widgetAction: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    claims: state.claims && state.claims.claimList,
    modal: state.modal,
    widgetAction: state.dashboard.widgetAction
  };
};

const mapDispatchToProps = {
  dispatchWidgetAction,
  dispatchClaims,
  toggleModal,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimList);

