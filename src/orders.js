import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, ButtonLight } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { orderService } from './services/ordersService';
import { emplyoeeID } from './index.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Orders extends Component {
  state = {
    orders: [],
    searchWord: '',
    activeOrder: 0
  };

  onChangeHandle(event) {
    this.setState({ state: (this.state.searchWord = event.target.value) }, this.searchOrder());
  }

  searchOrder() {
    let word = '%' + this.state.searchWord + '%';

    orderService.getOrderSearch(word, results => {
      this.setState(state => {
        this.state.orders = [];
        const orders = state.orders.concat(results);
        return { orders, results };
      });
    });
  }

  chooseActive(order) {
    orderService.getOrder(order.id, result => {
      this.setState({ state: (this.state.activeOrder = result) });
    });
  }

  render() {
    return (
      <Card>
        <Row>
          <Column width={4}>
            <h5>Alle bestillinger</h5>
            <Form.Input
              id="testSearch"
              type="search"
              onChange={this.onChangeHandle}
              placeholder="Søk etter bestilling"
            />
            <br /> <br />
            <Table>
              <Table.Thead>
                <Table.Th>Ordredato</Table.Th>
                <Table.Th>OrdreID</Table.Th>
                <Table.Th>KundeID</Table.Th>
              </Table.Thead>
              <Table.Tbody>
                {this.state.orders.map(order => (
                  <Table.Tr
                    key={order.id}
                    onClick={() => {
                      this.chooseActive(order);
                    }}
                  >
                    <Table.Td>{order.dateOrdered.toString().substring(4, 16)}</Table.Td>
                    <Table.Td>{order.id}</Table.Td>
                    <Table.Td>{order.customer_id}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Column>

          <Column>
            <br />
            <SelectedOrder activeOrder={this.state.activeOrder} />
          </Column>
        </Row>
      </Card>
    );
  }

  mounted() {
    orderService.getOrderSearch('%', results => {
      this.setState(state => {
        const orders = state.orders.concat(results);
        return { orders, results };
      });
    });

    orderService.getOrder('1', result => {
      this.setState({ state: (this.state.activeOrder = result) });
    });
  }
}

class SelectedOrder extends Component {
  bikes = [];
  equipments = [];

  state = {
    order: this.props.activeOrder
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ state: (this.state.order = nextProps.activeOrder) });

    orderService.getBikesFromOrder(this.state.order.id, bikes => {
      this.bikes = bikes;
    });

    orderService.getEquipmentFromOrder(this.state.order.id, equipments => {
      this.equipments = equipments;
    });
  }

  render() {
    if (!this.state.order) return null;

    return (
      <Card>
        <h5>Valgt ordre: {this.state.order.id}</h5>
        <br />
        <Row>
          <Column>
            <Row>
              <Column width={4}>
                <b>Bestillingsdato:</b>
              </Column>
              <Column>{this.state.order.dateOrdered.toString().substring(4, 24)}</Column>
            </Row>
            <Row>
              <Column width={4}>
                <b>Ordre id:</b>
              </Column>
              <Column>{this.state.order.id}</Column>
            </Row>
            <Row>
              <Column width={4}>
                <b>Kunde id:</b>
              </Column>
              <Column>{this.state.order.customer_id}</Column>
            </Row>
            <Row>
              <Column width={4}>
                <b>Kundenavn:</b>
              </Column>
              <Column>
                {this.state.order.firstName} {this.state.order.lastName}
              </Column>
            </Row>
            <Row>
              <Column width={4}>
                <b>Leietype:</b>
              </Column>
              <Column>{this.state.order.typeName}</Column>
            </Row>
            <Row>
              <Column width={4}>
                <b>Fra dato:</b>
              </Column>
              <Column>{this.state.order.fromDateTime.toString().substring(4, 16)}</Column>
            </Row>
            <Row>
              <Column width={4}>
                <b>Til dato:</b>
              </Column>
              <Column>{this.state.order.toDateTime.toString().substring(4, 16)}</Column>
            </Row>
            <Row>
              <Column width={4}>
                <b>Pris:</b>
              </Column>
              <Column>{this.state.order.price}</Column>
            </Row>
            <br />
          </Column>
        </Row>
        <Row>
          <Column width={8}>
            <h6>Sykler:</h6>
            <Table>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>
                    <b>ID</b>
                  </Table.Td>
                  <Table.Td>
                    <b>Sykkeltype</b>
                  </Table.Td>
                  <Table.Td>
                    <b>Merke</b>
                  </Table.Td>
                  <Table.Td>
                    <b>Modell</b>
                  </Table.Td>
                  <Table.Td>
                    <b>Pris</b>
                  </Table.Td>
                </Table.Tr>
                {this.bikes.map(bike => (
                  <Table.Tr key={bike.id}>
                    <Table.Td>{bike.id}</Table.Td>
                    <Table.Td>{bike.typeName}</Table.Td>
                    <Table.Td>{bike.brand}</Table.Td>
                    <Table.Td>{bike.model}</Table.Td>
                    <Table.Td>{bike.price} kr</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Column>
        </Row>
        <br />
        <Row>
          <Column width={8}>
            <h6>Utstyr</h6>
            <Table>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>
                    <b>UtstyrsID</b>
                  </Table.Td>
                  <Table.Td>
                    <b>Utstyrstype</b>
                  </Table.Td>
                  <Table.Td>
                    <b>Merke</b>
                  </Table.Td>
                  <Table.Td>
                    <b>Pris</b>
                  </Table.Td>
                </Table.Tr>
                {this.equipments.map(equipment => (
                  <Table.Tr key={equipment.id}>
                    <Table.Td>{equipment.id}</Table.Td>
                    <Table.Td>{equipment.typeName}</Table.Td>
                    <Table.Td>{equipment.brand}</Table.Td>
                    <Table.Td>{equipment.price}</Table.Td>
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
    orderService.getOrder('1', result => {
      this.setState({ state: (this.state.order = result) });
      console.log(this.state.order);
    });

    orderService.getBikesFromOrder(this.state.order.id, bikes => {
      this.bikes = bikes;
    });

    orderService.getEquipmentFromOrder(this.state.order.id, equipments => {
      this.equipments = equipments;
    });
  }
}

module.exports = { Orders };
