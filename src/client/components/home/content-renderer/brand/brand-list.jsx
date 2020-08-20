import React from "react";
import { connect } from "react-redux";
import "../../../../styles/home/content-renderer/brand/brand-list.scss";
import PropTypes from "prop-types";
import Dropdown from "../../../custom-components/dropdown/dropdown";
import {TOGGLE_ACTIONS, toggleModal} from "../../../../actions/modal-actions";
import ClientUtils from "../../../../utility/ClientUtils";
import Http from "../../../../utility/Http";
import searchIcon from "../../../../images/18-px-search.svg";
import filterIcon from "../../../../images/filter-sc.svg";
import burgerIcon from "../../../../images/group-23.svg";
import {saveBrandCompleted} from "../../../../actions/brand/brand-actions";
import PaginationNav from "../../../custom-components/pagination/pagination-nav";
import {showNotification} from "../../../../actions/notification/notification-actions";
import CustomTable from "../../../custom-components/table/custom-table";
import BrandListTable from "../../../custom-components/table/templates/brand-list-table";
import CONSTANTS from "../../../../constants/constants";
import AUTH_CONFIG from "./../../../../config/authorizations";
import restConfig from "./../../../../config/rest.js";
import "./../../../../styles/home/content-renderer/brand/brand-list.scss";
import NoRecordsMatch from "../../../custom-components/NoRecordsMatch/NoRecordsMatch";

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
    this.paginationCallback = this.paginationCallback.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.toggleFilterVisibility = this.toggleFilterVisibility.bind(this);
    this.editBrand = this.editBrand.bind(this);
    const userRole = props.userProfile && props.userProfile.role && props.userProfile.role.name;

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
      searchText: "",
      showFilters: false,
      loader: false,
      userRole,
      dropdown: {
        buttonText: burgerIcon,
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
      brandListColumns: [
        {
          Header: "#",
          accessor: "sequence",
          canSort: true
        },
        {
          Header: "BRAND NAME",
          accessor: "brandName"
        },
        {
          Header: "DATE ADDED",
          accessor: "dateAdded"
        },
        {
          Header: "STATUS",
          accessor: "brandStatus"
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

  editBrand (brandData) {
    const meta = { templateName: "NewBrandTemplate", data: {...brandData} };
    this.props.toggleModal(TOGGLE_ACTIONS.SHOW, {...meta});
  }

  async uiSearch (evt, isFilter, filteredBrands) {

    const searchText = evt ? evt.target.value && evt.target.value.toLowerCase() : this.state.searchText;
    const allBrands = filteredBrands ? filteredBrands : this.state.paginatedList;
    const filteredList = allBrands.filter(brand => {
      return brand.brandName && brand.brandName.toLowerCase().indexOf(searchText) !== -1
        || brand.dateAdded && brand.dateAdded.toLowerCase().indexOf(searchText) !== -1
        || brand.brandStatus && brand.brandStatus.toLowerCase().indexOf(searchText) !== -1;
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

    this.setState({brandList});
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

  applyFilters(isSearch, filteredList) {

    let paginatedList = filteredList ? [...filteredList] : [...this.state.paginatedList];
    this.state.filters.map(filter => {
      const filterOptionsSelected = filter.filterOptions.filter(filterOption => filterOption.selected && filterOption.value !== "all");

      if (filterOptionsSelected.length) {
        const filterId = filter.id;
        // console.log(filterId);
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
      name: "Profile Status",
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
    this.fetchBrands();
  }

  componentDidUpdate() {
    if (this.props.brandEdit.save) {
      this.fetchBrands();
      this.props.saveBrandCompleted();
    }
  }

  addNewBrand () {
    const meta = { templateName: "NewBrandTemplate" };
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
      const total = this.state.brandList.length;
      if (this.state.brandList.length && to >= from) {
        return `Viewing ${from} - ${to} of ${total} ${CONSTANTS.BRAND.SECTION_TITLE_PLURAL}`;
      } else if (this.state.brandList.length && to <= from) {
        return `Viewing 0 of ${total} ${CONSTANTS.BRAND.SECTION_TITLE_PLURAL}`;
      }
      return "";
    };

    const enableSectionAccess = restConfig.AUTHORIZATIONS_ENABLED ? this.state.userRole && AUTH_CONFIG.BRANDS.SECTION_ACCESS.map(role => role.toLowerCase()).includes(this.state.userRole.toLowerCase()) : true;
    const enableBrandCreate = restConfig.AUTHORIZATIONS_ENABLED ? this.state.userRole && AUTH_CONFIG.BRANDS.CREATE.map(role => role.toLowerCase()).includes(this.state.userRole.toLowerCase()) : true;
    return enableSectionAccess ? (
      <div className="row brand-list-content h-100">
        <div className="col h-100">

          <div className="row content-header-row p-4 h-10 mx-0">
            <div className="col">
              <h3>Your Brands</h3>
            </div>
          </div>
          <div className="row content-row p-4 h-90">
            <div className="col content-col h-100;">
              <div className="row action-row align-items-center mx-0">
                <div className="col-lg-8 col-6">
                  <div className={`btn btn-primary btn-sm px-3${!enableBrandCreate ? " disabled" : ""}`} onClick={enableBrandCreate && this.addNewBrand}>
                    New Brand
                  </div>
                </div>
                <div className="col-lg-4 col-6 text-right">
                  <div className="input-group input-group-sm">
                    <div className="input-group-prepend bg-transparent">
                      <div className="input-group-text bg-transparent">
                        <img src={searchIcon} className="Group-23" />
                      </div>
                    </div>
                    <input id="search-box" className="form-control form-control-sm border-left-0 shadow-none" type="search" placeholder="Search by Brand Name"
                      onChange={(evt) => this.uiSearch(evt, false)}/>
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
              <div className={`row brand-list-row align-items-start${this.state.loader && " loader"}`}>
                <div className="col pt-4 h-100">
                  <div className="row brand-list-table-row h-90">
                    <div className="col h-100 overflow-auto">
                      {
                        this.state.filteredList.length > 0 ?
                        <CustomTable data={[...this.state.filteredList]} columns={this.state.brandListColumns} template={BrandListTable}
                          templateProps={{Dropdown, dropdownOptions: this.state.dropdown, userProfile: this.props.userProfile}}/> : <NoRecordsMatch message="No Records Found matching search and filters provided." />
                      }
                    </div>
                  </div>
                  <div className="row brand-list-table-manage-row h-10 align-items-center mx-4">
                    <div className="col">
                      { viewerShip() }
                    </div>
                    <div className="col text-center">
                      <PaginationNav list={this.state.brandList} offset={this.state.page.offset} size={this.state.page.size} callback={this.paginationCallback}/>
                    </div>
                    <div className="col text-right">

                      {
                        !!this.state.brandList.length && <button type="button" className="btn btn-sm brand-count-toggle-btn dropdown-toggle px-4" data-toggle="dropdown"
                          aria-haspopup="true" aria-expanded="false">
                          Show {this.state.page.size} {CONSTANTS.BRAND.SECTION_TITLE_PLURAL} &nbsp;&nbsp;&nbsp;
                        </button>
                      }

                      <div className="dropdown-menu brand-count-dropdown-menu">
                        {
                          this.state.page.sizeOptions.map(val => {
                            return (<a key={val} className="dropdown-item"
                              onClick={() => {this.changePageSize(val);}}> Show {val} {CONSTANTS.BRAND.SECTION_TITLE_PLURAL} </a>);
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

BrandList.propTypes = {
  toggleModal: PropTypes.func,
  saveBrandCompleted: PropTypes.func,
  brandEdit: PropTypes.object,
  showNotification: PropTypes.func,
  userProfile: PropTypes.object
};

const mapStateToProps = state => {
  return {
    brandEdit: state.brandEdit,
    modal: state.modal,
    userProfile: state.userProfile
  };
};

const mapDispatchToProps = {
  toggleModal,
  saveBrandCompleted,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrandList);

