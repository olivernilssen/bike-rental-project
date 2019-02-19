import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService } from './services';
import {Overview, Booking, Bicycles, Customers, Locations, Basket} from './ansatt.js';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student


/* 
  HER SKAL ALLE ELEMENTER SETTES SAMMEN TIL FOR Å LAGE SELVE APPLIKASJONEN 
  
  BRUKER IMPORT AV ELEMENTER SOM TRENGS FRA ANDRE .JS FILER
*/
// let overview = new Overview;
// let booking = new Booking;
// let sykler = new Bicycles;
// let kunder = new Customers;
// let handlekurv = new Basket;
// let lokasjoner = new Locations;

class LoginMenu extends Component {
  render (){
    return(<div></div>);
  }
}


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false};
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    if(isLoggedIn == false){
      return(
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

    else {
     return (
      <nav className="navbar navbar-inverse navbar-fixed-left">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Sykkel Utleie 9000</a>
          </div>

        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            <li><NavLink to="/overview">Oversikt</NavLink></li>
            <li><NavLink to="/booking">Book</NavLink></li>
            <li><NavLink to="/bicycles">Sykler</NavLink></li>
            <li><NavLink to="/customers">Kunder</NavLink></li>
            <li><NavLink to="/locations">Lokasjoner</NavLink></li>
            <li><NavLink to="/basket">Handlekurv</NavLink></li>
          </ul>
          <button onClick={this.logout}>Log out</button>
        </div>
      </div>
    </nav>
     );}
  }

  login () {

    if(this.username == 'Oliver' && this.password == "1234")
    { 
      this.setState({isLoggedIn: true});
    }
    else if(this.username == null || this.password == null){
      alert("Please type something!");
    }
    else {
      alert("log in name or password was wrong");
    }
  }

  logout () {
    history.push('/login/');
    this.setState({isLoggedIn: false})
  }
}



ReactDOM.render(
  <HashRouter>
    <div>
      <Menu islogged={false}/>

      <Route path='/login/' isLoggedIn={true} component={LoginMenu} />
      <Route path="/overview/" isLoggedIn={true} component={Overview} />
      <Route path="/booking/" isLoggedIn={true} component={Booking} />
      <Route path="/bicycles/" isLoggedIn={true} component={Bicycles} />
      <Route path="/customers/" isLoggedIn={true} component={Customers} />
      <Route path="/basket/" isLoggedIn={true} component={Basket} />
      <Route path="/locations/" isLoggedIn={true} component={Locations} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);