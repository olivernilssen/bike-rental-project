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
}

export let customerService = new CustomerService();
