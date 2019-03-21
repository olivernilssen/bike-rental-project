import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { orderService } from './services/ordersService';
import { basket, employeeID } from './index.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class UserInfo extends Component {
  fornavn = '';
  etternavn = '';
  email = '';
  tlf = '';
  gate = '';
  poststed = '';
  postnummer = '';
  nr = '';

  render() {
    return (
      <div>
        <H1>Brukerinformasjon</H1>
        <br />
        <Card>
          <Row>
            <Column width={5}>
              <b>Fornavn:</b> {this.fornavn}
            </Column>

            <Column width={5}>
              <b>Etternavn:</b> {this.etternavn}
            </Column>
          </Row>

          <Row>
            <Column width={5}>
              <b>Epost:</b> {this.email}
            </Column>

            <Column width={5}>
              <b>Telefonnummer:</b> {this.tlf}
            </Column>
          </Row>

          <Row>
            <Column width={10}>
              <b>Gateadresse:</b> {this.gate} {this.nr}
            </Column>
          </Row>

          <Row>
            <Column width={5}>
              <b>Poststed:</b> {this.poststed}
            </Column>

            <Column width={5}>
              <b>Postnummer:</b> {this.postnummer}
            </Column>
          </Row>

          <br />
          <Button.Success type="button" onClick={() => history.push('/EditUserInfo')}>
            Endre informasjon
          </Button.Success>
        </Card>
      </div>
    );
  }

  mounted() {
    console.log(employeeID);
    rentalService.getAnsatt(employeeID, ansatt => {
      this.fornavn = ansatt.firstName;
      this.etternavn = ansatt.lastName;
      this.email = ansatt.email;
      this.tlf = ansatt.tlf;
      this.nr = ansatt.streetNum;
      this.gate = ansatt.streetAddress;
      this.poststed = ansatt.place;
      this.postnummer = ansatt.postalNum;
    });
  }
}

class EditUserInfo extends Component {
  fornavn = '';
  etternavn = '';
  email = '';
  tlf = '';
  gate = '';
  poststed = '';
  postnummer = '';
  nr = '';

  render() {
    return (
      <div>
        <Card title="Brukerinformasjon">
          <Row>
            <Column width={5}>
              <Form.Label>Fornavn:</Form.Label>
              <Form.Input type="text" value={this.fornavn} onChange={event => (this.fornavn = event.target.value)} />
            </Column>

            <Column width={5}>
              <Form.Label>Etternavn:</Form.Label>
              <Form.Input
                type="text"
                value={this.etternavn}
                onChange={event => (this.etternavn = event.target.value)}
              />
            </Column>
          </Row>

          <Row>
            <Column width={5}>
              <Form.Label>Epost:</Form.Label>
              <Form.Input type="text" value={this.email} onChange={event => (this.email = event.target.value)} />
            </Column>

            <Column width={5}>
              <Form.Label>Telefonnummer:</Form.Label>
              <Form.Input type="text" value={this.tlf} onChange={event => (this.tlf = event.target.value)} />
            </Column>
          </Row>

          <Row>
            <Column width={8}>
              <Form.Label>Gateadresse:</Form.Label>
              <Form.Input type="text" value={this.gate} onChange={event => (this.gate = event.target.value)} />
            </Column>

            <Column width={2}>
              <Form.Label>Nummer:</Form.Label>
              <Form.Input type="text" value={this.nr} onChange={event => (this.nr = event.target.value)} />
            </Column>
          </Row>

          <Row>
            <Column width={5}>
              <Form.Label>Poststed:</Form.Label>
              <Form.Input type="text" value={this.poststed} onChange={event => (this.poststed = event.target.value)} />
            </Column>

            <Column width={5}>
              <Form.Label>Postnummer:</Form.Label>
              <Form.Input
                type="text"
                value={this.postnummer}
                onChange={event => (this.postnummer = event.target.value)}
              />
            </Column>
          </Row>

          <br />
          <Button.Success type="button" onClick={this.save}>
            Oppdatere informasjon
          </Button.Success>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Button.Danger type="button" onClick={() => history.push('/information')}>
            Gå tilbake
          </Button.Danger>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getAnsatt(employeeID, ansatt => {
      this.fornavn = ansatt.firstName;
      this.etternavn = ansatt.lastName;
      this.email = ansatt.email;
      this.tlf = ansatt.tlf;
      this.nr = ansatt.streetNum;
      this.gate = ansatt.streetAddress;
      this.poststed = ansatt.place;
      this.postnummer = ansatt.postalNum;
    });
  }

  save() {
    rentalService.updateAnsatt(
      employeeID,
      this.fornavn,
      this.etternavn,
      this.email,
      this.tlf,
      this.gate,
      this.poststed,
      this.postnummer,
      this.nr,
      () => {
        history.push('/information');
      }
    );
  }
}

class MineSalg extends Component {
  sales = [];

  render() {
    return (
      <div>
        <Card title="Mine salg">
          Dette er en liste over dine salg
          <br />
          <br />
          <Row>
            <Column>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
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
                      <Table.Td>{sale.dateOrdered.toString().substring(4, 24)}</Table.Td>
                      <Table.Td>{sale.fromDateTime.toString().substring(4, 24)}</Table.Td>
                      <Table.Td>{sale.toDateTime.toString().substring(4, 24)}</Table.Td>
                      <Table.Td>{sale.price} kr</Table.Td>
                      <Table.Td>
                        <Button.Success type="button" onClick={() => history.push('/MineSalg/' + sale.id + '/edit')}>
                          Se bestilling
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
    rentalService.getSales(employeeID, sales => {
      this.sales = sales;
    });
  }
}

class Bestilling extends Component {
  bikes = [];
  equipments = [];
  sales = [];
  orderDate = '';

  //Legge inn id og til/fra tidspunkt i kolonnene til fordel for noen av detaljene.
  render() {
    return (
      <div>
        <Card title="Se på bestilling">
          Ordren er registrert på {this.sales.firstName} {this.sales.lastName} på tid/dato {this.orderDate}.
          <br /> <br />
          <Row>
            <Column>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Sykkeltype</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Fra:</Table.Th>
                  <Table.Th>Til:</Table.Th>
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
                      <Table.Td>sdfsdfsdf</Table.Td>
                      <Table.Td>sdfsdf</Table.Td>
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
            <h4 align="right">Totalpris: {this.sales.price} kr</h4>
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

    rentalService.getSales(employeeID, sales => {
      this.sales = sales[this.props.match.params.id - 1];
      this.orderDate = this.sales.dateOrdered.toString().substring(4, 24);
    });
  }
}

module.exports = {
  UserInfo,
  EditUserInfo,
  MineSalg,
  Bestilling
};
