import { connection } from './mysql_connection';
import { start } from 'repl';

class CustomerService {
  getCustomers(success) {
    connection.query('select * from Customers', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getCustomer(id, success) {
    connection.query(
      'select c.id, c.lastName, c.firstName, c.tlf, c.email, a.postalNum, a.place, a.streetAddress, a.streetNum from Customers c, Address a where a.id = c.address_id and c.id=?',
      [id],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      }
    );
  }

  getCustomerSearch(phrase, success) {
    connection.query(
      'select DISTINCT * from Customers where firstName like ? OR lastName like ? or id like ?',
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

  addCustomer(first, last, email, tlf, addr_id){
    connection.query("insert into Customers (firstName, lastName, email, tlf, address_id) values (?, ?, ?, ?, ?)",
      [first, last, email, tlf, addr_id],
      (error) => {
        if(error) return console.error(error);
      }
    )
  }

  updateCustomer(firstName, lastName, email, tlf, address_id, success){
    connection.query('update Customers set firstName=?, lastName=?, email=?, tlf=? where address_id=?', [firstName, lastName, email, tlf, address_id], (error, results) => {
      if (error) return console.error(error);

      success(console.log('oppdatert kunde'));
    });
  }

  addAddress(postalnr, place, street, streetnum) {
    connection.query("insert into Address (postalNum, place, streetAddress, streetNum) values ( ?, ?, ?, ?)",
    [postalnr, place, street, streetnum],
    (error) => {
      if(error) return console.error(error);
    });
  }

  updateAddress(streetAddress, streetNum, postalNum, place, id, success) {
    connection.query("update Address a, Customers c set a.streetAddress=?, a.streetNum=?, a.postalNum=?, a.place=? where a.id=c.address_id and a.id=?", [streetAddress, streetNum, postalNum, place, id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }
}

export let customerService = new CustomerService();
