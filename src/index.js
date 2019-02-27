import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { Overview, Booking, BookingDetails, Bicycles, BicycleDetails, Customers, Locations, Basket } from './ansatt.js';
import { Card, Tabs, Row, Column, NavBar, SideNavBar, SideNavHeading, Button, Form, CenterContent } from './widgets';

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
        <div>
          <NavBar brand="SykkelUtleie9000" />

          <div id="logIn">
            <CenterContent>
              <Card header="Logg inn">
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
                {/*<div className="d-flex justify-content-center">
                  <NavLink to="#">Forgot your password?</NavLink>
                </div>*/}
              </Card>
            </CenterContent>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <NavBar brand="SykkelUtleie9000">
            <Button.Danger onClick={this.logout}>Logg ut</Button.Danger>
          </NavBar>
          <div>
            <Row>
              <SideNavBar>
                <SideNavHeading>
                  <span>MENY</span>
                </SideNavHeading>
                <SideNavBar.SideLink to="/overview">
                  <span data-feather="home" />
                  Oversikt<span className="sr-only">(current)</span>
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/booking/">
                  <span data-feather="file" />
                  Booking
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/locations/">
                  <span data-feather="shopping-cart" />
                  Lokasjoner
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/bicycles/">
                  <span data-feather="users" />
                  Sykler
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/customers/">
                  <span data-feather="bar-chart-2" />
                  Kundeliste
                </SideNavBar.SideLink>
                <SideNavHeading>
                  <span>MIN SIDE</span>
                </SideNavHeading>
                <SideNavBar.SideLink to="#">
                  <span data-feather="file-text" />
                  Informasjon
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="#">
                  <span data-feather="file-text" />
                  Mine salg
                </SideNavBar.SideLink>
              </SideNavBar>
            </Row>
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
    // history.push('/login/');
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
      <Route path="/bicycles/" component={Bicycles} />
      <Route exact path="/bicycles/:id" component={BicycleDetails} />
      <Route exact path="/customers/" component={Customers} />
      <Route exact path="/basket/" component={Basket} />
      <Route exact path="/locations/" component={Locations} />
      <Route exact path="/booking/bookingDetails/" component={BookingDetails} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
