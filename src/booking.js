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
  Select,
  H1,
  CenterContent
} from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { rentalService } from './services/services';

import { basket, equipmentBasket } from './index.js';

import createHashHistory from 'history/createHashHistory';
import { bikeService } from './services/bikesService';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

let today = new Date();
let day = today.getDate();
let day2 = day + 2;
let month = today.getMonth() + 1;
let year = today.getFullYear();
let time = today.getHours();
let laterTime = today.getHours() + 2;

if (time == 24) time = '00';
if (time.toString().length == 1) time = '0' + time;
if (laterTime == 24) laterTime = '00';
if (laterTime.toString().length == 1) time = '0' + time;

if (day < 10) day = '0' + day;
if (day2 < 10) day2 = '0' + day2;
if (month < 10) month = '0' + month;

class Booking extends Component {
  todaysDate = year + '-' + month + '-' + day;
  nextDay = year + '-' + month + '-' + day2;
  currentHour = time + ':00';
  laterHour = time + 1 + ':00';
  laterHourAlt = laterTime + ':00';
  dayRent = false;
  locations = [];
  bikeTypes = [];

  state = {
    startDate: this.todaysDate,
    endDate: this.nextDay,
    startHour: this.currentHour,
    endHour: this.laterHour,
    typeSelect: '%',
    locationSelect: '%',
    allBikes: [],
    availableBikes: []
  };

  styleState = {
    display: 'block',
    clear: 'both'
  };

  handleCheckChange() {
    if (this.dayRent == false) {
      this.dayRent = true;
      this.state.endHour = this.laterHourAlt;
    } else {
      this.dayRent = false;
      this.state.endHour = this.laterHour;
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, this.findAvailBikes);
  }

  chooseBike(bike) {
    // history.push('/equipmentQuery/' + bike.id + '/edit');
    if (basket.length == 0) {
    } else if (basket[0].id == 'Handlekurven er tom') {
      basket.splice(0, 1);
    }

    if (this.dayRent == true) {
      bike.endDate = new Date(this.state.startDate.toString() + ' ' + this.state.endHour.toString() + ':00');
      bike.endDateString = this.state.startDate.toString() + ' ' + this.state.endHour.toString();
    } else {
      bike.endDate = new Date(this.state.endDate.toString() + ' ' + this.state.endHour.toString() + ':00');
      bike.endDateString = this.state.endDate.toString() + ' ' + this.state.endHour.toString();
    }

    bike.startDate = new Date(this.state.startDate.toString() + ' ' + this.state.startHour.toString() + ':00');
    bike.startDateString = this.state.startDate.toString() + ' ' + this.state.startHour.toString();
    bike.dayRent = this.dayRent;

    basket.push(bike);
    this.findAvailBikes();
  }

  render() {
    const styles = {
      btnStyle: {
        display: this.styleState.display,
        float: 'right'
      }
    };
    const { btnStyle } = styles;

    let notice;
    let checker = this.state.startDate.toString() + ' ' + this.state.startHour.toString() + ':00';
    let checker2 = this.state.endDate.toString() + ' ' + this.state.endHour.toString() + ':00';

    if (this.dayRent == false && this.state.startDate == this.state.endDate) {
      notice = <p style={{ color: 'red' }}>"Til dato" må være minst én dag senere enn "Fra dato" ved døgnutleie.</p>;
    }

    if (
      this.dayRent == true &&
      this.state.startDate.toString() == this.state.endDate.toString() &&
      checker.toString().substring(10, 13) >= checker2.toString().substring(10, 13)
    ) {
      notice = (
        <p style={{ color: 'red' }}>Ved timeutleie må "Til klokkeslett" være minst én time etter "Fra klokkeslett".</p>
      );
    }

    if (this.state.startDate > this.state.endDate) {
      notice = <p style={{ color: 'red' }}>"Til dato" må være senere enn "Fra dato".</p>;
    }

    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Booking</h1>
        </NavBar>
        <Card role="main">
          {/* Date entry */}
          <div className="container">
            <Row>
              <Column width={3}>
                <Form.Label>Fra dato:</Form.Label>
                <Form.Input
                  type="date"
                  name="startDate"
                  disabled={this.dayRent}
                  min={this.state.todaysDate}
                  value={this.state.startDate}
                  onChange={this.handleChange}
                />
              </Column>

              <Column width={3}>
                <Form.Label>Til dato:</Form.Label>
                <Form.Input
                  type="date"
                  name="endDate"
                  disabled={this.dayRent}
                  min={this.state.startDate}
                  value={this.state.endDate}
                  onChange={this.handleChange}
                />
              </Column>

              <Column width={3}>
                <br />
                <br />
                <div className="form-check">
                  <Form.Label>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={false}
                      name="dayRent"
                      checked={this.dayRent}
                      onChange={this.handleCheckChange}
                    />
                    <label className="form-check-label">Huk av for timeutleie</label>
                  </Form.Label>
                </div>
              </Column>
            </Row>
            <br />

            <Row>
              <Column width={3}>
                <Form.Label>Lokasjon:</Form.Label>
                <Select name="locationSelect" value={this.state.locationSelect} onChange={this.handleChange}>
                  <Select.Option value="%">Any Location</Select.Option>
                  {this.locations.map(loc => (
                    <Select.Option>{loc.name}</Select.Option>
                  ))}
                </Select>
              </Column>
              <Column width={3}>
                <Form.Label>Sykkeltype:</Form.Label>
                <Select name="typeSelect" value={this.state.typeSelect} onChange={this.handleChange}>
                  <Select.Option value="%">Any Type of bike</Select.Option>
                  {this.bikeTypes.map(type => (
                    <Select.Option key={type.id}>{type.typeName}</Select.Option>
                  ))}
                </Select>
              </Column>

              <Column width={2}>
                <Form.Label>Fra klokkeslett:</Form.Label>
                <Form.Input
                  type="time"
                  name="startHour"
                  disabled={!this.dayRent}
                  value={this.state.startHour}
                  onChange={this.handleChange}
                />
              </Column>

              <Column width={2}>
                <Form.Label>Til klokkeslett:</Form.Label>
                <Form.Input
                  type="time"
                  name="endHour"
                  disabled={!this.dayRent}
                  value={this.state.endHour}
                  onChange={this.handleChange}
                />
              </Column>
            </Row>
            {/* submit button */}
            <br />
            <Row>
              <Column width={1}>
                <ButtonOutline.Secondary name="submit" onClick={this.findAvailBikes}>
                  Søk
                </ButtonOutline.Secondary>
              </Column>
              <Column right>{notice}</Column>
            </Row>
          </div>
          <br />

          <CenterContent>
            <div style={{ width: 800 + 'px' }}>
              <h4>Ledige sykler</h4>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Hjul</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.state.availableBikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.name}</Table.Td>
                      <Table.Td>{bike.wheelSize}</Table.Td>
                      <Table.Td>{bike.price}</Table.Td>
                      <Table.Td width={1}>
                        <Button.Info
                          style={btnStyle}
                          onClick={() => {
                            this.chooseBike(bike);
                          }}
                        >
                          <FontAwesomeIcon className="" icon="plus" />
                        </Button.Info>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </CenterContent>
        </Card>
        <br />
      </div>
    );
  }

  mounted() {
    this.state.availableBikes = [];
    let empty = { id: 'Gjør et nytt søk' };

    bikeService.getBikeTypes(result => {
      for (let j = 0; j < result.length; j++) {
        for (let i = 0; i < result.length; i++) {
          if (i == j) continue;
          else if (result[i].typeName == result[j].typeName) {
            result.splice(i, 1);
          }
        }
      }
      this.bikeTypes = result;
    });

    rentalService.getLocations(results => {
      this.locations = results;
    });

    rentalService.getBookingSearch(
      this.state.locationSelect,
      this.state.typeSelect,
      this.state.startDate,
      this.state.endDate,
      result => {
        for (let i = 0; i < result.length; i++) {
          {
            for (let j = 0; j < basket.length; j++) {
              if (result[i].id == basket[j].id) {
                result.splice(i, 1);
              }
            }
          }
        }

        if (result.length == 0) {
          this.setState({ styleState: (this.styleState.display = 'none') });
          this.setState(state => {
            const availableBikes = state.availableBikes.concat(empty);
            return {
              availableBikes,
              empty
            };
          });
        } else {
          this.setState({ styleState: (this.styleState.display = 'block') });
          this.setState(state => {
            const availableBikes = state.availableBikes.concat(result);
            return {
              availableBikes,
              result
            };
          });
        }
      }
    );
  }

  //SQL SPØRRING HER
  findAvailBikes() {
    this.state.availableBikes = [];
    let empty = { id: 'Gjør et nytt søk' };

    rentalService.getBookingSearch(
      this.state.locationSelect,
      this.state.typeSelect,
      this.state.startDate,
      this.state.endDate,
      result => {
        for (let i = 0; i < result.length; i++) {
          {
            if (result.length == 0) {
              break;
            }
            for (let j = 0; j < basket.length; j++) {
              if (result[i].id == basket[j].id) {
                result.splice(i, 1);
              }
            }
          }
        }

        if (result.length == 0) {
          this.setState({ styleState: (this.styleState.display = 'none') });
          this.setState(state => {
            const availableBikes = state.availableBikes.concat(empty);
            return {
              availableBikes,
              empty
            };
          });
        } else {
          this.setState({ styleState: (this.styleState.display = 'block') });
          this.setState(state => {
            const availableBikes = state.availableBikes.concat(result);
            return {
              availableBikes,
              result
            };
          });
        }
      }
    );
  }
}

module.exports = { Booking };
