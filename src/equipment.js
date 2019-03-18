import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import { basket, employeeID } from './index.js';

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
          {this.equipTypes.map(types => (
            <Tab.Item key={types.id} to={'/equipment/' + types.id}>
              {types.typeName}
            </Tab.Item>
          ))}
          <Column right>
            <NavLink to={'/equipment/add/'}>
              <Button.Light>Legg inn ny utstyrstype</Button.Light>
            </NavLink>
          </Column>
        </Tab>
      </div>
    );
  }

  mounted() {
    equipmentService.getEquipmentType(types => {
      this.equipTypes = types;
    });
  }
}

class AddEquipment extends Component {
  antall = 0;
  equipTypes = [];
  locations = [];

  render() {
    return (
      <Card>
        <div className="container">
          <h5>Nytt sykkelutstyr</h5>
          <Row>
            <Column>
              <Form.Label>Antall:</Form.Label>
              <Form.Input type="text" onChange={event => (this.antall = event.target.value)} />
              <Form.Label>Lokasjon: </Form.Label>
              <select onChange={this.onChangeLocation}>
                {this.locations.map(lokasjon => (
                  <option key={lokasjon.id} data-key={lokasjon.id}>
                    {lokasjon.name}
                  </option>
                ))}
              </select>
              <br /> <br />
              <Row>
                <Column>
                  <Button.Success onClick={this.add}>Add</Button.Success>
                </Column>
                <Column right>
                  <Button.Light onClick={this.cancel}>Cancel</Button.Light>
                </Column>
              </Row>
            </Column>
            <br />
          </Row>
        </div>
      </Card>
    );
  }

  add() {
    if (this.antall <= 0) {
      return;
    } else {
      for (let i = 0; i < this.antall; i++) {
        equipmentService.addEquipment();
      }
    }

    history.push('/equipment/');
  }

  cancel() {
    history.push('/equipment/');
  }

  mounted() {
    rentalService.getLocations(locations => {
      this.state.curLocation = locations[0].id;
      this.locations = locations;
    });

    equipmentService.getEquipmentTypes(types => {
      this.equipTypes = types;
    });
  }
}

// class BikeTypeDetails extends Component {
//   bikeType = null;
//   state = {
//     bikes: [],
//     typeIds: 0,
//     bikeTypeDetails: []
//   };
//
//   render() {
//     if (!this.bikeType) return null;
//
//     return (
//       <div>
//         <Card>
//           <Row>
//             <Column>
//               <h6>Detaljert beskrivelse</h6>
//               <Table>
//                 <Table.Thead>
//                   <Table.Th>Merke</Table.Th>
//                   <Table.Th>Modell</Table.Th>
//                   <Table.Th>Årsmodell</Table.Th>
//                   <Table.Th>Rammestørrelse</Table.Th>
//                   <Table.Th>Hjulstørrelse</Table.Th>
//                   <Table.Th>Antall gir</Table.Th>
//                   <Table.Th>Girsystem</Table.Th>
//                   <Table.Th>Bremsesytem</Table.Th>
//                   <Table.Th>Vekt</Table.Th>
//                   <Table.Th>Beregnet for</Table.Th>
//                   <Table.Th>Timespris</Table.Th>
//                 </Table.Thead>
//                 <Table.Tbody>
//                   {this.state.bikeTypeDetails.map(bike => (
//                     <Table.Tr key={bike.id}>
//                       <Table.Td>{bike.brand}</Table.Td>
//                       <Table.Td>{bike.model}</Table.Td>
//                       <Table.Td>{bike.year}</Table.Td>
//                       <Table.Td>{bike.frameSize}</Table.Td>
//                       <Table.Td>{bike.wheelSize}</Table.Td>
//                       <Table.Td>{bike.gears}</Table.Td>
//                       <Table.Td>{bike.gearSystem}</Table.Td>
//                       <Table.Td>{bike.brakeSystem}</Table.Td>
//                       <Table.Td>{bike.weight_kg}</Table.Td>
//                       <Table.Td>{bike.suitedFor}</Table.Td>
//                       <Table.Td>{bike.price}</Table.Td>
//                     </Table.Tr>
//                   ))}
//                 </Table.Tbody>
//               </Table>
//               <br />
//               <h6>Sykler av denne typen:</h6>
//               <Table>
//                 <Table.Thead>
//                   <Table.Th>ID</Table.Th>
//                   <Table.Th>Lokasjon</Table.Th>
//                   <Table.Th>Status</Table.Th>
//                 </Table.Thead>
//                 <Table.Tbody>
//                   {this.state.bikes.map(bike => (
//                     <Table.Tr key={bike.id}>
//                       <Table.Td>{bike.id}</Table.Td>
//                       <Table.Td>{bike.location_id}</Table.Td>
//                       <Table.Td>{bike.bikeStatus}</Table.Td>
//                     </Table.Tr>
//                   ))}
//                 </Table.Tbody>
//               </Table>
//             </Column>
//           </Row>
//         </Card>
//       </div>
//     );
//   }
//
//   mounted() {
//     this.state.bikes = [];
//     this.state.bikeTypeDetails = [];
//
//     bikeService.getBikeTypes(bikeType => {
//       this.bikeType = bikeType;
//     });
//
//     connection.query(
//       'select id from BikeType where typeName = ?',
//       [this.props.match.params.typeName],
//       (error, idResult) => {
//         if (error) return console.error(error);
//         this.setState({ state: (this.state.typeIds = idResult) });
//
//         for (let i = 0; i < idResult.length; i++) {
//           connection.query(
//             'select id, location_id, bikeStatus from Bikes where type_id = ?',
//             [idResult[i].id],
//             (error, results) => {
//               if (error) return console.error(error);
//
//               this.setState(state => {
//                 const bikes = state.bikes.concat(results);
//                 return {
//                   bikes,
//                   results
//                 };
//               });
//             }
//           );
//
//           connection.query('select * from BikeType where id = ?', [idResult[i].id], (error, typeResult) => {
//             if (error) return console.error(error);
//
//             this.setState(state => {
//               const bikeTypeDetails = state.bikeTypeDetails.concat(typeResult);
//               return {
//                 bikeTypeDetails,
//                 typeResult
//               };
//             });
//           });
//         }
//       }
//     );
//   }
// }

// class EquipmentOnLocation extends Component {
//   locations = null;
//   equipment = [];
//
//   render() {
//     if (!this.locations) return null;
//
//     return (
//       <div>
//         <Card>
//           <Row>
//             <Column>
//               <h6>Liste over sykkelutstyr på valgt lokasjon</h6>
//               <Table>
//                 <Table.Thead>
//                   <Table.Th>ID</Table.Th>
//                   <Table.Th>Typenavn</Table.Th>
//                   <Table.Th>Produsent</Table.Th>
//                   <Table.Th>År</Table.Th>
//                   <Table.Th>Ramme</Table.Th>
//                   <Table.Th>Hjul</Table.Th>
//                   <Table.Th>Antall gir</Table.Th>
//                   <Table.Th>Gir</Table.Th>
//                   <Table.Th>Bremser</Table.Th>
//                   <Table.Th>Vekt</Table.Th>
//                   <Table.Th>Beregnet for</Table.Th>
//                   <Table.Th>Timespris</Table.Th>
//                 </Table.Thead>
//                 <Table.Tbody>
//                   {this.bikes.map(bike => (
//                     <Table.Tr key={bike.id}>
//                       <Table.Td>{bike.id}</Table.Td>
//                       <Table.Td>{bike.typeName}</Table.Td>
//                       <Table.Td>{bike.brand}</Table.Td>
//                       <Table.Td>{bike.year}</Table.Td>
//                       <Table.Td>{bike.frameSize}</Table.Td>
//                       <Table.Td>{bike.wheelSize}</Table.Td>
//                       <Table.Td>{bike.gears}</Table.Td>
//                       <Table.Td>{bike.gearSystem}</Table.Td>
//                       <Table.Td>{bike.brakeSystem}</Table.Td>
//                       <Table.Td>{bike.weight_kg}</Table.Td>
//                       <Table.Td>{bike.suitedFor}</Table.Td>
//                       <Table.Td>{bike.price}</Table.Td>
//                     </Table.Tr>
//                   ))}
//                 </Table.Tbody>
//               </Table>
//             </Column>
//           </Row>
//         </Card>
//       </div>
//     );
//   }
//
//   mounted() {
//     rentalService.getLocations(locations => {
//       this.bikeLocations = locations;
//     });
//
//     bikeService.getBikesOnLocation(this.props.match.params.id, bikes => {
//       this.bikes = bikes;
//     });
//   }
// }

module.exports = {};
