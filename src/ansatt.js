import * as React from 'react';
import { Component } from 'react-simplified';
// import { studentService } from './services';

import createHashHistory from 'history/createHashHistory';
import { start } from 'repl';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

if(day < 10) day = "0" + day;

if(month < 10) month = "0" + month;


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
 constructor(props)
 {
   super(props);
   this.todaysDate = year + "-" + month + "-" + day;
   this.dayRent = false;
   this.state = {
     startDate: this.todaysDate,
     endDate: "",
     hoursRenting: 0,
     typeSelect: "*",
     locationSelect: "*"
   }

   this.allBikes =
    [
       {type: "Tandem", id: "111", brand: "Bike1", brand: "Merida", location: "Voss", framesize: "15'", hrPrice: "100", year: "2019", weight: "15kg"},
       {type: "Dutch Bike", id: "222", brand: "Bike2", brand: "KLM", location: "Finnsnes", framesize: "19'", hrPrice: "50", year: "2011", weight: "15kg"},
       {type: "City Bike", id: "333", brand: "Bike3", brand: "Jonnsen", location: "Røros", framesize: "12'", hrPrice: "120", year: "2017", weight: "12kg"},
    ]

   this.availableBikes = this.allBikes;
   this.handleSubmit = this.handleSubmit.bind(this);
   this.handleCheckChange = this.handleCheckChange.bind(this);
   this.handleChange = this.handleChange.bind(this);
   
 }

handleCheckChange () {
  if(this.dayRent == false) {
    this.dayRent = true;
    
  }
  else 
  {
    this.dayRent = false;
  }
}

handleChange(e) {
  this.setState({ [e.target.name] : e.target.value });
  this.findAvailBikes();
}

handleSubmit () {
  this.findAvailBikes();
}

  render() {
    return (
      <div className="bootstrap-iso">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <h3>Booking</h3>
              <div>
                
                {/* Date entry */}
                <div className="form-group">
                  <input type="checkbox" name="dayRent" checked={this.dayRent} onChange={this.handleCheckChange} value="Times leie?"></input>
                  <label> Times leie?</label>
                  <input type="number" name="hoursRenting" disabled={!this.dayRent} onChange={this.handleChange} value={this.hoursRenting}></input>
                  <br></br>
                  <input 
                    type='date' 
                    name='startDate' 
                    disabled={this.dayRent}
                    min={this.state.todaysDate}
                    value={this.state.startDate} 
                    onChange={this.handleChange}>
                  </input>

                  <input 
                    type='date' 
                    name='endDate' 
                    disabled={this.dayRent}
                    min={this.state.startDate}
                    value={this.state.endDate} 
                    onChange={this.handleChange}>
                  </input>

                  <br></br>
                  <br></br>

                  <select name='locationSelect' value={this.state.locationSelect} onChange={this.handleChange}>
                    <option value='*'>Any Location</option>
                    <option value='Voss'>Voss</option>
                    <option value='Finnsnes'>Finnsnes</option>
                    <option value='Røros'>Røros</option>
                  </select>

                  <select name='typeSelect' value={this.state.typeSelect} onChange={this.handleChange}>
                    <option value='*'>Any Type of bike</option>
                    <option value='City Bike'>City bike</option>
                    <option value='mountainbike'>Mountain Bike</option>
                    <option value='Tandem'>Tandem</option>
                    <option value='Dutch Bike'>Dutch Bike</option>
                    <option value='childbike'>Childrens Bike</option>
                  </select>
                </div>

                {/* submit button */}
                <div className="form-group">
                  <button name="submit" type="button" onClick={this.handleSubmit}>Søk</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-xs-12">
              <h3>Ledige Sykler</h3>
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Merke</th>
                  <th>Lokasjon</th>
                  <th>Hjul</th>
                  <th>Vekt</th>
                  <th>Times Pris</th>
                </tr>
                </thead>
                <tbody>
                {this.availableBikes.map(bike => (
                <tr  key={bike.id}>
                  <td>{bike.id}</td>
                  <td>{bike.type}</td>
                  <td>{bike.brand}</td>
                  <td>{bike.location}</td>
                  <td>{bike.framesize}</td>
                  <td>{bike.weight}</td>
                  <td>{bike.hrPrice}</td>
                  <td><button type="button" onClick={this.detailBike(bike)}>Velg</button></td>
                </tr> 
               ))}
               </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  detailBike(bike) {
    //Do something here
    // this.props.history.push("/bikedetails/" + bike.id);
  }

  //SQL SPØRRING HER
  findAvailBikes() {
    this.availableBikes = [];

    for(let i = 0; i < this.allBikes.length; i++) {
      if(this.state.locationSelect == "*" && this.state.typeSelect != "*"){
        if(this.allBikes[i].type == this.state.typeSelect)
        {
          this.availableBikes.push(this.allBikes[i]);
        } 
      }
      else if(this.state.locationSelect  != "*" && this.state.typeSelect == "*"){
        if(this.allBikes[i].location == this.state.locationSelect )
        {
          this.availableBikes.push(this.allBikes[i]);
        }
      }
      else if(this.state.locationSelect  != "*" && this.state.typeSelect != "*"){
        if(this.allBikes[i].type == this.state.typeSelect && this.allBikes[i].location == this.state.locationSelect )
        {
          this.availableBikes.push(this.allBikes[i]);
        }
      }
      else{
        this.availableBikes.push(this.allBikes[i]);
      }
    }

    if(this.availableBikes.length == 0){
      this.availableBikes.push({"name": "Ingenting tilgjengelig i denne kategorien", "id": "Gjør et nytt søk"});
    }
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
