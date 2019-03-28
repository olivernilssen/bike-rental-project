import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1, Select } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { customerService } from './services/customersService';
import { basket, activeCustomer, equipmentBasket } from './index.js';
import { library } from '@fortawesome/fontawesome-svg-core';

import createHashHistory from 'history/createHashHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connection } from './services/mysql_connection';
import { equipmentService } from './services/equipmentService.js';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Basket extends Component {
  state = {
    inBasket: basket,
    kunder: [],
    phrase: '',
    activeC: activeCustomer,
    displayCustomer: 'block'
  };
  styleState = {
    display: 'block',
    clear: 'both'
  };

  removeBike(bike) {
    //Removes all equipment belong to bike with it
    for (var i = 0; equipmentBasket.length > i; i++) {
      if (equipmentBasket[i].bike_id == bike.id) {
        equipmentBasket.splice(i, 1);

        i--;
      }
    }

    //Removes bike from basket
    for (let i of basket) {
      if (bike == i) {
        basket.splice(basket.indexOf(i), 1);
        this.updateBasket();
      }
    }
  }

  updateBasket() {
    this.state.inBasket = [];

    if (basket.length == 0) this.styleState.display = 'none';
    else this.styleState.display = 'block';

    if (basket.length == 0) {
      this.setState(state => {
        const inBasket = state.inBasket.concat({ id: 'TOMT HER' });
        return { inBasket };
      });
    } else {
      this.setState(state => {
        const inBasket = state.inBasket.concat(basket);
        return { inBasket, basket };
      });
    }
  }

  handleChangePhrase(event) {
    this.setState({ state: (this.state.phrase = event.target.value) }, this.findCustomers());
  }

  findCustomers() {
    let queryPhrase = '';

    if (this.state.phrase == ' ') queryPhrase = '%';
    else queryPhrase = '%' + this.state.phrase + '%';

    customerService.getCustomerSearch(queryPhrase, results => {
      this.state.kunder = [];

      if (results.length == 0) {
        this.setState(state => {
          const kunder = state.kunder.concat({ firstName: 'Søk igjen' });
          return { kunder };
        });
      } else {
        this.setState(state => {
          const kunder = state.kunder.concat(results);
          return { kunder, results };
        });
      }
    });
  }

  chooseCustomer(customer) {
    this.state.displayCustomer = 'none';
    activeCustomer.splice(0, 1);
    activeCustomer.push(customer);
    this.setState({ state: (this.state.activeC[0] = customer) });
  }

  removeCustomer() {
    this.state.displayCustomer = 'block';
    this.setState({ state: (this.state.activeC[0] = [{ id: null }]) });
    this.setState({ state: (this.state.phrase = '') });
    this.findCustomers();
  }

  basketRemove(e) {
    for (var i = 0; equipmentBasket.length > i; i++) {
      if (equipmentBasket[i].id == e.id) {
        equipmentBasket.splice(i, 1);
      }
    }

    this.findCustomers();
  }

  render() {
    if (this.state.activeC[0].id == null) this.state.displayCustomer = 'block';
    else this.state.displayCustomer = 'none';

    const styles = {
      btnStyle: { display: this.styleState.display },
      divStyle: { display: this.state.displayCustomer }
    };

    const { divStyle } = styles;
    const { btnStyle } = styles;

    let notice;

    if (equipmentBasket.length == 0) {
      notice = (
        <Table.Tr>
          <Table.Td>Handlekurven din er tom for utstyr.</Table.Td>
        </Table.Tr>
      );
    }

    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <NavBar.Link to="#">
            <h1>Handlekurv</h1>
          </NavBar.Link>
        </NavBar>

        <Card>
          <Row>
            <Column>
              <Form.Label>
                <h4>
                  Valgt kunde: {this.state.activeC[0].id} {this.state.activeC[0].firstName}{' '}
                  {this.state.activeC[0].lastName}
                </h4>
              </Form.Label>
              <br />
              <Button.Danger
                style={btnStyle}
                onClick={() => {
                  this.removeCustomer();
                }}
              >
                Fjern Kunde
              </Button.Danger>
              <br />
              <br />

              <h6>Handlekurv for sykler:</h6>
              <div className="basket">
                <Column>
                  <Table>
                    <Table.Thead>
                      <Table.Th>ID</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Merke</Table.Th>
                      <Table.Th>Lokasjon</Table.Th>
                      <Table.Th>Fra Dato</Table.Th>
                      <Table.Th>Til Dato</Table.Th>
                      <Table.Th>Pris</Table.Th>
                      <Table.Th>Timesleie</Table.Th>
                      <Table.Th />
                      <Table.Th />
                    </Table.Thead>
                    <Table.Tbody>
                      {this.state.inBasket.map(bike => (
                        <Table.Tr key={bike.id}>
                          <Table.Td>{bike.id}</Table.Td>
                          <Table.Td>{bike.typeName}</Table.Td>
                          <Table.Td>{bike.brand}</Table.Td>
                          <Table.Td>{bike.name}</Table.Td>
                          <Table.Td>{bike.startDate}</Table.Td>
                          <Table.Td>{bike.endDate}</Table.Td>
                          <Table.Td>{bike.price}</Table.Td>
                          <Table.Td>{bike.dayRent ? 'Ja' : 'Nei'}</Table.Td>
                          <Table.Td>
                            <Button.Success
                              style={btnStyle}
                              onClick={() => history.push('/equipmentQuery/' + bike.id + '/edit')}
                            >
                              Velg utstyr
                            </Button.Success>
                          </Table.Td>
                          <Table.Td>
                            <Button.Danger
                              style={btnStyle}
                              onClick={() => {
                                this.removeBike(bike);
                              }}
                            >
                              Slett
                            </Button.Danger>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Column>
                <br />
                <br />

                <h6>Handlekurv for utstyr:</h6>
                <Column>
                  <Table>
                    <Table.Thead>
                      <Table.Th>Tilhører</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Merke</Table.Th>
                      <Table.Th>Størrelse</Table.Th>
                      <Table.Th>Pris</Table.Th>
                      <Table.Th />
                    </Table.Thead>
                    <Table.Tbody>
                      {notice}
                      {equipmentBasket.map(equip => (
                        <Table.Tr key={equip.id}>
                          <Table.Td>{equip.bike_id}</Table.Td>
                          <Table.Td>{equip.typeName}</Table.Td>
                          <Table.Td>{equip.brand}</Table.Td>
                          <Table.Td>{equip.comment}</Table.Td>
                          <Table.Td>{equip.price}</Table.Td>
                          <Table.Td>
                            <Button.Danger onClick={() => this.basketRemove(equip)}>Slett</Button.Danger>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Column>
              </div>
              <br />
              <Row>
                <Column>
                  <Button.Success onClick={this.transaction}>
                    <FontAwesomeIcon className="navIcon" icon="store" />
                    Til Betaling
                  </Button.Success>
                </Column>
              </Row>
            </Column>

            <Column style={divStyle} width={4}>
              <Card>
                <Column right>
                  <NavLink to={'/addCustomer/'}>
                    <Button.Success>Legg til ny kunde</Button.Success>
                  </NavLink>
                </Column>
                <Form.Label>Søk i kunder..</Form.Label>
                <Form.Input value={this.state.phrase} onChange={this.handleChangePhrase} />
                <br />
                <Table>
                  <Table.Thead>
                    <Table.Th>Fornavn</Table.Th>
                    <Table.Th>Etternavn</Table.Th>
                    <Table.Th />
                  </Table.Thead>
                  <Table.Tbody>
                    {this.state.kunder.map(kunde => (
                      <Table.Tr key={kunde.id}>
                        <Table.Td>{kunde.firstName}</Table.Td>
                        <Table.Td>{kunde.lastName}</Table.Td>
                        <Table.Td>
                          <Button.Success
                            onClick={() => {
                              this.chooseCustomer(kunde);
                            }}
                          >
                            <FontAwesomeIcon className="navIcon" icon="plus" />
                          </Button.Success>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Column>
          </Row>
        </Card>

        <br />
      </div>
    );
  }

  mounted() {
    customerService.getCustomerSearch('%', results => {
      this.setState(state => {
        const kunder = state.kunder.concat(results);
        return {
          kunder,
          results
        };
      });
    });
  }

  transaction() {
    //create new order
    //Add items to to order with customer ID
    //Remove items from current basket list
  }
}

class EquipmentQuery extends Component {
  suitableEquipment = [];
  equipmentTypes = [];
  choiceLock = false;
  secondChoiceLock = false;
  sizes = [];
  location = '';

  state = {
    selectStatus: '%',
    sizeSelectStatus: '%',
    inEqBasket: equipmentBasket
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.specify();
  }

  basketAdd(e) {
    equipmentBasket.push(e);
    this.specify();
  }

  basketRemove(e) {
    for (var i = 0; equipmentBasket.length > i; i++) {
      if (equipmentBasket[i].id == e.id) {
        equipmentBasket.splice(i, 1);
      }
    }

    this.specify();
  }

  render() {
    if (!this.sizes) return null;
    let notice;

    if (equipmentBasket.length == 0) {
      notice = (
        <Table.Tr>
          <Table.Td>Ingen valgte utstyr</Table.Td>
        </Table.Tr>
      );
    }

    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <NavBar.Link to="#">
            <h1>Handlekurv</h1>
          </NavBar.Link>
        </NavBar>
        <br />
        <Row>
          <Column>
            <Button.Light onClick={() => history.push('/basket/')}>Tilbake til handlekurv</Button.Light>
          </Column>
        </Row>
        <Card>
          <Row>
            <Column width={4}>
              <Form.Label>Utstyrstype:</Form.Label>
              <Select name={'selectStatus'} onChange={this.handleChange}>
                <Select.Option value="%">Velg en utstyrstype ...</Select.Option>
                {this.equipmentTypes.map(type => (
                  <Select.Option key={type.id} value={type.toString()}>
                    {type.toString()}
                  </Select.Option>
                ))}
              </Select>
            </Column>

            <Column width={4}>
              <Form.Label>Størrelse:</Form.Label>
              <Select name={'sizeSelectStatus'} onChange={this.handleChange}>
                <Select.Option key={'x'} value="%">
                  Velg en størrelse ...
                </Select.Option>
                {this.sizes.map(type => (
                  <Select.Option key={type.id} value={type.toString()}>
                    {type.toString()}
                  </Select.Option>
                ))}
              </Select>
            </Column>
          </Row>
          <br />
          <Row>
            <Column>
              <h6>Tilgjengelig utstyr:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>År</Table.Th>
                  <Table.Th>Størrelse</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.suitableEquipment.map(equip => (
                    <Table.Tr key={equip.id}>
                      <Table.Td>{equip.id}</Table.Td>
                      <Table.Td>{equip.typeName}</Table.Td>
                      <Table.Td>{equip.brand}</Table.Td>
                      <Table.Td>{equip.year}</Table.Td>
                      <Table.Td>{equip.comment}</Table.Td>
                      <Table.Td>{equip.objectStatus}</Table.Td>
                      <Table.Td>{equip.price}</Table.Td>
                      <Table.Td>
                        <Button.Success onClick={() => this.basketAdd(equip)}>
                          <FontAwesomeIcon className="navIcon" icon="plus" />
                        </Button.Success>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>

            <Column>
              <h6>Valgt utstyr:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Størrelse</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {notice}
                  {this.state.inEqBasket.map(equip => (
                    <Table.Tr key={equip.id}>
                      <Table.Td>{equip.id}</Table.Td>
                      <Table.Td>{equip.typeName}</Table.Td>
                      <Table.Td>{equip.brand}</Table.Td>
                      <Table.Td>{equip.comment}</Table.Td>
                      <Table.Td>{equip.price}</Table.Td>
                      <Table.Td>
                        <Button.Danger onClick={() => this.basketRemove(equip)}>Slett</Button.Danger>
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

  mounted() {
    equipmentService.getLocationFromBikeId(this.props.match.params.id, location => {
      this.location = location[0].id;
    });

    equipmentService.getTypeNameForSuitableEquipment(this.props.match.params.id, typeName => {
      equipmentService.getSuitableEquipment(
        this.location,
        this.state.selectStatus,
        this.state.sizeSelectStatus,
        typeName[0].typeName,
        equipment => {
          let k = this.props.match.params.id;
          equipment.forEach(function(e) {
            e.bike_id = +k;
          });

          this.suitableEquipment = equipment;

          if (this.secondChoiceLock == false) {
            this.sizes = equipment;

            let flags = [],
              output = [],
              l = this.sizes.length,
              i;
            for (i = 0; i < l; i++) {
              if (flags[this.sizes[i].comment]) continue;
              flags[this.sizes[i].comment] = true;
              output.push(this.sizes[i].comment);
            }

            this.sizes = output;
            this.secondChoiceLock = true;
          }

          if (this.choiceLock == false) {
            this.equipmentTypes = equipment;

            var flags = [],
              output = [],
              l = this.equipmentTypes.length;
            for (let i = 0; i < l; i++) {
              if (flags[this.equipmentTypes[i].typeName]) continue;
              flags[this.equipmentTypes[i].typeName] = true;
              output.push(this.equipmentTypes[i].typeName);
            }

            this.equipmentTypes = output;
            this.choiceLock = true;
          }
        }
      );
    });
  }

  specify() {
    equipmentService.getTypeNameForSuitableEquipment(this.props.match.params.id, typeName => {
      equipmentService.getSuitableEquipment(
        this.location,
        this.state.selectStatus,
        this.state.sizeSelectStatus,
        typeName[0].typeName,
        equipment => {
          let m = this.props.match.params.id;
          equipment.forEach(function(e) {
            e.bike_id += m;
          });

          this.suitableEquipment = equipment;

          for (var i = 0; this.suitableEquipment.length > i; i++) {
            for (var k = 0; equipmentBasket.length > k; k++) {
              if (this.suitableEquipment[i].id == equipmentBasket[k].id) {
                this.suitableEquipment.splice(i, 1);
              }
            }
          }

          if (this.secondChoiceLock == false) {
            this.sizes = equipment;
            var flags = [],
              output = [],
              l = this.sizes.length,
              i;

            for (i = 0; i < l; i++) {
              if (flags[this.sizes[i].comment]) continue;
              flags[this.sizes[i].comment] = true;
              output.push(this.sizes[i].comment);
            }

            this.sizes = output;
            this.secondChoiceLock = true;
          }

          if (this.choiceLock == false) {
            this.equipmentTypes = equipment;
            var flags = [],
              output = [],
              l = this.equipmentTypes.length,
              i;

            for (i = 0; i < l; i++) {
              if (flags[this.equipmentTypes[i].typeName]) continue;
              flags[this.equipmentTypes[i].typeName] = true;
              output.push(this.equipmentTypes[i].typeName);
            }

            this.equipmentTypes = output;
            this.choiceLock = true;
          }
        }
      );
    });
  }
}

module.exports = { Basket, EquipmentQuery };
