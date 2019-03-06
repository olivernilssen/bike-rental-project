import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { connection } from './mysql_connection';
import { basket } from './index.js';

import createHashHistory from 'history/createHashHistory';
import { start } from 'repl';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Basket extends Component {
    removeBike = this.removeBike.bind(this);
    updateBasket = this.updateBasket.bind(this);
    handleChangePhrase = this.handleChangePhrase.bind(this);
    chooseCustomer = this.chooseCustomer.bind(this);
    findCustomers = this.findCustomers.bind(this);
    removeCustomer = this.removeCustomer.bind(this);
  
    state = {
      inBasket: basket,
      kunder: [],
      phrase: "",
      activeCustomer: "Ingen Kunde valgt",
      displayCustomer: 'block',
      CustomerActive: false
    }
    styleState = {
      display: 'block',
      clear: 'both'
    };
  
    //REMOVE BIKE FROM BASKET
    removeBike(bike) {
      for (let i of basket) {
        if (bike == i) {
          basket.splice(basket.indexOf(i), 1);
          this.updateBasket();
        }
      }
    }
  
    updateBasket() {
      this.state.inBasket = [];
      if (basket.length == 0) {
        this.setState({ styleState: (this.styleState.display = 'none') });
      } else {
        this.setState({ styleState: (this.styleState.display = 'block') });
      }
  
      if (basket.length == 0) {
        this.setState(state => {
          const inBasket = state.inBasket.concat({id: "TOMT HER"});
          return {
            inBasket
          };
        });
      }
      else {
        this.setState(state => {
          const inBasket = state.inBasket.concat(basket);
          return {
            inBasket, 
            basket,
          };
        });
      }
    }
  
    handleChangePhrase(event){
      this.setState({state: (this.state.phrase = event.target.value)}, this.findCustomers());
    }
  
    findCustomers() {
      let queryPhrase = "";
  
      if(this.state.phrase == " "){
        queryPhrase = "%";
      }
      else {
        queryPhrase = "%" + this.state.phrase + "%";
      }
      rentalService.getCustomerSearch(queryPhrase, results => {
        this.state.kunder = [];
  
        if(results.length == 0){
          this.setState(state => {
            console.log(queryPhrase);
            const kunder = state.kunder.concat({firstName: "Søk igjen"});
            return {
              kunder, 
            };
          });
        }
        else {
          this.setState(state => {
          console.log(queryPhrase);
          const kunder = state.kunder.concat(results);
          return {
            kunder, 
            results,
          };
        });
        }
        
      })
    }
  
    chooseCustomer(customer) {
      this.setState({state: (this.state.activeCustomer = customer)});
      this.setState({state: (this.state.displayCustomer = 'none') });
    }
  
    removeCustomer() {
      this.setState({state: (this.state.activeCustomer = "Velg ny kunde")});
      this.setState({state: (this.state.displayCustomer = 'block') });
      this.setState({state: (this.state.phrase = "")});
      this.findCustomers();
    }
  
    render() {
      if (basket.length == 0 && this.state.inBasket.length == 0) {
        {
          this.updateBasket();
        }
      }
  
      const styles = {
        btnStyle: {
          display: this.styleState.display
        },
        divStyle: {
          display: this.state.displayCustomer
        }
      };
  
      const { divStyle } = styles;
  
      const { btnStyle } = styles;
      
      return (
          <div>
            <Row>
              <Card title="Handlekurv">
                <Table>
                  <Table.Thead>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Merke</Table.Th>
                    <Table.Th>Lokasjon</Table.Th>
                    <Table.Th>Hjul</Table.Th>
                    <Table.Th>Vekt</Table.Th>
                    <Table.Th>Times Pris</Table.Th>
                  </Table.Thead>
                  <Table.Tbody>
                    {this.state.inBasket.map(bike => (
                      <Table.Tr key={bike.id}>
                          <Table.Td>{bike.id}</Table.Td>
                          <Table.Td>{bike.typeName}</Table.Td>
                          <Table.Td>{bike.brand}</Table.Td>
                          <Table.Td>{bike.name}</Table.Td>
                          <Table.Td>{bike.wheelSize}</Table.Td>
                          <Table.Td>{bike.weight_kg}</Table.Td>
                          <Table.Td>{bike.price}</Table.Td>
                          <Table.Td>
                            <Button.Success
                              style={btnStyle}
                              onClick={() => {this.removeBike(bike)}}> Delete 
                            </Button.Success>
                          </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Row>
  
            <Row>
              <Card title="Søk etter kunde">
                <Form.Label>Valgt Kunde: {this.state.activeCustomer.firstName} </Form.Label> <br></br>
                <Button.Success onClick={() => {this.removeCustomer()}}> Fjern Kunde </Button.Success> <br></br><br></br>
                <div style={divStyle}>
                    <Form.Input value={this.state.phrase} onChange={this.handleChangePhrase}></Form.Input>
                    <br></br>
                    <br></br>
                    <Table>
                      <Table.Thead>
                        <Table.Th>Fornavn</Table.Th>
                        <Table.Th>Etternavn</Table.Th>
                        <Table.Th>ID</Table.Th>
                        <Table.Th></Table.Th>
                      </Table.Thead>
                      <Table.Tbody>
                        {this.state.kunder.map(kunde => (
                          <Table.Tr key={kunde.id}>
                              <Table.Td>{kunde.firstName}</Table.Td>
                              <Table.Td>{kunde.lastName}</Table.Td>
                              <Table.Td>{kunde.id}</Table.Td>
                              <Table.Td>
                                <Button.Success
                                  onClick={() => {this.chooseCustomer(kunde);}}> Velg 
                                </Button.Success>
                              </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </div>
              </Card>
            </Row>
          </div>
      );
    }
  
    mounted () {
      rentalService.getCustomerSearch("%", results => {
        this.setState(state => {
          const kunder = state.kunder.concat(results);
          return {
            kunder, 
            results,
          };
        });
      })
    }
  }

  module.exports = {Basket};