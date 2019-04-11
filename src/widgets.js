import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

/* Renders the different Bootstrap-based
visual components the application is built from */


//Used to box content throughout the application
export class Card extends Component {
  render() {
    return (
      <div className="card" style={this.props.style} id={this.props.id}>
        <div className="card-header">{this.props.header}</div>
        <div className="card-body">
          <h5 className="card-title">{this.props.title}</h5>
          <div className="card-text">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

//Entries in tables
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

//Table itself
export class Tab extends Component {
  static Item = TabItem;

  render() {
    return (
      <ul className="nav nav-tabs" id={this.props.id} role="navigation" aria-label={this.props.ariaLabel}>
        {this.props.children}
      </ul>
    );
  }
}

//Horizontal formating of content
export class Row extends Component {
  render() {
    return <div className="row">{this.props.children}</div>;
  }
}

//Vertical formating of content
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

//Horizontal navigation bar links
class NavBarLink extends Component {
  render() {
    return this.props.to ? (
      <NavLink
        className="nav-link"
        activeClassName="active"
        exact={this.props.exact}
        to={this.props.to}
        accessKey={this.props.accessKey}
      >
        {this.props.children}
      </NavLink>
    ) : (
      <li className="nav-item text-nowrap">{this.props.children}</li>
    );
  }
}

//The horizontal navigation bar itself
export class NavBar extends Component {
  static Link = NavBarLink;

  render() {
    return (
      <nav
        id="top-navbar"
        className="navbar navbar-dark fixed-top bg-dark d-flex justify-content-start flex-md-nowrap p-0 shadow"
        role="banner"
      >
        {
          <NavLink className="navbar-brand" activeClassName="active" to="/#/">
            {this.props.brand}
          </NavLink>
        }
        <ul className="navbar-nav px-3">{this.props.children}</ul>
      </nav>
    );
  }
}

//Links on the navigation bar on the left side of the page
class SideNavBarLink extends Component {
  render() {
    return this.props.to ? (
      <NavLink
        diabled={this.props.diabled}
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

//Headings on the navigation bar on the left side
export class SideNavHeading extends Component {
  render() {
    return (
      <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        {this.props.children}
      </h6>
    );
  }
}

//The navigation bar on the left side itself
export class SideNavBar extends Component {
  static SideLink = SideNavBarLink;

  render() {
    return (
      <nav className="col-md-2 d-md-block bg-light sidebar" id="navbar" role="navigation" aria-label="Main">
        <div className="sidebar-sticky">
          <ul className="nav flex-column">{this.props.children}</ul>
        </div>
      </nav>
    );
  }
}

//Red buttons
class ButtonDanger extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-danger"
        id={this.props.id}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

//Minimalistic buttons
class ButtonLight extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-light"
        onClick={this.props.onClick}
        data-toggle={this.props.dataToggle}
        data-target={this.props.dataTarget}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

//Blue button
class ButtonInfo extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-info"
        onClick={this.props.onClick}
        data-toggle={this.props.dataToggle}
        data-target={this.props.dataTarget}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

/* Exports various button types, allowing
 you to refer to them as Button.Danger etc. */

export class Button {
  static Danger = ButtonDanger;
  static Light = ButtonLight;
  static Info = ButtonInfo;
}

//More subtle version of the green button
class ButtonSuccessOutline extends Component {
  render() {
    return (
      <button type="button" className="btn btn-outline-success" onClick={this.props.onClick} style={this.props.style}>
        {this.props.children}
      </button>
    );
  }
}

//More subtle version of the green button
class ButtonDangerOutline extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-outline-danger"
        id={this.props.id}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

//More subtle version of the blue button
class ButtonInfoOutline extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-outline-info"
        id={this.props.id}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

//More subtle version of the green button
class ButtonSubmitOutline extends Component {
  render() {
    return (
      <button
        type="submit"
        className="btn btn-outline-primary"
        id={this.props.id}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

//More subtle version of a gray button
class ButtonSecondaryOutline extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-outline-secondary"
        id={this.props.id}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

//More subtle version of the minimalistic button
class ButtonLightOutline extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-outline-light"
        id={this.props.id}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

//Subtle version of a black button
class ButtonDarkOutline extends Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-outline-dark"
        id={this.props.id}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </button>
    );
  }
}

/* Exports various button types, allowing
 you to refer to them as ButtonOutline.Danger etc. */

export class ButtonOutline {
  static Success = ButtonSuccessOutline;
  static Danger = ButtonDangerOutline;
  static Info = ButtonInfoOutline;
  static Secondary = ButtonSecondaryOutline;
  static Light = ButtonLightOutline;
  static Dark = ButtonDarkOutline;
  static Submit = ButtonSubmitOutline;
}

// Styling for labels on input forms
class FormLabel extends Component {
  render() {
    return (
      <label className="col-form-label" htmlFor={this.props.for}>
        {this.props.children}
      </label>
    );
  }
}

//The input forms themselves
class FormInput extends Component {
  render() {
    return (
      <input
        className="form-control"
        type={this.props.type}
        name={this.props.name}
        disabled={this.props.disabled}
        min={this.props.min}
        value={this.props.value}
        onChange={this.props.onChange}
        required={this.props.required}
        pattern={this.props.pattern}
        placeholder={this.props.placeholder}
        checked={this.props.checked}
        width={this.props.width}
        style={this.props.style}
        min={this.props.min}
      />
    );
  }
}

//The items in a selection form that drops down
class Option extends Component {
  render() {
    return (
      <option selected={this.props.selected} value={this.props.value} id={this.props.id} data-key={this.props.dataKey}>
        {this.props.children}
      </option>
    );
  }
}

//The drop-down selection form itself
export class Select extends Component {
  static Option = Option;

  render() {
    return (
      <select
        className="custom-select my-1 mr-sm-2"
        onChange={this.props.onChange}
        name={this.props.name}
        value={this.props.value}
      >
        {this.props.children}
      </select>
    );
  }
}

// Used to center content on a page like the login screen
export class CenterContent extends Component {
  render() {
    return (
      <div className="d-flex justify-content-center" id={this.props.id}>
        {this.props.children}
      </div>
    );
  }
}


/*

  The rest of the widgets is just stylizing
  for various table elements.

*/

class Thead extends Component {
  render() {
    return (
      <thead className="thead-light">
        <tr>{this.props.children}</tr>
      </thead>
    );
  }
}

class Th extends Component {
  render() {
    return (
      <th scope="col" width={this.props.width}>
        {this.props.children}
      </th>
    );
  }
}

class Tbody extends Component {
  render() {
    return <tbody>{this.props.children}</tbody>;
  }
}

class Tr extends Component {
  render() {
    return (
      <tr style={this.props.style} onClick={this.props.onClick}>
        {this.props.children}
      </tr>
    );
  }
}

class Td extends Component {
  render() {
    return <td width={this.props.width}>{this.props.children}</td>;
  }
}

export class ClickTable extends Component {
  static Thead = Thead;
  static Tr = Tr;
  static Th = Th;
  static Td = Td;
  static Tbody = Tbody;

  render() {
    return (
      <div className="table-responsive">
        <table className="table table-hover" aria-label="Clickable table">
          {this.props.children}
        </table>
      </div>
    );
  }
}

export class Table extends Component {
  static Thead = Thead;
  static Tr = Tr;
  static Th = Th;
  static Td = Td;
  static Tbody = Tbody;

  render() {
    return (
      <div className="table-responsive box-shadow--3dp">
        <table className="table" style={this.props.style}>
          {this.props.children}
        </table>
      </div>
    );
  }
}

// Renders form components using Bootstrap styles
export class Form {
  static Label = FormLabel;
  static Input = FormInput;
}
