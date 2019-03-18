import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { bikeService } from './services/bikesService';
import { connection } from './services/mysql_connection';
import { basket, employeeID } from './index.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class AllBikes extends Component {
  state = {
    bikes: [],
    searchWord: ''
  };

  handleChange(event) {
    this.setState({ state: (this.state.searchWord = event.target.value) }, this.searchBikes());
  }

  searchBikes() {
    let searchWord = '%' + this.state.searchWord + '%';

    bikeService.searchBikes(searchWord, results => {
      this.setState({ state: (this.state.bikes = []) });
      this.setState(state => {
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
        <H1>Alle sykler</H1>
        <br />

        <Card>
          <Row>
            <Column>
              <Column right>
                <NavLink to={'/addBikes/'}>
                  <Button.Light>Legg inn ny sykkel</Button.Light>
                </NavLink>
              </Column>
              <Column right>
                <Form.Label>Søk på sykkel etter id, type, modell eller lokasjon</Form.Label>
                <Form.Input onChange={this.handleChange}>{this.state.searchWord}</Form.Input>
              </Column>
            </Column>
          </Row>
          <br />
          <Row>
            <Column>
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
                  <Table.Th>Status</Table.Th>
                  <Table.Th />
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
                      <Table.Td>{bike.bikeStatus}</Table.Td>
                      <Table.Td>
                        <NavLink to={'/selectedBike/' + bike.id}>
                          <Button.Success>Endre</Button.Success>
                        </NavLink>
                      </Table.Td>
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

  change() {}

  mounted() {
    bikeService.getAllBikesByType(results => {
      this.setState({ bikes: results });
    });
  }
}

class SelectedBike extends Component {
  bike = null;
  state = {
    statusOnBike: ['OK', 'Til Reperasjon', 'Trenger Reperasjon', 'Trenger Service', 'Stjålet', 'Utleid']
  };

  render() {
    return (
      <div>
        <H1>Sykkel med ID: {this.props.match.params.id}</H1>
        <br />

        <Row>
          <Column>
            <Button.Success onClick={this.change}>Endre</Button.Success>
          </Column>

          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
        </Row>
      </div>
    );
  }

  mounted() {
    bikeService.getBike(this.props.match.params.id, result => {
      this.bike = result;
    });
  }

  change() {
    history.push('/allBikes/');
  }

  cancel() {
    history.push('/allBikes/');
  }
}

class BikeTypes extends Component {
  bikeTypes = [];

  render() {
    return (
      <div>
        <H1>Sykkeltyper</H1>
        <br />
        <Tab>
          {this.bikeTypes.map(bikeType => (
            <Tab.Item key={bikeType.typeName} to={'/bikeTypes/' + bikeType.typeName}>
              {bikeType.typeName}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/bikeTypes/add/'}>
              <Button.Light>Legg inn ny sykkeltype</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  mounted() {
    bikeService.getDistinctBikeType(bikeTypes => {
      for (let i = 0; i < bikeTypes.length; i++) {
        for (let j = 0; j < bikeTypes.length; j++) {
          if (i == j) {
            continue;
          } else if (bikeTypes[i].typeName == bikeTypes[j].typeName) {
            bikeTypes.splice(j, 1);
          }
        }
      }
      this.bikeTypes = bikeTypes;
    });
  }
}

class AddBikes extends Component {
  antall = 0;
  bikeTypes = [];
  locations = [];
  typeSykkel = '';
  state = {
    selectedBikeID: 1,
    curLocation: ''
  };

  onChangeType(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({
      state: (this.state.selectedBikeID = event.target.options[selectedIndex].getAttribute('data-key'))
    });
    console.log(this.state.selectedBikeID);
  }

  onChangeLocation(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({ state: (this.state.curLocation = event.target.options[selectedIndex].getAttribute('data-key')) });
    console.log(this.state.curLocation);
  }

  render() {
    return (
      <Card>
        <div className="container">
          <h5>Ny sykkeltype</h5>
          <Row>
            <Column>
              <Form.Label>Antall:</Form.Label>
              <Form.Input type="text" onChange={event => (this.antall = event.target.value)} />
              <Form.Label>Type:</Form.Label>
              <select onChange={this.onChangeType}>
                {this.bikeTypes.map(bikeType => (
                  <option key={bikeType.id} data-key={bikeType.id}>
                    {bikeType.typeName} {bikeType.brand} {bikeType.model} {bikeType.year}
                  </option>
                ))}
              </select>
              <Form.Label>Lokasjon: </Form.Label>
              <select onChange={this.onChangeLocation}>
                {this.locations.map(lokasjon => (
                  <option key={lokasjon.id} data-key={lokasjon.id}>
                    {lokasjon.name}
                  </option>
                ))}
              </select>
              <br /> <br />
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
    if (this.antall <= 0) {
      return;
    } else {
      for (let i = 0; i < this.antall; i++) {
        bikeService.addBike(this.state.curLocation, this.state.selectedBikeID, 'OK');
      }
    }

    history.push('/allBikes/');
  }

  cancel() {
    history.push('/allBikes/');
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.state.curLocation = locations[0].id;
      this.locations = locations;
    });

    bikeService.getAllBikesByType(bikeTypes => {
      this.selectedBike = bikeTypes[0].id;
      this.bikeTypes = bikeTypes;
    });
  }
}

class BikeTypeDetails extends Component {
  bikeType = null;
  state = {
    bikes: [],
    typeIds: 0,
    bikeTypeDetails: []
  };

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
                  {this.state.bikeTypeDetails.map(bike => (
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
                  {this.state.bikes.map(bike => (
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
    this.state.bikes = [];
    this.state.bikeTypeDetails = [];

    bikeService.getBikeTypes(bikeType => {
      this.bikeType = bikeType;
    });

    connection.query(
      'select id from BikeType where typeName = ?',
      [this.props.match.params.typeName],
      (error, idResult) => {
        if (error) return console.error(error);
        this.setState({ state: (this.state.typeIds = idResult) });

        for (let i = 0; i < idResult.length; i++) {
          connection.query(
            'select id, location_id, bikeStatus from Bikes where type_id = ?',
            [idResult[i].id],
            (error, results) => {
              if (error) return console.error(error);

              this.setState(state => {
                const bikes = state.bikes.concat(results);
                return {
                  bikes,
                  results
                };
              });
            }
          );

          connection.query('select * from BikeType where id = ?', [idResult[i].id], (error, typeResult) => {
            if (error) return console.error(error);

            this.setState(state => {
              const bikeTypeDetails = state.bikeTypeDetails.concat(typeResult);
              return {
                bikeTypeDetails,
                typeResult
              };
            });
          });
        }
      }
    );
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
              <Form.Label>Modell:</Form.Label>
              <Form.Input type="text" onChange={event => (this.model = event.target.value)} />
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
    bikeService.newBikeType(
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
    history.push('/bikeTypes/' + this.props.match.params.typeName);
  }
}

class BikeStatus extends Component {
  bikeStatus = [];

  render() {
    return (
      <div>
        <H1>Sykler etter status</H1>
        <br />
        <Tab>
          {this.bikeStatus.map(status => (
            <Tab.Item key={status.bikeStatus} to={'/bikeStatus/' + status.bikeStatus}>
              {status.bikeStatus}
            </Tab.Item>
          ))}
        </Tab>
      </div>
    );
  }

  mounted() {
    bikeService.getBikeStatus(bikeStatus => {
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
    bikeService.getBikeStatus(bikeStatus => {
      this.bikeStatus = bikeStatus;
    });

    bikeService.getBikesByStatus(this.props.match.params.bikeStatus, bikes => {
      this.bikes = bikes;
    });
  }
}

class LocationList extends Component {
  locations = [];

  render() {
    return (
      <div>
        <h1 className="display-4">Lokasjoner</h1>
        <br />
        <Tab>
          {this.locations.map(location => (
            <Tab.Item key={location.id} to={'/locations/' + location.id}>
              {location.name}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/add/lokasjon/'}>
              <Button.Light>Legg inn ny lokasjon</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.locations = locations;
    });
  }
}

class AddLocation extends Component {
  area = [];
  locations = [];

  render() {
    return (
      <Card>
        <div>
          <h1 className="display-4">Lokasjoner</h1>
          <br />
          <Tab>
            {this.area.map(area => (
              <Tab.Item key={area.id} to={'/locations/add' + area.id}>
                {area.name}
              </Tab.Item>
            ))}
            <Column right>
              {this.locations.map(area => (
                <Tab.Item key={location.id} to={'/locations/add' + location.id}>
                  {location.name}
                </Tab.Item>
              ))}
            </Column>
          </Tab>
        </div>
      </Card>
    );
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.locations = locations;
    });

    rentalService.getArea(area => {
      this.area = area;
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

    bikeService.getBikesOnLocation(this.props.match.params.id, bikes => {
      this.bikes = bikes;
    });
  }
}

module.exports = {
  AllBikes,
  BikeTypes,
  BikeTypeDetails,
  BikeStatus,
  BikesByStatus,
  LocationList,
  BikesOnLocation,
  NewBikeType,
  AddBikes,
  SelectedBike,
  AddLocation
};
