import { connection } from './mysql_connection';

class StudentService {
  getStudents(success) {
    connection.query('select * from Students', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getStudent(id, success) {
    connection.query('select * from Students where id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateStudent(id, name, email, success) {
    connection.query('update Students set name=?, email=? where id=?', [name, email, id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  addStudent(name, email, success){
    connection.query('insert into Students(name, email) values (?, ?)', [name, email], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  deleteStudent(id, success){
    connection.query('delete from Students where id=?', [id], (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      success();
    });
  }

  studentSubjects(id, success){ //id = this.props.match.params.sub_code
    connection.query('select Subjects.name from Subjects, sub_choice where sub_choice.sub_code = Subjects.sub_code AND sub_choice.id=? ORDER BY Subjects.name', [id], (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      success(results);
    });
  }

  studentDetails(id, success){
    connection.query('select name, email from Students where id=? ORDER BY name', [id], (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      success(results[0]);
    });
  }

  getSubjects (success) {
    connection.query('select sub_code, name from Subjects ORDER BY Subjects.name', (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      success(results);
    });
  }

  getSubject (id, success) {
    connection.query('select *, name from Subjects where sub_code=?',[id], (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      success(results[0]);
    });
  }

  addSubject (id, name, success) {
    connection.query('insert into Subjects(name, sub_code) values (?, ?)', [name, id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  updateSubject (id, subcode, name, success) {
    connection.query('update Subjects set sub_code=?, name=? where Subjects.sub_code=?', [subcode, name, id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }

  getSubDetails(id, success){
    connection.query('select name, sub_code from Subjects where sub_code=?', [id], (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      success(results[0]);
    });
  }

  studentsInSub(id, success){
    connection.query('select Students.name from Students, sub_choice where sub_choice.id = Students.id AND sub_choice.sub_code=? ORDER BY name', [id], (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      success(results);
    });
  }
}
export let studentService = new StudentService();
