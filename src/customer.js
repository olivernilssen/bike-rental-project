import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { customerService } from './services/customersService';
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

    customerService.getCustomerSearch(word, results => {
      this.setState(state => {
        this.state.customers = [];
        const customers = state.customers.concat(results);
        return { customers, results };
      });
    });
  }

  chooseActive(customer) {
    customerService.getCustomer(customer.id, result => {
      this.setState({ state: (this.state.activeCustomer = result) });
    });
  }

  render() {
    return (
      <div>
        <H1>Kundeliste</H1>

        <Column right>
          <NavLink to={'/addCustomer/'}>
            <Button.Light>Legg til ny kunde</Button.Light>
          </NavLink>
        </Column>
        <Card>
          <Row>
            <Column>
              <Form.Input id="testSearch" type="search" onChange={this.onChangeHandle} placeholder="Søk etter kunde" />
              <br />
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
                      }}
                    >
                      <Table.Td>{customer.id}</Table.Td>
                      <Table.Td>{customer.firstName}</Table.Td>
                      <Table.Td>{customer.lastName}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
            <Column>
              <SelectedCustomer activeCustomer={this.state.activeCustomer} />
            </Column>
          </Row>
        </Card>
        <br />
      </div>
    );
  }

  mounted() {
    customerService.getCustomerSearch('%', results => {
      this.state.customers = results;
    });

    customerService.getCustomer('1', result => {
      this.setState({ activeCustomer: result });
    });
  }
}

class SelectedCustomer extends Component {
  firstName = '';
  lastName = '';
  email = '';
  tlf = 0;
  streetAddress = 0;
  streetNum = 0;
  postalNum = 0;
  place = '';
  address_id = null;


  state = {
    customer: this.props.activeCustomer,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ customer: nextProps.activeCustomer });
    this.setState({ change: false});
  }

  render() {
    if (!this.state.customer) return null;

    if(this.state.change) {

      return (
        <Card>
          <Column>
          <h5>Endre Kunde:</h5>
          <br />
          <Form.Label>Kunde id:</Form.Label>
              <Form.Input type="text" value={this.state.customer.id} disabled onChange={event => (this.id = event.target.value)} />
          <Form.Label>Fornavn:</Form.Label>
              <Form.Input type="text" value={this.state.customer.firstName} onChange={event => (this.firstName = event.target.value)} />
          <Form.Label>Etternavn:</Form.Label>
              <Form.Input type="text" placeholder={this.state.customer.lastName} onChange={event => (this.lastName = event.target.value)} />
          <Form.Label>Epost:</Form.Label>
              <Form.Input type="text" placeholder={this.state.customer.email} onChange={event => (this.email = event.target.value)} />
          <Form.Label>Telefon:</Form.Label>
              <Form.Input type="text" placeholder={this.state.customer.tlf} onChange={event => (this.tlf = event.target.value)} />
          <Form.Label>Adresse:</Form.Label>
              <Form.Input type="text" placeholder={this.state.customer.streetAddress} onChange={event => (this.streetAddress = event.target.value)} />
          <Form.Label>Gatenummer:</Form.Label>
              <Form.Input type="text" placeholder={this.state.customer.streetNum} onChange={event => (this.streetNum = event.target.value)} />
          <Form.Label>Postnummer:</Form.Label>
              <Form.Input type="text" placeholder={this.state.customer.postalNum} onChange={event => (this.postalNum = event.target.value)} />
          <Form.Label>Sted:</Form.Label>
              <Form.Input type="text" placeholder={this.state.customer.place} onChange={event => (this.place = event.target.value)} />
          <br />
          <Button.Success onClick={this.save}>Oppdatere informasjon</Button.Success>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Button.Danger onClick={this.cancel}>Gå tilbake</Button.Danger>
          </Column>
        </Card>
      )

    } else {

    return (
      <Card>
        <Column>
          <h5>Valgt Kunde:</h5>
          <br />
          <h6>
            {this.state.customer.firstName} {this.state.customer.lastName}
          </h6>
          <Table>
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
          <br />
          <Button.Success onClick={this.change}>Endre</Button.Success>
        </Column>
      </Card>
    );
  }
}


  change() {
    this.setState({ change: true});
  }

  cancel() {
    this.setState({ change: false})
  }

  mounted() {
    customerService.getCustomer('1', result => {
      this.setState({ state: (this.state.customer = result) });
    });

  }

  save() {
    //Check if address already in database
    customerService.getAddressID(this.postalNum, this.postalNum, this.streetAddress, this.streetNum, result => {
      // console.log(result);
      if (result === undefined) {
        customerService.updateAddress(this.postalNum, this.postalNum, this.streetAddress, this.streetNum);

        customerService.getAddressID(this.postalNum, this.postalNum, this.streetAddress, this.streetNum, newID => {
          customerService.updateCustomer(this.firstName, this.lastName, this.email, this.tlf, newID.id);
        });
      } else {
        customerService.updateCustomer(this.firstName, this.lastName, this.email, this.tlf, result.id);
      }
    });

    history.push('/customers/');
  }

}

class AddCustomer extends Component {
  firstName = '';
  lastName = '';
  email = '';
  tlf = 0;
  street = 0;
  streetNum = 0;
  postal = 0;
  place = '';
  addressID = null;

  render() {
    return (
      <Card>
        <div className="container">
          <h5>Ny kunde</h5>
          <br />
          <Row>
            <Column>
              <Form.Label>Fornavn:</Form.Label>
              <Form.Input type="text" required={true} onChange={event => (this.firstName = event.target.value)} />
              <Form.Label>Email:</Form.Label>
              <Form.Input type="text" required={true} onChange={event => (this.email = event.target.value)} />
              <br /> <br />
              <Form.Label>Gateaddresse:</Form.Label>
              <Form.Input type="text" required={true} onChange={event => (this.street = event.target.value)} />
              <Form.Label>Poststed:</Form.Label>
              <Form.Input type="text" required={true} onChange={event => (this.postal = event.target.value)} />
              <br /> <br />
              <Row>
                <Column>
                  <Button.Success onClick={this.add}>Add</Button.Success>
                </Column>
              </Row>
            </Column>
            <Column>
              <Form.Label>Etternavn</Form.Label>
              <Form.Input type="text" required={true} onChange={event => (this.lastName = event.target.value)} />
              <Form.Label>Telefon:</Form.Label>
              <Form.Input type="text" required={true} onChange={event => (this.tlf = event.target.value)} />
              <br /> <br />
              <Form.Label>Gatenummer:</Form.Label>
              <Form.Input type="text" required={true} onChange={event => (this.streetNum = event.target.value)} />
              <Form.Label>Postnummer:</Form.Label>
              <Form.Input type="text" required={true} onChange={event => (this.postalNum = event.target.value)} />
              <br />
              <br />
              <Row>
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

  cancel() {
    history.push('/customers/');
  }

  add() {
    //Check if address already in database
    customerService.getAddressID(this.postalNum, this.postal, this.street, this.streetNum, result => {
      // console.log(result);
      if (result === undefined) {
        customerService.addAddress(this.postalNum, this.postal, this.street, this.streetNum);

        customerService.getAddressID(this.postalNum, this.postal, this.street, this.streetNum, newID => {
          customerService.addCustomer(this.firstName, this.lastName, this.email, this.tlf, newID.id);
        });
      } else {
        customerService.addCustomer(this.firstName, this.lastName, this.email, this.tlf, result.id);
      }
    });

    history.push('/customers/');
  }
}

module.exports = { Customers, AddCustomer };
