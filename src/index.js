import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import {
  Overview,
  BookingDetails,
  BikeTypes,
  BikeTypeDetails,
  BikeStatus,
  BikesByStatus,
  Customers,
  LocationList,
  BikesOnLocation,
  AllBikes,
  SelectedCustomer
} from './ansatt.js';

import { userInfo } from './minSide';

import { Booking } from './booking.js';
import { Basket } from './basket.js';

import {
  Card,
  Tabs,
  Link,
  Row,
  Column,
  NavBar,
  SideNavBar,
  SideNavHeading,
  Button,
  Form,
  CenterContent
} from './widgets';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/*
  HER SKAL ALLE ELEMENTER SETTES SAMMEN TIL FOR Å LAGE SELVE APPLIKASJONEN

  BRUKER IMPORT AV ELEMENTER SOM TRENGS FRA ANDRE .JS FILER
*/
export let basket = [];
export let employeeID = 1;

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
    this.state = { isLoggedIn: true, menu: false }; //Endre denne til false for å starte med innloggings portalen ved oppstart av applikasjon
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState({ menu: !this.state.menu });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const show = this.state.menu ? 'show' : '';

    if (isLoggedIn == false) {
      history.push('/login/');

      return (
        <div>
          <NavBar brand="CycleOn Rentals" />

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
          <NavBar brand="CycleOn Rentals">
            <Button.Danger onClick={this.logout}>Logg ut</Button.Danger>
          </NavBar>
          <div>
            <Row>
              <SideNavBar>
                <SideNavHeading>
                  <span>MENY</span>
                </SideNavHeading>
                <SideNavBar.SideLink to="/overview/">
                  Oversikt<span className="sr-only">(current)</span>
                </SideNavBar.SideLink>
                <SideNavBar.SideLink to="/booking/">Booking</SideNavBar.SideLink>
                <SideNavBar.SideLink to="/locations/1">Lokasjoner</SideNavBar.SideLink>
                <SideNavBar.SideLink to="/allBikes/" onClick={this.toggleMenu}>
                  Sykler
                </SideNavBar.SideLink>

                <div className={'collapse navbar-collapse ' + show}>
                  <div id="subLinks">
                    <SideNavBar.SideLink to="/bikeTypes/1">Etter sykkeltype</SideNavBar.SideLink>
                    <SideNavBar.SideLink to="/locations/1">Etter lokasjon</SideNavBar.SideLink>
                    <SideNavBar.SideLink to="/bikeStatus/OK">Etter status</SideNavBar.SideLink>
                    <SideNavBar.SideLink to="#">Etter pris</SideNavBar.SideLink>
                  </div>
                </div>

                <SideNavBar.SideLink to="/customers/">Kundeliste</SideNavBar.SideLink>
                <SideNavBar.SideLink to="/basket/">Handlekurv</SideNavBar.SideLink>
                <SideNavHeading>
                  <span>MIN SIDE</span>
                </SideNavHeading>
                <SideNavBar.SideLink to="/information/">Informasjon</SideNavBar.SideLink>
                <SideNavBar.SideLink to="#">Mine salg</SideNavBar.SideLink>
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
      history.push('/overview/');
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
      <Route exact path="/allBikes/" component={AllBikes} />
      <Route path="/bikeTypes/" component={BikeTypes} />
      <Route exact path="/bikeTypes/:id/" component={BikeTypeDetails} />
      <Route path="/bikeStatus/" component={BikeStatus} />
      <Route exact path="/bikeStatus/:bikeStatus/" component={BikesByStatus} />
      <Route path="/customers/" component={Customers} />
      <Route exact path="/customers/:id" component={SelectedCustomer} />
      <Route exact path="/basket/" component={Basket} />
      <Route path="/locations/" component={LocationList} />
      <Route exact path="/locations/:id" component={BikesOnLocation} />
      <Route exact path="/information/" component={userInfo} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
