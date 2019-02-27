import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, List, Row, Column, NavBar, Button, Form } from './widgets';
import { rentalService } from './services';

import createHashHistory from 'history/createHashHistory';
import { start } from 'repl';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

if (day < 10) day = '0' + day;

if (month < 10) month = '0' + month;

/*
    ELEMENTER FOR ALLE BRUKERE INKLUDERT VANLIGE ANSATTE OG ADMIN

    SKAL EXPORTERES
*/

class Overview extends Component {
  render() {
    return <h1>OVERSIKT</h1>;
  }
}

class Booking extends Component {
  constructor(props) {
    super(props);
    this.todaysDate = year + '-' + month + '-' + day;
    this.dayRent = false;
    this.state = {
      startDate: this.todaysDate,
      endDate: '',
      hoursRenting: 0,
      typeSelect: '*',
      locationSelect: '*'
    };

    this.handlechangeStart = this.handlechangeStart.bind(this);
    this.handlechangeEnd = this.handlechangeEnd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleHourChange = this.handleHourChange.bind(this);
  }

  handlechangeStart(event) {
    this.setState({ startDate: event.target.value });
    history.push('/booking/');
  }

  handlechangeEnd(event) {
    this.setState({ endDate: event.target.value });
    history.push('/booking/');
  }

  handleCheckChange(event) {
    if (this.dayRent == false) {
      this.dayRent = true;
    } else {
      this.dayRent = false;
    }
  }

  handleHourChange(event) {
    this.setState({ hoursRenting: event.target.value });
    history.push('/booking/');
  }

  handleSubmit() {
    this.props.history.push({
      pathname: '/booking/bookingDetails/',
      states: {
        startDate: this.state.startDate,
        typeSelect: this.state.typeSelect,
        locationSelect: this.state.locationSelect,
        endDate: this.state.endDate,
        dayRent: this.dayRent,
        bikes: this.state.bikes,
        hoursRenting: this.state.hoursRenting
      }
    });
  }

  handlelocationChange(event) {
    this.setState({ locationSelect: event.target.value });
    history.push('/booking/');
  }

  handleTypeChange(event) {
    this.setState({ typeSelect: event.target.value });
    history.push('/booking/');
  }

  render() {
    return (
      <div className="bootstrap-iso">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <h3>Booking</h3>
              <div>
                {/* Date entry */}
                <div className="form-group">
                  <input type="checkbox" checked={this.dayRent} onChange={this.handleCheckChange} value="Times leie?" />
                  <label> Times leie?</label>
                  <input
                    type="number"
                    disabled={!this.dayRent}
                    onChange={this.handleHourChange}
                    value={this.hoursRenting}
                  />
                  <br />
                  <input
                    type="date"
                    name="startDate"
                    disabled={this.dayRent}
                    min={this.state.todaysDate}
                    value={this.state.startDate}
                    onChange={this.handlechangeStart}
                  />

                  <input
                    type="date"
                    name="endDate"
                    disabled={this.dayRent}
                    min={this.state.startDate}
                    value={this.state.endDate}
                    onChange={this.handlechangeEnd}
                  />

                  <br />
                  <br />

                  <select name="locations" value={this.state.locationSelect} onChange={this.handlelocationChange}>
                    <option value="*">Any Location</option>
                    <option value="Voss">Voss</option>
                    <option value="Finnsnes">Finnsnes</option>
                    <option value="Røros">Røros</option>
                  </select>

                  <select name="bikeType" value={this.state.typeSelect} onChange={this.handleTypeChange}>
                    <option value="*">Any Type of bike</option>
                    <option value="City Bike">City bike</option>
                    <option value="mountainbike">Mountain Bike</option>
                    <option value="Tandem">Tandem</option>
                    <option value="Dutch Bike">Dutch Bike</option>
                    <option value="childbike">Childrens Bike</option>
                  </select>
                </div>

                {/* submit button */}
                <div className="form-group">
                  <button name="submit" type="button" onClick={this.handleSubmit}>
                    Søk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class BookingDetails extends Component {
  constructor(props) {
    super(props);
    this.bikes = [
      { type: 'Tandem', id: '111', name: 'Bike1', brand: 'Merida', location: 'Voss' },
      { type: 'Dutch Bike', id: '222', name: 'Bike2', brand: 'Merida', location: 'Finnsnes' },
      { type: 'City Bike', id: '333', name: 'Bike3', brand: 'Merida', location: 'Røros' }
    ];

    this.bikes4User = [];
  }

  render() {
    if (this.props.location.states == null) {
      history.push('/booking/');
    }

    return (
      <div className="bootstrap-iso">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <h3>Ledige Sykler</h3>
              <ul>
                {this.bikes4User.map(bike => (
                  <li key={bike.id}>
                    {bike.name} <br />
                    {bike.type} <br />
                    {bike.id} <br />
                    {bike.location} <br />
                    <br />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //SQL SPØRRING ved å bruke this.props.location.states.(startdate, enddate, dayrent etc)
  mounted() {
    for (let i = 0; i < this.bikes.length; i++) {
      if (this.props.location.states.locationSelect == '*' && this.props.location.states.typeSelect != '*') {
        if (this.bikes[i].type == this.props.location.states.typeSelect) {
          this.bikes4User.push(this.bikes[i]);
        }
      } else if (this.props.location.states.locationSelect != '*' && this.props.location.states.typeSelect == '*') {
        if (this.bikes[i].location == this.props.location.states.locationSelect) {
          this.bikes4User.push(this.bikes[i]);
        }
      } else if (this.props.location.states.locationSelect != '*' && this.props.location.states.typeSelect != '*') {
        if (
          this.bikes[i].type == this.props.location.states.typeSelect &&
          this.bikes[i].location == this.props.location.states.locationSelect
        ) {
          this.bikes4User.push(this.bikes[i]);
        }
      } else {
        this.bikes4User.push(this.bikes[i]);
      }
    }
  }
}

class Bicycles extends Component {
  render() {
    return <h1>SYKLER</h1>;
  }
}

class LocationList extends Component {
  locations = [];

  render() {
    return (
      <div className="container">
        <Card>
          <List>
            {this.locations.map(location => (
              <List.Item key={location.id} to={'/locations/' + location.id + '/bikes'}>
                {location.name}
              </List.Item>
            ))}
          </List>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.locations = locations;
    });
  }
}

class BikeOnLocation extends Component {
  bikeLocations = [];

  render() {
    return (
      <div className="container">
        <Card>
          <List>
            {this.bikeLocations.map(bikeLocation => (
              <List.Item key={bikeLocation.id} to={'/locations/' + location.id + '/bikes'}>
                {location.name}
              </List.Item>
            ))}
          </List>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getBikesByLocation(bikesByLocations => {
      this.bikesByLocations = bikesByLocations;
    });
  }
}

class Customers extends Component {
  render() {
    return <h1>KUNDER</h1>;
  }
}

class Basket extends Component {
  render() {
    return <h1>HANDLEKURV</h1>;
  }
}

module.exports = { Overview, Booking, BookingDetails, Bicycles, LocationList, BikeOnLocation, Customers, Basket };
