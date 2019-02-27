import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, Row, Column, NavBar, Button, Form } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { connection } from './mysql_connection';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

if (day < 10) {
  day = '0' + day;
}

if (month < 10) {
  month = '0' + month;
}

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
    this.hoursRenting = 0;
    this.state = {
      startDate: this.todaysDate,
      endDate: ''
    };
    this.bikes = {
      bike1: { type: 'Tandem', id: '123', brand: 'Merida', location: 'Voss' }
    };

    this.handlechangeStart = this.handlechangeStart.bind(this);
    this.handlechangeEnd = this.handlechangeEnd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleHourChange = this.handleHourChange.bind(this);
  }

  handlechangeStart(event) {
    this.setState({ startDate: event.target.value });
  }

  handlechangeEnd(event) {
    this.setState({ endDate: event.target.value });
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
  }

  handleSubmit(event) {
    this.props.history.push({
      pathname: '/booking/bookingDetails/',
      startDate: {
        startDate: this.state.startDate,
        endDate: this.state.end,
        dayRent: this.dayRent,
        bikes: this.bikes,
        hoursRenting: this.hoursRenting
      }
    });
  }

  render() {
    return (
      <div className="bootstrap-iso">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <h3>Booking</h3>
              <form onSubmit={this.handleSubmit}>
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
                    min={this.todaysDate}
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

                  <select name="locations">
                    <option value="">Any Location</option>
                    <option value="Voss">Voss</option>
                    <option value="Finnsnes">Finnsnes</option>
                    <option value="Røros">Røros</option>
                  </select>

                  <select name="bikeType">
                    <option value="">Any Type of bike</option>
                    <option value="citybike">City bike</option>
                    <option value="mountainbike">Mountain Bike</option>
                    <option value="tandem">Tandem</option>
                    <option value="dutchbike">Dutch Bike</option>
                    <option value="childbike">Childrens Bike</option>
                  </select>
                </div>

                {/* submit button */}
                <div className="form-group">
                  <input name="submit" type="submit" value="Submit" />
                  {/* <BookingDetails startDate={this.state.startDate} endDate={this.state.endDate} dayRent={this.dayRent} bikes={this.bikes} hoursRenting={this.hoursRenting}></BookingDetails> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class BookingDetails extends Component {
  render() {
    console.log(this.props.location.state);
    return (
      <div className="bootstrap-iso">
        <h3>Available bikes</h3>
      </div>
    );
  }
}

class Bicycles extends Component {
  bikeTypes = [];

  render() {
    return (
      <div className="bootstrap-iso">
        <Card title="Sykler">
          <Column right>
            <NavLink to={'/add/bikeType/'}>
              <Button.Light>Legg inn ny sykkeltype</Button.Light>
            </NavLink>
          </Column>
          <Tab>
            {this.bikeTypes.map(bike => (
              <Tab.Item key={bike.id} to={'/bicycles/' + bike.id}>
                {bike.typeName}
              </Tab.Item>
            ))}
          </Tab>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getBikeTypes(bikeTypes => {
      this.bikeTypes = bikeTypes;
    });
  }
}

class BicycleDetails extends Component {
  bike = null;
  bikes = [];

  render() {
    if (!this.bike) return null;

    return (
      <div>
        <Card>
          <Row>
            <Column width={6}>
              <Card>
                <h5>Sykler av typen {this.bike.typeName}</h5>
                <br />
                <Row>
                  <Column>
                    <List>
                      {this.bikes.map(bike => (
                        <List.Item key={bike.id}>{bike.id}</List.Item>
                      ))}
                    </List>
                  </Column>
                </Row>
              </Card>
            </Column>
          </Row>
        </Card>
      </div>
    );
  }

  mounted() {
    connection.query('select id from Bikes where type_id = ?)', [this.props.match.params.id], (error, results) => {
      if (error) return console.error(error);

      this.bikes = results;
    });
  }
}

class Locations extends Component {
  render() {
    return <h1>LOKASJONER</h1>;
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

module.exports = { Overview, Booking, BookingDetails, Bicycles, BicycleDetails, Locations, Customers, Basket };
