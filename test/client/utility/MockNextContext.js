import React from 'react'
import {MemoryRouter} from "react-router";

export default class MockNextContext extends React.Component {
  render () {
    return <MemoryRouter initialEntries={[this.props.pathname || ""]}>{this.props.children}</MemoryRouter>
  }
}
