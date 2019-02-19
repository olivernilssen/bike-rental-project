import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student


/* 
    LOG IN MENY FOR Å VELGE BRUKER, SOM VIL HA PÅVIRKNING PÅ 
    HVA BRUKEREN KAN SE PÅ SKJERMEN 
    
    SKAL EXPORTERES
*/

class LogIn extends Component {
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
      // HER LASTES HOVED SIDEN OM LOG IN DETALJER ER RIKITG
    }
    else if(this.username == null || this.password == null){
      alert("Please type something!");
    }
    else {
      alert("log in name or password was wrong");
    }
  }

}

ReactDOM.render(
  <HashRouter>
    <div>
       <LogIn />
    </div>
  </HashRouter>,
  document.getElementById('root')
);