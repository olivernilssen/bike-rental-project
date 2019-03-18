import { connection } from './mysql_connection';
import { start } from 'repl';

class RentalService {
  getAnsatt(ansattId, success) {
    connection.query(
      'select * from Workers w, Address a WHERE w.worker_id = ? and w.address_id = a.id',
      [ansattId],
      (error, results) => {
        if (error) return console.error(error);
        success(results[0]);
      }
    );
  }

  updateAnsatt(ansattId, fornavn, etternavn, email, tlf, gate, poststed, postnummer, gatenr, success) {
    connection.query(
      'update Workers w, Address a set w.firstName = ?, w.lastName = ?, w.email = ?, w.tlf = ?, a.streetAddress = ?, a.postalNum = ?, a.place = ?, a.streetNum = ? where w.worker_id = ? and w.address_id = a.id',
      [fornavn, etternavn, email, tlf, gate, postnummer, poststed, gatenr, ansattId],
      error => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  getSales(ansattId, success) {
    connection.query(
      'select ot.typeName, c.firstName, c.lastName, o.id, o.customer_id, o.type_id, o.dateOrdered, o.fromDateTime, o.toDateTime, o.price from OrderType ot, Customers c, Orders o, Workers w WHERE c.id = o.customer_id AND  w.worker_id = ? AND ot.id = o.type_Id AND  w.worker_id = o.soldBy_id',
      [ansattId],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getLocations(success) {
    connection.query('select * from Locations', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  // "b.id not in (select ob.bike_id from OrderedBike ob, " +
  // "Orders o where ob.order_id = o.id and o.fromDateTime " +
  // "between ? and ? and o.toDateTime between ? and ?) " +

  getBookingSearch(locName, typeName, startDate, endDate, success) {
    connection.query(
      'select b.id, bt.typeName, bt.brand, l.name, bt.wheelSize, bt.weight_kg, bt.price from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id and l.name like ? and bt.typeName like ? and b.id not in (select ob.bike_id from OrderedBike ob, Orders o where ob.order_id = o.id and ((o.fromDateTime between ? and ?) or (o.toDateTime between ? and ?) or (o.fromDateTime <= ? and o.toDateTime >= ?))) order by b.id',
      [locName, typeName, startDate, endDate, startDate, endDate, startDate, endDate],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getMonthlyPrice(success) {
    connection.query('select sum(price) as sumPrice, month(dateOrdered) as month from Orders group by month(dateOrdered)', (error, results) => {
      if (error) return console.error(error);
      success(results);
    });
  }

  getLoginInfo(username, success) {
    connection.query('select user_id, password from Account where username = ?', [username], (error, results) => {
      if (error) return console.error(error);
      success(results);
    });
  }
}

export let rentalService = new RentalService();
