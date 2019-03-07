import * as React from 'react';
import { Component } from 'react-simplified';
import { Card, Tab, List, Row, Column, NavBar, Button, Form, Table } from './widgets';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { rentalService } from './services';
import { connection } from './mysql_connection';
import { basket, employeeID } from './index.js';
import Chart from './charts.js';

import createHashHistory from 'history/createHashHistory';
import { start } from 'repl';
const history = createHashHistory(); // Use history.push(...) to programmatically change path

class userInfo extends Component {
  render() {
    return (
      <div>
        <div>
          <h6>Brukerinformasjon</h6>
        </div>
      </div>
    );
  }
}

module.exports = {
  userInfo
};
