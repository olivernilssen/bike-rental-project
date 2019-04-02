import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, ButtonOutline, Form, Table, H1, Select } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { bikeService } from './services/bikesService';

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

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Lokasjoner</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Nytt område</h5>
            <Row>
              <Column>
                <Form.Label>Navn:</Form.Label>
                <Form.Input type="text" onChange={event => (this.areaName = event.target.value)} />
                <br /> <br />
                <Row>
                  <Column>
                    <ButtonOutline.Success
                      onClick={e => {
                        if (window.confirm('Er du sikker på at informasjonen er korrekt?')) this.add(e);
                      }}
                    >
                      Legg til
                    </ButtonOutline.Success>
                  </Column>
                  <Column right>
                    <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
                  </Column>
                </Row>
              </Column>
              <br />
            </Row>
          </div>
        </Card>
      </div>
    );
  }

  add() {
    rentalService.addArea(this.areaName);

    history.push('/area/1');
  }

  cancel() {
    history.push('/area/1/1');
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
            <Row>
              <Column width={5}>
                <Form.Label>Navn:</Form.Label>
                <Form.Input type="text" onChange={event => (this.name = event.target.value)} />
              </Column>
              <Column width={5}>
                <Form.Label>Område:</Form.Label>
                <Select value={this.curArea} onChange={event => (this.curArea = event.target.value)}>
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
                <Form.Input type="text" onChange={event => (this.streetAddress = event.target.value)} />
              </Column>
              <Column width={2}>
                <Form.Label>Gatenummer:</Form.Label>
                <Form.Input type="text" onChange={event => (this.streetNum = event.target.value)} />
              </Column>
            </Row>
            <Row>
              <Column width={5}>
                <Form.Label>Postnummer:</Form.Label>
                <Form.Input type="text" onChange={event => (this.postalNum = event.target.value)} />
              </Column>
              <Column width={5}>
                <Form.Label>Poststed:</Form.Label>
                <Form.Input type="text" onChange={event => (this.place = event.target.value)} />
              </Column>
            </Row>
            <br />
            <Row>
              <Column>
                <ButtonOutline.Success
                  onClick={e => {
                    if (window.confirm('Er du sikker på at informasjonen er korrekt?')) this.add(e);
                  }}
                >
                  Legg til
                </ButtonOutline.Success>
              </Column>
              <Column right>
                <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
              </Column>
            </Row>
          </div>
        </Card>
        <br />
      </div>
    );
  }

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
    history.push('/area/1/1');
  }

  cancel() {
    history.push('/area/1/1');
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
