import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, ButtonOutline, Form, Table, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { orderService } from './services/ordersService';
import { basket, employeeID } from './index.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class UserInfo extends Component {
  firstName = '';
  surName = '';
  email = '';
  tel = '';
  street = '';
  place = '';
  postalCode = '';
  streetNum = '';

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Min side</h1>
        </NavBar>

        <Card role="main">
        
          <Row>
            <Column width={5}>
              <b>Fornavn:</b> {this.firstName}
            </Column>
            <Column width={5}>
              <b>Etternavn:</b> {this.surName}
            </Column>
          </Row>
          <Row>
            <Column width={5}>
              <b>Epost:</b> {this.email}
            </Column>
            <Column width={5}>
              <b>Telefonnummer:</b> {this.tel}
            </Column>
          </Row>
          <Row>
            <Column width={10}>
              <b>Gateadresse:</b> {this.street} {this.streetNum}
            </Column>
          </Row>
          <Row>
            <Column width={5}>
              <b>Poststed:</b> {this.place}
            </Column>
            <Column width={5}>
              <b>Postnummer:</b> {this.postalCode}
            </Column>
          </Row>
          <br />
          <ButtonOutline.Success type="button" onClick={() => history.push('/EditUserInfo')}>
            Endre informasjon
          </ButtonOutline.Success>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getEmployee(employeeID, employee => {
      this.firstName = employee.firstName;
      this.surName = employee.lastName;
      this.email = employee.email;
      this.tel = employee.tlf;
      this.streetNum = employee.streetNum;
      this.street = employee.streetAddress;
      this.place = employee.place;
      this.postalCode = employee.postalNum;
    });
  }
}

class EditUserInfo extends Component {
  firstName = '';
  surName = '';
  email = '';
  tel = '';
  street = '';
  place = '';
  postalCode = '';
  streetNum = '';

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Min side</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Endre informasjon</h5>
            <br />
            <form onSubmit={e => {
                    if (window.confirm('Er du sikker på at informasjonen er korrekt?')) this.add(e);
                    }}>
              <Row>
                <Column width={5}>
                  <Form.Label>Fornavn:</Form.Label>
                  <Form.Input
                    required
                    type="text"
                    value={this.firstName}
                    onChange={event => (this.firstName = event.target.value)}
                  />
                </Column>
                <Column width={5}>
                  <Form.Label>Etternavn:</Form.Label>
                  <Form.Input type="text" required value={this.surName} onChange={event => (this.surName = event.target.value)} />
                </Column>
              </Row>
              <Row>
                <Column width={5}>
                  <Form.Label>Epost:</Form.Label>
                  <Form.Input type="email"  required value={this.email} onChange={event => (this.email = event.target.value)} />
                </Column>
                <Column width={5}>
                  <Form.Label>Telefonnummer:</Form.Label>
                  <Form.Input type="number" required value={this.tel} onChange={event => (this.tel = event.target.value)} />
                </Column>
              </Row>
              <Row>
                <Column width={8}>
                  <Form.Label>Gateadresse:</Form.Label>
                  <Form.Input type="text" required value={this.street} onChange={event => (this.street = event.target.value)} />
                </Column>
                <Column width={2}>
                  <Form.Label>Gatenummer:</Form.Label>
                  <Form.Input
                    required
                    type="text"
                    value={this.streetNum}
                    onChange={event => (this.streetNum = event.target.value)}
                  />
                </Column>
              </Row>
              <Row>
                <Column width={5}>
                  <Form.Label>Postnummer:</Form.Label>
                  <Form.Input
                    required
                    type="number"
                    value={this.postalCode}
                    onChange={event => (this.postalCode = event.target.value)}
                  />
                </Column>
                <Column width={5}>
                  <Form.Label>Poststed:</Form.Label>
                  <Form.Input type="text"  required value={this.place} onChange={event => (this.place = event.target.value)} />
                </Column>
              </Row>
              <br />
              <Row>
                <Column>
                  <ButtonOutline.Submit>Lagre</ButtonOutline.Submit>
                </Column>
                <Column right>
                  <ButtonOutline.Secondary onClick={() => history.push('/information')}>
                    Gå tilbake
                  </ButtonOutline.Secondary>
                </Column>
              </Row>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getEmployee(employeeID, employee => {
      this.firstName = employee.firstName;
      this.surName = employee.lastName;
      this.email = employee.email;
      this.tel = employee.tlf;
      this.streetNum = employee.streetNum;
      this.street = employee.streetAddress;
      this.place = employee.place;
      this.postalCode = employee.postalNum;
    });
  }

  save() {
    rentalService.updateEmployee(
      employeeID,
      this.firstName,
      this.surName,
      this.email,
      this.tel,
      this.street,
      this.place,
      this.postalCode,
      this.streetNum,
      () => {
        history.push('/information');
      }
    );
  }
}

class MySales extends Component {
  sales = [];

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Mine salg</h1>
        </NavBar>
        <Card role="main">
          Dette er en liste over dine salg som selger hos oss.
          <br />
          <br />
          <Row>
            <Column>
              <Table>
                <Table.Thead>
                  <Table.Th>Ordre-ID</Table.Th>
                  <Table.Th>Kunde</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Bestillingsdato</Table.Th>
                  <Table.Th>Start for utleie</Table.Th>
                  <Table.Th>Slutt for utleie</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.sales.map(sale => (
                    <Table.Tr key={sale.id}>
                      <Table.Td>{sale.id}</Table.Td>
                      <Table.Td>
                        {sale.firstName} {sale.lastName}
                      </Table.Td>
                      <Table.Td>{sale.typeName}</Table.Td>
                      <Table.Td>{sale.dateOrdered.toString().substring(4, 21)}</Table.Td>
                      <Table.Td>{sale.fromDateTime.toString().substring(4, 21)}</Table.Td>
                      <Table.Td>{sale.toDateTime.toString().substring(4, 21)}</Table.Td>
                      <Table.Td>{sale.price} kr</Table.Td>
                      <Table.Td>
                        <ButtonOutline.Info type="button" onClick={() => history.push('/MySales/' + sale.id + '/edit')}>
                          Se bestilling
                        </ButtonOutline.Info>
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
    rentalService.getSales(employeeID, sales => {
      this.sales = sales;
    });
  }
}

class DetailedOrder extends Component {
  bikes = [];
  equipments = [];
  sale = null;

  render() {
    if (!this.sale) return null;

    let notice;

    if (this.equipments.length == 0) {
      notice = (
        <Table.Tr>
          <Table.Td>Det ble ikke funnet noe utstyr knyttet til denne bestillingen.</Table.Td>
        </Table.Tr>
      );
    }

    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Mine salg</h1>
        </NavBar>
        <Card>
          Ordren er registrert på {this.sale.firstName} {this.sale.lastName} på tid/dato{' '}
          {this.sale.dateOrdered.toString().substring(4, 21)}. Utleien varer fra{' '}
          {this.sale.fromDateTime.toString().substring(4, 21)} til {this.sale.toDateTime.toString().substring(4, 21)}.
          <br /> <br />
          <Row>
            <Column>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Sykkeltype</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Modell</Table.Th>
                  <Table.Th>År</Table.Th>
                  <Table.Th>Rammestr.</Table.Th>
                  <Table.Th>Hjulstr.</Table.Th>
                  <Table.Th>Gir</Table.Th>
                  <Table.Th>Bremsesystem</Table.Th>
                  <Table.Th>Vekt</Table.Th>
                  <Table.Th>Kjønn</Table.Th>
                  <Table.Th>Pris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.bikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.model}</Table.Td>
                      <Table.Td>{bike.year}</Table.Td>
                      <Table.Td>{bike.frameSize}</Table.Td>
                      <Table.Td>{bike.wheelSize}</Table.Td>
                      <Table.Td>
                        {bike.gearSystem} ({bike.gears})
                      </Table.Td>
                      <Table.Td>{bike.brakeSystem}</Table.Td>
                      <Table.Td>{bike.weight_kg} kg</Table.Td>
                      <Table.Td>{bike.suitedFor}</Table.Td>
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
              <Table>
                <Table.Thead>
                  <Table.Th>Utstyrstype</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>År</Table.Th>
                  <Table.Th>Kommentar</Table.Th>
                  <Table.Th>Pris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {notice}
                  {this.equipments.map(equipment => (
                    <Table.Tr key={equipment.id}>
                      <Table.Td>{equipment.typeName}</Table.Td>
                      <Table.Td>{equipment.brand}</Table.Td>
                      <Table.Td>{equipment.year}</Table.Td>
                      <Table.Td>{equipment.comment}</Table.Td>
                      <Table.Td>{equipment.price}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
          <Column>
            <h4 align="right">Totalpris: {this.sale.price} kr</h4>
            <ButtonOutline.Info align="left" type="button" onClick={() => history.push('/MySales/')}>
              Gå tilbake til salgsoversikten din
            </ButtonOutline.Info>
          </Column>
        </Card>
      </div>
    );
  }

  mounted() {
    orderService.getBikesFromOrder(this.props.match.params.id, bikes => {
      this.bikes = bikes;
    });

    orderService.getEquipmentFromOrder(this.props.match.params.id, equipments => {
      this.equipments = equipments;
    });

    rentalService.getSale(this.props.match.params.id, sale => {
      this.sale = sale;
    });
  }
}

module.exports = {
  UserInfo,
  EditUserInfo,
  MySales,
  DetailedOrder
};
