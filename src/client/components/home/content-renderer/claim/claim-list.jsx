/* eslint-disable no-unused-expressions, no-magic-numbers */
import React from "react";
import { connect } from "react-redux";
import "../../../../styles/home/content-renderer/claim/claim-list.scss";
import PropTypes from "prop-types";
import Dropdown from "../../../custom-components/dropdown/dropdown";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import ClientUtils from "../../../../utility/ClientUtils";
import Http from "../../../../utility/Http";
import FilterBlue from "../../../../images/filterIcon.svg";
import emptyClaims from "../../../../images/empty-claim.png";
import {showNotification} from "../../../../actions/notification/notification-actions";
import {dispatchFilter, dispatchWidgetAction} from "./../../../../actions/dashboard/dashboard-actions";
import {dispatchClaims} from "./../../../../actions/claim/claim-actions";
import CustomTable from "../../../custom-components/table/custom-table";
import ClaimListTable from "../../../custom-components/table/templates/claim-list-table";
import CONSTANTS from "../../../../constants/constants";
import helper from "./../../../../utility/helper";
import {FilterType, Paginator} from "../../../index";
import SortUtil from "../../../../utility/SortUtil";
import SearchUtil from "../../../../utility/SearchUtil";
import FilterUtil from "../../../../utility/FilterUtil";
import mixpanel from "../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../constants/mixpanelConstants";

class ClaimList extends React.Component {

  /* eslint-disable max-statements */
  constructor (props) {
    super(props);

    this.addNewClaim = this.addNewClaim.bind(this);
    this.createFilters = this.createFilters.bind(this);
    this.fetchClaims = this.fetchClaims.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this);
    this.checkAndApplyDashboardFilter = this.checkAndApplyDashboardFilter.bind(this);
    this.updateListAndFilters = this.updateListAndFilters.bind(this);
    // this.getFilterPins = this.getFilterPins.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.multiSort = SortUtil.multiSort.bind(this);
    this.uiSearch = SearchUtil.uiSearch.bind(this);
    this.applyFilters = FilterUtil.applyFilters.bind(this);
    this.filterMap = {inprogress: "In Progress", closed: "Closed"};
    this.sortAndNormalise = SortUtil.sortAndNormalise.bind(this);
    this.state = {
      showFilters: false,
      claimList: [],
      paginatedList: [],
      filteredList: [],
      filters: [],
      appliedFilter: [],
      loader: false,
      nonBlockingLoader: false,
      searchText: "",
      unsortedList: [],
      identifier: "claims",
      columns: [
        // {
        //   Header: "#",
        //   accessor: "sequence",
        //   canSort: true
        // },
        {
          Header: "CLAIM NUMBER",
          accessor: "caseNumber",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "CLAIM TYPE",
          accessor: "claimType",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "BRAND",
          accessor: "brandName",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "SUBMITTED BY",
          accessor: "createdByName",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        },
        {
          Header: "SUBMISSION DATE",
          accessor: "claimDate",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET,
            type: CONSTANTS.SORTSTATE.DATETYPE
          }
        },
        {
          Header: "CLAIM STATUS",
          accessor: "claimStatus",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET
          }
        }
        // {
        //   Header: "CLAIM STATUS DETAILS",
        //   accessor: "statusDetails"
        // }
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

  async componentDidMount() {
    let location = this.props.history.location.pathname;
    location = location.endsWith("/") ? location.substring(0, location.length - 1) : location;
    const isClaimDetailPath = new RegExp(CONSTANTS.REGEX.CLAIMDETAILSPATH).test(location);
    if (isClaimDetailPath) {
      const ticketId = location.substring(location.indexOf("/claims/") + 8);
      this.showClaimDetails(ticketId);
    }
    if (this.props.claims) {
      this.checkAndApplyDashboardFilter(this.props.claims);
    }
    const claimList = await this.fetchClaims();
    this.checkAndApplyDashboardFilter(claimList);
    const mixpanelPayload = {WORK_FLOW: "ADD_NEW_CLAIM"};
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.CLAIM_LIST_WORKFLOW.VIEW_CLAIMS, mixpanelPayload);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter["widget-claim-summary"] !== this.props.filter["widget-claim-summary"] || this.props.fetchClaimsCompleted) {
      this.checkAndApplyDashboardFilter(this.props.claims);
      this.props.dispatchClaims({fetchClaimsCompleted: false});
    }
  }

  checkAndApplyDashboardFilter(claimList) {
    const filterValue = this.filterMap[this.props.filter["widget-claim-summary"]];
    this.createFilters(claimList);
    const stateCloned = {...this.state};
    const claimStatusFilter = stateCloned.filters.length > 0 && stateCloned.filters.find(filter => filter.id === "claimStatus");
    const dashboardFilter = claimStatusFilter && claimStatusFilter.filterOptions.find(filterOption => filterOption.name === filterValue);
    if (this.props.filter && this.props.filter["widget-claim-summary"]) {
      this.setState(() => {
        dashboardFilter && (dashboardFilter.selected = true);
        return stateCloned;
      }, () => this.applyFilters(false, claimList, false, true));
    } else {
      this.setState(() => {
        let i = 1;
        claimStatusFilter && claimStatusFilter.filterOptions.forEach(filterOption => {
          filterOption.selected = false;
        });
        claimList.forEach(claim => {
          claim.sequence = i++;
        });
        return stateCloned;
      }, () => this.applyFilters(false, claimList, false, false));
    }
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

  async fetchClaims () {
    !this.props.claims ? this.loader("loader", true) : this.loader("nonBlockingLoader", true);
    const response = (await Http.get("/api/claims", "", () => {
      this.loader("loader", false);
      this.loader("nonBlockingLoader", false);
    })).body;

    let claimList = [];

    if (response.data && response.data.content) {
      claimList = response.data.content.map((brand, i) => {
        const newClaim = { ...brand, sequence: i + 1 };
        newClaim.original = brand;
        const firstName = brand.firstName ? helper.toCamelCaseIndividual(brand.firstName) : "";
        const lastName = brand.lastName ? helper.toCamelCaseIndividual(brand.lastName) : "";
        newClaim.createdByName = `${firstName  } ${  lastName}`;
        newClaim.statusDetails = newClaim.statusDetails && newClaim.statusDetails !== "null" ? newClaim.statusDetails : "";
        return newClaim;
      });
      this.createFilters(claimList);
    }

    if (this.props.widgetAction) {
      this.addNewClaim();
      this.props.dispatchWidgetAction(false);
    }

    this.props.dispatchClaims({claimList});
    this.setState({unsortedList: claimList});
    const sortedClaimList = this.multiSort();

    return sortedClaimList;
  }

  mixpanelAddNewTemplateUtil = (meta, payload) => {
    const templateName = meta.templateName;
    const eventName = MIXPANEL_CONSTANTS.ADD_NEW_TEMPLATE_MAPPING[templateName];
    mixpanel.trackEvent(eventName, payload);
  }

  addNewClaim () {
    const meta = { templateName: "NewClaimTemplate" };
    const mixpanelPayload = {WORK_FLOW: "ADD_NEW_CLAIM"};
    this.mixpanelAddNewTemplateUtil(meta, mixpanelPayload);
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }


  toggleFilterVisibility (explicitToggle) {
    this.setState(state => {
      state = {...state};
      state.showFilters = explicitToggle !== undefined && typeof explicitToggle !== "object" ? explicitToggle : !state.showFilters;
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
    const claimList = [...this.props.claims];
    let i = 1;
    claimList.forEach(claim => {
      claim.sequence = i++;
    });
    this.setState({filters, filteredList: claimList, unsortedList: claimList, appliedFilter: []}, () => {
      this.uiSearch();
      this.props.dispatchFilter({...this.props.filter, "widget-claim-summary": ""});
    });

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
      name: "Submitted By",
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

  updateListAndFilters(paginatedList) {
    this.setState({paginatedList});
  }

  clearFilter(filterID, optionID) {
    this.onFilterChange(filterID, optionID);
    this.applyFilters(false, null, null, true);
    this.toggleFilterVisibility();
  }

  /* eslint-disable react/jsx-handler-names */
  render () {
    const claims = this.state.filteredList ? this.state.filteredList : this.props.claims;
    return (
      <div className="row claim-list-content h-100">
        <div className="col h-100">
          <div className="row content-header-row p-4 h-10 mx-0">
            <div className="col">
              <h3>My Claims</h3>
            </div>
          </div>
          {/*h-90*/}
          <div className="row content-row p-4 h-90 mx-0">
            <div className="col content-col pb-4 h-100">
              <div className="row action-row align-items-center mx-0">
                <div className="col-lg-8 col-6 pl-0">
                  <div className="btn btn-primary btn-sm px-3" onClick={this.addNewClaim}>
                    Submit New Claim
                  </div>
                </div>
                <div className="col-lg-4 col-6 text-right pr-0">
                  <div className="input-group input-group-sm">
                    {this.state.nonBlockingLoader && <div className="list-loader mr-3 mt-1 loader" style={{width: "1.5rem"}} />}
                    <input id="search-box" className="form-control form-control-sm " type="search" placeholder="Search by Claim Details"
                      onChange={evt => this.uiSearch(evt, false)}/>
                    <div className="input-group-append bg-transparent cursor-pointer" onClick={this.toggleFilterVisibility}>
                      <div className="bg-transparent">
                        <div className="filter-btn pl-4 " >
                          <img src={FilterBlue} height="20px"/> Filter
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row filter-dropdown-row">
                <div className={`col-12 filter-dropdown-column ${this.state.showFilters ? "show" : ""}`}>
                  <div className="custom-dropdown-menu mt-n4 no-border-radius px-5 w-100">
                    <div className="row filter-headers-row align-items-center py-3">
                      <div className="col">
                        <span className="filters-header-text font-weight-bold font-size-20">Filters</span>
                      </div>
                      <div className="col text-right">
                        <div className="btn filter-btns clear-btn text-primary mx-4 font-weight-bold" onClick={this.resetFilters}>Clear All Filters</div>
                        <div className="btn filter-btns apply-btn btn-sm btn-primary mr-4 px-3 font-weight-bold" onClick={() => this.applyFilters(false, null, null, true)}>Apply Filters </div>
                        <span className="filter-close-btn cursor-pointer" onClick={this.toggleFilterVisibility} >&times;</span>
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
                                      <li className="my-3" key={option.id} >
                                        <div className="form-check">
                                          <input className="form-check-input" type="checkbox" value="" id={`${filter.id}-${option.id}`} checked={option.selected}
                                            onChange={() => {
                                              this.onFilterChange(filter.id, option.id);
                                            }}/>
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
              <div className={`row claim-list-row align-items-start${this.state.loader && " loader"}`}>
                <div className="col pt-4 h-100">
                  <div className="row claim-list-table-row mb-5 px-4 h-90">
                    <div className="col h-100">
                      {
                        this.props.claims ?
                          <CustomTable sortHandler={this.sortAndNormalise} data={[...this.state.paginatedList]} columns={this.state.columns} template={ClaimListTable}
                            templateProps={{Dropdown, dropdownOptions: this.state.dropdown, loader: this.state.loader}}/>
                          : (!this.state.loader && <div className="row align-items-center h-100">
                          <div className="col text-center">
                            <img src={emptyClaims} height={95}/>
                            <br/><br/>
                            <div className="h4">No Claim History</div>
                            <div>You can submit a claim by clicking the "Submit New Claim" button</div>
                          </div>
                        </div>)
                      }
                    </div>
                  </div>
                </div>
              </div>
              <Paginator createFilters={this.createFilters} paginatedList={this.state.paginatedList} records={claims} section="CLAIM" updateListAndFilters={this.updateListAndFilters} />
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
  dispatchFilter: PropTypes.func,
  dispatchWidgetAction: PropTypes.func,
  fetchClaimsCompleted: PropTypes.bool,
  filter: PropTypes.object,
  history: PropTypes.object,
  fetchClaimCompleted: PropTypes.bool,
  toggleModal: PropTypes.func,
  showNotification: PropTypes.func,
  widgetAction: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    claims: state.claims && state.claims.claimList,
    fetchClaimsCompleted: state.claims && state.claims.fetchClaimsCompleted,
    filter: state.dashboard.filter,
    modal: state.modal,
    widgetAction: state.dashboard.widgetAction
  };
};

const mapDispatchToProps = {
  dispatchWidgetAction,
  dispatchClaims,
  dispatchFilter,
  toggleModal,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimList);

