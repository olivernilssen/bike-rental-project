import { connection } from './mysql_connection';
import { start } from 'repl';

class EmployeeService {
  getEmployees(success) {
    connection.query('select * from Workers, ', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getEmployee(worker_id, success) {
    connection.query(
      'select w.worker_id, w.lastName, w.firstName, w.tlf, w.email, a.postalNum, a.place, a.streetAddress, a.streetNum from Workers w, Address a where a.id = w.address_id and w.worker_id=?',
      [worker_id],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      }
    );
  }

  getEmployeeID(email, success) {
    connection.query('select worker_id from Workers where email = ?',
    [email],
    (error, result) => {
      if (error) return console.error(error);
      success(result[0]);
    })
  }

  getAccountPassword(user_id, success) {
    connection.query('select password from Account where user_id = ?', [user_id], (error, result) => {
      if (error) return console.error(error);
      success(result[0]);
    })
  }

  getCustomerOrders(customer_id, success) {
    connection.query('select o.id, o.customer_id, ot.typeName, o.dateOrdered, o.fromDateTime, o.toDateTime, o.price from Orders o, OrderType ot, Customers c where o.type_id = ot.id and c.id=o.customer_id and o.customer_id = ?', [customer_id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getEmployeeSales(worker_id, success) {
    connection.query(
      'select ot.typeName, c.firstName, c.lastName, o.id, o.customer_id, o.type_id, o.dateOrdered, o.fromDateTime, o.toDateTime, o.price, w.worker_id from OrderType ot, Customers c, Orders o, Workers w where c.id = o.customer_id and ot.id = o.type_id and  w.worker_id = o.soldBy_id and w.worker_id = ?',
      [worker_id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getEmployeeSearch(phrase, success) {
    connection.query(
      'select DISTINCT * from Workers where firstName like ? OR lastName like ? or worker_id like ?',
      [phrase, phrase, phrase],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getAddressID(postal, place, street, streetnum, success){
    connection.query('select id from Address where postalNum = ? and place = ? and streetAddress = ? and streetNum = ?',
    [postal, place, street, streetnum],
    (error, result) => {
        if (error) return console.error(error);
        success(result[0]);
      }
    );
  }

  addEmployee(first, last, email, tlf, addr_id){
    connection.query("insert into Workers (firstName, lastName, email, tlf, address_id) values (?, ?, ?, ?, ?)",
      [first, last, email, tlf, addr_id],
      (error) => {
        if(error) return console.error(error);
      }
    )
  }

  updateEmployee(firstName, lastName, email, tlf, addr_id, worker_id){
    connection.query('update Workers set firstName=?, lastName=?, email=?, tlf=?, address_id=? where worker_id=?',
    [firstName, lastName, email, tlf, addr_id, worker_id],
    (error) => {
      if (error) return console.error(error);
    });
  }

  addAddress(postalnr, place, street, streetnum) {
    connection.query("insert into Address (postalNum, place, streetAddress, streetNum) values ( ?, ?, ?, ?)",
    [postalnr, place, street, streetnum],
    (error) => {
      if(error) return console.error(error);
    });
  }

  updateAddress(streetAddress, streetNum, postalNum, place, id) {
    connection.query("update Address a, Workers w set (a.streetAddress=?, a.streetNum=?, a.postalNum=?, a.place=?) where a.id=w.address_id and a.id=?",
    [streetAddress, streetNum, postalNum, place, id],
    (error) => {
      if (error) return console.error(error);
    });
  }

  addUser(username, password, user_id ) {
    connection.query("insert into Account (username, password, user_id ) values (?, ?, ?)",
    [username, password, user_id],
    (error) => {
      if (error) return console.error(error);
    });
  }

  updateUser(username, password) {
    connection.query("update Account (username, password)")
  }
}

export let employeeService = new EmployeeService();
