import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { connection } from './mysql_connection';
import { basket, employeeID } from './index.js';

import createHashHistory from 'history/createHashHistory';
import { start } from 'repl';
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

  ansattId = 1; //ID-en til den ansatte som vises

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
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getAnsatt(this.ansattId, ansatt => {
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
      this.ansattId,
      this.fornavn,
      this.etternavn,
      this.email,
      this.tlf,
      this.gate,
      this.poststed,
      this.postnummer,
      this.nr,
      () => {
        history.push('/overview');
      }
    );
  }
}

module.exports = {
  UserInfo
};
