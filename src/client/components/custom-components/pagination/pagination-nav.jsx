import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";


class PaginationNav extends React.Component {

  constructor(props) {
    super(props);
    this.updatePage = this.updatePage.bind(this);

    this.state = {
      list: [],
      page: {
        offset: 0,
        size: 0,
        net: {
          size: 0,
          pagesCount: 0
        },
        list: []
      }
    };
  }

  updatePage (list, offset, size) {
    //console.log(offset >= this.state.page.net.pagesCount || offset < 0)

    const startIndex = offset * size;
    const endIndex = startIndex + size;
    const pageList = list.slice(startIndex, endIndex);

    const pageState = {...this.state.page};
    pageState.offset = offset;
    pageState.size = size;
    pageState.net.size = list.length;
    pageState.net.pagesCount = Math.ceil(pageState.net.size / pageState.size);
    pageState.list = pageList;

    if (pageState.offset >= pageState.net.pagesCount || pageState.offset < 0) {
      return;
    }

    this.setState({list, page: pageState});
    this.props.callback(pageState);
  }

  componentDidMount() {
    if (this.props.list.length && this.props.offset >= 0 && this.props.size >= 0) {
      this.updatePage(this.props.list, this.props.offset, this.props.size);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props && this.props.list.length && this.props.offset >= 0 && this.props.size >= 0) {
      this.updatePage(this.props.list, this.props.offset, this.props.size);
    }
  }

  render() {
    const paginationNav = [];
    for (let i = 0; i < this.state.page.net.pagesCount; i++) {
      const navItem = (<li key={i} className={`page-item ${this.state.page.offset === i ? "active" : ""}`}
        onClick={() => {this.updatePage(this.state.list, i, this.state.page.size);}}>
        <a className="page-link" href="#">{i + 1}</a>
      </li>);
      paginationNav.push(navItem);
    }

    return (
      !!this.state.list.length &&
        <nav>
          <ul className="pagination pagination-sm justify-content-center align-items-center m-0">
            <li className="page-item"
                onClick={() => {this.updatePage(this.state.list, this.state.page.offset - 1, this.state.page.size);}}>
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true"> &lt; </span>
              </a>
            </li>
            {paginationNav}
            <li className="page-item"
              onClick={() => {this.updatePage(this.state.list, this.state.page.offset + 1, this.state.page.size);}}>
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true"> &gt; </span>
              </a>
            </li>
          </ul>
        </nav>
    );
  }
}


PaginationNav.propTypes = {
  list: PropTypes.array,
  offset: PropTypes.number,
  size: PropTypes.number,
  callback: PropTypes.func
};

const mapStateToProps = state => state;


export default connect(
  mapStateToProps,
  dispatch => ({ dispatch })
)(PaginationNav);
