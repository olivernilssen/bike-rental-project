import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { connection } from './mysql_connection';

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

    this.allBikes = [
      {
        type: 'Tandem',
        id: '111',
        brand: 'Bike1',
        brand: 'Merida',
        location: 'Voss',
        framesize: "15'",
        hrPrice: '100',
        year: '2019',
        weight: '15kg'
      },
      {
        type: 'Dutch Bike',
        id: '222',
        brand: 'Bike2',
        brand: 'KLM',
        location: 'Finnsnes',
        framesize: "19'",
        hrPrice: '50',
        year: '2011',
        weight: '15kg'
      },
      {
        type: 'City Bike',
        id: '333',
        brand: 'Bike3',
        brand: 'Jonnsen',
        location: 'Røros',
        framesize: "12'",
        hrPrice: '120',
        year: '2017',
        weight: '12kg'
      }
    ];

    this.availableBikes = this.allBikes;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleCheckChange() {
    if (this.dayRent == false) {
      this.dayRent = true;
    } else {
      this.dayRent = false;
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.findAvailBikes();
  }

  handleSubmit() {
    this.findAvailBikes();
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div>
            <h3>Booking</h3>
            <div>
              {/* Date entry */}
              <div className="form-group">
                <input
                  type="checkbox"
                  name="dayRent"
                  checked={this.dayRent}
                  onChange={this.handleCheckChange}
                  value="Times leie?"
                />
                <label> Times leie?</label>
                <input
                  type="number"
                  name="hoursRenting"
                  disabled={!this.dayRent}
                  onChange={this.handleChange}
                  value={this.hoursRenting}
                />
                <br />
                <input
                  type="date"
                  name="startDate"
                  disabled={this.dayRent}
                  min={this.state.todaysDate}
                  value={this.state.startDate}
                  onChange={this.handleChange}
                />

                <input
                  type="date"
                  name="endDate"
                  disabled={this.dayRent}
                  min={this.state.startDate}
                  value={this.state.endDate}
                  onChange={this.handleChange}
                />

                <br />
                <br />

                <select name="locationSelect" value={this.state.locationSelect} onChange={this.handleChange}>
                  <option value="*">Any Location</option>
                  <option value="Voss">Voss</option>
                  <option value="Finnsnes">Finnsnes</option>
                  <option value="Røros">Røros</option>
                </select>

                <select name="typeSelect" value={this.state.typeSelect} onChange={this.handleChange}>
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

        <div className="row">
          <div>
            <h3>Ledige Sykler</h3>
            <Card>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Hjul</Table.Th>
                  <Table.Th>Vekt</Table.Th>
                  <Table.Th>Times Pris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.availableBikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.type}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.location}</Table.Td>
                      <Table.Td>{bike.framesize}</Table.Td>
                      <Table.Td>{bike.weight}</Table.Td>
                      <Table.Td>{bike.hrPrice}</Table.Td>
                      <Table.Td>
                        <Button.Success onClick={this.detailBike(bike)}>Velg</Button.Success>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  detailBike(bike) {
    //Do something here
    // this.props.history.push("/bikedetails/" + bike.id);
  }

  //SQL SPØRRING HER
  findAvailBikes() {
    this.availableBikes = [];

    for (let i = 0; i < this.allBikes.length; i++) {
      if (this.state.locationSelect == '*' && this.state.typeSelect != '*') {
        if (this.allBikes[i].type == this.state.typeSelect) {
          this.availableBikes.push(this.allBikes[i]);
        }
      } else if (this.state.locationSelect != '*' && this.state.typeSelect == '*') {
        if (this.allBikes[i].location == this.state.locationSelect) {
          this.availableBikes.push(this.allBikes[i]);
        }
      } else if (this.state.locationSelect != '*' && this.state.typeSelect != '*') {
        if (this.allBikes[i].type == this.state.typeSelect && this.allBikes[i].location == this.state.locationSelect) {
          this.availableBikes.push(this.allBikes[i]);
        }
      } else {
        this.availableBikes.push(this.allBikes[i]);
      }
    }

    if (this.availableBikes.length == 0) {
      this.availableBikes.push({ name: 'Ingenting tilgjengelig i denne kategorien', id: 'Gjør et nytt søk' });
    }
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
  bikeType = null;
  bikeTypeDetails = [];
  bikes = [];

  render() {
    if (!this.bikeType) return null;

    return (
      <div>
        <Card>
          <Row>
            <Column>
              <h6>Detaljert beskrivelse</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Modell</Table.Th>
                  <Table.Th>Årsmodell</Table.Th>
                  <Table.Th>Rammestørrelse</Table.Th>
                  <Table.Th>Hjulstørrelse</Table.Th>
                  <Table.Th>Antall gir</Table.Th>
                  <Table.Th>Girsystem</Table.Th>
                  <Table.Th>Bremsesytem</Table.Th>
                  <Table.Th>Vekt</Table.Th>
                  <Table.Th>Beregnet for</Table.Th>
                  <Table.Th>Timespris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.bikeTypeDetails.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.model}</Table.Td>
                      <Table.Td>{bike.year}</Table.Td>
                      <Table.Td>{bike.frameSize}</Table.Td>
                      <Table.Td>{bike.wheelSize}</Table.Td>
                      <Table.Td>{bike.gears}</Table.Td>
                      <Table.Td>{bike.gearSystem}</Table.Td>
                      <Table.Td>{bike.brakeSystem}</Table.Td>
                      <Table.Td>{bike.weight_kg}</Table.Td>
                      <Table.Td>{bike.suitedFor}</Table.Td>
                      <Table.Td>{bike.price}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <br />
              <h6>Sykler av denne typen:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.bikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.location_id}</Table.Td>
                      <Table.Td>{bike.bikeStatus}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getBikeTypes(bikeType => {
      this.bikeType = bikeType;
    });

    connection.query('select * from BikeType where id = ?', [this.props.match.params.id], (error, results) => {
      if (error) return console.error(error);

      this.bikeTypeDetails = results;
    });

    connection.query(
      'select id, location_id, bikeStatus from Bikes where type_id = ?',
      [this.props.match.params.id],
      (error, results) => {
        if (error) return console.error(error);

        this.bikes = results;
      }
    );
  }
}

class LocationList extends Component {
  locations = [];

  render() {
    return (
      <div className="bootstrap-iso">
        <Card title="Lokasjoner">
          <Column right>
            <NavLink to={'/add/lokasjon/'}>
              <Button.Light>Legg inn ny lokasjon</Button.Light>
            </NavLink>
          </Column>
          <Tab>
            {this.locations.map(location => (
              <Tab.Item key={location.id} to={'/locations/' + location.id}>
                {location.name}
              </Tab.Item>
            ))}
          </Tab>
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

class BikesOnLocation extends Component {
  bikeLocations = [];
  bikes = [];
  bikeTypes = null;

  render() {
    if (!this.bikeTypes) return null;

    return (
      <div>
        <Card>
          <Row>
            <Column>
              <h6>Liste over sykler på valgt lokasjon</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Typenavn</Table.Th>
                  <Table.Th>Produsent</Table.Th>
                  <Table.Th>Årsmodell</Table.Th>
                  <Table.Th>Rammestørrelse</Table.Th>
                  <Table.Th>Hjulstørrelse</Table.Th>
                  <Table.Th>Antall gir</Table.Th>
                  <Table.Th>Girsystem</Table.Th>
                  <Table.Th>Bremsesytem</Table.Th>
                  <Table.Th>Vekt</Table.Th>
                  <Table.Th>Beregnet for</Table.Th>
                  <Table.Th>Timespris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.bikeTypes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.year}</Table.Td>
                      <Table.Td>{bike.frameSize}</Table.Td>
                      <Table.Td>{bike.wheelSize}</Table.Td>
                      <Table.Td>{bike.gears}</Table.Td>
                      <Table.Td>{bike.gearSystem}</Table.Td>
                      <Table.Td>{bike.brakeSystem}</Table.Td>
                      <Table.Td>{bike.weight_kg}</Table.Td>
                      <Table.Td>{bike.suitedFor}</Table.Td>
                      <Table.Td>{bike.price}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
        </Card>
      </div>
    );
  }

  mounted() {
    this.bikeTypes = [];
    rentalService.getBikesOnLocation(this.props.match.params.id, bikeType => {
      this.bikeTypes = bikeType;
      // console.log(this.props.history.location.pathname);
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

module.exports = { Overview, Booking, Bicycles, BicycleDetails, LocationList, BikesOnLocation, Customers, Basket };
