import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { connection } from './mysql_connection';
import { basket } from './index.js';

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
  todaysDate = year + '-' + month + '-' + day;
  dayRent = false;
  state = {
    startDate: this.todaysDate,
    endDate: '',
    hoursRenting: 0,
    typeSelect: '%',
    locationSelect: '%'
  };

  styleState = {
    display: 'block',
    clear: 'both'
  };

  allBikes = [ ];
  availableBikes = [];
  handleSubmit = this.handleSubmit.bind(this);
  handleCheckChange = this.handleCheckChange.bind(this);
  handleChange = this.handleChange.bind(this);
  chooseBike = this.chooseBike.bind(this);

  handleCheckChange() {
    if (this.dayRent == false) {
      this.dayRent = true;
    } else {
      this.dayRent = false;
    }

    this.findAvailBikes();
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.findAvailBikes();
  }

  handleSubmit() {
    this.findAvailBikes();
  }

  chooseBike(bike) {
    if (basket[0].status == 3) {
      basket.splice(0, 1);
    }

    basket.push(bike);
    console.log(basket.length);
    this.findAvailBikes();
  }

  render() {
    const styles = {
      btnStyle: {
        display: this.styleState.display
      }
    };

    const { btnStyle } = styles;

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
                  <option value="%">Any Location</option>
                  <option value="Finse">Finse</option>
                  <option value="Flåm">Flåm</option>
                  <option value="Haugastøl">Haugastøl</option>
                  <option value="Voss">Voss</option>
                </select>

                <select name="typeSelect" value={this.state.typeSelect} onChange={this.handleChange}>
                  <option value="%">Any Type of bike</option>
                  <option value="Terreng">Terreng</option>
                  <option value="Downhill">Downhill</option>
                  <option value="Landevei">Landevei</option>
                  <option value="Barn">Barn</option>
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
                  <Table.Th>Pris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.availableBikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.name}</Table.Td>
                      <Table.Td>{bike.wheelSize}</Table.Td>
                      <Table.Td>{bike.price}</Table.Td>
                      <Table.Td>
                        <Button.Success
                          style={btnStyle}
                          onClick={() => {
                            this.chooseBike(bike);
                          }}>
                          Velg
                        </Button.Success>
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

  mounted() {
    this.availableBikes = [];

    this.startDate = this.startDate + '%';
    this.endDate = this.endDate + '%';

    rentalService.getBookingSearch(
      this.state.locationSelect,
      this.state.typeSelect,
      this.state.startDate,
      this.state.endDate,
      result => {

        this.availableBikes = result;

        for(let i = 0; i < this.availableBikes.length; i++){
          {
            for (let j = 0; j < basket.length; j++)
            {
              if(this.availableBikes[i].id == basket[j].id)
              {
                result.splice(i, 1);
              }
            }
          }
        }
        
        if (this.availableBikes.length == 0) {
          this.availableBikes.push({ status: 3, id: 'Gjør et nytt søk' });
        }
    
        if (this.availableBikes[0].id == 'Gjør et nytt søk') {
          this.setState({ styleState: (this.styleState.display = 'none') });
        } else {
          this.setState({ styleState: (this.styleState.display = 'block') });
        }
      }
    );
  }

  //SQL SPØRRING HER
  findAvailBikes() {
    this.availableBikes = [];

    this.startDate = this.startDate + '%';
    this.endDate = this.endDate + '%';

    rentalService.getBookingSearch(
      this.state.locationSelect,
      this.state.typeSelect,
      this.state.startDate,
      this.state.endDate,
      result => {

        this.availableBikes = result;

        for(let i = 0; i < this.availableBikes.length; i++){
          {
            for (let j = 0; j < basket.length; j++)
            {
              if(this.availableBikes[i].id == basket[j].id)
              {
                result.splice(i, 1);
              }
            }
          }
        }
        
        if (this.availableBikes.length == 0) {
          this.availableBikes.push({ status: 3, id: 'Gjør et nytt søk' });
        }
    
        if (this.availableBikes[0].id == 'Gjør et nytt søk') {
          this.setState({ styleState: (this.styleState.display = 'none') });
        } else {
          this.setState({ styleState: (this.styleState.display = 'block') });
        }
      }
    );

    

    //   //OM DET IKKE ER NOEN TILGJENGELIGE SYKLER I DENNE KATEGORIEN, SI TIL BRUKER AT DET IKKE ER NOE DER
    //   //OG LEGG NOE I LISTEN MED STATUS 3, SLIK AT RENDER IKKE KJØRER UENDELIG
    
  }
}

class AllBikes extends Component {
  bikes = [];

  render() {
    return (
      <div>
        <Card>
          <Row>
            <Column>
              <h6>Alle sykler</h6>
              <Column right>
                <NavLink to={'/add/bikeType/'}>
                  <Button.Light>Legg inn ny sykkeltype</Button.Light>
                </NavLink>
              </Column>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Modell</Table.Th>
                  <Table.Th>Årsmodell</Table.Th>
                  <Table.Th>Beregnet for</Table.Th>
                  <Table.Th>Timespris</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.bikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.model}</Table.Td>
                      <Table.Td>{bike.year}</Table.Td>
                      <Table.Td>{bike.suitedFor}</Table.Td>
                      <Table.Td>{bike.price}</Table.Td>
                      <Table.Td>{bike.name}</Table.Td>
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
    rentalService.getAllBikesByType(bikes => {
      this.bikes = bikes;
    });
  }
}

class BikeTypes extends Component {
  bikeTypes = [];

  render() {
    return (
      <div className="bootstrap-iso">
        <Card title="Sykkeltyper">
          <Column right>
            <NavLink to={'/add/bikeType/'}>
              <Button.Light>Legg inn ny sykkeltype</Button.Light>
            </NavLink>
          </Column>
          <Tab>
            {this.bikeTypes.map(bikeType => (
              <Tab.Item key={bikeType.id} to={'/bikeTypes/' + bikeType.id}>
                {bikeType.typeName}
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

class BikeTypeDetails extends Component {
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

class BikeStatus extends Component {
  bikeStatus = [];

  render() {
    return (
      <div className="bootstrap-iso">
        <Card title="Sykkelstatus">
          <Tab>
            {this.bikeStatus.map(status => (
              <Tab.Item key={status.bikeStatus} to={'/bikeStatus/' + status.bikeStatus}>
                {status.bikeStatus}
              </Tab.Item>
            ))}
          </Tab>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getBikeStatus(bikeStatus => {
      this.bikeStatus = bikeStatus;
    });
  }
}

class BikesByStatus extends Component {
  bikeStatus = null;
  bikes = [];

  render() {
    if (!this.bikeStatus) return null;

    return (
      <div>
        <Card>
          <h6>Sykler med denne statusen:</h6>
          <Table>
            <Table.Thead>
              <Table.Th>ID</Table.Th>
              <Table.Th>Lokasjon</Table.Th>
              <Table.Th>Sykkeltype</Table.Th>
            </Table.Thead>
            <Table.Tbody>
              {this.bikes.map(bike => (
                <Table.Tr key={bike.id}>
                  <Table.Td>{bike.id}</Table.Td>
                  <Table.Td>{bike.name}</Table.Td>
                  <Table.Td>{bike.typeName}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getBikeStatus(bikeStatus => {
      this.bikeStatus = bikeStatus;
    });

    rentalService.getBikesByStatus(this.props.match.params.bikeStatus, bikes => {
      this.bikes = bikes;
    });
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
  bikeLocations = null;
  bikes = [];

  render() {
    if (!this.bikeLocations) return null;

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
                  {this.bikes.map(bike => (
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
    rentalService.getLocations(locations => {
      this.bikeLocations = locations;
    });

    rentalService.getBikesOnLocation(this.props.match.params.id, bikes => {
      this.bikes = bikes;
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
  removeBike = this.removeBike.bind(this);
  inBasket = basket;
  styleState = {
    display: 'block',
    clear: 'both'
  };

  //REMOVE BIKE FROM BASKET
  removeBike(bike) {
    for (let i of basket) {
      if (bike == i) {
        basket.splice(i, 1);
      }
    }

    this.checkifEmpty();
  }

  checkifEmpty() {
    this.inBasket = basket;

    if (this.inBasket.length == 0) {
      this.inBasket.push({ status: 3, id: 'Handlekurven er tom :(' });
    }

    if (this.inBasket[0].status == 3) {
      this.setState({ styleState: (this.styleState.display = 'none') });
    } else {
      this.setState({ styleState: (this.styleState.display = 'block') });
    }
  }

  render() {
    if (this.inBasket.length == 0) {
      {
        this.checkifEmpty();
      }
    }

    const styles = {
      btnStyle: {
        display: this.styleState.display
      }
    };

    const { btnStyle } = styles;

    return (
      <div className="row">
        <div>
          <h3>Sykler i handlekurv</h3>
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
                {basket.map(bike => (
                  <Table.Tr key={bike.id}>
                    <Table.Td>{bike.id}</Table.Td>
                    <Table.Td>{bike.type}</Table.Td>
                    <Table.Td>{bike.brand}</Table.Td>
                    <Table.Td>{bike.location}</Table.Td>
                    <Table.Td>{bike.framesize}</Table.Td>
                    <Table.Td>{bike.weight}</Table.Td>
                    <Table.Td>{bike.hrPrice}</Table.Td>
                    <Table.Td>
                      <Button.Success
                        style={btnStyle}
                        onClick={() => {
                          this.removeBike(bike);
                        }}
                      >
                        Delete
                      </Button.Success>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </div>
      </div>
    );
  }
}

module.exports = {
  Overview,
  Booking,
  AllBikes,
  BikeTypes,
  BikeTypeDetails,
  BikeStatus,
  BikesByStatus,
  LocationList,
  BikesOnLocation,
  Customers,
  Basket
};
