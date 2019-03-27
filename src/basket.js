import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { customerService } from './services/customersService';
import { basket, activeCustomer, equipmentBasket } from './index.js';

import createHashHistory from 'history/createHashHistory';
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
        <H1>Handlekurv</H1>
        <br />
        <Card>
          <Row>
            <Column width={8}>
              <Form.Label>
                <h4>
                  Valgt kunde: {this.state.activeC[0].id} {this.state.activeC[0].firstName}{' '}
                  {this.state.activeC[0].lastName}
                </h4>
              </Form.Label>
              <br />
              <Button.Danger
                onClick={() => {
                  this.removeCustomer();
                }}
              >
                Fjern Kunde
              </Button.Danger>
              <br />
              <br />

              <h6>Handlekurv for sykler:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Hjul</Table.Th>
                  <Table.Th>Vekt</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th>Fra Dato</Table.Th>
                  <Table.Th>Til Dato</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.state.inBasket.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.name}</Table.Td>
                      <Table.Td>{bike.price}</Table.Td>
                      <Table.Td>{bike.startDate}</Table.Td>
                      <Table.Td>{bike.endDate}</Table.Td>
                      <Table.Td>
                        <Button.Success
                          style={btnStyle}
                          onClick={() => history.push('/equipmentQuery/' + bike.id + '/edit')}
                        >
                          Velge utstyr
                        </Button.Success>
                      </Table.Td>
                      <Table.Td>
                        <Button.Danger
                          style={btnStyle}
                          onClick={() => {
                            this.removeBike(bike);
                          }}
                        >
                          Delete
                        </Button.Danger>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <br />
              <br />

              <h6>Handlekurv for utstyr:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>Tilhører</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Størrelse</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th>Knapp</Table.Th>
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

            <Column width={0.5} />

            <Column style={divStyle}>
              <Form.Label>Søk i kunder ...</Form.Label>
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
                          Velg
                        </Button.Success>
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
}

module.exports = { Basket };
