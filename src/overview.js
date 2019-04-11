import * as React from 'react';
import { Component } from 'react-simplified';
import { Bar } from 'react-chartjs-2';
import {
  Card,
  Row,
  Column,
  NavBar,
  ButtonOutline,
  Table
} from './widgets';
import { NavLink } from 'react-router-dom';
import { rentalService } from './services/services';
import { employeeID } from './index.js'

import createHashHistory from 'history/createHashHistory';

let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();
let day2 = day + 2;

if (day < 10) day = '0' + day;
if (day2 < 10) day2 = '0' + day2;
if (month < 10) month = '0' + month;


/**
 * Chart is from react-chart-2.js
 * and is a library that we used to create a nice 
 * little chart on our overview page
 * It gets information based on how much money they have earned each month
 * and displays it accordingly in a graph.
 */
class Chart extends Component {
  months = [
    'Januar',
    'Februar',
    'Mars',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Desember'
  ];
  newData = [0, 0, 0, 0];
  newLabel = [0, 0, 0, 0];

  render() {
    const chartData = {
      labels: this.newLabel,
      datasets: [
        {
          data: this.newData,
          backgroundColor: [
            'rgba(255,99,132, 0.6)',
            'rgba(255,99,13, 0.6)',
            'rgba(200,99,12, 0.6)',
            'rgba(255,0,132, 0.6)'
          ]
        }
      ]
    };

    if (!this.newData || !this.newLabel) return null;

    return (
      <div>
        <ButtonOutline.Secondary onClick={this.updateChart}>Oppdater</ButtonOutline.Secondary>
        <div className="chart">
          <Bar
            data={chartData}
            height={30}
            width={140}
            options={
              ({
                maintainAspectRatio: false
              },
              {
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        stepSize: Math.max.apply(this.newData) / 5
                      }
                    }
                  ]
                },
                animation: {
                  duration: 2000,
                  animateScale: true
                }
              })
            }
          />
        </div>
      </div>
    );
  }

  //Used to update the charts, supposed to have buttons for each year
  //but there was no time to implement that in the end unfortunatly 
  updateChart() {
    let tempData = [];
    let tempLabel = [];

    this.newData = [];

    rentalService.getMonthlyPrice(newdata => {
      this.newLabel.length = newdata.length;

      for (let i = 0; i < newdata.length; i++) {
        tempData.push(newdata[i].sumPrice);
        tempLabel.push(this.months[newdata[i].month - 1]);
      }

      this.newData = tempData;
      this.newLabel = tempLabel;
    });
  }

  /**
   * Gets all the monhtly sale income + sets tempdata til 0 first to start animation. 
   */
  mounted() {
    let tempData = [];
    let tempLabel = [];

    rentalService.getMonthlyPrice(newdata => {
      for (let i = 0; i < newdata.length; i++) {
        tempData.push(newdata[i].sumPrice);
        tempLabel.push(this.months[newdata[i].month - 1]);
      }

      this.newData = tempData;
      this.newLabel = tempLabel;
    });
  }
}


class RentedBikes extends Component {
  todaysDate = year + '-' + month + '-' + day + '%';

  rentedBikes = [];
  orderedBikes = [];

  render() {
    return (
      <div>
        <Row>
          <Column>
            <Card title="Utleide sykler:">
              <br />
              <Table>
                <Table.Thead>
                  <Table.Th>SykkelID</Table.Th>
                  <Table.Th>Sykkeltype</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.rentedBikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.name}</Table.Td>
                      <Table.Td>{bike.bikeStatus}</Table.Td>
                      <Table.Td>
                        <NavLink to={'/selectedBike/' + bike.id}>
                          <ButtonOutline.Info style={{ float: 'right' }}>Innlevering</ButtonOutline.Info>
                        </NavLink>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
            <br />
          </Column>

          <Column>
            <Card title="Bestilte sykler:">
              <br />
              <Table>
                <Table.Thead>
                  <Table.Th>OrderID</Table.Th>
                  <Table.Th>Kunde</Table.Th>
                  <Table.Th>SykkelID</Table.Th>
                  <Table.Th>Sykkeltype</Table.Th>
                  <Table.Th>Lokasjon</Table.Th>
                  <Table.Th>Fradato</Table.Th>
                  <Table.Th />
                </Table.Thead>
                <Table.Tbody>
                  {this.orderedBikes.map(bike => (
                    <Table.Tr key={bike.id}>
                      <Table.Td>{bike.order_id}</Table.Td>
                      <Table.Td>
                        {bike.firstName} {bike.lastName}
                      </Table.Td>
                      <Table.Td>{bike.id}</Table.Td>
                      <Table.Td>{bike.typeName}</Table.Td>
                      <Table.Td>{bike.name}</Table.Td>
                      <Table.Td>{bike.fromDateTime.toString().substring(4, 16)}</Table.Td>
                      <Table.Td>
                        <NavLink to={'/selectedBike/' + bike.id}>
                          <ButtonOutline.Info style={{ float: 'right' }}>Utlevering</ButtonOutline.Info>
                        </NavLink>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          </Column>
        </Row>
        <br />
      </div>
    );
  }

  mounted() {
    rentalService.getRentedBikes(rented => {
      this.rentedBikes = rented;
    });

    rentalService.getOrderedBikes(this.todaysDate, ordered => {
      this.orderedBikes = ordered;
    });
  }
}

class Overview extends Component {
  state = {user: ''};

  render() {
    return (
      <div>
        <NavBar brand="CycleOn Rentals">
          <h1>Oversikt</h1>
        </NavBar>
        <div role="main">
        
          <Card style={{ minWidth: '400px' }}>
            <h3>Du er på logget som: {this.state.user.firstName} {this.state.user.lastName}</h3>
            <Chart />
          </Card>
          <br />
          <RentedBikes />
        </div>
      </div>
    );
  }

  mounted(){
    if(employeeID != 0 || employeeID != null || employeeID != ""){
      rentalService.getEmployee(employeeID, result => {
        this.setState({user: result})
      });
    }
  }
}

module.exports = { Overview };
