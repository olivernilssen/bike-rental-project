import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService } from './services';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

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

class locations extends Component {
  render(){
    return(
      <h1>LOKASJONER</h1>
    );
  }
}

class customers extends Component {
  render(){
    return(
      <h1>KUNDER</h1>
    );
  }
}

class basket extends Component {
  render(){
    return(
      <h1>HANDLEKURV</h1>
    );
  }
}


