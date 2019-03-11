import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { basket } from './index.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();
let day2 = day + 2;

if (day < 10) day = '0' + day;
if (day2 < 10) day2 = '0' + day2;
if (month < 10) month = '0' + month;

class Booking extends Component {
  todaysDate = year + '-' + month + '-' + day;
  nextDay = year + '-' + month + '-' + day2;
  dayRent = false;
  state = {
    startDate: this.todaysDate,
    endDate: this.nextDay,
    hoursRenting: 0,
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
    } else {
      this.dayRent = false;
    }

    this.findAvailBikes();
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, this.handleSubmit);
  }

  handleSubmit() {
    this.findAvailBikes();
  }

  chooseBike(bike) {
    if (basket.length == 0) {
    } else if (basket[0].id == 'Handlekurven er tom') {
      basket.splice(0, 1);
    }

    if (this.state.dayRent == true) {
      bike.startDate = this.state.startDate;
      bike.endDate = this.state.startDate;
      bike.hoursRent = this.state.hoursRenting;
      bike.dayRent = true;
    } else {
      bike.startDate = this.state.startDate;
      bike.endDate = this.state.endDate;
      bike.hoursRent = this.state.hoursRenting;
      bike.dayRent = false;
    }

    basket.push(bike);
    this.findAvailBikes();
  }

  render() {
    const styles = {
      btnStyle: {
        display: this.styleState.display
      }
    };
    const { btnStyle } = styles;

    return (
      <div>
        <Card title="Booking">
          {/* Date entry */}
          <div className="form-group">
            <input
              type="checkbox"
              name="dayRent"
              checked={this.dayRent}
              onChange={this.handleCheckChange}
              value="Timesleie?"
            />
            <Form.Label>Times leie? </Form.Label>
            <input
              type="number"
              name="hoursRenting"
              disabled={!this.dayRent}
              onChange={this.handleChange}
              value={this.hoursRenting}
            />
            <br />
            <br />

            <Row>
              <Column width={2}>
                <Form.Label>Fra dato: </Form.Label>
                <input
                  type="date"
                  name="startDate"
                  disabled={this.dayRent}
                  min={this.state.todaysDate}
                  value={this.state.startDate}
                  onChange={this.handleChange}
                />
              </Column>

              <Column width={2}>
                <Form.Label>Til dato:</Form.Label>
                <input
                  type="date"
                  name="endDate"
                  disabled={this.dayRent}
                  min={this.state.startDate}
                  value={this.state.endDate}
                  onChange={this.handleChange}
                />
              </Column>
            </Row>
            <br />

            <select name="locationSelect" value={this.state.locationSelect} onChange={this.handleChange}>
              <option value="%">Any Location</option>
              <option value="Finse">Finse</option>
              <option value="Flåm">Flåm</option>
              <option value="Haugastøl">Haugastøl</option>
              <option value="Voss">Voss</option>
            </select>

            <select name="typeSelect" value={this.state.typeSelect} onChange={this.handleChange}>
              <option value="%">Any Type of bike</option>
              <option value="Terreng">Terreng</option>
              <option value="Downhill">Downhill</option>
              <option value="Landevei">Landevei</option>
              <option value="Barn">Barn</option>
            </select>
          </div>

          {/* submit button */}
          <div className="form-group">
            <button name="submit" type="button" onClick={this.handleSubmit}>
              Søk
            </button>
          </div>
          <br />

          <h6>Ledige sykler:</h6>
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
                  <Table.Td>
                    <Button.Success
                      style={btnStyle}
                      onClick={() => {
                        this.chooseBike(bike);
                      }}
                    >
                      Velg
                    </Button.Success>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </div>
    );
  }

  mounted() {
    this.state.availableBikes = [];
    let empty = { id: 'Gjør et nytt søk' };

    this.startDate = this.startDate + '%';
    this.endDate = this.endDate + '%';

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

    this.startDate = this.startDate + '%';
    this.endDate = this.endDate + '%';

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
