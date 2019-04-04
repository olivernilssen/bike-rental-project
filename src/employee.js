import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, ButtonOutline, Form, Table, ClickTable, H1 } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { employeeService } from './services/employeeService';
import { basket, employeeID } from './index.js';
import { Modal } from 'react-bootstrap';
require('react-bootstrap/ModalHeader');
require('react-bootstrap/Modal');

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Employees extends Component {
  state = {
    employees: [],
    searchWord: '',
    activeEmployee: null
  };

  /**handle change
   * change the searchword whenever there
   * is an input in the search box, then call to searchEmployee()
   * to print out the new list.
   * @event - event/value of the clicked element
   */
  onChangeHandle(event) {
    this.setState({ state: (this.state.searchWord = event.target.value) }, this.searchEmployees());
  }

  /** Search Employee
   * Uses a query to search through the database
   * to return a new list of employees
   * that only show relevant employees towards search word
   */
  searchEmployee() {
    let word = '%' + this.state.searchWord + '%';

    userService.getEmployeeSearch(word, results => {
      this.setState(state => {
        this.state.employees = [];
        const employees = state.employees.concat(results);
        return { employees, results };
      });
    });
  }

  /**
   * Will change the activeEmployee state, and send it to
   * the child component, aswell as updated the value in
   * each employee in employeelist to reflect
   * which employee is currently clicked
   * @customer - clicked employee from table row
   */
  chooseActive(employee) {
    let index = this.state.employees
      .map(function(e) {
        return e.worker_id;
      })
      .indexOf(employee.worker_id);

    for (let i = 0; i < this.state.employees.length; i++) {
      this.state.employees[i].selectedEmp = false;
    }

    this.state.employees[index].selectedEmp = true;

    employeeService.getEmployee(employee.worker_id, result => {
      this.setState({ state: (this.state.activeEmployee = result) });
    });
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Liste over ansatte</h1>
        </NavBar>

        <Column right>
          <NavLink to="/addEmployee">
            <Button.Light>Legg til ny Ansatt</Button.Light>
          </NavLink>
        </Column>
        <Card>
          <Row>
            <Column width={5}>
              <Form.Input id="testSearch" type="search" onChange={this.onChangeHandle} placeholder="Søk etter ansatt" />
              <br />
              <ClickTable>
                <ClickTable.Thead>
                  <ClickTable.Th>AnsattID</ClickTable.Th>
                  <ClickTable.Th>Fornavn</ClickTable.Th>
                  <ClickTable.Th>Etternavn</ClickTable.Th>
                </ClickTable.Thead>
                <ClickTable.Tbody>
                  {this.state.employees.map(employee => (
                    <ClickTable.Tr
                      style={employee.selectedEmp ? { backgroundColor: '#c5e0e4' } : { backgroundColor: '' }}
                      key={employee.worker_id}
                      onClick={() => {
                        this.chooseActive(employee);
                      }}
                    >
                      <ClickTable.Td>{employee.worker_id}</ClickTable.Td>
                      <ClickTable.Td>{employee.firstName}</ClickTable.Td>
                      <ClickTable.Td>{employee.lastName}</ClickTable.Td>
                    </ClickTable.Tr>
                  ))}
                </ClickTable.Tbody>
              </ClickTable>
            </Column>
            <Column>
              <SelectedEmployee activeEmployee={this.state.activeEmployee} />
            </Column>
          </Row>
        </Card>
        <br />
      </div>
    );
  }

  mounted() {
    employeeService.getEmployeeSearch('%', results => {
      for (let i = 0; i < results.length; i++) {
        if (i == 0) {
          results[i].selectedEmp = true;
        } else {
          results[i].selectedEmp = false;
        }
      }
      this.state.employees = results;
    });

    employeeService.getEmployee('1', result => {
      this.setState({ activeEmployee: result });
    });
  }
}

class SelectedEmployee extends Component {
  state = {
    employee: this.props.activeEmployee
  };

  active = '';
  salesByEmployee = [];
  accountPasswords = [];

  /**
   * This method will be called whenever the child component
   * "SelectedEmployee" recieves new information/props from
   * its parent component "Employees". Whenever activeEmployee
   * is changed, the child component props will aslo change.
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      employee: nextProps.activeEmployee,
      change: false,
      allSales: false,
      showConfirm: false,
      showError: false
    });

    this.active = nextProps.activeEmployee;
  }

  /**handle close
   * closes the modal by setting showConfirm = false
   */
  handleClose() {
    this.setState({ showConfirm: false });
  }

  /**handle Show
   * Shows the modal by setting showConfirm = true
   */
  handleShow() {
    this.setState({ showConfirm: true });
  }

  render() {
    if (!this.state.employee) return null;

    if (this.state.change) {
      return (
        <div>
          <NavBar brand="CycleOn Rentals">
            <h1>Liste over Ansatte</h1>
          </NavBar>
          <Card>
            <h5>Endre Ansatt:</h5>
            <br />
            <form onSubmit={this.handleShow}>
              <Form.Label>Ansatt id:</Form.Label>
              <Form.Input type="text" value={this.state.employee.worker_id} disabled />
              <Form.Label>Fornavn:</Form.Label>
              <Form.Input
                required
                type="text"
                value={this.active.firstName}
                onChange={event => (this.active.firstName = event.target.value)}
              />
              <Form.Label>Etternavn:</Form.Label>
              <Form.Input
                required
                type="text"
                value={this.active.lastName}
                onChange={event => (this.active.lastName = event.target.value)}
              />
              <Form.Label>Epost:</Form.Label>
              <Form.Input
                required
                type="email"
                value={this.active.email}
                onChange={event => (this.active.email = event.target.value)}
              />
              <Form.Label>Telefon:</Form.Label>
              <Form.Input
                required
                type="number"
                value={this.active.tlf}
                onChange={event => (this.active.tlf = event.target.value)}
              />
              <Form.Label>Adresse:</Form.Label>
              <Form.Input
                required
                type="text"
                value={this.active.streetAddress}
                onChange={event => (this.active.streetAddress = event.target.value)}
              />
              <Form.Label>Gatenummer:</Form.Label>
              <Form.Input
                required
                type="text"
                value={this.active.streetNum}
                onChange={event => (this.active.streetNum = event.target.value)}
              />
              <Form.Label>Postnummer:</Form.Label>
              <Form.Input
                required
                type="number"
                value={this.active.postalNum}
                onChange={event => (this.active.postalNum = event.target.value)}
              />
              <Form.Label>Sted:</Form.Label>
              <Form.Input
                required
                type="text"
                value={this.active.place}
                onChange={event => (this.active.place = event.target.value)}
              />
              <Form.Label>Passord:</Form.Label>
              <Form.Input
                required
                type="password"
                value={this.active.password}
                onChange={event => (this.active.password = event.target.value)}
              />
              <br />
              <Row>
                <Column>
                  <ButtonOutline.Submit>Lagre</ButtonOutline.Submit>
                </Column>
                <Column right>
                  <ButtonOutline.Secondary onClick={this.cancel}>Cancel</ButtonOutline.Secondary>
                </Column>
              </Row>
            </form>
          </Card>

          <Modal show={this.state.showConfirm} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Er informasjonen riktig?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Er du sikker på at du vil gjøre disse endringene?</p>
              <br />
              <p>Trykk Utfør for å godta endringene</p>
            </Modal.Body>
            <Modal.Footer>
              <Row>
                <Column>
                  <ButtonOutline.Success onClick={this.save}>Utfør</ButtonOutline.Success>
                </Column>
                <Column right>
                  <ButtonOutline.Secondary onClick={this.handleClose}>Avbryt</ButtonOutline.Secondary>
                </Column>
              </Row>
            </Modal.Footer>
          </Modal>
        </div>
      );
    } else if (this.state.allSales) {
      return (
        <Card>
          <h5>Tidligere salg</h5>
          <br />
          <Row>
            <Column>
              <Table>
                <Table.Thead>
                  <Table.Th>Ordre-ID</Table.Th>
                  <Table.Th>Ordretype</Table.Th>
                  <Table.Th>Bestillingsdato</Table.Th>
                  <Table.Th>Start for utleie</Table.Th>
                  <Table.Th>Slutt for utleie</Table.Th>
                  <Table.Th>Pris</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.salesByEmployee.map(sales => (
                    <Table.Tr key={sales.id}>
                      <Table.Td>{sales.id}</Table.Td>
                      <Table.Td>{sales.typeName}</Table.Td>
                      <Table.Td>{sales.dateOrdered.toString().substring(4, 24)}</Table.Td>
                      <Table.Td>{sales.fromDateTime.toString().substring(4, 24)}</Table.Td>
                      <Table.Td>{sales.toDateTime.toString().substring(4, 24)}</Table.Td>
                      <Table.Td>{sales.price} kr</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Column>
          </Row>
          <br />
          <ButtonOutline.Secondary type="button" onClick={this.cancel}>
            Gå tilbake
          </ButtonOutline.Secondary>
        </Card>
      );
    } else {
      return (
        <Card>
          <h5>Valgt Ansatt:</h5>
          <br />
          <h6>
            {this.state.employee.firstName} {this.state.employee.lastName}
          </h6>
          <Table>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Ansatt id:</Table.Td>
                <Table.Td>{this.state.employee.worker_id}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Fornavn:</Table.Td>
                <Table.Td>{this.state.employee.firstName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Etternavn:</Table.Td>
                <Table.Td>{this.state.employee.lastName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Epost:</Table.Td>
                <Table.Td>{this.state.employee.email}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Telefon:</Table.Td>
                <Table.Td>{this.state.employee.tlf}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Adresse:</Table.Td>
                <Table.Td>
                  {this.state.employee.streetAddress} {this.state.employee.streetNum}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Poststed:</Table.Td>
                <Table.Td>
                  {this.state.employee.postalNum} {this.state.employee.place}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <br />
          <Row>
            <Column width={2}>
              <ButtonOutline.Success onClick={this.change}>Endre</ButtonOutline.Success>
            </Column>
            <Column>
              <ButtonOutline.Info onClick={this.allSales}>Se tidligere Salg</ButtonOutline.Info>
            </Column>
          </Row>
        </Card>
      );
    }
  }

  /**change
   * Show the editing window by setting change to true
   * and that prompts the render to rerender with
   * the correct return statement and will then change the
   * current window
   */
  change() {
    this.setState({ change: true });
  }

  /**allSales
   * Shows all sales by chosen employee by running it
   * by the database and showing the allSales window on top
   */
  allSales() {
    this.setState({ allSales: true });

    employeeService.getEmployeeSales(this.state.employee.worker_id, salesByEmployee => {
      this.salesByEmployee = salesByEmployee;
    });
  }

  /**Cancel
   * Sets change and allSales to false so that
   * the editing window is no longer available
   */
  cancel() {
    this.setState({ change: false, allSales: false });
  }

  mounted() {
    employeeService.getEmployee('1', result => {
      this.setState({ state: (this.state.employee = result) });
      this.active = result;
    });

    // employeeService.getAccountPassword(
    // });
  }

  /**Save
   * Save the edited parameters for the employee. But checks if
   * entered address is already in database, otherwise create a new
   * address entry. Then save the employee with new or old address id.
   */
  save() {
    //Check if address already in database
    employeeService.getAddressID(
      this.active.postalNum,
      this.active.place,
      this.active.streetAddress,
      this.active.streetNum,
      result => {
        if (result === undefined) {
          employeeService.addAddress(
            this.active.postalNum,
            this.active.place,
            this.active.streetAddress,
            this.active.streetNum
          );

          employeeService.getAddressID(
            this.active.postalNum,
            this.active.place,
            this.active.streetAddress,
            this.active.streetNum,
            newID => {
              employeeService.updateEmployee(
                this.active.firstName,
                this.active.lastName,
                this.active.email,
                this.active.tlf,
                newID.worker_id,
                this.state.employee.worker_id
              );
            }
          );
        } else {
          employeeService.updateEmployee(
            this.active.firstName,
            this.active.lastName,
            this.active.email,
            this.active.tlf,
            result.worker_id,
            this.state.employee.id
          );
        }
      }
    );

    this.setState({ change: false });
  }
}

class AddEmployee extends Component {
  firstName = '';
  lastName = '';
  email = '';
  tlf = 0;
  street = 0;
  streetNum = 0;
  postal = 0;
  place = '';
  addressID = null;
  username = '';
  password = '';
  EmployeeID = null;
  showConfirm = false;

  /**HandleClose
   * Handles the closing of the modal that pops up
   * will close it by returing the this.showConfirm = false
   */
  handleClose() {
    this.showConfirm = false;
  }

  /**HandleShow
   * Handles the opening the modal that pops up when prompted
   * will open by returing this.showConfirm = false
   */
  handleShow() {
    this.showConfirm = true;
  }

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Ansattliste</h1>
        </NavBar>
        <Card>
          <div className="container">
            <h5>Ny ansatt</h5>
            <br />
            <form onSubmit={this.handleShow}>
              <Row>
                <Column width={5}>
                  <Form.Label>Fornavn:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.firstName = event.target.value)} />
                </Column>
                <Column width={5}>
                  <Form.Label>Etternavn:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.lastName = event.target.value)} />
                </Column>
              </Row>
              <Row>
                <Column width={5}>
                  <Form.Label>Email:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.email = event.target.value)} />
                </Column>
                <Column width={5}>
                  <Form.Label>Telefon:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.tlf = event.target.value)} />
                </Column>
              </Row>
              <Row>
                <Column width={8}>
                  <Form.Label>Gateaddresse:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.street = event.target.value)} />
                </Column>
                <Column width={2}>
                  <Form.Label>Gatenummer:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.streetNum = event.target.value)} />
                </Column>
              </Row>
              <Row>
                <Column width={5}>
                  <Form.Label>Postnummer:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.postalNum = event.target.value)} />
                </Column>
                <Column width={5}>
                  <Form.Label>Poststed:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.postal = event.target.value)} />
                </Column>
              </Row>
              <Row>
                <Column width={5}>
                  <Form.Label>Brukernavn:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.username = event.target.value)} />
                </Column>
                <Column width={5}>
                  <Form.Label>Passord:</Form.Label>
                  <Form.Input type="text" required={true} onChange={event => (this.password = event.target.value)} />
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
            <p>Trykk Utfør for å legge til ansatt.</p>
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

  /**Cancel
   * Returns to the previous page
   * Stop the user from adding a new employee
   */
  cancel() {
    this.props.history.goBack();
  }

  /**HandleClose
   * Adds a new employee by running it through the
   * database and services files. Adds it using
   * user input and pushes back to employees main site.
   */
  add() {
    //Check if address already in database
    employeeService.getAddressID(this.postalNum, this.postal, this.street, this.streetNum, result => {
      if (result === undefined) {
        employeeService.addAddress(this.postalNum, this.postal, this.street, this.streetNum);

        employeeService.getAddressID(this.postalNum, this.postal, this.street, this.streetNum, adrID => {
          employeeService.addEmployee(this.firstName, this.lastName, this.email, this.tlf, adrID.id);
        });

        employeeService.getEmployeeID(this.email, empID => {
          employeeService.addUser(this.username, this.password, empID.worker_id);
        });
      } else {
        employeeService.addEmployee(this.firstName, this.lastName, this.email, this.tlf, result.id);

        employeeService.getEmployeeID(this.email, empID => {
          employeeService.addUser(this.username, this.password, empID.worker_id);
        });
      }
    });
    this.handleClose();
    history.push('/employees/');
  }
}

module.exports = { Employees, AddEmployee };
