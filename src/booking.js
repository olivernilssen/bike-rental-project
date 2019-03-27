import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, Select, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { equipmentService } from './services/equipmentService.js';
import { basket, equipmentBasket } from './index.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();
//
let time = today.getHours() + 1;

if (time == 24) {
  time = '00';
}

if (time.toString().length == 1) {
  time = '0' + time;
}

let laterTime = today.getHours() + 2;

if (laterTime == 24) {
  laterTime = '00';
}

if (laterTime.toString().length == 1) {
  time = '0' + time;
}

let day2 = day + 2;

if (day < 10) day = '0' + day;
if (day2 < 10) day2 = '0' + day2;
if (month < 10) month = '0' + month;

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

  handleTypeChange(e) {
    this.state.selectStatus = e.target.value;
    this.specify();
  }

  handleSizeChange(e) {
    this.state.sizeSelectStatus = e.target.value;
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
        <H1>Valg av sykkelutstyr</H1>
        <br />
        <Row>
          <Column>
            <Button.Light onClick={() => history.push('/booking/')}>Bookingsøk</Button.Light>
          </Column>
          <Column right>
            <Button.Light onClick={() => history.push('/basket/')}>Gå til handlekurv</Button.Light>
          </Column>
        </Row>
        <Card>
          <Row>
            <Column width={4}>
              <Form.Label>Utstyrstype:</Form.Label>
              <Select onChange={this.handleTypeChange}>
                <Select.Option value="%">Velg en utstyrstype ...</Select.Option>
                {this.equipmentTypes.map(type => (
                  <Select.Option value={type.toString()}>{type.toString()}</Select.Option>
                ))}
              </Select>
            </Column>

            <Column width={4}>
              <Form.Label>Størrelse:</Form.Label>
              <Select onChange={this.handleSizeChange}>
                <Select.Option value="%">Velg en størrelse ...</Select.Option>
                {this.sizes.map(type => (
                  <Select.Option key={type.comment} value={type.toString()}>
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
                  <Table.Th>-</Table.Th>
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
                        <Button.Success onClick={() => this.basketAdd(equip)}>Velg</Button.Success>
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
                  <Table.Th>-</Table.Th>
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
      this.location = JSON.stringify(location)
        .substring(7)
        .replace('}]', '');
    });

    equipmentService.getTypeNameForSuitableEquipment(this.props.match.params.id, typeName => {
      equipmentService.getSuitableEquipment(
        this.location,
        this.state.selectStatus,
        this.state.sizeSelectStatus,
        JSON.stringify(typeName)
          .substring(14)
          .replace('"}]', ''),
        equipment => {
          let k = this.props.match.params.id;
          equipment.forEach(function(e) {
            e.bike_id = +k;
          });

          this.suitableEquipment = equipment;

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

    this.specify();
  }

  specify() {
    equipmentService.getTypeNameForSuitableEquipment(this.props.match.params.id, typeName => {
      equipmentService.getSuitableEquipment(
        this.location,
        this.state.selectStatus,
        this.state.sizeSelectStatus,
        JSON.stringify(typeName)
          .substring(14)
          .replace('"}]', ''),
        equipment => {
          let m = this.props.match.params.id;
          equipment.forEach(function(e) {
            e.bike_id = +m;
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

class Booking extends Component {
  todaysDate = year + '-' + month + '-' + day;
  nextDay = year + '-' + month + '-' + day2;
  currentHour = time + ':00';
  laterHour = time + ':00';
  laterHourAlt = laterTime + ':00';
  dayRent = false;

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
      this.handleSubmit();
    } else {
      this.dayRent = false;
      this.state.endHour = this.laterHour;
      this.handleSubmit();
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, this.handleSubmit);
  }

  handleSubmit() {
    this.findAvailBikes();
  }

  chooseBike(bike) {
    // history.push('/equipmentQuery/' + bike.id + '/edit');

    if (basket.length == 0) {
    } else if (basket[0].id == 'Handlekurven er tom') {
      basket.splice(0, 1);
    }

    bike.startDate = this.state.startDate;
    bike.endDate = this.state.startDate;

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

    let notice;
    let checker = this.state.startDate.toString() + ' ' + this.state.startHour.toString() + ':00';
    let checker2 = this.state.endDate.toString() + ' ' + this.state.endHour.toString() + ':00';

    if (this.dayRent == false && this.state.startDate.toString() == this.state.endDate.toString()) {
      notice = (
        <p style={{ color: 'red' }}>
          Pass på at "Til dato:" er minst én dag senere enn "Fra dato:" ved døgnutleie. Ønsker du å leie og levere samme
          dag, velg "Timeutleie".
        </p>
      );
    }

    if (
      this.dayRent == true &&
      this.state.startDate.toString() == this.state.endDate.toString() &&
      checker.toString().substring(10, 13) >= checker2.toString().substring(10, 13)
    ) {
      notice = (
        <p style={{ color: 'red' }}>
          Ved leie og innlevering på samme dag må "Til klokkeslett" minst være én time etter "Fra klokkeslett".
        </p>
      );
    }

    if (this.state.startDate.toString() > this.state.endDate.toString()) {
      notice = (
        <p style={{ color: 'red' }}>
          Hvordan kan man låne noe en dag og levere tilbake før det? Vet du noe om universet vi ikke vet?
        </p>
      );
    }

    return (
      <div>
        <H1>Booking</H1>
        <br />
        <Card>
          {/* Date entry */}
          <div className="container">
            <Row>
              <Column width={3}>
                <Form.Label>Fra dato:</Form.Label>
                <Form.Input
                  type="date"
                  name="startDate"
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
                      value="Timesleie?"
                      name="dayRent"
                      checked={this.dayRent}
                      onChange={this.handleCheckChange}
                    />
                    <label className="form-check-label">Ønsker du spesifisere klokkeslett? (timeutleie)</label>
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
                  <Select.Option value="Finse">Finse</Select.Option>
                  <Select.Option value="Flåm">Flåm</Select.Option>
                  <Select.Option value="Haugastøl">Haugastøl</Select.Option>
                  <Select.Option value="Voss">Voss</Select.Option>
                  <Select.Option value="Myrdal">Myrdal</Select.Option>
                </Select>
              </Column>
              <Column width={3}>
                <Form.Label>Sykkeltype:</Form.Label>
                <Select name="typeSelect" value={this.state.typeSelect} onChange={this.handleChange}>
                  <Select.Option value="%">Any Type of bike</Select.Option>
                  <Select.Option value="Terreng">Terreng</Select.Option>
                  <Select.Option value="Downhill">Downhill</Select.Option>
                  <Select.Option value="Landevei">Landevei</Select.Option>
                  <Select.Option value="Barn">Barn</Select.Option>
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
                <Button.Success name="submit" onClick={this.handleSubmit}>
                  Søk
                </Button.Success>
              </Column>
              <Column right>{notice}</Column>
            </Row>
          </div>

          <br />
          <Card header="LEDIGE SYKLER:">
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
        </Card>
        <br />
      </div>
    );
  }

  mounted() {
    this.state.availableBikes = [];
    let empty = { id: 'Gjør et nytt søk' };

    rentalService.getBookingSearch(
      this.state.locationSelect,
      this.state.typeSelect,
      this.state.startDate.toString() + ' ' + this.state.startHour.toString() + ':00',
      this.state.endDate.toString() + ' ' + this.state.endHour.toString() + ':00',
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
      this.state.startDate.toString() + ' ' + this.state.startHour.toString() + ':00',
      this.state.endDate.toString() + ' ' + this.state.endHour.toString() + ':00',
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

module.exports = { Booking, EquipmentQuery };
