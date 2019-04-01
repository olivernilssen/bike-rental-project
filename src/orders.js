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
  ClickTable,
  H1,
  Select
} from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { orderService } from './services/ordersService';
import { rentalService } from './services/services';
import { emplyoeeID } from './index.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Orders extends Component {
  state = {
    sales: [],
    searchWord: '',
    month: '%',
    activeOrder: null
  };

  onChangeHandle(event) {
    this.setState({ state: (this.state.searchWord = event.target.value) }, this.searchSales());
  }

  handleChangeSelect(event) {
    this.setState({ month: (this.state.month = event.target.value) }, this.searchSales());
  }

  searchSales() {
    let searchWord = '%' + this.state.searchWord + '%';
    let month = '%' + this.state.month + '%';

    rentalService.searchSales(searchWord, month, results => {
      this.setState({ state: (this.state.sales = []) });
      this.setState(state => {
        const sales = state.sales.concat(results);
        return {
          sales,
          results
        };
      });
    });
  }

  chooseActive(order) {
    let index = this.state.sales
      .map(function(e) {
        return e.id;
      })
      .indexOf(order.id);

    for (let i = 0; i < this.state.sales.length; i++) {
      this.state.sales[i].selectedSale = false;
    }

    this.state.sales[index].selectedSale = true;

    orderService.getOrder(order.id, result => {
      this.setState({ state: (this.state.activeOrder = result) });
    });
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Ordrer</h1>
        </NavBar>
        <Card role='main'>
          <Row>
            <Column width={5}>
              <Select name="locationSelect" value={this.state.month} onChange={this.handleChangeSelect}>
                <Select.Option value="%">Alle måneder</Select.Option>
                <Select.Option value="-01-">Januar</Select.Option>
                <Select.Option value="-02-">Februar</Select.Option>
                <Select.Option value="-03-">Mars</Select.Option>
                <Select.Option value="-04-">April</Select.Option>
                <Select.Option value="-05-">Mai</Select.Option>
                <Select.Option value="-06-">Juni</Select.Option>
                <Select.Option value="-07-">Juli</Select.Option>
                <Select.Option value="-08-">August</Select.Option>
                <Select.Option value="-09-">September</Select.Option>
                <Select.Option value="-10-">Oktober</Select.Option>
                <Select.Option value="-11-">November</Select.Option>
                <Select.Option value="-12-">Desember</Select.Option>
              </Select>
              <br />
              <br />
              <Form.Input
                type="search"
                placeholder="Søk på kunde, selger, datoer og pris."
                onChange={this.onChangeHandle}
              >
                {this.state.searchWord}
              </Form.Input>

              <ClickTable>
                <ClickTable.Thead>
                  <ClickTable.Th>Ordredato</ClickTable.Th>
                  <ClickTable.Th>Ordre ID</ClickTable.Th>
                  <ClickTable.Th>Kunde ID</ClickTable.Th>
                </ClickTable.Thead>
                <ClickTable.Tbody>
                  {this.state.sales.map(sale => (
                    <ClickTable.Tr
                      style={sale.selectedSale ? { backgroundColor: '#c5e0e4' } : { backgroundColor: '' }}
                      key={sale.id}
                      onClick={() => {
                        this.chooseActive(sale);
                      }}
                    >
                      <ClickTable.Td>{sale.dateOrdered.toString().substring(4, 16)}</ClickTable.Td>
                      <ClickTable.Td>{sale.id}</ClickTable.Td>
                      <ClickTable.Td>{sale.customer_id}</ClickTable.Td>
                    </ClickTable.Tr>
                  ))}
                </ClickTable.Tbody>
              </ClickTable>
            </Column>
            <Column>
              <SelectedOrder activeOrder={this.state.activeOrder} />
            </Column>
          </Row>
          <br />
        </Card>
        <br />
      </div>
    );
  }

  mounted() {
    rentalService.getAllSales(results => {
      for (let i = 0; i < results.length; i++) {
        if(i == 0){
          results[i].selectedSale = true;
        }
        else{
          results[i].selectedSale = false;
        }
      }
      this.setState({ sales: results, activeOrder: results[0] });
    });
  }
}

class SelectedOrder extends Component {
  bikes = [];
  equipments = [];

  state = {
    order: this.props.activeOrder
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ state: (this.state.order = nextProps.activeOrder) });
    if(this.state.order){
      this.updateOrder();
    }
  }

  updateOrder() {
    orderService.getBikesFromOrder(this.state.order.id, bikes => {
      this.bikes = bikes;
    });

    orderService.getEquipmentFromOrder(this.state.order.id, equipments => {
      this.equipments = equipments;
    });
  }

  render() {
    console.log(this.props.activeOrder);
    if (!this.state.order) return null;

    return (
      <Card>
        <div className="container">
          <h5>Valgt ordre: {this.state.order.id}</h5>
          <br />
          <Row>
            <Column>
              <Row>
                <Column width={4}>
                  <b>Bestillingsdato:</b>
                </Column>
                <Column>{this.state.order.dateOrdered.toString().substring(4, 24)}</Column>
              </Row>
              <Row>
                <Column width={4}>
                  <b>Ordre id:</b>
                </Column>
                <Column>{this.state.order.id}</Column>
              </Row>
              <Row>
                <Column width={4}>
                  <b>Kunde id:</b>
                </Column>
                <Column>{this.state.order.customer_id}</Column>
              </Row>
              <Row>
                <Column width={4}>
                  <b>Kundenavn:</b>
                </Column>
                <Column>
                  {this.state.order.firstName} {this.state.order.lastName}
                </Column>
              </Row>
              <Row>
                <Column width={4}>
                  <b>Leietype:</b>
                </Column>
                <Column>{this.state.order.typeName}</Column>
              </Row>
              <Row>
                <Column width={4}>
                  <b>Fra dato:</b>
                </Column>
                <Column>{this.state.order.fromDateTime.toString().substring(4, 16)}</Column>
              </Row>
              <Row>
                <Column width={4}>
                  <b>Til dato:</b>
                </Column>
                <Column>{this.state.order.toDateTime.toString().substring(4, 16)}</Column>
              </Row>
              <Row>
                <Column width={4}>
                  <b>Pris:</b>
                </Column>
                <Column>{this.state.order.price}</Column>
              </Row>
              <br />
            </Column>
          </Row>
          <Row>
            <Column>
              <h6>Sykler:</h6>
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <b>ID</b>
                    </Table.Td>
                    <Table.Td>
                      <b>Sykkeltype</b>
                    </Table.Td>
                    <Table.Td>
                      <b>Merke</b>
                    </Table.Td>
                    <Table.Td>
                      <b>Modell</b>
                    </Table.Td>
                    <Table.Td>
                      <b>Pris</b>
                    </Table.Td>
                  </Table.Tr>
                  {this.bikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.brand}</Table.Td>
                      <Table.Td>{bike.model}</Table.Td>
                      <Table.Td>{bike.price} kr</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
          <br />
          <Row>
            <Column>
              <h6>Utstyr</h6>
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <b>UtstyrsID</b>
                    </Table.Td>
                    <Table.Td>
                      <b>Utstyrstype</b>
                    </Table.Td>
                    <Table.Td>
                      <b>Merke</b>
                    </Table.Td>
                    <Table.Td>
                      <b>Pris</b>
                    </Table.Td>
                  </Table.Tr>
                  {this.equipments.map(equipment => (
                    <Table.Tr key={equipment.id}>
                      <Table.Td>{equipment.id}</Table.Td>
                      <Table.Td>{equipment.typeName}</Table.Td>
                      <Table.Td>{equipment.brand}</Table.Td>
                      <Table.Td>{equipment.price}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
        </div>
      </Card>
    );
  }

  mounted() {
    orderService.getOrder('1', result => {
      this.setState({ order : result});
      console.log(result);
    });

    orderService.getBikesFromOrder('1', bikes => {
      this.bikes = bikes;
    });

    orderService.getEquipmentFromOrder('1', equipments => {
      this.equipments = equipments;
    });
  }
}

module.exports = { Orders };
