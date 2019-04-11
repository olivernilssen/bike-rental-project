import * as React from 'react';
import { Component } from 'react-simplified';
import {
  Card,
  Tab,
  Row,
  Column,
  NavBar,
  Button,
  ButtonOutline,
  Form,
  Table,
  ClickTable,
  Select,
  CenterContent
} from './widgets';
import { NavLink } from 'react-router-dom';
import { rentalService } from './services/services';
import { bikeService } from './services/bikesService';
import { Modal } from 'react-bootstrap';
require('react-bootstrap/ModalHeader');
require('react-bootstrap/Modal');

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class AllBikes extends Component {
  state = {
    bikes: [],
    searchWord: ''
  };

  /**Handle bikeSearch
   * Sets state of searchword to input value,
   * and then calls to searchBikes()
   * @event - event that's executed when button is clicked
   */
  handleChange(event) {
    this.setState({ state: (this.state.searchWord = event.target.value) }, this.searchBikes());
  }

  /**search bikes
   * Search for bikes depending on user input
   * Always set searchword to %% at the start, 
   * so if the input is empty, then it will 
   * print out eveything.
   */
  searchBikes() {
    let searchWord = '%' + this.state.searchWord + '%';

    bikeService.searchBikes(searchWord, results => {
      this.setState({ state: (this.state.bikes = []) });
      this.setState(state => {
        const bikes = state.bikes.concat(results);
        return {
          bikes,
          results
        };
      });
    });
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykler</h1>
        </NavBar>
        <div role="main">
          <Column right>
            <NavLink to={'/addBikes/'}>
              <Button.Light>Legg inn ny sykkel</Button.Light>
            </NavLink>
          </Column>
          <Card>
            <Row>
              <Column>
                <Column right>
                  <Form.Label>Søk på sykkel etter id, type, modell eller lokasjon</Form.Label>
                  <Form.Input onChange={this.handleChange}>{this.state.searchWord}</Form.Input>
                </Column>
              </Column>
            </Row>
            <br />
            <Row>
              <Column>
                <Table>
                  <Table.Thead>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Merke</Table.Th>
                    <Table.Th>Modell</Table.Th>
                    <Table.Th>Årsmodell</Table.Th>
                    <Table.Th>Beregnet for</Table.Th>
                    <Table.Th>Dagspris</Table.Th>
                    <Table.Th>Lokasjon</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th />
                  </Table.Thead>
                  <Table.Tbody>
                    {this.state.bikes.map(bike => (
                      <Table.Tr key={bike.id}>
                        <Table.Td>{bike.id}</Table.Td>
                        <Table.Td>{bike.typeName}</Table.Td>
                        <Table.Td>{bike.brand}</Table.Td>
                        <Table.Td>{bike.model}</Table.Td>
                        <Table.Td>{bike.year}</Table.Td>
                        <Table.Td>{bike.suitedFor}</Table.Td>
                        <Table.Td>{bike.price}</Table.Td>
                        <Table.Td>{bike.name}</Table.Td>
                        <Table.Td>{bike.bikeStatus}</Table.Td>
                        <Table.Td>
                          <NavLink to={'/selectedBike/' + bike.id}>
                            <ButtonOutline.Info>Endre</ButtonOutline.Info>
                          </NavLink>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Column>
            </Row>
          </Card>
        </div>
        <br />
      </div>
    );
  }

  /** Mounted
   * We use an sql-query to fetch all bikes from the database
   * and stores them in the bike-array
   */
  mounted() {
    bikeService.getAllBikesByType(results => {
      this.setState({ bikes: results });
    });
  }
}

class SelectedBike extends Component {
  bike = [];
  bikeType = '';
  bikeLoc = '';
  bikeStatus = '';
  locations = [];
  note = '';
  state = {
    location_id: null,
    statusOnBike: ['OK', 'Til Reperasjon', 'Trenger Reperasjon', 'Trenger Service', 'Må flyttes', 'Stjålet', 'Utleid']
  };

  render() {
    if (!this.bike) return null;

    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykler</h1>
        </NavBar>
        <Card title={'Sykkel med id: ' + this.props.match.params.id}>
          <img src="../pictures/bike.svg" width="20%" alt="Illustrasjonsbilde av en sykkel" />

          <Table>
            <Table.Thead>
              <Table.Th>Type id:</Table.Th>
              <Table.Th>Merke</Table.Th>
              <Table.Th>Model</Table.Th>
              <Table.Th>År</Table.Th>
              <Table.Th>Ramme</Table.Th>
              <Table.Th>Girsystem</Table.Th>
              <Table.Th>Bremser</Table.Th>
              <Table.Th>Vekt</Table.Th>
              <Table.Th>For</Table.Th>
              <Table.Th>Pris</Table.Th>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>{this.bike.type_id}</Table.Td>
                <Table.Td>{this.bike.brand}</Table.Td>
                <Table.Td>{this.bike.model}</Table.Td>
                <Table.Td>{this.bike.year}</Table.Td>
                <Table.Td>{this.bike.frameSize}"</Table.Td>
                <Table.Td>
                  {this.bike.gearSystem}/{this.bike.gears}
                </Table.Td>
                <Table.Td>{this.bike.brakeSystem}</Table.Td>
                <Table.Td>{this.bike.weight_kg}kg</Table.Td>
                <Table.Td>{this.bike.suitedFor}</Table.Td>
                <Table.Td>{this.bike.price}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <br />
          <br />

          <Table>
            <Table.Thead>
              <Table.Th>Sykkel id</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Lokasjon</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>{this.props.match.params.id}</Table.Td>
                <Table.Td>{this.bike.typeName}</Table.Td>
                <Table.Td>
                  <Select name="locationSelect" value={this.bikeLoc} onChange={this.onChangeLocation}>
                    {this.locations.map(loc => (
                      <Select.Option key={loc.id} id={loc.id}>
                        {loc.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Table.Td>
                <Table.Td>
                  <Select
                    name="status"
                    value={this.bikeStatus}
                    onChange={event => (this.bikeStatus = event.target.value)}
                  >
                    {this.state.statusOnBike.map(status => (
                      <Select.Option key={status} id={status}>
                        {status}
                      </Select.Option>
                    ))}
                  </Select>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <br />

          <CenterContent>
            <div className="form-group">
              <Form.Label htmlFor="comment">
                <b>Skriv inn en kommentar om sykkelen:</b>
              </Form.Label>
              <textarea
                className="form-control"
                id="comment"
                row="200"
                cols="100"
                value={this.note}
                onChange={event => (this.note = event.target.value)}
              />
            </div>
          </CenterContent>

          <Row>
            <Column>
              <ButtonOutline.Success onClick={this.change}>Lagre</ButtonOutline.Success>
            </Column>

            <Column right>
              <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
            </Column>
          </Row>
        </Card>

        <br />
      </div>
    );
  }

  /** Mounted
   * We use an sql-query to fetch all locations from the database,
   * and stores them in the locations-array.
   * We fetch the bike with the specific id
   */
  mounted() {
    rentalService.getLocations(result => {
      this.locations = result;
    });

    bikeService.getBike(this.props.match.params.id, result => {
      this.bike = result;
      this.bikeLoc = result.name;
      this.bikeType = result.typeName;
      this.bikeStatus = result.bikeStatus;
      this.state.location_id = result.location_id;
      if (result.bikeNote == null) {
        this.note = '';
      } else {
        this.note = result.bikeNote;
      }
    });
  }

  /** Select location
   * Gets the location_id from the select locations option-menu
   * @event - the chosen option in our list
   */
  onChangeLocation(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.bikeLoc = event.target.value;
    this.setState({ state: (this.state.location_id = event.target.options[selectedIndex].getAttribute('data-key')) });
  }

  /** Change bike info
   * Updates the bike in the database, with the chosen values
   */
  change() {
    if (this.state.location_id == null) {
    } else {
      bikeService.updateBikes(this.props.match.params.id, this.bikeStatus, this.state.location_id, this.note);
      this.props.history.goBack();
    }
  }

  //Goes back to previous page by cancelling action
  cancel() {
    this.props.history.goBack();
  }
}

class BikeTypes extends Component {
  bikeTypes = [];

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykler</h1>
        </NavBar>
        <Tab ariaLabel="Biketypes">
          {this.bikeTypes.map(bikeType => (
            <Tab.Item key={bikeType.typeName} to={'/bikeTypes/' + bikeType.typeName}>
              {bikeType.typeName}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/addBikeType/'}>
              <Button.Light>Legg inn ny sykkeltype</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  /** Mounted
   * Gets one of each biketype from an sql-query to the database
   */
  mounted() {
    bikeService.getDistinctBikeType(bikeTypes => {
      for (let i = 0; i < bikeTypes.length; i++) {
        for (let j = 0; j < bikeTypes.length; j++) {
          if (i == j) {
            continue;
          } else if (bikeTypes[i].typeName == bikeTypes[j].typeName) {
            bikeTypes.splice(j, 1);
          }
        }
      }
      this.bikeTypes = bikeTypes;
    });
  }
}

class AddBikes extends Component {
  antall = 0;
  bikeTypes = [];
  locations = [];
  typeSykkel = '';
  showConfirm = false;
  state = {
    selectedBikeID: 1,
    curLocation: ''
  };

  /** On change of biketype
   * Sets the selected biketype to the chosen option in our list
   * @event - the option chosen from the select option menu
   */
  onChangeType(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({
      state: (this.state.selectedBikeID = event.target.options[selectedIndex].getAttribute('data-key'))
    });
  }

  /** On change of locations
   * Sets the selected location to the chosen option in our list
   * @event - the option chosen from the select option menu
   */
  onChangeLocation(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({ state: (this.state.curLocation = event.target.options[selectedIndex].getAttribute('data-key')) });
  }

  /** Handle opening and closing of the modal
   * Modal opens when submitting the form
   */
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
          <h1>Sykler</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Ny sykkel</h5>
            <form onSubmit={this.handleShow}>
              <Row>
                <Column>
                  <Form.Label>Antall:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.antall = event.target.value)} />
                  <Form.Label>Type:</Form.Label>
                  <Select onChange={this.onChangeType}>
                    {this.bikeTypes.map(bikeType => (
                      <Select.Option key={bikeType.id} dataKey={bikeType.id}>
                        {bikeType.typeName} {bikeType.brand} {bikeType.model} {bikeType.year}
                      </Select.Option>
                    ))}
                  </Select>
                  <Form.Label>Lokasjon: </Form.Label>
                  <Select onChange={this.onChangeLocation}>
                    {this.locations.map(lokasjon => (
                      <Select.Option key={lokasjon.id} dataKey={lokasjon.id}>
                        {lokasjon.name}
                      </Select.Option>
                    ))}
                  </Select>
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
            <p>Trykk Utfør for å legge til ny sykkel.</p>
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

  /** Add the bike
   * Adds the bike(s) to the database, with the chosen bikeType
   * and location
   */
  add() {
    if (this.antall <= 0) {
      return;
    } else {
      for (let i = 0; i < this.antall; i++) {
        bikeService.addBike(this.state.curLocation, this.state.selectedBikeID, 'OK');
      }
    }
    this.handleClose();
    history.push('/allBikes/');
  }

  cancel() {
    history.push('/allBikes/');
  }

  /** Mounted
   * Fetch the locations stored in the database
   * Fetch the biketypes stores in the database
   */
  mounted() {
    rentalService.getLocations(locations => {
      this.state.curLocation = locations[0].id;
      this.locations = locations;
    });

    bikeService.getBikeTypes(bikeTypes => {
      this.selectedBike = bikeTypes[0].id;
      this.bikeTypes = bikeTypes;
    });
  }
}

class BikeTypeDetails extends Component {
  showingBikes = 0;
  lock = false;

  changePrice = false;
  typeIds = [];

  state = {
    priceBike: '',
    bikes: [],
    bikeTypeDetails: null
  };

  /** Show all bikes with specific brand within a biketype
   * Bikes belonging to the specific brand will show when the brand
   * is clicked on. When the brand is clicked again, all bikes from
   * the chosen biketype will show
   * @type - the brand that is clicked on
   */
  showThisType(type) {
    this.temp = [];
    let index = this.state.bikeTypeDetails
      .map(function(e) {
        return e.id;
      })
      .indexOf(type.id);

    for (let i = 0; i < this.state.bikeTypeDetails.length; i++) {
      this.state.bikeTypeDetails[i].selectedType = false;
    }

    if (this.showingBikes === type.id && this.lock == true) {
      this.lock = false;
      this.state.bikes = [];

      for (let i = 0; i < this.typeIds.length; i++) {
        bikeService.getBikesbyTypeID(this.typeIds[i].id, results => {
          this.setState({ bikes: this.state.bikes.concat(results) });
        });
      }
      this.showingBikes = 0;
    } else {
      this.lock = true;
      this.state.bikeTypeDetails[index].selectedType = true;
      this.state.bikes = [];

      bikeService.getBikesbyTypeID(type.id, results => {
        this.showingBikes = type.id;
        this.state.bikes = [];
        this.setState({ bikes: results });
      });
    }
  }

  /** Handle change
   * This check to see if there has been a change in the input
   * for the price of the bikebrand. If there is, change the value shown
   * @e - The chosen value
   */
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    if (!this.state.bikeTypeDetails) return null;

    let notice;

    if (this.lock == true) {
      notice = (
        <p style={{ color: 'red' }}>Trykk på samme leiegjenstand igjen for å se beholdning for alle størrelser/typer</p>
      );
    }

    return (
      <div role="main">
        <Card>
          <Row>
            <Column>
              <h6>Detaljert beskrivelse</h6>
              <ClickTable>
                <ClickTable.Thead>
                  <ClickTable.Th>Merke</ClickTable.Th>
                  <ClickTable.Th>Modell</ClickTable.Th>
                  <ClickTable.Th>Årsmodell</ClickTable.Th>
                  <ClickTable.Th>Ramme</ClickTable.Th>
                  <ClickTable.Th>Hjul</ClickTable.Th>
                  <ClickTable.Th>Girsystem</ClickTable.Th>
                  <ClickTable.Th>Bremsesystem</ClickTable.Th>
                  <ClickTable.Th>Vekt</ClickTable.Th>
                  <ClickTable.Th>Beregnet for</ClickTable.Th>
                  <ClickTable.Th>Dagspris</ClickTable.Th>
                  <ClickTable.Th />
                </ClickTable.Thead>
                <ClickTable.Tbody>
                  {this.state.bikeTypeDetails.map(type => (
                    <ClickTable.Tr
                      style={type.selectedType ? { backgroundColor: '#c5e0e4' } : { backgroundColor: '' }}
                      key={type.id}
                      onClick={() => {
                        this.showThisType(type);
                      }}
                    >
                      <ClickTable.Td>{type.brand}</ClickTable.Td>
                      <ClickTable.Td>{type.model}</ClickTable.Td>
                      <ClickTable.Td>{type.year}</ClickTable.Td>
                      <ClickTable.Td>{type.frameSize}"</ClickTable.Td>
                      <ClickTable.Td>{type.wheelSize}"</ClickTable.Td>
                      <ClickTable.Td>
                        {type.gearSystem} {type.gears}
                      </ClickTable.Td>
                      <ClickTable.Td>{type.brakeSystem}</ClickTable.Td>
                      <ClickTable.Td>{type.weight_kg}kg</ClickTable.Td>
                      <ClickTable.Td>{type.suitedFor}</ClickTable.Td>
                      <ClickTable.Td>
                        {type.changePrice ? (
                          <Form.Input
                            style={{ width: 70 + 'px' }}
                            name="priceBike"
                            value={this.state.priceBike}
                            onChange={this.handleChange}
                          />
                        ) : (
                          type.price
                        )}
                      </ClickTable.Td>
                      <ClickTable.Td>
                        {type.changePrice ? (
                          <ButtonOutline.Success
                            onClick={() => {
                              this.save(type);
                            }}
                          >
                            {' '}
                            {type.changePrice ? 'Lagre' : 'Endre'}
                          </ButtonOutline.Success>
                        ) : (
                          <ButtonOutline.Secondary
                            onClick={() => {
                              this.change(type);
                            }}
                          >
                            {type.changePrice ? 'Lagre' : 'Endre'}
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
              <h6>Sykler av denne typen:</h6>
              <Table>
                <Table.Thead>
                  <Table.Th style={{ padding: 'right' }}>ID</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.state.bikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.name}</Table.Td>
                      <Table.Td>{bike.bikeStatus}</Table.Td>
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

  /** Change the price of the bike
   * Stores the value chosen, to be used in the function save()
   * @type - The bikebrand chosen
   */
  change(type) {
    for (let i = 0; i < this.state.bikeTypeDetails.length; i++) {
      this.state.bikeTypeDetails[i].changePrice = false;
    }

    let index = this.state.bikeTypeDetails
      .map(function(e) {
        return e.id;
      })
      .indexOf(type.id);
    this.setState({ priceBike: type.price });
    this.state.bikeTypeDetails[index].changePrice = true;
  }

  /** Save the price of the bike
   * Updates the price chosen, to all the bikes in the chosen brand
   * Stores this value in the database, by using an sql-query
   * @type - The bikebrand chosen
   */
  save(type) {
    bikeService.updateBikeType(this.state.priceBike, type.id);

    let index = this.state.bikeTypeDetails
      .map(function(e) {
        return e.id;
      })
      .indexOf(type.id);
    this.state.bikeTypeDetails[index].price = this.state.priceBike;
    this.state.bikeTypeDetails[index].changePrice = false;
  }

  /** Mounted
   * Fetches all the information needed from the database
   * Get the id from the biketype chosen, all bikes from this
   * type, and all brands from this type with all bikes from the
   * brand
   */
  mounted() {
    this.state.bikes = [];
    this.state.bikeTypeDetails = [];

    bikeService.getTypeID(this.props.match.params.typeName, idResult => {
      this.typeIds = idResult;

      for (let i = 0; i < idResult.length; i++) {
        bikeService.getBikesbyTypeID(idResult[i].id, results => {
          this.setState(state => {
            const bikes = state.bikes.concat(results);
            return { bikes, results };
          });
        });

        bikeService.getBikeTypesWhere(idResult[i].id, typeResult => {
          for (let i = 0; i < typeResult.length; i++) {
            typeResult[i].selectedType = false;
            typeResult[i].changePrice = false;
          }
          this.setState(state => {
            const bikeTypeDetails = state.bikeTypeDetails.concat(typeResult);
            return {
              bikeTypeDetails,
              typeResult
            };
          });
        });
      }
    });
  }
}

class NewBikeType extends Component {
  typeName = '';
  brand = '';
  model = '';
  year = 0;
  frameSize = 0;
  wheelSize = 0;
  gears = 0;
  gearSystem = '';
  brakeSystem = '';
  weight_kg = 0;
  suitedFor = '';
  price = 0;
  showConfirm = false;


  /**Handle close and show of Modal
   * Handle the closure and showing of the Modal
   * set show confirm equlas true to show
   * and vice verca
   */
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
          <h1>Sykler</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Ny sykkeltype</h5>
            <form onSubmit={this.handleShow}>
              <Row>
                <Column>
                  <Form.Label>Type:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.typeName = event.target.value)} />
                  <Form.Label>Merke:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.brand = event.target.value)} />
                  <Form.Label>Modell:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.model = event.target.value)} />
                  <Form.Label>Årsmodell:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.year = event.target.value)} />
                  <Form.Label>Rammestørrelse:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.frameSize = event.target.value)} />
                  <Form.Label>Hjulstørrelse:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.wheelSize = event.target.value)} />
                </Column>
                <Column>
                  <Form.Label>Girsystem:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.gearSystem = event.target.value)} />
                  <Form.Label>Antall gir:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.gears = event.target.value)} />
                  <Form.Label>Bremsesystem:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.brakeSystem = event.target.value)} />
                  <Form.Label>Vekt:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.weight_kg = event.target.value)} />
                  <Form.Label>Beregnet for:</Form.Label>
                  <Form.Input type="text" required onChange={event => (this.suitedFor = event.target.value)} />
                  <Form.Label>Pris:</Form.Label>
                  <Form.Input type="number" required onChange={event => (this.price = event.target.value)} />
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
            <p>Trykk Utfør for å legge til ny sykkeltype.</p>
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

  /** Add new biketype
   * Does a query and stores the new biketype in the database
   */
  add() {
    bikeService.newBikeType(
      this.typeName,
      this.brand,
      this.model,
      this.year,
      this.frameSize,
      this.wheelSize,
      this.gears,
      this.gearSystem,
      this.brakeSystem,
      this.weight_kg,
      this.suitedFor,
      this.price
    );
    this.handleClose();
    history.push('/bikeTypes/Terreng');
  }

  cancel() {
    history.push('/bikeTypes/Terreng');
  }
}

class BikeStatus extends Component {
  bikeStatus = [];

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Sykler</h1>
        </NavBar>
        <Tab ariaLabel="Bikestatuses">
          {this.bikeStatus.map(status => (
            <Tab.Item key={status.bikeStatus} to={'/bikeStatus/' + status.bikeStatus}>
              {status.bikeStatus}
            </Tab.Item>
          ))}
        </Tab>
      </div>
    );
  }

  /** Mounted
   * Does a query to find all the different bikestatuses
   */
  mounted() {
    bikeService.getBikeStatus(bikeStatus => {
      this.bikeStatus = bikeStatus;
    });
  }
}

class BikesByStatus extends Component {
  bikeStatus = null;
  bikes = [];

  render() {
    if (!this.bikeStatus) return null;

    return (
      <div role="main">
        <Card>
          <h6>Sykler med denne statusen:</h6>
          <Table>
            <Table.Thead>
              <Table.Th width={200}>ID</Table.Th>
              <Table.Th width={400}>Lokasjon</Table.Th>
              <Table.Th width={400}>Sykkeltype</Table.Th>
              <Table.Th />
            </Table.Thead>
            <Table.Tbody>
              {this.bikes.map(bike => (
                <Table.Tr key={bike.id}>
                  <Table.Td>{bike.id}</Table.Td>
                  <Table.Td>{bike.name}</Table.Td>
                  <Table.Td>{bike.typeName}</Table.Td>
                  <Table.Td>
                    <NavLink style={{ float: 'right' }} to={'/selectedBike/' + bike.id}>
                      <ButtonOutline.Secondary>Endre</ButtonOutline.Secondary>
                    </NavLink>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
        <br />
      </div>
    );
  }

  /** Mounted
   * Does a query to find all bikes with the different bikestatuses
   */
  mounted() {
    bikeService.getBikeStatus(bikeStatus => {
      this.bikeStatus = bikeStatus;
    });

    bikeService.getBikesByStatus(this.props.match.params.bikeStatus, bikes => {
      this.bikes = bikes;
    });
  }
}

module.exports = {
  AllBikes,
  BikeTypes,
  BikeTypeDetails,
  BikeStatus,
  BikesByStatus,
  NewBikeType,
  AddBikes,
  SelectedBike
};
