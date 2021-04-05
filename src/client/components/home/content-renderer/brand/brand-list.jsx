import React from "react";
import { connect } from "react-redux";
import "../../../../styles/home/content-renderer/brand/brand-list.scss";
import PropTypes from "prop-types";
import Dropdown from "../../../custom-components/dropdown/dropdown";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import ClientUtils from "../../../../utility/ClientUtils";
import Http from "../../../../utility/Http";
import filterIcon from "../../../../images/filterIcon.svg";
import kebabIcon from "../../../../images/kebab-icon.png";
import {saveBrandCompleted} from "../../../../actions/brand/brand-actions";
import {showNotification} from "../../../../actions/notification/notification-actions";
import {dispatchFilter, dispatchWidgetAction} from "./../../../../actions/dashboard/dashboard-actions";
import NoRecordsMatch from "../../../custom-components/NoRecordsMatch/NoRecordsMatch";
import {FilterType, Paginator} from "../../../index";
import CustomTable from "../../../custom-components/table/custom-table";
import BrandListTable from "../../../custom-components/table/templates/brand-list-table";
import CONSTANTS from "../../../../constants/constants";
import AUTH_CONFIG from "./../../../../config/authorizations";
import restConfig from "./../../../../config/rest.js";
import SortUtil from "../../../../utility/SortUtil";
import "./../../../../styles/home/content-renderer/brand/brand-list.scss";
import mixpanel from "../../../../utility/mixpanelutils";
import MIXPANEL_CONSTANTS from "../../../../constants/MixPanelConsants";

class BrandList extends React.Component {

  constructor (props) {
    super(props);

    this.addNewBrand = this.addNewBrand.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.uiSearch = this.uiSearch.bind(this);
    this.createFilters = this.createFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.fetchBrands = this.fetchBrands.bind(this);
    // this.paginationCallback = this.paginationCallback.bind(this);
    // this.changePageSize = this.changePageSize.bind(this);
    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this);
    this.updateListAndFilters = this.updateListAndFilters.bind(this);
    this.editBrand = this.editBrand.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.multiSort = SortUtil.multiSort.bind(this);
    const userRole = props.userProfile && props.userProfile.role && props.userProfile.role.name;
    this.filterMap = {"pending": "Pending Verification", "verified": "Verified"};
    this.updateSortState = this.updateSortState.bind(this);
    this.state = {
      page: {
        offset: 0,
        size: 10,
        sizeOptions: [5, 10, 15, 20, 30]
      },
      brandList: [],
      paginatedList: [],
      filteredList: [],
      filters: [],
      appliedFilter: [],
      searchText: "",
      showFilters: false,
      loader: false,
      userRole,
      unsortedList: [],
      dropdown: {
        buttonText: kebabIcon,
        dropdownOptions: [
          {
            id: 1,
            value: CONSTANTS.BRAND.OPTIONS.DISPLAY.EDIT,
            disabled: restConfig.AUTHORIZATIONS_ENABLED ? !AUTH_CONFIG.BRANDS.EDIT.ROLES.includes(userRole) : false,
            clickCallback: (evt, option, data) => {
              this.editBrand(data.original);
            }
          },
          {
            id: 2,
            value: CONSTANTS.BRAND.OPTIONS.DISPLAY.SUSPEND,
            disabled: restConfig.AUTHORIZATIONS_ENABLED ? !AUTH_CONFIG.BRANDS.SUSPEND.ROLES.includes(userRole) : false,
            clickCallback: (evt, option, data) => {
              const outgoingStatus = data.brandStatus && data.brandStatus === CONSTANTS.BRAND.OPTIONS.PAYLOAD.SUSPEND
                                      ? CONSTANTS.BRAND.OPTIONS.PAYLOAD.VERIFIED : CONSTANTS.BRAND.OPTIONS.PAYLOAD.SUSPEND;
              const payload = {status: outgoingStatus};
              this.loader(true);
              const response = Http.put(`/api/brands/${data.brandId}`, payload, "", () => this.loader(false));
              response.then(res => {
                this.fetchBrands();
              });
            }
          },
          // TODO disabled for MVP, enable for sprint 3
          // {
          //   id: 3,
          //   value: CONSTANTS.BRAND.OPTIONS.DISPLAY.DELETE,
          //   disabled: restConfig.IS_MVP || (restConfig.AUTHORIZATIONS_ENABLED ? !AUTH_CONFIG.BRANDS.DELETE.ROLES.map(role => role.toLocaleLowerCase()).includes(userRole ? userRole.toLowerCase() : "") : false),
          //   notMvp: true,
          //   clickCallback: (evt, option, data) => {
          //     const payload = {
          //       status: "Delete"
          //     };
          //     const response = Http.put(`/api/brands/${data.brandId}`, payload);
          //     response.then(res => {
          //       this.fetchBrands();
          //     });
          //   }
          // }
        ]
      },
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
          Header: "BRAND NAME",
          accessor: "brandName",
          sortState: {
            level: CONSTANTS.SORTSTATE.RESET,
          }
        },
        {
          Header: "DATE ADDED",
          accessor: "dateAdded",
          sortState: {
            level: CONSTANTS.SORTSTATE.DESCENDING,
            type: CONSTANTS.SORTSTATE.DATETYPE, // initSort , priorityLevel, 
            priorityLevel: 1,
          }
        },
        {
          Header: "STATUS",
          accessor: "brandStatus",
          sortState: {
            level: CONSTANTS.SORTSTATE.ASCENDING,
            priorityLevel: 0,
          }
        }
      ],
      columnPriority: 1
    };
  }

  loader (enable) {
    this.setState(state => {
      const stateClone = {...state};
      stateClone.loader = enable;
      return stateClone;
    });
  }
  updateSortState(header) {
    const columns = [...this.state.columns];
    const columnMeta = columns.find(column => column.accessor === header.id);
    if (columnMeta.canSort !== false) {
      let sortLevel = columnMeta.sortState.level;
      let columnPriority = this.state.columnPriority;
      sortLevel = Number.isNaN(sortLevel) ? CONSTANTS.SORTSTATE.ASCENDING : sortLevel;
      if (sortLevel === CONSTANTS.SORTSTATE.DESCENDING) {
        columnMeta.sortState.level = CONSTANTS.SORTSTATE.RESET;
        columnMeta.sortState.priorityLevel = -1;
      } else {
        columnMeta.sortState.level = sortLevel === CONSTANTS.SORTSTATE.RESET ? CONSTANTS.SORTSTATE.ASCENDING : CONSTANTS.SORTSTATE.DESCENDING;
        if (typeof columnMeta.sortState.priorityLevel === "undefined" || columnMeta.sortState.priorityLevel === -1) {
          columnMeta.sortState.priorityLevel = this.state.columnPriority + 1;
          columnPriority += 1;
        }
      }
      this.setState({columns, columnPriority}, () => this.multiSort());
   }
  }

  editBrand (brandData) {
    const meta = { templateName: "NewBrandTemplate", data: {...brandData} };
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }

  uiSearch (evt, isFilter, filteredBrands) {
    const searchText = evt ? evt.target.value && evt.target.value.toLowerCase() : this.state.searchText;
    const allBrands = filteredBrands ? filteredBrands : this.state.brandList;
    let filteredList = allBrands.filter(brand => {
      return brand.brandName && brand.brandName.toLowerCase().indexOf(searchText) !== -1
        || brand.dateAdded && brand.dateAdded.toLowerCase().indexOf(searchText) !== -1
        || brand.brandStatus && brand.brandStatus.toLowerCase().indexOf(searchText) !== -1;
    });
    let i = 1;
    if (filteredList) filteredList.forEach(brand => brand.sequence = i++);
    if (isFilter) {
      const unsortedfilteredList = filteredList;
      if (this.state.columnPriority > 0) {
        i = 1;
        filteredList = this.multiSort(filteredList);
        filteredList.forEach(claim => claim.sequence = i++);
      }
      this.setState({filteredList, unsortedList: unsortedfilteredList, searchText});
    } else {
      this.setState({filteredList, unsortedList: filteredList, searchText}, () => this.applyFilters(true, filteredList));
    }
  }

  // paginationCallback (page) {
  //
  //   const pageState = {...this.state.page};
  //   pageState.offset = page.offset;
  //   pageState.size = page.size;
  //   const paginatedList = [...page.list];
  //   const filteredList = [...page.list];
  //   this.createFilters(paginatedList);
  //
  //   this.setState({page: pageState, paginatedList, filteredList});
  // }

  async fetchBrands () {
    this.loader(true);
    const response = (await Http.get("/api/brands", "", () => this.loader(false))).body;

    let brandList = [];

    if (response.content && response.content.length) {
      brandList = response.content.map((brand, i) => {
        const newBrand = { ...brand, sequence: i + 1 };
        newBrand.original = brand;
        return newBrand;
      });
    }
    if (this.props.widgetAction) {
      this.addNewBrand();
      this.props.dispatchWidgetAction(false);
    }
    this.setState({brandList, unsortedList: brandList}, () => this.checkAndApplyDashboardFilter(brandList));
    const sortedBrandList = this.multiSort();
    this.setState({brandList: sortedBrandList});
    return sortedBrandList;
  }

  resetFilters() {
    const filters = [...this.state.filters];
    filters.forEach(filter => {
      filter.filterOptions.forEach(filterOption => {
        filterOption.selected = false;
      });
    });
    const brandList = [...this.state.brandList];
    let i = 1;
    brandList.forEach(brand => brand.sequence = i++)
    this.setState({filters, filteredList: brandList, unsortedList: brandList, appliedFilter:[]}, () => {
      this.uiSearch();
      this.props.dispatchFilter({...this.props.filter, "widget-brand-summary": ""})
    });
    this.toggleFilterVisibility();
  }

  applyFilters(isSearch, filteredList, showFilter, buttonClickAction) {

    // let paginatedList = filteredList ? [...filteredList] : [...this.state.paginatedList];
    filteredList = filteredList ? [...filteredList] : [...this.state.brandList];
    this.state.filters.map(filter => {
      const filterOptionsSelected = filter.filterOptions.filter(filterOption => filterOption.selected && filterOption.value !== "all");
      let i = 1;
      if (filterOptionsSelected.length) {
        const filterId = filter.id;
        filteredList = filteredList.filter(user => {
          let bool = false;
          filterOptionsSelected.map(filterOption => {
            bool = bool || (!!user[filterId] && user[filterId].toLowerCase().indexOf(filterOption.value.toLowerCase()) !== -1);
          });
          return bool;
        })

      }
      filteredList && filteredList.forEach(brand => brand.sequence = i++);
    });

    let appliedFilters = this.state.filters.map(filter => {
      let clonedFilterOption = filter.filterOptions.map(option => {
        return {...option}
      })
      return {...filter,filterOptions: clonedFilterOption}
    });
    if(buttonClickAction === true){
      this.setState({appliedFilter: appliedFilters});
    }

    if (isSearch) {
      const unsortedfilteredList = filteredList;
      if (this.state.columnPriority > 0) {
        filteredList = this.multiSort(filteredList);
        let i = 1;
        filteredList.forEach(claim => claim.sequence = i++);
      }
      this.setState({filteredList, unsortedList: unsortedfilteredList});
    } else {
      this.setState({filteredList, unsortedList: filteredList}, () => this.uiSearch(null, true, filteredList));
      this.toggleFilterVisibility(showFilter);
    }

    // if (buttonClickAction) {
    //   this.props.dispatchFilter({...this.props.filter, "widget-brand-summary": ""})
    // }
  }

  clearFilter(filterID,optionID){
    this.onFilterChange(filterID, optionID);
    this.applyFilters(false,null,null,true)
    this.toggleFilterVisibility()
  }

  createFilters(paginatedList) {

    const brandsSet = new Set();
    const statusSet = new Set();

    paginatedList.map(brand => {
      brandsSet.add(brand.brandName);
      statusSet.add(brand.brandStatus);
    });

    // const brandsFilter = {
    //   id: "brandName",
    //   name: "Brands",
    //   filterOptions: Array.from(brandsSet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
    // };

    const statusFilter = {
      id: "brandStatus",
      name: "Brand Status",
      // filterOptions: Array.from(statusSet, (value, i) => ({id: i + 1, name: value, value, selected: false}))
      filterOptions: Array.from(Object.values(CONSTANTS.BRAND.STATUS), (value, i) => ({id: i + 1, name: value, value, selected: false}))
    };

    const filters = [ statusFilter];
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
    const brandList = await this.fetchBrands();
    this.checkAndApplyDashboardFilter(brandList);
    mixpanel.trackEvent(MIXPANEL_CONSTANTS.LEFT_NAV_EVENTS.VIEW_MY_BRANDS);
  }

  checkAndApplyDashboardFilter(brandList) {
    const filterValue = this.filterMap[this.props.filter["widget-brand-summary"]]
    this.createFilters(brandList);
    const stateCloned = {...this.state};
    const brandStatusFilter = stateCloned.filters.length > 0 && stateCloned.filters.find(filter => filter.id === "brandStatus")
    const dashboardFilter = brandStatusFilter && brandStatusFilter.filterOptions.find(filterOption => filterOption.name === filterValue);
    if (this.props.filter && this.props.filter["widget-brand-summary"]) {
      this.setState(state => {
        dashboardFilter && (dashboardFilter.selected = true);
        return stateCloned;
      }, () => this.applyFilters(false, brandList, false,true))
      // })
    } else {
      this.setState(state => {
        let i = 1;
        brandStatusFilter && brandStatusFilter.filterOptions.forEach(filterOption => filterOption.selected = false);
        brandList.forEach(brand => brand.sequence = i++)
        return stateCloned;
      }, () => this.applyFilters(false, brandList, false,false))
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.brandEdit.save) {
      this.fetchBrands();
      this.props.saveBrandCompleted();
    }
    if (prevProps.filter["widget-brand-summary"] !== this.props.filter["widget-brand-summary"]) {
      this.checkAndApplyDashboardFilter(this.state.brandList);
    }
  }

  addNewBrand () {
    const meta = { templateName: "NewBrandTemplate" };
    mixpanel.addNewTemplate(meta);
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

  // changePageSize(size) {
  //   const page = {...this.state.page};
  //   page.size = size;
  //   this.setState({page});
  // }

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

  // eslint-disable-next-line complexity
  render () {
    const brands = this.state.filteredList ? this.state.filteredList : this.state.brandList;
//     const viewerShip = () => {
//       const from = this.state.page.offset * this.state.page.size + 1;
//       const to = this.state.page.offset * this.state.page.size + this.state.filteredList.length;
//       const total = this.state.brandList.length;
//       if (this.state.brandList.length && to >= from) {
//         return (<div>Viewing <span className="count font-weight-bold" >{from} - {to}</span> of {total} {CONSTANTS.BRAND.SECTION_TITLE_PLURAL}</div>);
//         // return `Viewing ${from} - ${to} of ${total} ${CONSTANTS.BRAND.SECTION_TITLE_PLURAL}`;
//       } else if (this.state.brandList.length && to <= from) {
//         return (<div>Viewing <span className="count font-weight-bold">0</span> of ${total} ${CONSTANTS.BRAND.SECTION_TITLE_PLURAL}</div>);
//       }
//       return "";
//     };

    const enableSectionAccess = restConfig.AUTHORIZATIONS_ENABLED ? this.state.userRole && AUTH_CONFIG.BRANDS.SECTION_ACCESS.map(role => role.toLowerCase()).includes(this.state.userRole.toLowerCase()) : true;
    const enableBrandCreate = restConfig.AUTHORIZATIONS_ENABLED ? this.state.userRole && AUTH_CONFIG.BRANDS.CREATE.map(role => role.toLowerCase()).includes(this.state.userRole.toLowerCase()) : true;
    return enableSectionAccess ? (
      <div className="row brand-list-content h-100">
        <div className="col h-100">

          <div className="row content-header-row p-4 h-10 mx-0">
            <div className="col">
              <h3>My Brands</h3>
            </div>
          </div>
          <div className="row content-row p-4 h-90 mx-0">
            <div className="col content-col pb-4 h-100;">
              <div className="row action-row align-items-center mx-0">
                <div className="col-lg-8 col-6 pl-0">
                  <div className={`btn btn-primary btn-sm px-3 ${!enableBrandCreate ? " disabled" : ""}`} onClick={enableBrandCreate && this.addNewBrand}>
                    Add New Brand
                  </div>
                </div>
                <div className="col-lg-4 col-6 text-right pr-0">
                  <div className="input-group input-group-sm">
                    <input id="search-box" className="form-control form-control-sm " type="search" placeholder="Search by Brand Name"
                      onChange={(evt) => this.uiSearch(evt, false)}/>
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
              {/*{this.props.filter && this.props.filter["widget-brand-summary"] && this.props.filter["widget-brand-summary"] !== "all" &&*/}
              {/*<FilterType filterText={`Brand Status is '__filterType__'`} filterMap={this.filterMap} currentFilters={this.props.filter} filterId="widget-brand-summary"*/}
              {/*            clearFilterHandler={this.props.dispatchFilter}/>}*/}
              <div className="row filter-dropdown-row">
                <div className={`col-12 pr-4 filter-dropdown-column ${this.state.showFilters ? "show" : ""}`}>
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
              <div className="filter-pin-row">
                <FilterType filters ={this.state.appliedFilter} clearFilter={this.clearFilter}/>
              </div>
              <div className={`row brand-list-row align-items-start${this.state.loader && " loader"}`}>
                <div className="col pt-4 h-100">
                  <div className="row brand-list-table-row px-4 h-90">
                    <div className="col h-100">
                      {
                        this.state.brandList ?
                        <CustomTable sortHandler={this.updateSortState} data={[...this.state.paginatedList]} columns={this.state.columns} template={BrandListTable}
                          templateProps={{Dropdown, dropdownOptions: this.state.dropdown, userProfile: this.props.userProfile, loader: this.state.loader}}/>
                          : (!this.state.loader && <NoRecordsMatch message="No Records Found matching search and filters provided." />)
                      }
                    </div>
                  </div>
                  {/*<div className="row brand-list-table-manage-row px-4 h-10 align-items-center ">*/}
                  {/*  <div className="col">*/}
                  {/*    { viewerShip() }*/}
                  {/*  </div>*/}
                  {/*  <div className="col text-center">*/}
                  {/*    <PaginationNav list={this.state.brandList} offset={this.state.page.offset} size={this.state.page.size} callback={this.paginationCallback}/>*/}
                  {/*  </div>*/}
                  {/*  <div className="col text-right">*/}
                  {/*    {*/}
                  {/*      !!this.state.brandList.length && <span className="showing-content pr-2">Showing</span>*/}
                  {/*    }*/}
                  {/*    {*/}
                  {/*      !!this.state.brandList.length && <button type="button" className="btn btn-sm brand-count-toggle-btn dropdown-toggle px-4" data-toggle="dropdown"*/}
                  {/*        aria-haspopup="true" aria-expanded="false">*/}
                  {/*        {this.state.page.size} {CONSTANTS.BRAND.SECTION_TITLE_PLURAL} &nbsp;&nbsp;&nbsp;*/}
                  {/*      </button>*/}
                  {/*    }*/}

                  {/*    <div className="dropdown-menu brand-count-dropdown-menu">*/}
                  {/*      {*/}
                  {/*        this.state.page.sizeOptions.map(val => {*/}
                  {/*          return (<a key={val} className="dropdown-item"*/}
                  {/*            onClick={() => {this.changePageSize(val);}}> {val} {CONSTANTS.BRAND.SECTION_TITLE_PLURAL} </a>);*/}
                  {/*        })*/}
                  {/*      }*/}
                  {/*    </div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                  {/*<Paginator createFilters={this.createFilters} paginatedList={this.state.paginatedList} records={brands} section="BRAND" updateListAndFilters={this.updateListAndFilters} />*/}
                </div>
              </div>
              <Paginator createFilters={this.createFilters} paginatedList={this.state.paginatedList} records={brands} section="BRAND" updateListAndFilters={this.updateListAndFilters} />
            </div>
          </div>
        </div>
      </div>
    ) : <p>Access Denied</p>;
  }
}

BrandList.propTypes = {
  dispatchWidgetAction: PropTypes.func,
  toggleModal: PropTypes.func,
  saveBrandCompleted: PropTypes.func,
  brandEdit: PropTypes.object,
  showNotification: PropTypes.func,
  userProfile: PropTypes.object,
  widgetAction: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    brandEdit: state.brandEdit,
    filter: state.dashboard.filter,
    modal: state.modal,
    userProfile: state.user.profile,
    widgetAction: state.dashboard.widgetAction
  };
};

const mapDispatchToProps = {
  dispatchFilter,
  dispatchWidgetAction,
  toggleModal,
  saveBrandCompleted,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrandList);

