import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService } from './services_OLD';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student


/* 
  HER SKAL ALLE ELEMENTER SETTES SAMMEN TIL FOR Å LAGE SELVE APPLIKASJONEN 
  
  BRUKER IMPORT AV ELEMENTER SOM TRENGS FRA ANDRE .JS FILER
*/

class Menu extends Component {
  render() {
    return (
      <table className='navbar'>
        <thead>
            <tr>
            </tr>
        </thead>
      </table>
    );
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
       <Menu />
    </div>
  </HashRouter>,
  document.getElementById('root')
);