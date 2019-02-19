import * as React from 'react';
import { Component } from 'react-simplified';
import { studentService } from './services';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

/* 
    ELEMENTER FOR ALLE BRUKERE INKLUDERT VANLIGE ANSATTE OG ADMIN
    
    SKAL EXPORTERES
*/


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

module.exports = {Overview, Booking, Bicycles, Locations, Customers, Basket}

