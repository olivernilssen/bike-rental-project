import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Card,
  Tab,
  List,
  Row,
  Column,
  NavBar,
  Button,
  ButtonOutline,
  Form,
  Table,
  ClickTable,
  H1,
  Select
} from './widgets';
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
        <NavBar brand="CycleOn Rentals">
          <h1>Sykkelutstyr</h1>
        </NavBar>
        <Tab ariaLabel="Equipment-types">
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

class EquipmentTypesOtherMain extends Component {
  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykkelutstyr</h1>
        </NavBar>
        <Card>
          <Row>
            <Column>
              Opprettelsen av begrensningen var vellykket.
              <br />
              <br />
            </Column>
          </Row>
        </Card>
      </div>
    );
  }
}

class EquipmentTypesMain extends Component {
  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykkelutstyr</h1>
        </NavBar>
        <Card>
          <Row>
            <Column>
              Slettingen av begrensningen var vellykket.
              <br />
              <br />
            </Column>
          </Row>
        </Card>
      </div>
    );
  }
}

class EquipTypeDetails extends Component {
  handler = '';
  restrictions = [];
  equipType = null;
  distinctBikeType = null;
  lock = false;
  selectStatus = '';
  showingEquipment = 0;

  state = {
    priceEquip: 0,
    equipments: [],
    typeIds: [],
    equipTypeDetails: []
  };

  showThisType(type) {
    let index = this.state.equipTypeDetails
      .map(function(e) {
        return e.id;
      })
      .indexOf(type.id);

    for (let i = 0; i < this.state.equipTypeDetails.length; i++) {
      this.state.equipTypeDetails[i].selectedEquip = false;
    }

    if (this.showingEquipment === type.id && this.lock == true) {
      this.lock = false;
      this.state.equipments = [];

      for (let i = 0; i < this.state.typeIds.length; i++) {
        equipmentService.getEquipmentByTypeID(this.state.typeIds[i].id, results => {
          this.setState(state => {
            const equipments = state.equipments.concat(results);
            return { equipments, results };
          });
        });
      }
      this.showingEquipment = 0;
    } else {
      this.lock = true;

      equipmentService.getEquipmentByTypeID(type.id, results => {
        this.showingEquipment = type.id;
        this.setState(state => {
          this.state.equipments = [];
          const equipments = state.equipments.concat(results);
          return { equipments, results };
        });
      });

      this.state.equipTypeDetails[index].selectedEquip = true;
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    if (!this.equipType) return null;
    if (!this.distinctBikeType) return null;

    let notice;

    if (this.lock == true) {
      notice = (
        <p style={{ color: 'red' }}>Trykk på samme leiegjenstand igjen for å se beholdning for alle størrelser/typer</p>
      );
    }

    let noRestr;

    if (this.restrictions.length == 0) {
      noRestr = <Table.Td>Det ble ikke funnet noen begrensninger.</Table.Td>;
    }

    return (
      <div role="main">
        <Card>
          <Row>
            <Column width={12}>
              <h6>Velg en spesiell størrelse/type ved å trykke på den i tabellen:</h6>
              <ClickTable>
                <ClickTable.Thead>
                  <ClickTable.Th>Merke</ClickTable.Th>
                  <ClickTable.Th>Årsmodell</ClickTable.Th>
                  <ClickTable.Th>Størrelse</ClickTable.Th>
                  <ClickTable.Th>Pris</ClickTable.Th>
                  <ClickTable.Th />
                </ClickTable.Thead>
                <ClickTable.Tbody>
                  {this.state.equipTypeDetails.map(type => (
                    <ClickTable.Tr
                      style={type.selectedEquip ? { backgroundColor: '#c5e0e4' } : { backgroundColor: '' }}
                      key={type.id}
                      onClick={() => {
                        this.showThisType(type);
                      }}
                    >
                      <ClickTable.Td>{type.brand}</ClickTable.Td>
                      <ClickTable.Td>{type.year}</ClickTable.Td>
                      <ClickTable.Td>{type.comment}</ClickTable.Td>
                      <ClickTable.Td>
                        {type.changePrice ? (
                          <Form.Input
                            style={{ width: 70 + 'px' }}
                            name="priceEquip"
                            value={this.state.priceEquip}
                            onChange={this.handleChange}
                          />
                        ) : (
                          type.price
                        )}
                      </ClickTable.Td>
                      <ClickTable.Td>
                        {type.changePrice ? (
                          <ButtonOutline.Success
                            style={{ float: 'right' }}
                            onClick={() => {
                              this.save(type);
                            }}
                          >
                            {' '}
                            {type.changePrice ? 'Lagre' : 'Endre'}
                          </ButtonOutline.Success>
                        ) : (
                          <ButtonOutline.Secondary
                            style={{ float: 'right' }}
                            onClick={() => {
                              this.change(type);
                            }}
                          >
                            {type.changePrice ? 'Lagre' : 'Endre'}
                          </ButtonOutline.Secondary>
                        )}
                      </ClickTable.Td>
                    </ClickTable.Tr>
                  ))}
                </ClickTable.Tbody>
              </ClickTable>
            </Column>
          </Row>
          <Row>
            <Column right>{notice}</Column>
          </Row>
          <br />
          <Row>
            <Column>
              <h6>Beholdning for valgte varer:</h6>
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

            <Column>
              <Row>
                <Column>
                  <h6>Sykkeltyper utstyret IKKE passer til:</h6>
                  <Table>
                    <Table.Thead>
                      <Table.Th>Navn</Table.Th>
                      <Table.Th>Endre</Table.Th>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>{noRestr}</Table.Tr>
                      {this.restrictions.map(restrictions => (
                        <Table.Tr key={restrictions.id}>
                          <Table.Td>{restrictions.typeName}</Table.Td>
                          <Table.Td>
                            <ButtonOutline.Success onClick={() => this.delete(restrictions.id)}>
                              Tillat
                            </ButtonOutline.Success>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Column>
              </Row>
              <br />
              <Row>
                <Column>
                  <h6>Velg ny sykkeltype å begrense for dette utstyret:</h6>
                  <Select
                    name="typeSelect"
                    value={this.selectStatus}
                    onChange={event => (this.selectStatus = event.target.value)}
                  >
                    <Select.Option value="">Du har ikke valgt noen sykkel..</Select.Option>
                    {this.distinctBikeType.map(trestrictions => (
                      <Select.Option key={trestrictions.id}>{trestrictions.typeName} </Select.Option>
                    ))}
                  </Select>
                  <br />
                  <br />
                  <ButtonOutline.Danger
                    style={{ float: 'right' }}
                    onClick={() => {
                      this.add();
                    }}
                  >
                    Legg til ny restriksjon
                  </ButtonOutline.Danger>
                </Column>
              </Row>
            </Column>
          </Row>
        </Card>
        <br />

        <br />
      </div>
    );
  }

  change(type) {
    for (let i = 0; i < this.state.equipTypeDetails.length; i++) {
      this.state.equipTypeDetails[i].changePrice = false;
    }

    let index = this.state.equipTypeDetails
      .map(function(e) {
        return e.id;
      })
      .indexOf(type.id);
    this.setState({ priceEquip: type.price });
    this.state.equipTypeDetails[index].changePrice = true;
  }

  save(type) {
    connection.query('update EquipmentType set price = ? where id = ?', [this.state.priceEquip, type.id], error => {
      if (error) console.error(error);
    });

    let index = this.state.equipTypeDetails
      .map(function(e) {
        return e.id;
      })
      .indexOf(type.id);
    this.state.equipTypeDetails[index].price = this.state.priceEquip;
    this.state.equipTypeDetails[index].changePrice = false;
  }

  add() {
    if (this.selectStatus != '') {
      equipmentService.getBikeIdByName(this.selectStatus, idResult => {
        equipmentService.addRestriction(idResult[0].id, this.state.equipTypeDetails[0].id, () => {
          history.push('/equipmentTypes/Skip/OtherMain');
        });
      });
    }
  }

  delete(id) {
    this.handler = id;

    equipmentService.deleteRestriction(this.handler, this.state.equipTypeDetails[0].id, () => {
      history.push('/equipmentTypes/Skip/Main');
    });
  }

  mounted() {
    equipmentService.getRestrictions(this.props.match.params.typeName, results => {
      this.restrictions = results;
      this.lock = false;
    });

    this.state.equipments = [];
    this.state.equipTypeDetails = [];

    equipmentService.getEquipmentTypes(type => {
      this.equipType = type;
    });

    equipmentService.getDistinctBikeType(this.props.match.params.typeName, distinctType => {
      this.distinctBikeType = distinctType;
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
          for (let i = 0; i < typeResult.length; i++) {
            typeResult[i].selectedEquip = false;
            typeResult[i].changePrice = false;
          }
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
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykkelutstyr</h1>
        </NavBar>
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
                    <Select onChange={this.onChangeType}>
                      {this.equipmentTypes.map(type => (
                        <Select.Option key={type.id} dataKey={type.id}>
                          {type.typeName} {type.brand} {type.year} {type.comment}
                        </Select.Option>
                      ))}
                    </Select>
                  </Row>
                </Column>
                <Column width={3}>
                  <Row>
                    <Form.Label>Lokasjon: </Form.Label>
                  </Row>
                  <Row>
                    <Select onChange={this.onChangeLocation}>
                      {this.locations.map(lokasjon => (
                        <Select.Option key={lokasjon.id} dataKey={lokasjon.id}>
                          {lokasjon.name}
                        </Select.Option>
                      ))}
                    </Select>
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
                    <Form.Input type="number" onChange={event => (this.antall = event.target.value)} />
                  </Row>
                </Column>
              </Row>
              <br />
              <Row>
                <Column>
                  <ButtonOutline.Success onClick={this.add}>Add</ButtonOutline.Success>
                </Column>
                <Column right>
                  <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
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
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykkelutstyr</h1>
        </NavBar>
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
                <ButtonOutline.Success onClick={this.add}>Add</ButtonOutline.Success>
              </Column>
              <Column right>
                <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
              </Column>
            </Row>
          </div>
        </Card>
      </div>
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
  AddEquipment,
  EquipmentTypesMain,
  EquipmentTypesOtherMain
};
