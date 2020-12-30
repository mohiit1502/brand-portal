import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PaginationNav from "../custom-components/pagination/pagination-nav";
import CONSTANTS from "../../constants/constants";
import './Paginator.component.scss';

class Paginator extends Component {

  constructor(props) {
    super(props);
    this.changePageSize = this.changePageSize.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.state = {
      list: [],
      page: {
        offset: 0,
        size: 10,
        net: {
          size: 0,
          pagesCount: 0
        },
        sizeOptions: [5, 10, 15, 20, 30],
        list: []
      }
    }
  }

  componentDidMount() {
    if (this.props.records.length && this.state.page.offset >= 0 && this.state.page.size >= 0) {
      this.updatePage(this.state.page.offset, this.state.page.size);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.records !== prevProps.records && this.state.page.offset >= 0 && this.state.page.size >= 0) {
      this.updatePage(this.state.page.offset, this.state.page.size);
    }
  }

  updatePage (offset, size) {
    const list = this.props.records;
    const pageState = {...this.state.page};
    pageState.size = size;
    pageState.net.size = list.length;
    pageState.net.pagesCount = Math.ceil(pageState.net.size / pageState.size);
    pageState.list = pageList;
    pageState.offset = offset >= pageState.net.pagesCount ? pageState.net.pagesCount - 1 : offset;
    const startIndex = pageState.offset * size;
    const endIndex = startIndex + size;
    const pageList = list.slice(startIndex, endIndex);

    if (pageState.offset < 0) return;
    const paginatedList = [...pageList];
    this.setState({list, page: pageState});
    this.props.updateListAndFilters(paginatedList);
  }

  changePageSize(size) {
    const page = {...this.state.page};
    page.size = size;
    this.setState({page}, () => this.updatePage(this.state.page.offset, size));
  }

  render() {
    const page = this.state.page;
    const records = this.props.records;
    const from = page.offset * page.size + 1;
    const to = page.offset * page.size + this.props.paginatedList.length;
    const total = records && records.length;
    let pageViewInfo = records && records.length ? <React.Fragment>
      Viewing <span className="count font-weight-bold" >{to >= from ? `${from} - ${to}` : 0}</span> of {total} {CONSTANTS[this.props.section].SECTION_TITLE_PLURAL}
    </React.Fragment> : ""

    const pageSizeSelector = records && records.length ?
      <React.Fragment>
        <span className="showing-content pr-2">Show</span>
        <button type="button" className="btn btn-sm count-toggle-btn dropdown-toggle px-4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {page.size} {CONSTANTS[this.props.section].SECTION_TITLE_PLURAL} &nbsp;&nbsp;&nbsp;
        </button>
        <div className="dropdown-menu count-dropdown-menu">
          {page.sizeOptions.map(val => <a key={val} className="dropdown-item" onClick={() => {this.changePageSize(val);}}>
            {val} {CONSTANTS[this.props.section].SECTION_TITLE_PLURAL}</a>)}
        </div>
      </React.Fragment> : null;

    return (
      <div className="c-Paginator row table-manage-row h-10 px-4 align-items-center">
        <div className="col text-left">{pageViewInfo}</div>
        <div className="col text-center">
          <PaginationNav list={records ? records : []} page={this.state.page} updatePage={this.updatePage}/>
        </div>
        <div className="col text-right">{pageSizeSelector}</div>
      </div>
    );
  }
}

Paginator.propTypes = {
  createFilters: PropTypes.func,
  filteredList: PropTypes.array,
  paginatedList: PropTypes.array,
  records: PropTypes.array,
  section: PropTypes.string,
  updateListAndFilters: PropTypes.func
};

Paginator.defaultProps = {
  paginatedList: [],
  records: []
}

export default Paginator;
