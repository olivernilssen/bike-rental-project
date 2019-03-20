import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1, Select } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { bikeService } from './services/bikesService';

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
        <Column right>
          <NavLink to={'/addBikes/'}>
            <Button.Light>Legg inn ny sykkel</Button.Light>
          </NavLink>
        </Column>
        <Card>
          <Row>
            <Column>
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
        <br />
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
  bike = [];
  bikeType = '';
  bikeLoc = '';
  bikeStatus = '';
  locations = [];
  note = '';
  state = {
    location_id: null,
    statusOnBike: ['OK', 'Til Reperasjon', 'Trenger Reperasjon', 'Trenger Service', 'Må flyttes', 'Stjålet', 'Utleid']
  };

  render() {
    if (!this.bike) return null;

    return (
      <div>
        <Card title={'Sykkel med id: ' + this.props.match.params.id}>
          <img src="../pictures/bikeImage.png" width="30%" />
          <Table>
            <Table.Thead>
              <Table.Th>Sykkel id</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Lokasjon</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Thead>

            <Table.Tbody>
              <Table.Tr>
                <Table.Td>{this.props.match.params.id}</Table.Td>
                <Table.Td>{this.bike.typeName}</Table.Td>
                <Table.Td>
                  <Select name="locationSelect" value={this.bikeLoc} onChange={this.onChangeLocation}>
                    {this.locations.map(loc => (
                      <Select.Option key={loc.id} dataKey={loc.id}>
                        {loc.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Table.Td>
                <Table.Td>
                  <Select
                    name="status"
                    value={this.bikeStatus}
                    onChange={event => (this.bikeStatus = event.target.value)}
                  >
                    {this.state.statusOnBike.map(status => (
                      <Select.Option key={status}>{status}</Select.Option>
                    ))}
                  </Select>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <br />
          <br />
          <Table>
            <Table.Thead>
              <Table.Th>Type id:</Table.Th>
              <Table.Th>Merke</Table.Th>
              <Table.Th>Model</Table.Th>
              <Table.Th>År</Table.Th>
              <Table.Th>Ramme</Table.Th>
              <Table.Th>Girsystem</Table.Th>
              <Table.Th>Bremser</Table.Th>
              <Table.Th>Vekt</Table.Th>
              <Table.Th>For</Table.Th>
              <Table.Th>Pris</Table.Th>
            </Table.Thead>

            <Table.Tbody>
              <Table.Tr>
                <Table.Td>{this.bike.type_id}</Table.Td>
                <Table.Td>{this.bike.brand}</Table.Td>
                <Table.Td>{this.bike.model}</Table.Td>
                <Table.Td>{this.bike.year}</Table.Td>
                <Table.Td>{this.bike.frameSize}"</Table.Td>
                <Table.Td>
                  {this.bike.gearSystem}/{this.bike.gears}
                </Table.Td>
                <Table.Td>{this.bike.brakeSystem}</Table.Td>
                <Table.Td>{this.bike.weight_kg}kg</Table.Td>
                <Table.Td>{this.bike.suitedFor}</Table.Td>
                <Table.Td>{this.bike.price}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Form.Label>Skriv inn en kommentar om sykkelen:</Form.Label>
          <br />
          <textarea row="200" cols="100" value={this.note} onChange={event => (this.note = event.target.value)} />
          <br />
          <br />
          <Row>
            <Column>
              <Button.Success onClick={this.change}>Endre</Button.Success>
            </Column>

            <Column right>
              <Button.Light onClick={this.cancel}>Cancel</Button.Light>
            </Column>
          </Row>
        </Card>

        <br />
      </div>
    );
  }

  mounted() {
    rentalService.getLocations(result => {
      this.locations = result;
    });

    bikeService.getBike(this.props.match.params.id, result => {
      this.bike = result;
      this.bikeLoc = result.name;
      this.bikeType = result.typeName;
      this.bikeStatus = result.bikeStatus;
      this.state.location_id = result.location_id;
      if (result.bikeNote == null) {
        this.note = '';
      } else {
        this.note = result.bikeNote;
      }
    });
  }

  onChangeLocation(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.bikeLoc = event.target.value;
    this.setState({ state: (this.state.location_id = event.target.options[selectedIndex].getAttribute('data-key')) });
    console.log(this.state.location_id);
  }

  change() {
    console.log(this.state.location_id);
    if (this.state.location_id == null) {
    } else {
      bikeService.updateBikes(this.props.match.params.id, this.bikeStatus, this.state.location_id, this.note);
      console.log(this.bikeLoc, this.bikeType, this.bikeStatus, this.note);
      history.push('/allBikes/');
    }
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
              <Select onChange={this.onChangeType}>
                {this.bikeTypes.map(bikeType => (
                  <Select.Option key={bikeType.id} dataKey={bikeType.id}>
                    {bikeType.typeName} {bikeType.brand} {bikeType.model} {bikeType.year}
                  </Select.Option>
                ))}
              </Select>
              <Form.Label>Lokasjon: </Form.Label>
              <Select onChange={this.onChangeLocation}>
                {this.locations.map(lokasjon => (
                  <Select.Option key={lokasjon.id} dataKey={lokasjon.id}>
                    {lokasjon.name}
                  </Select.Option>
                ))}
              </Select>
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

    bikeService.getBikeTypes(bikeTypes => {
      this.selectedBike = bikeTypes[0].id;
      this.bikeTypes = bikeTypes;
    });
  }
}

class BikeTypeDetails extends Component {
  bikeType = null;
  showingBikes = 0;
  state = {
    bikes: [],
    typeIds: [],
    bikeTypeDetails: []
  };

  showThisType(id) {
    if (this.showingBikes === id) {
      this.state.bikes = [];
      let temp = [];
      for (let i = 0; i < this.state.typeIds.length; i++) {
        bikeService.getBikesbyTypeID(this.state.typeIds[i].id, results => {
          this.showingBikes = id;
          this.setState(state => {
            const bikes = state.bikes.concat(results);
            return { bikes, results };
          });
        });
      }

      this.showingBikes = 0;
    } else {
      this.state.bikes = [];
      bikeService.getBikesbyTypeID(id, results => {
        this.showingBikes = id;
        this.setState(state => {
          const bikes = state.bikes.concat(results);
          return { bikes, results };
        });
      });
    }
  }

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
                  {this.state.bikeTypeDetails.map(type => (
                    <Table.Tr
                      key={type.id}
                      onClick={() => {
                        this.showThisType(type.id);
                      }}
                    >
                      <Table.Td>{type.brand}</Table.Td>
                      <Table.Td>{type.model}</Table.Td>
                      <Table.Td>{type.year}</Table.Td>
                      <Table.Td>{type.frameSize}</Table.Td>
                      <Table.Td>{type.wheelSize}</Table.Td>
                      <Table.Td>{type.gears}</Table.Td>
                      <Table.Td>{type.gearSystem}</Table.Td>
                      <Table.Td>{type.brakeSystem}</Table.Td>
                      <Table.Td>{type.weight_kg}</Table.Td>
                      <Table.Td>{type.suitedFor}</Table.Td>
                      <Table.Td>{type.price}</Table.Td>
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
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.state.bikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.location_id}</Table.Td>
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
        <br />
      </div>
    );
  }

  mounted() {
    this.state.bikes = [];
    this.state.bikeTypeDetails = [];

    bikeService.getBikeTypes(bikeType => {
      this.bikeType = bikeType;
    });

    bikeService.getTypeID(this.props.match.params.typeName, idResult => {
      this.state.typeIds = idResult;

      for (let i = 0; i < idResult.length; i++) {
        bikeService.getBikesbyTypeID(idResult[i].id, results => {
          this.setState(state => {
            const bikes = state.bikes.concat(results);
            return { bikes, results };
          });
        });

        bikeService.getBikeTypesWhere(idResult[i].id, typeResult => {
          this.setState(state => {
            const bikeTypeDetails = state.bikeTypeDetails.concat(typeResult);
            return {
              bikeTypeDetails,
              typeResult
            };
          });
        });
      }
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
        <br />
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

class AreaList extends Component {
  area = [];

  render() {
    return (
      <div>
        <Tab>
          {this.area.map(area => (
            <Tab.Item key={area.a_id} to={'/area/' + area.a_id}>
              {area.areaName}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/addArea'}>
              <Button.Light>Legg til nytt område</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  mounted() {
    rentalService.getArea(area => {
      this.area = area;
    });
  }
}

class AddArea extends Component {
  areaName = '';

  render() {
    return (
      <Card>
        <div className="container">
          <h5>Nytt område</h5>
          <Row>
            <Column>
              <Form.Label>Navn:</Form.Label>
              <Form.Input type="text" onChange={event => (this.areaName = event.target.value)} />
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
    rentalService.addArea(this.areaName);

    history.push('/area/1');
  }

  cancel() {
    history.push('/area/1');
  }
}

class LocationInArea extends Component {
  areaLocations = null;
  locations = [];

  render() {
    if (!this.areaLocations) return null;

    return (
      <div>
        <Card>
          <h1 className="display-4">Lokasjoner</h1>
          <br />
          <Tab>
            {this.locations.map(location => (
              <Tab.Item key={location.id} to={'/area/' + location.id}>
                {location.name}
              </Tab.Item>
            ))}
            <Column right>
              <NavLink to={'/addLocation/'}>
                <Button.Light>Legg til ny lokasjon</Button.Light>
              </NavLink>
            </Column>
          </Tab>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getArea(area => {
      this.areaLocations = area;
    });

    rentalService.getLocations(locations => {
      this.locations = locations;
    });
  }
}

class AddLocation extends Component {
  areaNames = [];
  name = '';
  postalNum = 0;
  place = '';
  streetAddress = '';
  streetNum = 0;
  state = { curArea: '' };

  onChangeType(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({
      state: (this.state.curArea = event.target.options[selectedIndex].getAttribute('data-key'))
    });
    console.log(this.state.curArea);
  }

  render() {
    return (
      <Card>
        <div className="container">
          <h5>Ny lokasjon</h5>
          <Row>
            <Column>
              <Form.Label>Navn:</Form.Label>
              <Form.Input type="text" onChange={event => (this.areaName = event.target.value)} />
              <Form.Label>Område: </Form.Label>
              <Select onChange={this.onChangeareaName}>
                {this.areaNames.map(areaN => (
                  <Select.Option key={areaN.id} dataKey={areaN.id}>
                    {areaN.areaName}
                  </Select.Option>
                ))}
              </Select>
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
    rentalService.addLocation(
      this.Name,
      this.postalNum,
      this.place,
      this.streetAddress,
      this.streetNum,
      this.state.curArea
    );

    history.push('/area/1');
  }

  cancel() {
    history.push('/area/1');
  }

  mounted() {
    rentalService.getArea(areaNames => {
      this.state.curArea = areaNames[0].a_id;
      this.areaNames = areaNames;
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
  AreaList,
  AddArea,
  LocationInArea,
  AddLocation,
  BikesOnLocation,
  NewBikeType,
  AddBikes,
  SelectedBike,
  AddLocation
};
