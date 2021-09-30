import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../../styles/custom-components/pagination/pagination-nav.scss";
import leftCaret from "../../../images/caret_left.svg";
import rightCaret from "../../../images/caret_right.svg";

class PaginationNav extends React.Component {

  render() {
    const paginationButtons = [];
    const page = this.props.page;
    for (let i = 0; i < page.net.pagesCount; i++) {
      const navItem = (<li key={i} className={`page-item ${page.offset === i ? "active" : ""}`}
        onClick={() => {this.props.updatePage(i, page.size);}}>
        <a className="page-link" href="#">{i + 1}</a>
      </li>);
      paginationButtons.push(navItem);
    }

    const previousButton = (<li className="page-item" onClick={() => this.props.updatePage(page.offset - 1, page.size)}>
      <a className="page-link left" href="#" aria-label="Previous">
        <img className="arrow left" src={leftCaret}/>
      </a>
    </li>);

    const nextButton = (<li className="page-item" onClick={() => this.props.updatePage(page.offset + 1, page.size)}>
      <a className="page-link right" href="#" aria-label="Next">
        <img className="arrow right" src={rightCaret}/>
      </a>
    </li>);

    return (
      !!this.props.list.length &&
        <nav className="d-inline-block">
          <ul className="pagination pagination-sm justify-content-start align-items-center m-0">
            {previousButton}
            {paginationButtons}
            {nextButton}
          </ul>
        </nav>
    );
  }
}

PaginationNav.propTypes = {
  list: PropTypes.array,
  page: PropTypes.object,
  updatePage: PropTypes.func
};

export default connect()(PaginationNav);
