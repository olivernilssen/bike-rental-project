import * as React from 'react';
import { Component } from 'react-simplified';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services/services';
import createHashHistory from 'history/createHashHistory';

const history = createHashHistory(); // Use history.push(...) to programmatically change path

class Chart extends Component {
  months = [];
  myData = [10, 20, 5];

  state = {
    chartData: {
      labels: ['Hvor mye charts.js suger', "noe", "noe"],
      datasets: [
        {
          label: 'Salg',
          data: this.myData,
          backgroundColor: [
            'rgba(130,99,132, 0.6)',
            'rgba(255,99,13, 0.6)',
            'rgba(200,99,12, 0.6)',
            'rgba(255,99,132, 0.6)',
            'rgba(255,0,132, 0.6)'
          ]
        }
      ]
    }
  };

  componentWillMount() {
		this.setState(initialState);
  }
  
	componentDidMount() {
		var _this = this;

		setInterval(function () {
			var oldDataSet = _this.state.datasets[0];
			var newData = [];

			for (var x = 0; x < _this.state.labels.length; x++) {
				newData.push(Math.floor(Math.random() * 100));
			}

			var newDataSet = _extends({}, oldDataSet);

			newDataSet.data = newData;
			newDataSet.backgroundColor = (0, _rcolor2.default)();
			newDataSet.borderColor = (0, _rcolor2.default)();
			newDataSet.hoverBackgroundColor = (0, _rcolor2.default)();
			newDataSet.hoverBorderColor = (0, _rcolor2.default)();

			var newState = _extends({}, initialState, {
				datasets: [newDataSet]
			});

			_this.setState(newState);
		}, 5000);}
  

  render() {
    if(!this.state.chartData.datasets.data) return null;
    console.log(this.state.chartData);
    console.log(this.state.chartData.datasets.data);

    return (
      <div className="chart">
        <Bar
          data={this.state.chartData}
          height={300}
          width={150}
          options={{
            maintainAspectRatio: false
          }}
        />
      </div>
    );
  }

  mounted() {
    console.log(this.state.chartData);
    rentalService.getMonthlyPrice(newdata => { 
      console.log("hey query");
      this.setState({state: (this.state.chartData.datasets.data = [newdata[0].sumPrice, 100, 100])});
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
