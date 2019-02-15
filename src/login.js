import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService } from './services_OLD';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student


/* 
    LOG IN MENY FOR Å VELGE BRUKER, SOM VIL HA PÅVIRKNING PÅ 
    HVA BRUKEREN KAN SE PÅ SKJERMEN 
    
    SKAL EXPORTERES
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