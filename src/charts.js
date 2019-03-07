import * as React from 'react';
import { Component } from 'react-simplified';
import { Bar, Line, Pie } from 'react-chartjs-2';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        labels: ['Mai', 'Juni', 'Juli', 'August', 'September'],
        datasets: [
          {
            label: 'Salg',
            data: [200, 500, 300, 800, 30],
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
  }

  render() {
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
}

export default Chart;
