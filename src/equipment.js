import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { equipmentService } from './services/equipmentService';
import { connection } from './services/mysql_connection';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class EquipmentTypes extends Component {
  equipTypes = [];

  render() {
    return (
      <div>
        <H1>Sykkelutstyr</H1>
        <br />
        <Tab>
          {this.equipTypes.map(type => (
            <Tab.Item key={type.typeName} to={'/equipmentTypes/' + type.typeName}>
              {type.typeName}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/equipments/add/'}>
              <Button.Light>Legg inn nytt utstyr</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  mounted() {
    equipmentService.getDistinctEquipType(types => {
      for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < types.length; j++) {
          if (i == j) {
            continue;
          } else if (types[i].typeName == types[j].typeName) {
            types.splice(j, 1);
          }
        }
      }
      this.equipTypes = types;
    });
  }
}

class EquipTypeDetails extends Component {
  equipType = null;
  showingEquipment = 0;
  state = {
    equipments: [],
    typeIds: [],
    equipTypeDetails: []
  };

  showThisType(id) {
    if (this.showingEquipment === id) {
      this.state.equipments = [];
      let temp = [];

      for (let i = 0; i < this.state.typeIds.length; i++) {
        equipmentService.getEquipmentByTypeID(this.state.typeIds[i].id, results => {
          this.showingEquipment = id;
          this.setState(state => {
            const equipments = state.equipments.concat(results);
            return { equipments, results };
          });
        });
      }

      this.showingEquipment = 0;
    } else {
      this.state.equipments = [];
      equipmentService.getEquipmentByTypeID(id, results => {
        this.showingEquipment = id;
        this.setState(state => {
          const equipments = state.equipments.concat(results);
          return { equipments, results };
        });
      });
    }
  }

  render() {
    if (!this.equipType) return null;

    return (
      <div>
        <Card>
          <Row>
            <Column>
              <h6>Detaljert beskrivelse</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Årsmodell</Table.Th>
                  <Table.Th>Størrelse</Table.Th>
                  <Table.Th>Pris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.state.equipTypeDetails.map(type => (
                    <Table.Tr
                      key={type.id}
                      onClick={() => {
                        this.showThisType(type.id);
                      }}
                    >
                      <Table.Td>{type.brand}</Table.Td>
                      <Table.Td>{type.year}</Table.Td>
                      <Table.Td>{type.comment}</Table.Td>
                      <Table.Td>{type.price}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <br />
              <h6>Utstyr av denne typen:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.state.equipments.map(equip => (
                    <Table.Tr key={equip.id}>
                      <Table.Td>{equip.id}</Table.Td>
                      <Table.Td>{equip.name}</Table.Td>
                      <Table.Td>{equip.objectStatus}</Table.Td>
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
    this.state.equipments = [];
    this.state.equipTypeDetails = [];

    equipmentService.getEquipmentTypes(type => {
      this.equipType = type;
    });

    equipmentService.getTypeID(this.props.match.params.typeName, idResult => {
      this.state.typeIds = idResult;

      for (let i = 0; i < idResult.length; i++) {
        equipmentService.getEquipmentByTypeID(idResult[i].id, results => {
          this.setState(state => {
            const equipments = state.equipments.concat(results);
            return { equipments, results };
          });
        });

        equipmentService.getEquipmentTypesWhere(idResult[i].id, typeResult => {
          this.setState(state => {
            const equipTypeDetails = state.equipTypeDetails.concat(typeResult);
            return {
              equipTypeDetails,
              typeResult
            };
          });
        });
      }
    });
  }
}

class AddEquipment extends Component {
  antall = 0;
  equipmentTypes = [];
  locations = [];
  state = {
    selectedEquipTypeID: 1,
    curLocation: ''
  };

  onChangeType(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({
      state: (this.state.selectedEquipTypeID = event.target.options[selectedIndex].getAttribute('data-key'))
    });
  }

  onChangeLocation(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({ state: (this.state.curLocation = event.target.options[selectedIndex].getAttribute('data-key')) });
    console.log(this.state.curLocation);
  }

  render() {
    return (
      <div>
        <Card>
          <div className="container">
            <h5>Legg inn nytt sykkelutstyr</h5>
            <br />
            <div className="container">
              <Row>
                <Column width={3}>
                  <Row>
                    <Form.Label>Utstyrstype:</Form.Label>
                  </Row>
                  <Row>
                    <select onChange={this.onChangeType}>
                      {this.equipmentTypes.map(type => (
                        <option key={type.id} data-key={type.id}>
                          {type.typeName} {type.brand} {type.year} {type.comment}
                        </option>
                      ))}
                    </select>
                  </Row>
                </Column>
                <Column widht={3}>
                  <Row>
                    <Form.Label>Lokasjon: </Form.Label>
                  </Row>
                  <Row>
                    <select onChange={this.onChangeLocation}>
                      {this.locations.map(lokasjon => (
                        <option key={lokasjon.id} data-key={lokasjon.id}>
                          {lokasjon.name}
                        </option>
                      ))}
                    </select>
                  </Row>
                </Column>
              </Row>
              <br />
              <Row>
                <Column width={3}>
                  <Row>
                    <Form.Label>Antall:</Form.Label>
                  </Row>
                  <Row>
                    <Form.Input type="text" onChange={event => (this.antall = event.target.value)} />
                  </Row>
                </Column>
              </Row>
              <br />
              <Row>
                <Column>
                  <Button.Success onClick={this.add}>Add</Button.Success>
                </Column>
                <Column right>
                  <Button.Light onClick={this.cancel}>Cancel</Button.Light>
                </Column>
              </Row>
            </div>
          </div>
        </Card>
        <br />
        <div>
          <NewEquipmentType />
        </div>
        <br />
      </div>
    );
  }

  add() {
    if (this.antall <= 0) {
      return;
    } else {
      for (let i = 0; i < this.antall; i++) {
        equipmentService.addEquipment(this.state.curLocation, this.state.selectedEquipTypeID, 'OK');
      }
    }

    history.push('/equipmentTypes/Helmet');
  }

  cancel() {
    history.push('/equipmentTypes/Helmet');
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.state.curLocation = locations[0].id;
      this.locations = locations;
    });

    equipmentService.getEquipmentTypes(type => {
      this.selectedEquipment = type[0].id;
      this.equipmentTypes = type;
    });
  }
}

class NewEquipmentType extends Component {
  typeName = '';
  brand = '';
  year = 0;
  comment = '';
  price = 0;

  render() {
    return (
      <Card>
        <div className="container">
          <h5>Ny utstyrstype</h5>
          <Row>
            <Column>
              <Form.Label>Type:</Form.Label>
              <Form.Input type="text" onChange={event => (this.typeName = event.target.value)} />
              <Form.Label>Merke:</Form.Label>
              <Form.Input type="text" onChange={event => (this.brand = event.target.value)} />
              <Form.Label>Årsmodell:</Form.Label>
              <Form.Input type="text" onChange={event => (this.year = event.target.value)} />
            </Column>
            <Column>
              <Form.Label>Størrelse:</Form.Label>
              <Form.Input type="text" onChange={event => (this.comment = event.target.value)} />
              <Form.Label>Pris:</Form.Label>
              <Form.Input type="text" onChange={event => (this.price = event.target.value)} />
              <br />
              <br />
            </Column>
          </Row>
          <br />
          <Row>
            <Column>
              <Button.Success onClick={this.add}>Add</Button.Success>
            </Column>
            <Column right>
              <Button.Light onClick={this.cancel}>Cancel</Button.Light>
            </Column>
          </Row>
        </div>
      </Card>
    );
  }

  add() {
    equipmentService.newEquipmentType(this.typeName, this.brand, this.year, this.comment, this.price);

    history.push('/equipmentTypes/Helmet');
  }

  cancel() {
    history.push('/equipmentTypes/Helmet');
  }
}

module.exports = {
  EquipmentTypes,
  EquipTypeDetails,
  AddEquipment
};
