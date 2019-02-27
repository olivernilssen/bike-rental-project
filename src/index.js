import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { Overview, Booking, BookingDetails, Bicycles, Customers, Locations, Basket } from './ansatt.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/*
  HER SKAL ALLE ELEMENTER SETTES SAMMEN TIL FOR Å LAGE SELVE APPLIKASJONEN

  BRUKER IMPORT AV ELEMENTER SOM TRENGS FRA ANDRE .JS FILER
*/

let employeeID = 0;

/* Denne er her fordi om jeg det ikke blir pushet til en komponent,
så ser du alt av innhold fra tidligere komponenter selv etter utlogging */
class LoginMenu extends Component {
  render() {
    return <div />;
  }
}

/* Set state for menyen. Hva vises, alt etter hvem som er logget inn */
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: true }; //Endre denne til false for å starte med innloggings portalen ved oppstart av applikasjon
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    if (isLoggedIn == false) {
      history.push('/login/');
      return (
        <div className="container">
          <div className="d-flex justify-content-center h-100">
            <div className="card">
              <div className="card-header">
                <h3>Sign In</h3>
              </div>
              <div className="card-body">
                <form onSubmit={this.login}>
                  <div className="input-group form-group">
                    <input
                      type="text"
                      value={this.username}
                      onChange={event => (this.username = event.target.value)}
                      className="form-control"
                      placeholder="Employee Name"
                    />
                  </div>
                  <div className="input-group form-group">
                    <input
                      type="password"
                      value={this.password}
                      onChange={event => (this.password = event.target.value)}
                      className="form-control"
                      placeholder="Password"
                    />
                  </div>

                  <div className="form-group">
                    <input type="submit" value="Login" className="btn float-right login_btn" />
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-center">
                  <a href="#">Forgot your password?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">
              Company name
            </a>
            <input
              className="form-control form-control-dark w-100"
              type="text"
              placeholder="Search"
              aria-label="Search"
            />
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap">
                <a className="nav-link" href="#">
                  Sign out
                </a>
              </li>
            </ul>
          </nav>

          <div className="container-fluid">
            <div className="row">
              <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <a className="nav-link active" href="#">
                        <span data-feather="home" />
                        Dashboard <span className="sr-only">(current)</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file" />
                        Orders
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="shopping-cart" />
                        Products
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="users" />
                        Customers
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="bar-chart-2" />
                        Reports
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="layers" />
                        Integrations
                      </a>
                    </li>
                  </ul>

                  <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                    <span>Saved reports</span>
                    <a className="d-flex align-items-center text-muted" href="#">
                      <span data-feather="plus-circle" />
                    </a>
                  </h6>
                  <ul className="nav flex-column mb-2">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file-text" />
                        Current month
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file-text" />
                        Last quarter
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file-text" />
                        Social engagement
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        <span data-feather="file-text" />
                        Year-end sale
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>

              <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                  <h1 className="h2">Dashboard</h1>
                  <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group mr-2">
                      <button type="button" className="btn btn-sm btn-outline-secondary">
                        Share
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-secondary">
                        Export
                      </button>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                      <span data-feather="calendar" />
                      This week
                    </button>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    }
  }

  login(event) {
    //SPØRRING KREVES
    if (this.username == 'Oliver' && this.password == '1234') {
      employeeID = this.username; //Dette blir endret til en spørring
      this.setState({ isLoggedIn: true });
    } else if (this.username == null || this.password == null) {
      alert('Please type something!');
    } else {
      alert('log in name or password was wrong');
    }
  }

  logout() {
    history.push('/login/');
    this.setState({ isLoggedIn: false });
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu isLoggedIn={false} />

      <Route exact path="/login/" component={LoginMenu} />
      <Route exact path="/overview/" component={Overview} />
      <Route path="/booking/" component={Booking} />
      <Route exact path="/bicycles/" component={Bicycles} />
      <Route exact path="/customers/" component={Customers} />
      <Route exact path="/basket/" component={Basket} />
      <Route exact path="/locations/" component={Locations} />
      <Route exact path="/booking/bookingDetails/" component={BookingDetails} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
