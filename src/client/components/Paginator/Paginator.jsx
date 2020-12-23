import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PaginationNav from "../custom-components/pagination/pagination-nav";
import CONSTANTS from "../../constants/constants";
import './Paginator.component.scss';

class Paginator extends Component {

  constructor(props) {
    super(props);
    this.changePageSize = this.changePageSize.bind(this);
    this.paginationCallback = this.paginationCallback.bind(this);
    this.state = {
      page: {
        offset: 0,
        size: 10,
        sizeOptions: [5, 10, 15, 20, 30]
      }
    }
  }

  paginationCallback (page) {
    const pageState = {...this.state.page};
    pageState.offset = page.offset;
    pageState.size = page.size;
    const paginatedList = [...page.list];
    this.setState({page: pageState});
    this.props.updateListAndFilters(paginatedList);
  }

  changePageSize(size) {
    const page = {...this.state.page};
    page.size = size;
    this.setState({page});
  }

  render() {
    const page = this.state.page;
    const records = this.props.records;
    let pageViewInfo = "";
    const from = page.offset * page.size + 1;
    const to = page.offset * page.size + this.props.paginatedList.length;
    const total = records && records.length;
    if (records && records.length && to >= from) {
      pageViewInfo = <React.Fragment>Viewing <span className="count font-weight-bold" >{from} - {to}</span> of {total} {CONSTANTS[this.props.section].SECTION_TITLE_PLURAL}</React.Fragment>;
    } else if (records && records.length && to <= from) {
      pageViewInfo = <React.Fragment>Viewing <span className="count font-weight-bold" >0</span> of {total} {CONSTANTS[this.props.section].SECTION_TITLE_PLURAL}</React.Fragment>;
    }
    const pageSizeSelector = records && records.length &&
      <React.Fragment>
        <span className="showing-content pr-2">Show</span>
        <button type="button" className="btn btn-sm claim-count-toggle-btn dropdown-toggle px-4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {page.size} {CONSTANTS[this.props.section].SECTION_TITLE_PLURAL} &nbsp;&nbsp;&nbsp;
        </button>
        <div className="dropdown-menu claim-count-dropdown-menu">
          {page.sizeOptions.map(val => <a key={val} className="dropdown-item" onClick={() => {this.changePageSize(val);}}>
            {val} {CONSTANTS[this.props.section].SECTION_TITLE_PLURAL}</a>)}
        </div>
      </React.Fragment>

    return (
      <div className="c-Paginator row claim-list-table-manage-row h-10 align-items-center mx-4">
        <div className="col text-left">{ pageViewInfo }</div>
        <div className="col text-center"><PaginationNav list={records ? records : []} offset={page.offset} size={page.size} callback={this.paginationCallback}/></div>
        <div className="col text-right">{pageSizeSelector}</div>
      </div>
    );
  }
}

Paginator.propTypes = {
  createFilters: PropTypes.func,
  filteredList: PropTypes.array,
  paginationCallback: PropTypes.func,
  paginatedList: PropTypes.array,
  records: PropTypes.array,
  section: PropTypes.string,
  updateListAndFilters: PropTypes.func
};

export default Paginator;
