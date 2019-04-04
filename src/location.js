import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, ButtonOutline, Form, Table, H1, Select } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { bikeService } from './services/bikesService';
import { Modal } from 'react-bootstrap';
require('react-bootstrap/ModalHeader');
require('react-bootstrap/Modal');

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class AreaList extends Component {
  area = [];

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Lokasjoner</h1>
        </NavBar>
        <Tab aria-label="Areas">
          {this.area.map(area => (
            <Tab.Item key={area.area_id} to={'/area/' + area.area_id}>
              {area.areaName}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/addArea'}>
              <Button.Light>Legg til nytt område</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  mounted() {
    rentalService.getArea(area => {
      this.area = area;
    });
  }
}

class AddArea extends Component {
  areaName = '';
  showConfirm = false;

  /**handle close
   * closes the modal by setting showConfirm = false
   */
  handleClose() {
    this.showConfirm = false;
  }

  /**handle Show
   * Shows the modal by setting showConfirm = true
   */
  handleShow() {
    this.showConfirm = true;
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Lokasjoner</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Nytt område</h5>
            <form onSubmit={this.handleShow}>
              <Row>
                <Column>
                  <Form.Label>Navn:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.areaName = event.target.value)} />
                  <br /> <br />
                  <Row>
                    <Column>
                      <ButtonOutline.Submit>Legg til</ButtonOutline.Submit>
                    </Column>
                    <Column right>
                      <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
                    </Column>
                  </Row>
                </Column>
                <br />
              </Row>
            </form>
          </div>
        </Card>

        <Modal show={this.showConfirm} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Er informasjonen riktig?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Er du sikker på at informasjonen er riktig?</p>
            <br />
            <p>Trykk Utfør for å legge til nytt område.</p>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Column>
                <ButtonOutline.Success onClick={this.add}>Utfør</ButtonOutline.Success>
              </Column>
              <Column right>
                <ButtonOutline.Secondary onClick={this.handleClose}>Avbryt</ButtonOutline.Secondary>
              </Column>
            </Row>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  /**add
   *  gets new areaName from input, pushes it to the database,
   *  runs handleClose() which closes the modal and returns you to
   *  area/1
   */
  add() {
    rentalService.addArea(this.areaName);
    this.handleClose();
    history.goBack('/area/1');
  }

  cancel() {
    history.goBack();
  }
}

class LocationInArea extends Component {
  area = null;
  locations = [];

  render() {
    if (!this.area) return null;

    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Lokasjoner</h1>
        </NavBar>
        <Card>
          <Tab aria-label="Locations">
            {this.locations.map(location => (
              <Tab.Item key={location.id} to={'/area/' + this.props.match.params.area_id + '/' + location.id}>
                {location.name}
              </Tab.Item>
            ))}
            <Column right>
              <NavLink to={'/addLocation/'}>
                <ButtonOutline.Dark>Legg til ny lokasjon</ButtonOutline.Dark>
              </NavLink>
            </Column>
          </Tab>
        </Card>
      </div>
    );
  }

  mounted() {
    rentalService.getArea(area => {
      this.area = area;
    });

    rentalService.getLocationsByArea(this.props.match.params.area_id, locations => {
      this.locations = locations;
    });
  }
}

class AddLocation extends Component {
  areaNames = [];
  locationNames = [];
  name = '';
  postalNum = 0;
  place = '';
  streetAddress = '';
  streetNum = 0;
  curArea = '';
  curAreaID = '';
  showConfirm = false;

  /**handle close
   * closes the modal by setting showConfirm = false
   */
  handleClose() {
    this.showConfirm = false;
  }

  /**handle Show
   * Shows the modal by setting showConfirm = true
   */
  handleShow() {
    this.showConfirm = true;
  }

  /** On change type
   *  puts all Area in to options in the select
   */
  onChangeType(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({
      state: (this.state.curArea = event.target.options[selectedIndex].getAttribute('data-key'))
    });
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Lokasjoner</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Ny lokasjon</h5>
            <br />
            <form onSubmit={this.handleShow}>
              <Row>
                <Column width={5}>
                  <Form.Label>Navn:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.name = event.target.value)} />
                </Column>
                <Column width={5}>
                  <Form.Label>Område:</Form.Label>
                  <Select value={this.curArea} required onChange={event => (this.curArea = event.target.value)}>
                    {this.areaNames.map(areaN => (
                      <Select.Option key={areaN.areaName} value={areaN.areaName} id={areaN.id}>
                        {areaN.areaName}
                      </Select.Option>
                    ))}
                  </Select>
                </Column>
              </Row>

              <Row>
                <Column width={8}>
                  <Form.Label>Gateadresse:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.streetAddress = event.target.value)} />
                </Column>
                <Column width={2}>
                  <Form.Label>Gatenummer:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.streetNum = event.target.value)} />
                </Column>
              </Row>
              <Row>
                <Column width={5}>
                  <Form.Label>Postnummer:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.postalNum = event.target.value)} />
                </Column>
                <Column width={5}>
                  <Form.Label>Poststed:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.place = event.target.value)} />
                </Column>
              </Row>
              <br />
              <Row>
                <Column>
                  <ButtonOutline.Submit>Legg til</ButtonOutline.Submit>
                </Column>
                <Column right>
                  <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
                </Column>
              </Row>
            </form>
          </div>
        </Card>

        <Modal show={this.showConfirm} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Er informasjonen riktig?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Er du sikker på at informasjonen er riktig?</p>
            <br />
            <p>Trykk Utfør for å legge til ny lokasjon.</p>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Column>
                <ButtonOutline.Success onClick={this.add}>Utfør</ButtonOutline.Success>
              </Column>
              <Column right>
                <ButtonOutline.Secondary onClick={this.handleClose}>Avbryt</ButtonOutline.Secondary>
              </Column>
            </Row>
          </Modal.Footer>
        </Modal>
        <br />
      </div>
    );
  }

  /** Add
   *  gets area id, takes input from form and uses the area id it got earlier
   *  and inserts to database, then closes the modal and pushes to area/1/1
   */
  add() {
    rentalService.getAreaID(this.curArea, result => {
      this.curAreaID = result.id;

      rentalService.addLocation(
        this.name,
        this.streetAddress,
        this.streetNum,
        this.postalNum,
        this.place,
        this.curAreaID
      );
    });
    this.handleClose();
    history.push('/area/1/1');
  }

  cancel() {
    history.goBack();
  }

  mounted() {
    rentalService.getArea(areaNames => {
      this.curArea = areaNames[0].areaName;
      this.areaNames = areaNames;
    });
  }
}

class BikesOnLocation extends Component {
  bikeLocations = null;
  bikes = [];
  area = null;

  render() {
    //returns table with bikes that are located in same area and same location
    if (!this.bikeLocations && !this.area) return null;

    return (
      <div role="main">
        <Card>
          <Row>
            <Column>
              <h6>Liste over sykler på valgt lokasjon</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Typenavn</Table.Th>
                  <Table.Th>Produsent</Table.Th>
                  <Table.Th>År</Table.Th>
                  <Table.Th>Ramme</Table.Th>
                  <Table.Th>Hjul</Table.Th>
                  <Table.Th>Antall gir</Table.Th>
                  <Table.Th>Gir</Table.Th>
                  <Table.Th>Bremser</Table.Th>
                  <Table.Th>Vekt</Table.Th>
                  <Table.Th>Beregnet for</Table.Th>
                  <Table.Th>Timespris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.bikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.year}</Table.Td>
                      <Table.Td>{bike.frameSize}</Table.Td>
                      <Table.Td>{bike.wheelSize}</Table.Td>
                      <Table.Td>{bike.gears}</Table.Td>
                      <Table.Td>{bike.gearSystem}</Table.Td>
                      <Table.Td>{bike.brakeSystem}</Table.Td>
                      <Table.Td>{bike.weight_kg}</Table.Td>
                      <Table.Td>{bike.suitedFor}</Table.Td>
                      <Table.Td>{bike.price}</Table.Td>
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
    rentalService.getArea(area => {
      this.area = area;
    });

    rentalService.getLocations(locations => {
      this.locations = locations;
    });

    bikeService.getBikesOnLocation(this.props.match.params.id, bikes => {
      this.bikes = bikes;
    });
  }
}

module.exports = {
  AddArea,
  AreaList,
  LocationInArea,
  AddLocation,
  BikesOnLocation
};
