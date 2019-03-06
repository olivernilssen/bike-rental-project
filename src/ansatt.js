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
let day2 = day + 2;

if (day < 10) day = '0' + day;
if (day2 < 10) day2 = '0' + day2;

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
  nextDay = year + '-' + month + '-' + (day2);
  dayRent = false;
  state = {
    startDate: this.todaysDate,
    endDate: this.nextDay,
    hoursRenting: 0,
    typeSelect: '%',
    locationSelect: '%',
    allBikes: [],
    availableBikes: []
  };

  styleState = {
    display: 'block',
    clear: 'both'
  };

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
    this.setState({ [e.target.name]: e.target.value }, this.handleSubmit);
  }

  handleSubmit() {
    this.findAvailBikes();
  }

  chooseBike(bike) {
    if(basket.length == 0)
    {

    }
    else if(basket[0].id == "Handlekurven er tom"){
      basket.splice(0, 1);
    }

    basket.push(bike);
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
                  <Table.Th></Table.Th>
                  
                </Table.Thead>
                <Table.Tbody>
                  {this.state.availableBikes.map(bike => (
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
    this.state.availableBikes = [];
    let empty = {id: 'Gjør et nytt søk'};

    this.startDate = this.startDate + '%';
    this.endDate = this.endDate + '%';

    rentalService.getBookingSearch(
      this.state.locationSelect,
      this.state.typeSelect,
      this.state.startDate,
      this.state.endDate,
      result => {

        for(let i = 0; i < result.length; i++){
          {
            for (let j = 0; j < basket.length; j++)
            {
              if(result[i].id == basket[j].id)
              {
                result.splice(i, 1);
              }
            }
          }
        }
        
        if (result.length == 0) {
          this.setState({ styleState: (this.styleState.display = 'none') });
          this.setState(state => {
            const availableBikes = state.availableBikes.concat(empty);
            return {
              availableBikes, 
              empty,
            };
          });
        }
        else {
          this.setState({ styleState: (this.styleState.display = 'block') });
          this.setState(state => {
            const availableBikes = state.availableBikes.concat(result);
            return {
              availableBikes, 
              result,
            };
          });
        }
      }
    );
  }

  //SQL SPØRRING HER
  findAvailBikes() {
    this.state.availableBikes = [];
    let empty = {id: 'Gjør et nytt søk'};

    this.startDate = this.startDate + '%';
    this.endDate = this.endDate + '%';

    rentalService.getBookingSearch(
      this.state.locationSelect,
      this.state.typeSelect,
      this.state.startDate,
      this.state.endDate,
      result => {

        for(let i = 0; i < result.length; i++){
          {
            if(result.length == 0){
              break;
            }
            for (let j = 0; j < basket.length; j++)
            {
              if(result[i].id == basket[j].id)
              {
                result.splice(i, 1);
              }
            }
          }
        }
        
        if (result.length == 0) {
          this.setState({ styleState: (this.styleState.display = 'none') });
          this.setState(state => {
            const availableBikes = state.availableBikes.concat(empty);
            return {
              availableBikes, 
              empty,
            };
          });
        }
        else {
          this.setState({ styleState: (this.styleState.display = 'block') });
          this.setState(state => {
            const availableBikes = state.availableBikes.concat(result);
            return {
              availableBikes, 
              result,
            };
          });
        }
      }
    );
  }
}

class AllBikes extends Component {
  searchBikes = this.searchBikes.bind(this);
  handleChange = this.handleChange.bind(this);
  state = {
    bikes: [],
    searchWord: ""
  }

  handleChange(event) {
    this.setState({state: (this.state.searchWord = event.target.value)}, this.searchBikes());
  }

  searchBikes() {
    let searchWord = "%" + this.state.searchWord + "%";

    console.log("searchbikes");
    rentalService.searchBikes(searchWord, results => {
      this.setState(state => {
        this.setState({state: (this.state.bikes = [])});
        const bikes = state.bikes.concat(results);
        return {
          bikes, 
          results,
        };
      });
    })
  }

  render() {
    return (
      <div>
        <Card>
          <Row>
            <Column>
              <h6>Alle sykler</h6>
              <Column right>
                <Form.Label>Søk på sykkel etter sykkel-ID</Form.Label>
                <Form.Input onChange={this.handleChange}>{this.state.searchWord}</Form.Input>
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
                  {this.state.bikes.map(bike => (
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
    rentalService.getAllBikesByType(results => {
      this.setState(state => {
        const bikes = state.bikes.concat(results);
        return {
          bikes, 
          results,
        };
      });
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
                  <Table.Th>År</Table.Th>
                  <Table.Th>Ramme</Table.Th>
                  <Table.Th>Hjul</Table.Th>
                  <Table.Th>Antall gir</Table.Th>
                  <Table.Th>Gir</Table.Th>
                  <Table.Th>Bremser</Table.Th>
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
  updateBasket = this.updateBasket.bind(this);
  handleChangePhrase = this.handleChangePhrase.bind(this);
  chooseCustomer = this.chooseCustomer.bind(this);
  findCustomers = this.findCustomers.bind(this);
  removeCustomer = this.removeCustomer.bind(this);

  state = {
    inBasket: basket,
    kunder: [],
    phrase: "",
    activeCustomer: "Ingen Kunde valgt",
    displayCustomer: 'block',
    CustomerActive: false
  }
  styleState = {
    display: 'block',
    clear: 'both'
  };

  //REMOVE BIKE FROM BASKET
  removeBike(bike) {
    for (let i of basket) {
      if (bike == i) {
        basket.splice(basket.indexOf(i), 1);
        this.updateBasket();
      }
    }
  }

  updateBasket() {
    this.state.inBasket = [];
    if (basket.length == 0) {
      this.setState({ styleState: (this.styleState.display = 'none') });
    } else {
      this.setState({ styleState: (this.styleState.display = 'block') });
    }

    if (basket.length == 0) {
      this.setState(state => {
        const inBasket = state.inBasket.concat({id: "TOMT HER"});
        return {
          inBasket
        };
      });
    }
    else {
      this.setState(state => {
        const inBasket = state.inBasket.concat(basket);
        return {
          inBasket, 
          basket,
        };
      });
    }
  }

  handleChangePhrase(event){
    this.setState({state: (this.state.phrase = event.target.value)}, this.findCustomers());
  }

  findCustomers() {
    let queryPhrase = "";

    if(this.state.phrase == " "){
      queryPhrase = "%";
    }
    else {
      queryPhrase = "%" + this.state.phrase + "%";
    }
    rentalService.getCustomerSearch(queryPhrase, results => {
      this.state.kunder = [];

      if(results.length == 0){
        this.setState(state => {
          console.log(queryPhrase);
          const kunder = state.kunder.concat({firstName: "Søk igjen"});
          return {
            kunder, 
          };
        });
      }
      else {
        this.setState(state => {
        console.log(queryPhrase);
        const kunder = state.kunder.concat(results);
        return {
          kunder, 
          results,
        };
      });
      }
      
    })
  }

  chooseCustomer(customer) {
    this.setState({state: (this.state.activeCustomer = customer)});
    this.setState({state: (this.state.displayCustomer = 'none') });
  }

  removeCustomer() {
    this.setState({state: (this.state.activeCustomer = "Velg ny kunde")});
    this.setState({state: (this.state.displayCustomer = 'block') });
    this.setState({state: (this.state.phrase = "")});
    this.findCustomers();
  }

  render() {
    if (basket.length == 0 && this.state.inBasket.length == 0) {
      {
        this.updateBasket();
      }
    }

    const styles = {
      btnStyle: {
        display: this.styleState.display
      },
      divStyle: {
        display: this.state.displayCustomer
      }
    };

    const { divStyle } = styles;

    const { btnStyle } = styles;
    
    return (
        <div>
          <Row>
            <Card title="Handlekurv">
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
                  {this.state.inBasket.map(bike => (
                    <Table.Tr key={bike.id}>
                        <Table.Td>{bike.id}</Table.Td>
                        <Table.Td>{bike.typeName}</Table.Td>
                        <Table.Td>{bike.brand}</Table.Td>
                        <Table.Td>{bike.name}</Table.Td>
                        <Table.Td>{bike.wheelSize}</Table.Td>
                        <Table.Td>{bike.weight_kg}</Table.Td>
                        <Table.Td>{bike.price}</Table.Td>
                        <Table.Td>
                          <Button.Success
                            style={btnStyle}
                            onClick={() => {this.removeBike(bike)}}> Delete 
                          </Button.Success>
                        </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          </Row>

          <Row>
            <Card title="Søk etter kunde">
              <Form.Label>Valgt Kunde: {this.state.activeCustomer.firstName} </Form.Label> <br></br>
              <Button.Success onClick={() => {this.removeCustomer()}}> Fjern Kunde </Button.Success> <br></br><br></br>
              <div style={divStyle}>
                  <Form.Input value={this.state.phrase} onChange={this.handleChangePhrase}></Form.Input>
                  <br></br>
                  <br></br>
                  <Table>
                    <Table.Thead>
                      <Table.Th>Fornavn</Table.Th>
                      <Table.Th>Etternavn</Table.Th>
                      <Table.Th>ID</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Thead>
                    <Table.Tbody>
                      {this.state.kunder.map(kunde => (
                        <Table.Tr key={kunde.id}>
                            <Table.Td>{kunde.firstName}</Table.Td>
                            <Table.Td>{kunde.lastName}</Table.Td>
                            <Table.Td>{kunde.id}</Table.Td>
                            <Table.Td>
                              <Button.Success
                                onClick={() => {this.chooseCustomer(kunde);}}> Velg 
                              </Button.Success>
                            </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
            </Card>
          </Row>
        </div>
    );
  }

  mounted () {
    rentalService.getCustomerSearch("%", results => {
      this.setState(state => {
        const kunder = state.kunder.concat(results);
        return {
          kunder, 
          results,
        };
      });
    })
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
