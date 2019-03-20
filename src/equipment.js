import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { equipmentService } from './services/equipmentService';
import { connection } from './services/mysql_connection';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class EquipmentTypes extends Component {
  equipTypes = [];

  render() {
    return (
      <div>
        <H1>Sykkelutstyr</H1>
        <br />
        <Tab>
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

class EquipTypeDetails extends Component {
  equipType = null;
  showingEquipment = 0;
  state = {
    equipments: [],
    typeIds: [],
    equipTypeDetails: []
  };

  showThisType(id) {
    if (this.showingEquipment === id) {
      this.state.equipments = [];
      let temp = [];

      for (let i = 0; i < this.state.typeIds.length; i++) {
        equipmentService.getEquipmentByTypeID(this.state.typeIds[i].id, results => {
          this.showingEquipment = id;
          this.setState(state => {
            const equipments = state.equipments.concat(results);
            return { equipments, results };
          });
        });
      }

      this.showingEquipment = 0;
    } else {
      this.state.equipments = [];
      equipmentService.getEquipmentByTypeID(id, results => {
        this.showingEquipment = id;
        this.setState(state => {
          const equipments = state.equipments.concat(results);
          return { equipments, results };
        });
      });
    }
  }

  render() {
    if (!this.equipType) return null;

    return (
      <div>
        <Card>
          <Row>
            <Column>
              <h6>Detaljert beskrivelse</h6>
              <Table>
                <Table.Thead>
                  <Table.Th>Merke</Table.Th>
                  <Table.Th>Årsmodell</Table.Th>
                  <Table.Th>Størrelse</Table.Th>
                  <Table.Th>Pris</Table.Th>
                </Table.Thead>
                <Table.Tbody>
                  {this.state.equipTypeDetails.map(type => (
                    <Table.Tr
                      key={type.id}
                      onClick={() => {
                        this.showThisType(type.id);
                      }}
                    >
                      <Table.Td>{type.brand}</Table.Td>
                      <Table.Td>{type.year}</Table.Td>
                      <Table.Td>{type.comment}</Table.Td>
                      <Table.Td>{type.price}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <br />
              <h6>Utstyr av denne typen:</h6>
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
          </Row>
        </Card>
      </div>
    );
  }

  mounted() {
    this.state.equipments = [];
    this.state.equipTypeDetails = [];

    equipmentService.getEquipmentTypes(type => {
      this.equipType = type;
    });

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

class AddEquipment extends Component {
  antall = 0;
  equipmentTypes = [];
  locations = [];
  state = {
    selectedEquipTypeID: 1,
    curLocation: ''
  };

  onChangeType(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({
      state: (this.state.selectedEquipTypeID = event.target.options[selectedIndex].getAttribute('data-key'))
    });
  }

  onChangeLocation(event) {
    const selectedIndex = event.target.options.selectedIndex;
    this.setState({ state: (this.state.curLocation = event.target.options[selectedIndex].getAttribute('data-key')) });
    console.log(this.state.curLocation);
  }

  render() {
    return (
      <div>
        <Card>
          <h5>Legg inn nytt sykkelutstyr</h5>
          <br />
          <div className="container">
            <Row>
              <Column width={3}>
                <Row>
                  <Form.Label>Utstyrstype:</Form.Label>
                </Row>
                <Row>
                  <select onChange={this.onChangeType}>
                    {this.equipmentTypes.map(type => (
                      <option key={type.id} data-key={type.id}>
                        {type.typeName} {type.brand} {type.year} {type.comment}
                      </option>
                    ))}
                  </select>
                </Row>
              </Column>
              <Column widht={3}>
                <Row>
                  <Form.Label>Lokasjon: </Form.Label>
                </Row>
                <Row>
                  <select onChange={this.onChangeLocation}>
                    {this.locations.map(lokasjon => (
                      <option key={lokasjon.id} data-key={lokasjon.id}>
                        {lokasjon.name}
                      </option>
                    ))}
                  </select>
                </Row>
              </Column>
            </Row>
            <br />
            <Row>
              <Column width={3}>
                <Row>
                  <Form.Label>Antall:</Form.Label>
                </Row>
                <Row>
                  <Form.Input type="text" onChange={event => (this.antall = event.target.value)} />
                </Row>
              </Column>
            </Row>
            <br />
            <Row>
              <Column>
                <Button.Success onClick={this.add}>Add</Button.Success>
              </Column>
              <Column right>
                <Button.Light onClick={this.cancel}>Cancel</Button.Light>
              </Column>
            </Row>
          </div>
        </Card>
        <br />
        <Card>
          <h5>Legg til ny utstyrstype</h5>
        </Card>
      </div>
    );
  }

  add() {
    if (this.antall <= 0) {
      return;
    } else {
      for (let i = 0; i < this.antall; i++) {
        equipmentService.addEquipment(this.state.curLocation, this.state.selectedEquipTypeID, 'OK');
      }
    }

    history.push('/equipmentTypes/Helmet');
  }

  cancel() {
    history.push('/equipmentTypes/Helmet');
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.state.curLocation = locations[0].id;
      this.locations = locations;
    });

    equipmentService.getEquipmentTypes(type => {
      this.selectedEquipment = type[0].id;
      this.equipmentTypes = type;
    });
  }
}

// class NewBikeType extends Component {
//   typeName = '';
//   brand = '';
//   model = '';
//   year = 0;
//   frameSize = 0;
//   wheelSize = 0;
//   gears = 0;
//   gearSystem = '';
//   brakeSystem = '';
//   weight_kg = 0;
//   suitedFor = '';
//   price = 0;
//
//   render() {
//     return (
//       <Card>
//         <div className="container">
//           <h5>Ny sykkeltype</h5>
//           <Row>
//             <Column>
//               <Form.Label>Type:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.typeName = event.target.value)} />
//               <Form.Label>Merke:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.brand = event.target.value)} />
//               <Form.Label>Modell:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.model = event.target.value)} />
//               <Form.Label>Årsmodell:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.year = event.target.value)} />
//               <Form.Label>Rammestørrelse:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.frameSize = event.target.value)} />
//               <Form.Label>Hjulstørrelse:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.wheelSize = event.target.value)} />
//               <Form.Label>Antall gir:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.gears = event.target.value)} />
//             </Column>
//             <Column>
//               <Form.Label>Girsystem:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.gearSystem = event.target.value)} />
//               <Form.Label>Bremsesystem:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.brakeSystem = event.target.value)} />
//               <Form.Label>Vekt:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.weight_kg = event.target.value)} />
//               <Form.Label>Beregnet for:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.suitedFor = event.target.value)} />
//               <Form.Label>Pris:</Form.Label>
//               <Form.Input type="text" onChange={event => (this.price = event.target.value)} />
//               <br />
//               <br />
//               <Row>
//                 <Column>
//                   <Button.Success onClick={this.add}>Add</Button.Success>
//                 </Column>
//                 <Column right>
//                   <Button.Light onClick={this.cancel}>Cancel</Button.Light>
//                 </Column>
//               </Row>
//             </Column>
//             <br />
//           </Row>
//         </div>
//       </Card>
//     );
//   }
//
//   add() {
//     bikeService.newBikeType(
//       this.typeName,
//       this.brand,
//       this.model,
//       this.year,
//       this.frameSize,
//       this.wheelSize,
//       this.gears,
//       this.gearSystem,
//       this.brakeSystem,
//       this.weight_kg,
//       this.suitedFor,
//       this.price
//     );
//
//     history.push('/bikeTypes/');
//   }
//
//   cancel() {
//     history.push('/bikeTypes/' + this.props.match.params.typeName);
//   }
// }

// class BikeStatus extends Component {
//   bikeStatus = [];
//
//   render() {
//     return (
//       <div>
//         <H1>Sykler etter status</H1>
//         <br />
//         <Tab>
//           {this.bikeStatus.map(status => (
//             <Tab.Item key={status.bikeStatus} to={'/bikeStatus/' + status.bikeStatus}>
//               {status.bikeStatus}
//             </Tab.Item>
//           ))}
//         </Tab>
//       </div>
//     );
//   }
//
//   mounted() {
//     bikeService.getBikeStatus(bikeStatus => {
//       this.bikeStatus = bikeStatus;
//     });
//   }
// }
//
// class BikesByStatus extends Component {
//   bikeStatus = null;
//   bikes = [];
//
//   render() {
//     if (!this.bikeStatus) return null;
//
//     return (
//       <div>
//         <Card>
//           <h6>Sykler med denne statusen:</h6>
//           <Table>
//             <Table.Thead>
//               <Table.Th>ID</Table.Th>
//               <Table.Th>Lokasjon</Table.Th>
//               <Table.Th>Sykkeltype</Table.Th>
//             </Table.Thead>
//             <Table.Tbody>
//               {this.bikes.map(bike => (
//                 <Table.Tr key={bike.id}>
//                   <Table.Td>{bike.id}</Table.Td>
//                   <Table.Td>{bike.name}</Table.Td>
//                   <Table.Td>{bike.typeName}</Table.Td>
//                 </Table.Tr>
//               ))}
//             </Table.Tbody>
//           </Table>
//         </Card>
//       </div>
//     );
//   }
//
//   mounted() {
//     bikeService.getBikeStatus(bikeStatus => {
//       this.bikeStatus = bikeStatus;
//     });
//
//     bikeService.getBikesByStatus(this.props.match.params.bikeStatus, bikes => {
//       this.bikes = bikes;
//     });
//   }
// }

module.exports = {
  EquipmentTypes,
  EquipTypeDetails,
  AddEquipment
};
