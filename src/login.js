import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService } from './services';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student


/* 
  HER SKAL ALLE ELEMENTER SETTES SAMMEN TIL FOR Å LAGE SELVE APPLIKASJONEN 
  
  BRUKER IMPORT AV ELEMENTER SOM TRENGS FRA ANDRE .JS FILER
*/
let ansattKomponent = require('./ansatt');
let overview = new ansattKomponent.Overview;
let booking = new ansattKomponent.Booking;
let sykler = new ansattKomponent.Bicycles;
let kunder = new ansattKomponent.Customers;
let handlekurv = new ansattKomponent.Basket;
let lokasjoner = new ansattKomponent.Locations;

let loggedIn = false;

class LoginMenu extends Component {
  username = '';
  password = '';

  render() {
    return (
      <div className="container">
        <div className="d-flex justify-content-center h-100">
          <div className="card">
            <div className="card-header">
              <h3>Sign In</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="input-group form-group">
                  <input type="text" value={this.username} onChange={event => (this.username = event.target.value)} className="form-control" placeholder="Employee Name"></input>
                  
                </div>
                <div className="input-group form-group">
                  <input type="password" value={this.password} onChange={event => (this.password = event.target.value)} className="form-control" placeholder="Password"></input>
                </div>
                  
                <div className="form-group">
                  <input type="submit" value="Login" onClick={this.login} className="btn float-right login_btn"></input>
                </div>
              </form>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-center">
                <a href="#">Forgot your password?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  login () {

    if(this.username == 'Oliver' && this.password == "1234")
    { 
      loggedIn = true;
      console.log("hva skjer? " + loggedIn);
    }
    else if(this.username == null || this.password == null){
      alert("Please type something!");
    }
    else {
      alert("log in name or password was wrong");
    }
  }
}


class Menu extends Component {
  render() {
    return (
      <nav class="navbar navbar-inverse navbar-fixed-left">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Sykkel Utleie 9000</a>
          </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><NavLink to="/overview">Oversikt</NavLink></li>
            <li><NavLink to="/booking">Book</NavLink></li>
            <li><NavLink to="/bicycles">Sykler</NavLink></li>
            <li><NavLink to="/customers">Kunder</NavLink></li>
            <li><NavLink to="/locations">Lokasjoner</NavLink></li>
            <li><NavLink to="/basket">Handlekurv</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
    );
  }
}


if(loggedIn == true){
  ReactDOM.render(
    <HashRouter>
      <div>
        <Menu /> 
        <Route path="/overview/" component={overview} />
        <Route path="/booking/" component={booking} />
        <Route path="/bicycles/" component={sykler} />
        <Route path="/customers/" component={kunder} />
        <Route path="/basket/" component={handlekurv} />
        <Route path="/locations/" component={lokasjoner} />
      </div>
    </HashRouter>,
    document.getElementById('root')
  );
}
else 
{
  ReactDOM.render(
    <HashRouter>
        <div>
          <LoginMenu />
        </div>
    </HashRouter>,
    document.getElementById('root')
  );
}