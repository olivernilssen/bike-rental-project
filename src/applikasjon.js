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

class Overview extends Component {
  render(){
    return(
      <h1>OVERSIKT</h1>
    );
  }
}

class Booking extends Component {
  render(){
    return(
      <h1>BOOKING</h1>
    );
  }
}

class Bicycles extends Component {
  render(){
    return(
      <h1>SYKLER</h1>
    );
  }
}

class Locations extends Component {
  render(){
    return(
      <h1>LOKASJONER</h1>
    );
  }
}

class Customers extends Component {
  render(){
    return(
      <h1>KUNDER</h1>
    );
  }
}

class Basket extends Component {
  render(){
    return(
      <h1>HANDLEKURV</h1>
    );
  }
}


ReactDOM.render(
  <HashRouter>
    <div>
       <Menu /> 
       <Route path="/overview/" component={Overview} />
       <Route path="/booking/" component={Booking} />
       <Route path="/bicycles/" component={Bicycles} />
       <Route path="/customers/" component={Customers} />
       <Route path="/basket/" component={Basket} />
       <Route path="/locations/" component={Locations} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);