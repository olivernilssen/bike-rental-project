import * as React from 'react';
import { Component } from 'react-simplified';
import { studentService } from './services';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

/*
    ELEMENTER FOR ALLE BRUKERE INKLUDERT VANLIGE ANSATTE OG ADMIN

    SKAL EXPORTERES
*/

class Overview extends Component {
  render() {
    return <h1>OVERSIKT</h1>;
  }
}

class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date()
    };

    // this.handleChange = this.handleChange.bind(this);
  }

  handleChangeStart(date) {
    this.setState({
      startDate: date
    });
  }

  handleChangeEnd(date) {
    this.setState({
      endDate: date
    });
  }

  render() {
    return (
      <div className="bootstrap-iso">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <h3>Booking</h3>
              <form method="post">
                {/* Date entry */}
                <div className="form-group">
                  <DatePicker
                    selected={this.state.startDate}
                    minDate={new Date()}
                    selectsStart
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeStart}
                  />

                  <DatePicker
                    selected={this.state.endDate}
                    selectsEnd
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.handleChangeEnd}
                  />
                </div>
                {/* submit button */}
                <div className="form-group">
                  <button className="btn btn-primary " name="submit" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Bicycles extends Component {
  render() {
    return <h1>SYKLER</h1>;
  }
}

class Locations extends Component {
  render() {
    return <h1>LOKASJONER</h1>;
  }
}

class Customers extends Component {
  render() {
    return <h1>KUNDER</h1>;
  }
}

class Basket extends Component {
  render() {
    return <h1>HANDLEKURV</h1>;
  }
}

module.exports = { Overview, Booking, Bicycles, Locations, Customers, Basket };
