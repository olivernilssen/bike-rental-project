import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService } from './services_OLD';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

//DENNE FILEN ER FOR HJELP OM VI TRENGER OG SE PA EKSEMPEL KODE SLETTES TIL SLUTT
class Menu extends Component {
  render() {
    return (
      <table className='navbar'>
        <thead>
            <tr>
              <th><NavLink to="/home">BADR</NavLink></th>
              <th><NavLink to="/whiteb">Whiteboard</NavLink></th>
              <th><NavLink to="/students">Studenter</NavLink></th>
              <th><NavLink to="/subjects">Emner</NavLink></th>
            </tr>
        </thead>
      </table>
    );
  }
}

class whiteboard extends Component {
  render()
  {
    return ( 
      <div className="whiteb">
        <h1>WHITEBOARD</h1>
        <h2>Announcments</h2>
        <br></br>
        <p>Your assignment is due in 2h</p>
      </div>
    )
  }
}

class home extends Component {
  render()
  {
    return ( 
      <div className="home">
        <h1>HOME PAGE</h1>
        <h2>Bachelor i Informatikk, med spesialisering i drift av datasystemer</h2>
        <br></br>
        <p>Lykke til</p>
      </div>
    )
  }
}


class StudentList extends Component {
  students = [];

  render() {
    return (
      <ul className='students'>
        {this.students.map(student => (
          <li key={student.id}>
            <NavLink to={'/students/' + student.id}>{student.name}</NavLink>
          </li>
        ))}
        <br></br>
        <button type='button' onClick={this.add}>Legg til Studenter</button>
      </ul>
    );
  }

  add ()
  {
    history.push('/studentAdd/')
  }


  mounted() {
    studentService.getStudents(students => {
      this.students = students;
    });
  }
}

class StudentEdit extends Component {
  name = '';
  email = '';
  edited = '';

  render() {
    return (
      <form>
        <br></br>
        Name: <input type="text" value={this.name} onChange={event => (this.name = event.target.value)} />
        <br></br>
        Email: <input type="text" value={this.email} onChange={event => (this.email = event.target.value)} />
        <br></br><br></br>
       <button type="button" onClick={this.save}> Save </button>

      </form>
    );
  }

  mounted() {
    studentService.getStudent(this.props.match.params.id, student => {
      this.name = student.name;
      this.email = student.email;
    });
  }

  save() {
    studentService.updateStudent(this.props.match.params.id, this.name, this.email, () => {
      history.push('/students/');
    });
  }
}


class addStudent extends Component {
  name = '';
  email = '';

  render() {
    return (
      <form>
        <br></br>
        Name: <input type="text" value={this.name} onChange={event => (this.name = event.target.value)} />
        <br></br>
        Email: <input type="text" value={this.email} onChange={event => (this.email = event.target.value)} />
        
        <br></br><br></br>
       <button type="button" onClick={this.save}> Save </button>

      </form>
    );
  }

  save() {
    studentService.addStudent(this.name, this.email, () => {
      history.push('/students/');
    });
  }
}


class StudentDetails extends Component {
  name = '';
  email = '';
  subjectsTaking = [];

  render() {
    return (
        <ul className="studDetails">
          <li><b>Detaljer:</b></li>
          <li>Navn: {this.name}</li>
          <li>Email: {this.email}</li>
          <br></br>
          <li><b>Påmeldte fag:</b></li>
          <ul>
          {this.subjectsTaking.map(subject => (
            <li key={subject.sub_code}>
              {subject.name}
            </li>
            ))}
        </ul>
        <br></br>
        <button type='button' onClick={this.update}>Endre Detaljer</button>
        <button type='button' onClick={this.delete}>Slett Student</button>
        {/* <NavLink to={'/students/' + this.props.match.params.id + '/edit'}>Endre Detaljer</NavLink> */}
        </ul>
    );
  }

  update(){
    history.push("/studentedit/" + this.props.match.params.id + "/edit");
  }

  //kan bare slette studenter uten NOEN emner er lagt til denne studenten 
  delete(){
    studentService.deleteStudent(this.props.match.params.id, () => {
      history.push("/students/");
    });
  }

  mounted() {
    //Navn og email til student
    studentService.studentDetails(this.props.match.params.id, student => {
      this.name = student.name;
      this.email = student.email;
    });

    studentService.studentSubjects(this.props.match.params.id, subjects => {
      this.subjectsTaking = subjects;
    })
  }
}


class Subjects extends Component {
  subjects = [];

  render () {
    return (
      <ul className = "subjects">
        {this.subjects.map(subject => (
          <li key={subject.sub_code}>
            <NavLink activeStyle={{ color: 'green' }} to={'/subjects/' + subject.sub_code}>
              {subject.name}
            </NavLink>
          </li>
        ))}
        <button type='button' onClick={this.add}>Legg til Emner</button>
      </ul>

    )
  }

  add(){
    history.push("/subjectAdd/");
  }

  mounted() {
    studentService.getSubjects(subject => {
      this.subjects = subject;
    })
  }
}


class SubjectDetails extends Component {
  sub_code = '';
  name = '';
  studentsinClass = [];

  render() {
    return (
      <ul className="subDetails">
        <li><b>Detaljer:</b></li>
        <li>Emne Kode: {this.sub_code}</li>
        <li>Emne Navn: {this.name}</li>
        <br></br>
        <li><b>Elever i klassen:</b></li>
        <ul>
          {this.studentsinClass.map(student => (
            <li>
              {student.name}
            </li>
            ))}
        <br></br>
        <button type='button' onClick={this.update}>Endre Detaljer</button>
        </ul>
        </ul>
        );}
          

    update(){
      history.push("/subjectEdit/" + this.props.match.params.sub_code + "/edit");
    }

    delete(){
      // studentService.deleteSubject(this.props.match.params.sub_code, () => {
      //   history.push("/subjects/");
      // });
    }

  mounted() {
    studentService.getSubDetails(this.props.match.params.sub_code, subject => {
      this.sub_code = subject.sub_code;
      this.name = subject.name;
    })

    studentService.studentsInSub(this.props.match.params.sub_code, students =>{
      this.studentsinClass = students;
    })
  }
}

class addSubject extends Component {
  name = '';
  subCode = '';

  render() {
    return (
      <form>
        <br></br>
        Name: <input type="text" value={this.name} onChange={event => (this.name = event.target.value)} />
        <br></br>
        Subject Code: <input type="text" value={this.subCode} onChange={event => (this.subCode = event.target.value)} />
        
        <br></br><br></br>
       <button type="button" onClick={this.save}> Save </button>

      </form>
    );
  }

  save() {
    studentService.addSubject(this.name, this.subCode, () => {
      history.push('/subjects/');
    });
  } 
}

class subjectEdit extends Component {
  name = '';
  subCode = '';
  oldSubCode = '';

  render() {
    return (
      <form>
        <br></br>
        Name: <input type="text" value={this.name} onChange={event => (this.name = event.target.value)} />
        <br></br>
        Email: <input type="text" value={this.subCode} onChange={event => (this.subCode = event.target.value)} />
        <br></br><br></br>
       <button type="button" onClick={this.save}> Save </button>

      </form>
    );
  }

  mounted() {
    studentService.getSubject(this.props.match.params.sub_code, subject => {
      this.name = subject.name;
      this.subCode = subject.sub_code;
      this.oldSubCode = subject.sub_code;
    });
  }

  save() {
    studentService.updateSubject(this.oldSubCode, this.subCode, this.name, () => {
      history.push('/Subjects/');
    });
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
       <Menu />
       <Route path='/whiteb' component={whiteboard}/>
       <Route path='/home' component={home}/>
       {/* <Route exact path="/" component={WhiteBrd} /> */}
        <div id="mysubjects"><Route path="/subjects/" component={Subjects} /></div>
        <div id="mystudents"><Route path="/students/" component={StudentList}/></div>

        <div id="underDiv"><Route path="/students/:id" component={StudentDetails} /></div>
        <div id="underDiv"><Route path="/subjects/:sub_code" component={SubjectDetails} /></div>

        <Route path="/subjectAdd/" component={addSubject} />
        <Route path='/studentAdd/' component={addStudent}/>
        <Route path="/studentedit/:id/edit" component={StudentEdit} />
        <Route path='/subjectEdit/:sub_code/edit' component={subjectEdit} />  
        
    </div>
  </HashRouter>,
  document.getElementById('root')
);