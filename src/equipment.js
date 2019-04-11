import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, Row, Column, NavBar, Button, ButtonOutline, Form, Table, ClickTable, Select } from './widgets';
import { NavLink } from 'react-router-dom';
import { rentalService } from './services/services';
import { equipmentService } from './services/equipmentService';
import { bikeService } from './services/bikesService';
import { Modal } from 'react-bootstrap';
require('react-bootstrap/ModalHeader');
require('react-bootstrap/Modal');

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

/* The navigation on top of the equipment page */

class EquipmentTypes extends Component {
  equipTypes = [];

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykkelutstyr</h1>
        </NavBar>
        <Tab ariaLabel="Equipment-types">
          {this.equipTypes.map(type => (
            <Tab.Item key={type.typeName} to={'/equipmentTypes/' + type.typeName}>
              {type.typeName}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/equipments/add/'}>
              <Button.Light>Legg inn nytt utstyr</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  mounted() {

    /* Gets all unique types of equipment for the navigation
    on top of the equipment page, so you can move between them.  */

    equipmentService.getDistinctEquipType(types => {
      for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < types.length; j++) {
          if (i == j) {
            continue;
          } else if (types[i].typeName == types[j].typeName) {
            types.splice(j, 1);
          }
        }
      }
      this.equipTypes = types;
    });
  }
}

/* The main table on the equipment page with
all types of the selected equipment as well
as the table on the left underneath which
shows all items of that type and which may
be filtered by clicking on the first table

Finally includes the table where you can
add and see restrictions between equipment
types and bicycle types.*/

class EquipTypeDetails extends Component {
  handler = '';
  restrictions = [];
  equipType = null;
  distinctBikeType = null;
  lock = false;
  bikeType = '';
  showingEquipment = 0;
  showInfo = false;
  infoText = '';

  state = {
    priceEquip: 0,
    equipments: [],
    typeIds: [],
    equipTypeDetails: []
  };

  /* Allows the user to filter the items
  shown according to size selected. */

  showThisType(type) {
    let index = this.state.equipTypeDetails
      .map(function(e) {
        return e.id;
      })
      .indexOf(type.id);

    for (let i = 0; i < this.state.equipTypeDetails.length; i++) {
      this.state.equipTypeDetails[i].selectedEquip = false;
    }

    if (this.showingEquipment === type.id && this.lock == true) {
      this.lock = false;
      this.state.equipments = [];

      for (let i = 0; i < this.state.typeIds.length; i++) {
        equipmentService.getEquipmentByTypeID(this.state.typeIds[i].id, results => {
          this.setState(state => {
            const equipments = state.equipments.concat(results);
            return { equipments, results };
          });
        });
      }
      this.showingEquipment = 0;
    } else {
      this.lock = true;

      equipmentService.getEquipmentByTypeID(type.id, results => {
        this.showingEquipment = type.id;
        this.setState(state => {
          this.state.equipments = [];
          const equipments = state.equipments.concat(results);
          return { equipments, results };
        });
      });

      this.state.equipTypeDetails[index].selectedEquip = true;
    }
  }

  //Updates variable across component

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  //Handles opening/closing feedback messages

  handleClose() {
    this.showInfo = false;
    this.mounted();
  }
  handleShow() {
    this.showInfo = true;
  }


  render() {


  //Stops tables from loading if empty

    if (!this.equipType) return null;
    if (!this.distinctBikeType) return null;


    /* Explains filtering functionality when you click
    on an equipment type in the main table */

    let notice;

    if (this.lock == true) {
      notice = (
        <p style={{ color: 'red' }}>Trykk på samme leiegjenstand igjen for å se beholdning for alle størrelser/typer</p>
      );
    }


    /* Message shown while there are no
    restrictions for the viewed equipment type */

    let noRestr;

    if (this.restrictions.length == 0) {
      noRestr = <Table.Td>Det ble ikke funnet noen begrensninger.</Table.Td>;
    }

    return (
      <div role="main">
        <Card>
          <Row>
            <Column width={12}>
              <h6>Velg en spesiell størrelse/type ved å trykke på den i tabellen:</h6>
              <ClickTable>
                <ClickTable.Thead>
                  <ClickTable.Th>Merke</ClickTable.Th>
                  <ClickTable.Th>Årsmodell</ClickTable.Th>
                  <ClickTable.Th>Størrelse</ClickTable.Th>
                  <ClickTable.Th>Pris</ClickTable.Th>
                  <ClickTable.Th />
                </ClickTable.Thead>
                <ClickTable.Tbody>
                  {this.state.equipTypeDetails.map(type => (
                    <ClickTable.Tr
                      style={type.selectedEquip ? { backgroundColor: '#c5e0e4' } : { backgroundColor: '' }}
                      key={type.id}
                      onClick={() => {
                        this.showThisType(type);
                      }}
                    >
                      <ClickTable.Td>{type.brand}</ClickTable.Td>
                      <ClickTable.Td>{type.year}</ClickTable.Td>
                      <ClickTable.Td>{type.comment}</ClickTable.Td>
                      <ClickTable.Td>
                        {type.changePrice ? (
                          <Form.Input
                            style={{ width: 70 + 'px' }}
                            name="priceEquip"
                            value={this.state.priceEquip}
                            onChange={this.handleChange}
                          />
                        ) : (
                          type.price
                        )}
                      </ClickTable.Td>
                      <ClickTable.Td>
                        {type.changePrice ? (
                          <ButtonOutline.Success
                            style={{ float: 'right' }}
                            onClick={() => {
                              this.save(type);
                            }}
                          >
                            Lagre
                          </ButtonOutline.Success>
                        ) : (
                          <ButtonOutline.Secondary
                            style={{ float: 'right' }}
                            onClick={() => {
                              this.change(type);
                            }}
                          >
                            Endre
                          </ButtonOutline.Secondary>
                        )}
                      </ClickTable.Td>
                    </ClickTable.Tr>
                  ))}
                </ClickTable.Tbody>
              </ClickTable>
            </Column>
          </Row>
          <Row>
            <Column right>{notice}</Column>
          </Row>
          <br />
          <Row>
            <Column>
              <h6>Beholdning for valgte varer:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.state.equipments.map(equip => (
                    <Table.Tr key={equip.id}>
                      <Table.Td>{equip.id}</Table.Td>
                      <Table.Td>{equip.name}</Table.Td>
                      <Table.Td>{equip.objectStatus}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>

            <Column>
              <Row>
                <Column>
                  <h6>Sykkeltyper utstyret IKKE passer til:</h6>
                  <Table>
                    <Table.Thead>
                      <Table.Th>Navn</Table.Th>
                      <Table.Th />
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr>{noRestr}</Table.Tr>
                      {this.restrictions.map(restrictions => (
                        <Table.Tr key={restrictions.id}>
                          <Table.Td>{restrictions.typeName}</Table.Td>
                          <Table.Td>
                            <ButtonOutline.Success
                              style={{ float: 'right' }}
                              onClick={() => this.delete(restrictions.id)}
                            >
                              Tillat
                            </ButtonOutline.Success>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Column>
              </Row>
              <br />
              <Row>
                <Column>
                  <h6>Velg ny sykkeltype å begrense for dette utstyret:</h6>
                  <Select name="typeSelect" onChange={event => (this.bikeType = event.target.value)}>
                    <Select.Option>Du har ikke valgt noen sykkel..</Select.Option>
                    {this.distinctBikeType.map(trestrictions => (
                      <Select.Option key={trestrictions.typeName}>{trestrictions.typeName}</Select.Option>
                    ))}
                  </Select>
                  <br />
                  <br />
                  <ButtonOutline.Danger
                    style={{ float: 'right' }}
                    onClick={() => {
                      this.add();
                    }}
                  >
                    Legg til ny restriksjon
                  </ButtonOutline.Danger>
                </Column>
              </Row>
            </Column>
          </Row>
        </Card>

        <Modal show={this.showInfo} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.infoText}</p>
          </Modal.Body>
          <Modal.Footer>
            <ButtonOutline.Secondary onClick={this.handleClose}>Lukk</ButtonOutline.Secondary>
          </Modal.Footer>
        </Modal>
        <br />
      </div>
    );
  }

  /* Opens box so you can change price of given equipment */

  change(type) {
    for (let i = 0; i < this.state.equipTypeDetails.length; i++) {
      this.state.equipTypeDetails[i].changePrice = false;
    }

    let index = this.state.equipTypeDetails
      .map(function(e) {
        return e.id;
      })
      .indexOf(type.id);
    this.setState({ priceEquip: type.price });
    this.state.equipTypeDetails[index].changePrice = true;
  }

  /* Saves new price you've put in for a given equipment */

  save(type) {
    equipmentService.updateEquipmentType(this.state.priceEquip, type.id);

    let index = this.state.equipTypeDetails
      .map(function(e) {
        return e.id;
      })
      .indexOf(type.id);
    this.state.equipTypeDetails[index].price = this.state.priceEquip;
    this.state.equipTypeDetails[index].changePrice = false;
  }

  /* Uses id of bike from table to add a restriction
  to every bike which shares the same type name.*/

  add() {
    this.infoText = 'Opprettelsen av begrensningen var vellykket';

    if (this.bikeType != '' || this.bikeType != undefined) {
      bikeService.getTypeID(this.bikeType, idResult => {
        equipmentService.addRestriction(idResult[0].id, this.state.equipTypeDetails[0].id);
      });
    }
    this.handleShow();
  }

  /* Uses id of equipment passed from table
  to delete restriction for every equipment of same type.
  Shows confirmation message as well. */

  delete(id) {
    this.handler = id;
    this.infoText = 'Sletting av begrensningen var vellykket.';

    equipmentService.deleteRestriction(this.handler, this.state.equipTypeDetails[0].id, () => {
      this.handleShow();
    });
  }

  mounted() {

    /* Gets restrictions based on the name of the equipment
    which is taken from the name used in the navigation. */

    equipmentService.getRestrictions(this.props.match.params.typeName, results => {
      this.restrictions = results;
      this.lock = false;
    });

    //Empties them for reuse
    this.state.equipments = [];
    this.state.equipTypeDetails = [];

   //Gets all types of equipment
    equipmentService.getEquipmentTypes(type => {
      this.equipType = type;
    });

  //Gets all unique types of bicycles
    equipmentService.getDistinctBikeType(this.props.match.params.typeName, distinctType => {
      this.distinctBikeType = distinctType;
    });


    /* Deduces information it needs from id taken from the
    application navigation to display relevant lists of equipment */

    equipmentService.getTypeID(this.props.match.params.typeName, idResult => {
      this.state.typeIds = idResult;

      for (let i = 0; i < idResult.length; i++) {
        equipmentService.getEquipmentByTypeID(idResult[i].id, results => {
          this.setState(state => {
            const equipments = state.equipments.concat(results);
            return { equipments, results };
          });
        });

        equipmentService.getEquipmentTypesWhere(idResult[i].id, typeResult => {
          for (let i = 0; i < typeResult.length; i++) {
            typeResult[i].selectedEquip = false;
            typeResult[i].changePrice = false;
          }
          this.setState(state => {
            const equipTypeDetails = state.equipTypeDetails.concat(typeResult);
            return {
              equipTypeDetails,
              typeResult
            };
          });
        });
      }
    });


  }
}

/* First half of screen which shows when you
click the button to add new equipment. The box
allows you to add new bike equipment. */

class AddEquipment extends Component {
  antall = 0;
  equipmentTypes = [];
  locations = [];
  showConfirm = false;
  state = {
    selectedEquipTypeID: 1,
    curLocation: ''
  };

  /* Registers across the components what
  location and type you have selected for
  the equipment which you want to add. */

  onChangeType(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({
      state: (this.state.selectedEquipTypeID = event.target.options[selectedIndex].getAttribute('data-key'))
    });
  }
  onChangeLocation(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({ state: (this.state.curLocation = event.target.options[selectedIndex].getAttribute('data-key')) });
  }

  //Handles opening/closing feedback messages

  handleClose() {
    this.showConfirm = false;
  }
  handleShow() {
    this.showConfirm = true;
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykkelutstyr</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Legg inn nytt sykkelutstyr</h5>
            <br />
            <form onSubmit={this.handleShow}>
              <Row>
                <Column width={3}>
                  <Form.Label>Utstyrstype:</Form.Label>
                  <Select onChange={this.onChangeType} value="EquipmentTypes">
                    {this.equipmentTypes.map(type => (
                      <Select.Option key={type.id} dataKey={type.id} value={type.id}>
                        {type.typeName} {type.brand} {type.year} {type.comment}
                      </Select.Option>
                    ))}
                  </Select>
                </Column>
                <Column width={3}>
                  <Form.Label>Lokasjon: </Form.Label>
                  <Select onChange={this.onChangeLocation} value="Locations">
                    {this.locations.map(lokasjon => (
                      <Select.Option key={lokasjon.id} dataKey={lokasjon.id} value={lokasjon.id}>
                        {lokasjon.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Column>
              </Row>
              <br />
              <Row>
                <Column width={3}>
                  <Form.Label>Antall:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.antall = event.target.value)} />
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
        <br />
        <NewEquipmentType />
        <br />

        <Modal show={this.showConfirm} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Er informasjonen riktig?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Er du sikker på at informasjonen er riktig?</p>
            <br />
            <p>Trykk Utfør for å legge til sykkelutstyret.</p>
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

  // Adds the new equipment to the database

  add() {
    if (this.antall <= 0) {
      return;
    } else {
      for (let i = 0; i < this.antall; i++) {
        equipmentService.addEquipment(this.state.curLocation, this.state.selectedEquipTypeID, 'OK');
      }
    }
    this.handleClose();
    history.push('/equipmentTypes/Helmet');
  }

// Returns you to the main equipment page if you click "Cancel"

  cancel() {
    history.push('/equipmentTypes/Helmet');
  }

  //Gets all the locations so you can select them

  mounted() {
    rentalService.getLocations(locations => {
      this.state.curLocation = locations[0].id;
      this.locations = locations;
    });


  //Gets all the equipment types so you can select them

    equipmentService.getEquipmentTypes(type => {
      this.selectedEquipment = type[0].id;
      this.equipmentTypes = type;
    });
  }
}

/* Second half of screen which shows when you
click the button to add new equipment. The box
allows you to add entirely new bike types. */

class NewEquipmentType extends Component {
  typeName = '';
  brand = '';
  year = 0;
  comment = '';
  price = 0;
  showConfirm = false;


    //Handles opening/closing feedback messages

  handleClose() {
    this.showConfirm = false;
  }
  handleShow() {
    this.showConfirm = true;
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykkelutstyr</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Ny utstyrstype</h5>
            <br />
            <form onSubmit={this.handleShow}>
              <Row>
                <Column>
                  <Form.Label>Type:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.typeName = event.target.value)} />
                  <Form.Label>Merke:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.brand = event.target.value)} />
                  <Form.Label>Årsmodell:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.year = event.target.value)} />
                </Column>
                <Column>
                  <Form.Label>Størrelse:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.comment = event.target.value)} />
                  <Form.Label>Pris:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.price = event.target.value)} />
                  <br />
                  <br />
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
            <p>Trykk Utfør for å legge til utstyrstypen.</p>
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

  /* Adds your new equipment type with all entered
  information into the database */

  add() {
    equipmentService.newEquipmentType(this.typeName, this.brand, this.year, this.comment, this.price);

    this.handleClose();
    history.push('/equipmentTypes/Helmet');
  }

  // Returns you to the main equipment page if you click "Cancel"

  cancel() {
    history.push('/equipmentTypes/Helmet');
  }
}

module.exports = {
  EquipmentTypes,
  EquipTypeDetails,
  AddEquipment
};
