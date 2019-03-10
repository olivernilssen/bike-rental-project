import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

// Renders an information card using Bootstrap styles
// Attributes: title
export class Card extends Component {
  render() {
    return (
      <div className="card" style={this.props.style}>
        <div className="card-header">{this.props.header}</div>
        <div className="card-body">
          <h5 className="card-title">{this.props.title}</h5>
          <div className="card-text">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

class ListItem extends Component {
  render() {
    return this.props.to ? (
      <NavLink className="list-group-item" activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    ) : (
      <li className="list-group-item">{this.props.children}</li>
    );
  }
}

export class List extends Component {
  static Item = ListItem;

  render() {
    return <ul className="list-group">{this.props.children}</ul>;
  }
}

class TabItem extends Component {
  render() {
    return this.props.to ? (
      <NavLink className="nav-link" activeClassName="active" to={this.props.to}>
        {this.props.children}
      </NavLink>
    ) : (
      <li className="nav-item" id="tab">
        {this.props.children}
      </li>
    );
  }
}

export class Tab extends Component {
  static Item = TabItem;

  render() {
    return <ul className="nav nav-tabs">{this.props.children}</ul>;
  }
}

// Renders a row using Bootstrap styles
export class Row extends Component {
  render() {
    return <div className="row">{this.props.children}</div>;
  }
}

// Renders a column with specified width using Bootstrap styles
// Properties: width, right
export class Column extends Component {
  render() {
    return (
      <div
        className={'col' + (this.props.width ? '-' + this.props.width : '') + (this.props.right ? ' text-right' : '')}
        style={this.props.style}
      >
        {this.props.children}
      </div>
    );
  }
}

// Renders a NavBar link using Bootstrap styles
// Attributes: exact, to
class NavBarLink extends Component {
  render() {
    return this.props.to ? (
      <NavLink className="nav-link" activeClassName="active" exact={this.props.exact} to={this.props.to}>
        {this.props.children}
      </NavLink>
    ) : (
      <li className="nav-item text-nowrap">{this.props.children}</li>
    );
  }
}

// Renders a NavBar using Bootstrap styles
// Attributes: brand
export class NavBar extends Component {
  static Link = NavBarLink;

  render() {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        {
          <NavLink className="navbar-brand col-sm-3 col-md-2 mr-0" activeClassName="active" exact to="/">
            {this.props.brand}
          </NavLink>
        }
        <ul className="navbar-nav px-3">{this.props.children}</ul>
      </nav>
    );
  }
}

class SideNavBarLink extends Component {
  render() {
    return this.props.to ? (
      <NavLink
        className="nav-link"
        activeClassName="active"
        exact={this.props.exact}
        to={this.props.to}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </NavLink>
    ) : (
      <li className="nav-item">{this.props.children}</li>
    );
  }
}

export class SideNavHeading extends Component {
  render() {
    return (
      <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        {this.props.children}
      </h6>
    );
  }
}

// Renders a NavBar using Bootstrap styles
// Attributes: brand
export class SideNavBar extends Component {
  static SideLink = SideNavBarLink;

  render() {
    return (
      <nav className="col-md-2 d-md-block bg-light sidebar" id="navbar">
        <div className="sidebar-sticky">
          <ul className="nav flex-column">{this.props.children}</ul>
        </div>
      </nav>
    );
  }
}

// Renders a success button using Bootstrap styles
// Attributes: onClick
class ButtonSuccess extends Component {
  render() {
    return (
      <button type="button" className="btn btn-success" onClick={this.props.onClick} style={this.props.style}>
        {this.props.children}
      </button>
    );
  }
}

// Renders a danger button using Bootstrap styles
// Attributes: onClick
class ButtonDanger extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-danger"
        id="dangerBtn"
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

// Renders a light button using Bootstrap styles
// Attributes: onClick
class ButtonLight extends Component {
  render() {
    return (
      <button type="button" className="btn btn-light" onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

// Renders a button using Bootstrap styles
export class Button {
  static Success = ButtonSuccess;
  static Danger = ButtonDanger;
  static Light = ButtonLight;
}

// Renders a form label using Bootstrap styles
class FormLabel extends Component {
  render() {
    return <label className="col-form-label">{this.props.children}</label>;
  }
}

// Renders a form input using Bootstrap styles
// Attributes: type, value, onChange, required, pattern
class FormInput extends Component {
  render() {
    return (
      <input
        className="form-control"
        type={this.props.type}
        value={this.props.value}
        onChange={this.props.onChange}
        required={this.props.required}
        pattern={this.props.pattern}
      />
    );
  }
}

export class CenterContent extends Component {
  render() {
    return <div className="d-flex justify-content-center">{this.props.children}</div>;
  }
}

class Thead extends Component {
  render() {
    return (
      <thead className="thead-dark">
        <tr>{this.props.children}</tr>
      </thead>
    );
  }
}

class Th extends Component {
  render() {
    return <th scope="col">{this.props.children}</th>;
  }
}

class Tbody extends Component {
  render() {
    return <tbody>{this.props.children}</tbody>;
  }
}

class Tr extends Component {
  render() {
    return <tr onClick={this.props.onClick}>{this.props.children}</tr>;
  }
}

class Td extends Component {
  render() {
    return <td>{this.props.children}</td>;
  }
}

export class Table extends Component {
  static Thead = Thead;
  static Tr = Tr;
  static Th = Th;
  static Td = Td;
  static Tbody = Tbody;

  render() {
    return <table className="table table-striped table-hover">{this.props.children}</table>;
  }
}

export class H1 extends Component {
  render() {
    return <h1 className="display-4">{this.props.children}</h1>;
  }
}

// Renders form components using Bootstrap styles
export class Form {
  static Label = FormLabel;
  static Input = FormInput;
}
