import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, ButtonLight } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { connection } from './mysql_connection';
import { basket, employeeID } from './index.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Customers extends Component {
  state = {
    customers: [],
    searchWord: '',
    activeCustomer: null
  };

  onChangeHandle(event) {
    this.setState({ state: (this.state.searchWord = event.target.value) }, this.searchCustomer());
  }

  searchCustomer() {
    let word = '%' + this.state.searchWord + '%';

    rentalService.getCustomerSearch(word, results => {
      this.setState(state => {
        this.state.customers = [];
        const customers = state.customers.concat(results);
        return { customers, results };
      });
    });
  }

  chooseActive(customer) {
    rentalService.getCustomer(customer.id, result => {
      // console.log("chooseActive()")
      this.setState({ state: (this.state.activeCustomer = result) });
    });
  }

  addCustomer() {}

  render() {
    // console.log("render customer()");

    return (
      <Card>
        <Row>
          <Column>
            <h6>Kundeliste</h6>
            <Form.Input id="testSearch" type="search" onChange={this.onChangeHandle} placeholder="Søk etter kunde" />
            <br /> <br />
            <Table>
              <Table.Thead>
                <Table.Th>KundeID</Table.Th>
                <Table.Th>Fornavn</Table.Th>
                <Table.Th>Etternavn</Table.Th>
              </Table.Thead>
              <Table.Tbody>
                {this.state.customers.map(customer => (
                  <Table.Tr
                    key={customer.id}
                    onClick={() => {
                      this.chooseActive(customer);
                    }}>
                    <Table.Td>{customer.id}</Table.Td>
                    <Table.Td>{customer.firstName}</Table.Td>
                    <Table.Td>{customer.lastName}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Column>
          <Column>
            <Button.Light>Legg til ny kunde</Button.Light>
            <SelectedCustomer activeCustomer={this.state.activeCustomer} />
          </Column>
        </Row>
      </Card>
    );
  }

  mounted() {
    rentalService.getCustomerSearch('%', results => {
      this.setState(state => {
        const customers = state.customers.concat(results);
        return { customers, results };
      });
    });

    rentalService.getCustomer('1', result => {
      // console.log("mounting")
      this.setState({activeCustomer: result});
    });
  }
}

class SelectedCustomer extends Component {
  state = {
    customer: this.props.activeCustomer
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ customer: nextProps.activeCustomer });
  }

  render() {
    // const icon = <Icon name="rocket" />
    if (!this.state.customer) return null;
    // console.log("render selectedCustomer");

    return (
      <Column>
        <h6>Valgt Kunde:</h6>
        <h6>
          {this.state.customer.firstName} {this.state.customer.lastName}
        </h6>
        <Table>
          <Table.Thead>
            <Table.Th />
            <Table.Th />
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Kunde id:</Table.Td>
              <Table.Td>{this.state.customer.id}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Fornavn:</Table.Td>
              <Table.Td>{this.state.customer.firstName}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Etternavn:</Table.Td>
              <Table.Td>{this.state.customer.lastName}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Epost:</Table.Td>
              <Table.Td>{this.state.customer.email}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Telefon:</Table.Td>
              <Table.Td>{this.state.customer.tlf}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Adresse:</Table.Td>
              <Table.Td>
                {this.state.customer.streetAddress} {this.state.customer.streetNum}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Poststed:</Table.Td>
              <Table.Td>
                {this.state.customer.postalNum} {this.state.customer.place}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Column>
    );
  }

  mounted() {
    rentalService.getCustomer('1', result => {
      // console.log("Mounting2")
      this.setState({ state: (this.state.customer = result) });
    });
  }
}

class AddCustomer extends Component {
  render() {
    return (
      <Card>
        <h6>Legg til kunde</h6>
      </Card>
    );
  }
}

module.exports = {Customers, AddCustomer};
