import * as React from 'react';
import { Component } from 'react-simplified';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';

class Chart extends Component {
  months = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
  newData = null;
  newLabel = null;

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
    }

    

    if(!this.newData || !this.newLabel) return null;

    return (
      <div>
        <button onClick={this.updateChart}>Knapp</button>
        <div className="chart">
          <Bar
            data={chartData}
            height={350}
            width={150}
            options={{
              maintainAspectRatio: false
            }}
          />
        </div>
      </div>
    );
  }

  //Brukes til å oppdatere charts når den tid kommer alt etter år :)
  updateChart() {
    let tempData = [];
    let tempLabel = [];

    this.newData = [];
    this.newLabel = [];

    rentalService.getMonthlyPrice(newdata => { 
      for(let i = 0; i < newdata.length; i++){
        tempData.push(newdata[i].sumPrice)
        tempLabel.push(this.months[newdata[i].month - 1])
      }

      this.newData = tempData;
      this.newLabel = tempLabel;
    });
  }

  mounted() {
    let tempData = [];
    let tempLabel = [];
    
    this.newData = [];
    this.newLabel = [];

    rentalService.getMonthlyPrice(newdata => { 
      for(let i = 0; i < newdata.length; i++){
        tempData.push(newdata[i].sumPrice)
        tempLabel.push(this.months[newdata[i].month - 1 ])
      }

      this.newData = tempData;
      this.newLabel = tempLabel;
    });
  }
}

class Overview extends Component {
  render() {
    return (
      <div>
        <Card title="Oversikt">
          <Chart />
        </Card>
      </div>
    );
  }
}

module.exports = { Overview };
