import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { connection } from './mysql_connection';
import { basket, employeeID } from './index.js';
import Chart from './charts.js';

import createHashHistory from 'history/createHashHistory';
import { start } from 'repl';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

/*
    ELEMENTER FOR ALLE BRUKERE INKLUDERT VANLIGE ANSATTE OG ADMIN

    SKAL EXPORTERES
*/

class Overview extends Component {
  render() {
    return (
      <div>
        <div>
          <h6>Overview</h6>
        </div>
        <Chart />
      </div>
    );
  }
}

class AllBikes extends Component {
  searchBikes = this.searchBikes.bind(this);
  handleChange = this.handleChange.bind(this);
  state = {
    bikes: [],
    searchWord: ''
  };

  handleChange(event) {
    this.setState({ state: (this.state.searchWord = event.target.value) }, this.searchBikes());
  }

  searchBikes() {
    let searchWord = '%' + this.state.searchWord + '%';

    console.log('searchbikes');
    rentalService.searchBikes(searchWord, results => {
      this.setState(state => {
        this.setState({ state: (this.state.bikes = []) });
        const bikes = state.bikes.concat(results);
        return {
          bikes,
          results
        };
      });
    });
  }

  render() {
    return (
      <div>
        <Card>
          <Row>
            <Column>
              <h6>Alle sykler</h6>
              <Column right>
                <Form.Label>Søk etter sykkel</Form.Label>
                <Form.Input onChange={this.handleChange}>{this.state.searchWord}</Form.Input>
              </Column>
              <br />
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
          results
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
            <NavLink to={'/bikeTypes/add/'}>
              <Button.Light>Legg inn ny sykkeltype</Button.Light>
            </NavLink>
          </Column>
          <Tab>
            {this.bikeTypes.map(bikeType => (
              <Tab.Item key={bikeType.id} to={'/bikeTypes/' + bikeType.typeName}>
                {bikeType.typeName}
              </Tab.Item>
            ))}
          </Tab>
        </Card>
        <br />
      </div>
    );
  }

  mounted() {
    rentalService.getDistinctBikeType(bikeTypes => {
      
      console.log("startiterate");
      for(let i = 0; i < bikeTypes.length; i++){
        for(let j = 0; j < bikeTypes.length; j++){
          if(bikeTypes[i].typeName == bikeTypes[j].typeName)
          {
            console.log("hmm");
            bikeTypes.splice(i, 1);
          }
        }
      }

      this.bikeTypes = bikeTypes;
    });
  }
}

class NewBikeType extends Component {
  typeName = '';
  brand = '';
  model = '';
  year = 0;
  frameSize = 0;
  wheelSize = 0;
  gears = 0;
  gearSystem = '';
  brakeSystem = '';
  weight_kg = 0;
  suitedFor = '';
  price = 0;

  render() {
    return (
      <Card>
        <div className="container">
          <h5>Ny sykkeltype</h5>
          <Row>
            <Column>
              <Form.Label>Type:</Form.Label>
              <Form.Input type="text" onChange={event => (this.typeName = event.target.value)} />
              <Form.Label>Merke:</Form.Label>
              <Form.Input type="text" onChange={event => (this.brand = event.target.value)} />
              <Form.Label>Årsmodell:</Form.Label>
              <Form.Input type="text" onChange={event => (this.year = event.target.value)} />
              <Form.Label>Rammestørrelse:</Form.Label>
              <Form.Input type="text" onChange={event => (this.frameSize = event.target.value)} />
              <Form.Label>Hjulstørrelse:</Form.Label>
              <Form.Input type="text" onChange={event => (this.wheelSize = event.target.value)} />
              <Form.Label>Antall gir:</Form.Label>
              <Form.Input type="text" onChange={event => (this.gears = event.target.value)} />
            </Column>
            <Column>
              <Form.Label>Girsystem:</Form.Label>
              <Form.Input type="text" onChange={event => (this.gearSystem = event.target.value)} />
              <Form.Label>Bremsesystem:</Form.Label>
              <Form.Input type="text" onChange={event => (this.brakeSystem = event.target.value)} />
              <Form.Label>Vekt:</Form.Label>
              <Form.Input type="text" onChange={event => (this.weight_kg = event.target.value)} />
              <Form.Label>Beregnet for:</Form.Label>
              <Form.Input type="text" onChange={event => (this.suitedFor = event.target.value)} />
              <Form.Label>Pris:</Form.Label>
              <Form.Input type="text" onChange={event => (this.price = event.target.value)} />
              <br />
              <br />
              <Row>
                <Column>
                  <Button.Success onClick={this.add}>Add</Button.Success>
                </Column>
                <Column right>
                  <Button.Light onClick={this.cancel}>Cancel</Button.Light>
                </Column>
              </Row>
            </Column>
            <br />
          </Row>
        </div>
      </Card>
    );
  }

  add() {
    rentalService.newBikeType(
      this.typeName,
      this.brand,
      this.model,
      this.year,
      this.frameSize,
      this.wheelSize,
      this.gears,
      this.gearSystem,
      this.brakeSystem,
      this.weight_kg,
      this.suitedFor,
      this.price
    );

    history.push('/bikeTypes/');
  }

  cancel() {
    history.push('/bikeTypes/' + this.props.match.params.id);
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
  onChangeHandle = this.onChangeHandle.bind(this);
  searchCustomer = this.searchCustomer.bind(this);
  state = {
    customers: [],
    searchWord: '',
    activeCustomer: ''
  };

  onChangeHandle(event) {
    this.setState({ state: (this.state.searchWord = event.target.value) });
  }

  searchCustomer() {
    //QUERY HERE
  }

  activeCustomerChoose() {}

  render() {
    return (
      <Card>
        <Row>
          <Column>
            <h6>Kundeliste</h6>
            <Form.Input id="testSearch" type="search" onChange={this.onChangeHandle} placeholder="Søk etter kunde" />
            <br />
            <br />
            <Table>
              <Table.Thead>
                <Table.Th>KundeID</Table.Th>
                <Table.Th>Fornavn</Table.Th>
                <Table.Th>Etternavn</Table.Th>
              </Table.Thead>
              <Table.Tbody>
                {this.state.customers.map(customer => (
                  <Table.Tr key={customer.id} onClick={this.activeCustomerChoose()}>
                    <Table.Td>{customer.id}</Table.Td>
                    <Table.Td>{customer.firstName}</Table.Td>
                    <Table.Td>{customer.lastName}</Table.Td>
                    {/* <Table.Td>{customer.email}</Table.Td>
                    <Table.Td>{customer.tlf}</Table.Td> */}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Column>
        </Row>
      </Card>
    );
  }

  mounted() {
    rentalService.getCustomerSearch('%', results => {
      this.setState({ state: (this.state.activeCustomer = results[0]) });
      this.setState(state => {
        const customers = state.customers.concat(results);
        return { customers, results };
      });
    });
  }
}

class SelectedCustomer extends Component {
  customer = '';

  render() {
    console.log(this.props);
    return (
      <Column>
        <Form.Label>Valgt Kunde</Form.Label>
        <Form.Label>
          {this.customer.firstName} {this.customer.lastName}
        </Form.Label>
        <Table>
          <Table.Thead>
            <Table.Th>KUNDE INFO</Table.Th>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>KundeID: {this.customer.id}</Table.Td>
              <Table.Td>Fornavn: {this.customer.firstName}</Table.Td>
              <Table.Td>Etternavn: {this.customer.lastName}</Table.Td>
              <Table.Td>Epost: {this.customer.email}</Table.Td>
              <Table.Td>Telefon: {this.customer.tlf}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Column>
    );
  }

  mounted() {
    rentalService.getCustomer(this.props.match.params.id, result => {
      this.setState({ state: (this.customer = result) });
    });
  }
}

module.exports = {
  Overview,
  AllBikes,
  BikeTypes,
  BikeTypeDetails,
  NewBikeType,
  BikeStatus,
  BikesByStatus,
  LocationList,
  BikesOnLocation,
  Customers,
  SelectedCustomer
};
