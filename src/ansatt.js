import * as React from 'react';
import { Component } from 'react-simplified';
// import { studentService } from './services';

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

let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

if(day < 10)
{
  day = "0" + day;
}

if(month < 10){
  month = "0" + month;
}

class Booking extends Component {
 constructor(props)
 {
   super(props);
   this.todaysDate = year + "-" + month + "-" + day;
   this.state = {
     startDate: this.todaysDate,
     endDate: ""
   }
   this.handlechangeStart = this.handlechangeStart.bind(this);
   this.handlechangeEnd = this.handlechangeEnd.bind(this);
   this.handleSubmit = this.handleSubmit.bind(this);

  if(this.month < "10"){
    console.log("DAJWDNKANWJND");
   this.month = "0" + toString(this.month);
  }
  
  if(toString(this.day).length == 1){
    this.day = "0" + toString(this.day);
  }

 }

 setMonthorDay(value) {
   if(value < 10){
     
   }
 }


 handlechangeStart (event) {
  this.setState({startDate: event.target.value})
}

handlechangeEnd (event) {
  this.setState({endDate: event.target.value})
}

handleSubmit (event) {
  alert("noe skjedde her");
  event.preventDefault();
}

  render() {
    console.log(this.today + " \n\n " + this.todaysDate  + " \n\n " + this.state.startDate);
    return (
      <div className="bootstrap-iso">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <h3>Booking</h3>
              <form onSubmit={this.handleSubmit}>
                {/* Date entry */}
                <div className="form-group">
                  <input 
                    type='date' 
                    name='startDate' 
                    min={this.todaysDate}
                    value={this.state.startDate} 
                    onChange={this.handlechangeStart}>
                  </input>

                  <input 
                    type='date' 
                    name='endDate' 
                    min={this.state.startDate}
                    value={this.state.endDate} 
                    onChange={this.handlechangeEnd}>
                  </input>

                  <select name='locations'>
                    <option value=''>Any Location</option>
                    <option value='Voss'>Voss</option>
                    <option value='Finnsnes'>Finnsnes</option>
                    <option value='Røros'>Røros</option>
                  </select>

                  <select name='bikeType'>
                    <option value=''>Any Type of bike</option>
                    <option value='citybike'>City bike</option>
                    <option value='mountainbike'>Mountain Bike</option>
                    <option value='tandem'>Tandem</option>
                    <option value='dutchbike'>Dutch Bike</option>
                    <option value='childbike'>Childrens Bike</option>
                  </select>
                </div>
                {/* submit button */}
                <div className="form-group">
                  <input name="submit" type="submit" value='Submit' />
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
