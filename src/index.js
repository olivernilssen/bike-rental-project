import * as React from 'react';
import { Component, sharedComponentData } from 'react-simplified';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import {
  BikeTypes,
  BikeTypeDetails,
  NewBikeType,
  BikeStatus,
  BikesByStatus,
  AllBikes,
  AddBikes,
  SelectedBike
} from './bikes.js';

import { AreaList, AddArea, LocationInArea, AddLocation, BikesOnLocation } from './location';
import { UserInfo, EditUserInfo, MySales, DetailedOrder } from './myPage';
import { Customers, AddCustomer } from './customer.js';
import { Booking } from './booking.js';
import { Basket, EquipmentQuery } from './basket.js';
import { Overview } from './overview.js';
import { Orders } from './orders.js';
import { EquipmentTypes, EquipTypeDetails, AddEquipment } from './equipment.js';
import { Employees, AddEmployee } from './employee.js';

import { Card, Row, NavBar, SideNavBar, SideNavHeading, Button, Form, CenterContent } from './widgets';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faCoffee,
  faShoppingCart,
  faBicycle,
  faCalendar,
  faMapMarkerAlt,
  faUsers,
  faArchive,
  faPlusCircle,
  faStore,
  faSortDown,
  faPlus,
  faPercent
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faCoffee,
  faChartPie,
  faShoppingCart,
  faBicycle,
  faCalendar,
  faMapMarkerAlt,
  faUsers,
  faArchive,
  faPlusCircle,
  faStore,
  faSortDown,
  faPlus,
  faPercent
);

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

/*
  FOR Å TESTE INNLOGGIN BRUK
  BRUKERNAVN: Peter001 PASSORD: 1234 FOR EN SELGER
  BRUKERNAVN: Karl003 PASSORD: 1234 FOR EN ADMIN
  !OBS OBS!

  FOR Å SLIPPE Å LOGGE INN HVER GANG DU OPPDATERER MED CTRL+R UNDER INSPEKSJON AV APPLIKASJONEN
  ENDRE FØLGENDE VARIABLER:
    employeeID = 1 for selger ELLER employeeID = 3 for en Admin.
    state.isLoggedIn = true. (DENNE LIGGER I KOMPONENTEN MENU)
*/
export const shared = sharedComponentData({ basketLength: 0 });
export let basket = [];
export let equipmentBasket = [];
export let employeeID = null;
export const activeCustomer = [{ id: null, lastName: '', firstName: '' }];

/**
 * Login menu component which is called if the user is not
 * logged in, or the log in information is false.
 */
class LoginMenu extends Component {
  state = {
    username: '',
    password: '',
    userinfo: null
  };

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals" />
        <div id="loggInBg">
          <CenterContent>
            <Card id="logg" header="Logg inn">
              <form onSubmit={this.login}>
                <div className="input-group form-group">
                  <Form.Input
                    type="text"
                    onChange={event => (this.state.username = event.target.value)}
                    className="form-control"
                    placeholder="Employee Username"
                  />
                </div>
                <div className="input-group form-group">
                  <Form.Input
                    type="password"
                    onChange={event => (this.state.password = event.target.value)}
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <Form.Input type="submit" value="Login" className="btn float-right login_btn" />
                </div>
              </form>
            </Card>
          </CenterContent>
        </div>
      </div>
    );
  }

  login() {
    rentalService.getLoginInfo(this.state.username, results => {
      if (results.length == 0 || results === undefined) {
        alert('Brukernavnet er ugyldig, Please try again');
        return;
      }

      this.setState({ userinfo: results[0] });

      if (
        this.state.username == null ||
        this.state.password == null ||
        this.state.username == '' ||
        this.state.password == ''
      ) {
        alert('One or more fields are empty, Please try again');
      } else if (this.state.password != this.state.userinfo.password) {
        alert('Password is wrong, contact Admin');
      } else if (this.state.password == this.state.userinfo.password) {
        employeeID = this.state.userinfo.user_id;
        this.props.isLoggedIn(true);
        history.push('/overview/');
      } else {
        alert('log in name or password was wrong');
      }
    });
  }
}

/* Set state for menyen. Hva vises, alt etter hvem som er logget inn */
class Menu extends Component {
  state = {
    user: null,
    adminIDs: [],
    Localbasket: this.props.Mybasket,
    isLoggedIn: false,
    bikeMenu: false,
    admin: false
  };

  /**
   * Get login data based on what happens in the child
   * component in LoginMenu
   * This data will be used to check if the used is
   * logged in, and what type of user it is.
   * @param {*} data
   */
  getLoginData(data) {
    this.setState({ isLoggedIn: data });

    if (employeeID != 0 || employeeID != null || employeeID != '') {
      rentalService.getEmployee(employeeID, result => {
        console.log(result);
        this.setState({ user: result });
      });

      //this should be checking towards all users that are
      //admin, but unfortunalty time has limited us
      for (let i = 0; i < this.state.adminIDs.length; i++) {
        if (employeeID == this.state.adminIDs[i].worker_id) {
          this.setState({ admin: true });
        }
      }
    }
  }

  //Whenever the this.props.Mybasket is updated, call
  //this function.
  componentWillReceiveProps(nextProps) {
    console.log('Will recieve Props');
    this.setState({ Localbasket: nextProps.Mybasket });
  }

  //Endre denne til false for å starte med innloggings portalen ved oppstart av applikasjon
  toggleBikeMenu() {
    this.setState({ bikeMenu: !this.state.bikeMenu });
  }

  toggleMenu() {
    this.setState({ bikeMenu: false });
  }

  render() {
    const spanstyle = {
      height: '22px',
      width: '22px',
      backgroundColor: '#DF4444',
      color: 'white',
      borderRadius: '50%',
      display: 'inline-block',
      textAlign: 'center'
    };

    if (basket.length === 0) {
      spanstyle.display = 'none';
    }

    //This will change depending on if they equal true or false
    const isLoggedIn = this.state.isLoggedIn;
    const showBike = this.state.bikeMenu ? 'show' : '';
    const hideAdmin = this.state.admin ? '' : 'hide';

    if (isLoggedIn == false) {
      history.push('');
      return <LoginMenu isLoggedIn={this.getLoginData} />;
    } else {
      return (
        <div>
          <NavBar brand="CycleOn Rentals" to="/overview/" />
          <Row>
            <SideNavBar>
              <SideNavHeading>
                <span>MENY</span>
              </SideNavHeading>
              <SideNavBar.SideLink onClick={this.toggleMenu} to="/overview/">
                <FontAwesomeIcon className="navIcon" icon="chart-pie" />
                Oversikt
              </SideNavBar.SideLink>
              <SideNavBar.SideLink onClick={this.toggleMenu} to="/booking/">
                <FontAwesomeIcon className="navIcon" icon="calendar" />
                Booking
              </SideNavBar.SideLink>
              <SideNavBar.SideLink onClick={this.toggleMenu} to="/area/1/1">
                <FontAwesomeIcon className="navIcon" icon="map-marker-alt" />
                Lokasjoner
              </SideNavBar.SideLink>
              <SideNavBar.SideLink onClick={this.toggleBikeMenu} to="/allBikes/">
                <FontAwesomeIcon className="navIcon" icon="bicycle" />
                Sykler
                <FontAwesomeIcon id="dropdownBike" icon="sort-down" />
              </SideNavBar.SideLink>

              <div className={'collapse navbar-collapse ' + showBike}>
                <div className="subLinks">
                  <SideNavBar.SideLink to="/allBikes/">- Alle sykler</SideNavBar.SideLink>
                  <SideNavBar.SideLink to="/bikeTypes/Terreng">- Etter sykkeltype</SideNavBar.SideLink>
                  <SideNavBar.SideLink to="/area/1/1">- Etter lokasjon</SideNavBar.SideLink>
                  <SideNavBar.SideLink to="/bikeStatus/OK">- Etter status</SideNavBar.SideLink>
                </div>
              </div>
              <SideNavBar.SideLink onClick={this.toggleMenu} to="/equipmentTypes/Helmet">
                <FontAwesomeIcon className="navIcon" icon="plus-circle" />
                Sykkelutstyr
              </SideNavBar.SideLink>
              <SideNavBar.SideLink onClick={this.toggleMenu} to="/orders/">
                <FontAwesomeIcon className="navIcon" icon="archive" />
                Ordrer
              </SideNavBar.SideLink>
              <SideNavBar.SideLink onClick={this.toggleMenu} to="/customers/">
                <FontAwesomeIcon className="navIcon" icon="users" />
                Kundeliste
              </SideNavBar.SideLink>
              <SideNavBar.SideLink onClick={this.toggleMenu} to="/basket/">
                <FontAwesomeIcon className="navIcon" icon="shopping-cart" />
                Handlekurv <span style={spanstyle}>{shared.basketLength}</span>
              </SideNavBar.SideLink>
              <SideNavHeading>
                <span>Min Side</span>
              </SideNavHeading>
              <SideNavBar.SideLink onClick={this.toggleMenu} to="/information/">
                Informasjon
              </SideNavBar.SideLink>
              <SideNavBar.SideLink onClick={this.toggleMenu} to="/MySales">
                Mine salg
              </SideNavBar.SideLink>
              <div className={hideAdmin}>
                <SideNavBar.SideLink onClick={this.toggleMenu} to="/employees">
                  Ansatte
                </SideNavBar.SideLink>
              </div>
              <SideNavBar.SideLink>
                <Button.Danger id="loggutKnapp" onClick={this.logout}>
                  Logg ut
                </Button.Danger>
              </SideNavBar.SideLink>
            </SideNavBar>
          </Row>
        </div>
      );
    }
  }

  //Log out of the application, set isLoggedin = false
  //and push to login menu and reset the given
  //username and password
  logout() {
    this.setState({ isLoggedIn: false });
    this.state.username = '';
    this.state.password = '';
    this.setState({ admin: false });
    history.push('/login/');
  }

  mounted() {
    rentalService.getArea(area => {
      this.area = area;
    });

    if (employeeID != 0 || employeeID != null || employeeID != '') {
      rentalService.getEmployee(employeeID, result => {
        this.setState({ user: result });
      });
    }

    rentalService.getAdminID(Ids => {
      this.state.adminIDs = Ids;
    });
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu Mybasket={basket} />
      <Route exact path="/overview/" component={Overview} />
      <Route path="/booking/" component={Booking} />
      <Route exact path="/equipmentQuery/:id/edit" component={EquipmentQuery} />

      <Route exact path="/allBikes/" component={AllBikes} />
      <Route path="/bikeTypes/" component={BikeTypes} />
      <Route exact path="/addBikeType/" component={NewBikeType} />
      <Route exact path="/bikeTypes/:typeName/" component={BikeTypeDetails} />
      <Route exact path="/addBikes/" component={AddBikes} />
      <Route exact path="/selectedBike/:id" component={SelectedBike} />

      <Route path="/bikeStatus/" component={BikeStatus} />
      <Route exact path="/bikeStatus/:bikeStatus/" component={BikesByStatus} />
      <Route path="/orders/" component={Orders} />
      <Route path="/customers/" component={Customers} />
      <Route exact path="/addCustomer/" component={AddCustomer} />
      <Route path="/area/" component={AreaList} />
      <Route exact path="/addArea" component={AddArea} />
      <Route path="/area/:area_id" component={LocationInArea} />
      <Route exact path="/area/:area_id/:id" component={BikesOnLocation} />
      <Route exact path="/addLocation/" component={AddLocation} />

      <Route path="/equipmentTypes/" component={EquipmentTypes} />
      <Route exact path="/equipmentTypes/:typeName/" component={EquipTypeDetails} />
      <Route exact path="/equipments/add" component={AddEquipment} />
      <Route exact path="/basket/" component={Basket} />

      <Route exact path="/information/" component={UserInfo} />
      <Route exact path="/EditUserInfo" component={EditUserInfo} />
      <Route exact path="/MySales/" component={MySales} />
      <Route path="/MySales/:id/edit" component={DetailedOrder} />
      <Route path="/employees/" component={Employees} />
      <Route exact path="/addEmployee/" component={AddEmployee} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
