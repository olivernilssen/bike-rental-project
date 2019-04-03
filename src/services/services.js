import { connection } from './mysql_connection';
import { start } from 'repl';

class RentalService {
  getEmployee(employeeID, success) {
    connection.query(
      'select * from Workers w, Address a WHERE w.worker_id = ? and w.address_id = a.id',
      [employeeID],
      (error, results) => {
        if (error) return console.error(error);
        success(results[0]);
      }
    );
  }

  searchSales(searchWord, month, success) {
    connection.query(
      'select distinct ot.typeName, w.firstName, c.lastName, o.id, o.customer_id, o.type_id, o.dateOrdered, o.fromDateTime, o.toDateTime, o.price from OrderType ot, Customers c, Orders o, Workers w WHERE c.id = o.customer_id AND ot.id = o.type_Id AND w.worker_id = o.soldBy_id and (o.dateOrdered like ? or o.fromDateTime like ? or o.toDateTime like ?)' +
        'and (ot.typeName like ? or w.firstName like ? or w.lastName like ? or c.firstName like ? or c.lastName like ? or o.id like ? or o.dateOrdered like ? or o.fromDateTime like ? or o.toDateTime like ? or o.price like ?)',
      [
        month,
        month,
        month,
        searchWord,
        searchWord,
        searchWord,
        searchWord,
        searchWord,
        searchWord,
        searchWord,
        searchWord,
        searchWord,
        searchWord
      ],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  updateEmployee(employeeID, firstName, surName, email, tel, street, place, postalCode, streetNum, success) {
    connection.query(
      'update Workers w, Address a set w.firstName = ?, w.lastName = ?, w.email = ?, w.tlf = ?, a.streetAddress = ?, a.postalNum = ?, a.place = ?, a.streetNum = ? where w.worker_id = ? and w.address_id = a.id',
      [firstName, surName, email, tel, street, postalCode, place, streetNum, employeeID],
      error => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  getSales(employeeID, success) {
    connection.query(
      'select ot.typeName, c.firstName, c.lastName, o.id, o.customer_id, o.type_id, o.dateOrdered, o.fromDateTime, o.toDateTime, o.price, w.worker_id from OrderType ot, Customers c, Orders o, Workers w where c.id = o.customer_id and ot.id = o.type_id and  w.worker_id = o.soldBy_id and w.worker_id = ?',
      [employeeID],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getSale(id, success) {
    connection.query(
      'select ot.typeName, c.firstName, c.lastName, o.id, o.customer_id, o.type_id, o.dateOrdered, o.fromDateTime, o.toDateTime, o.price, w.worker_id from OrderType ot, Customers c, Orders o, Workers w where c.id = o.customer_id and ot.id = o.type_id and w.worker_id = o.soldBy_id and o.id = ?',
      [id],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      }
    );
  }

  getAllSales(success) {
    connection.query(
      'select ot.typeName, w.firstName, c.lastName, o.id, o.customer_id, o.type_id, o.dateOrdered, o.fromDateTime, o.toDateTime, o.price from OrderType ot, Customers c, Orders o, Workers w WHERE c.id = o.customer_id AND ot.id = o.type_Id AND w.worker_id = o.soldBy_id',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getLocations(success) {
    connection.query('select * from Locations', (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }
  // Denne funker ikke som den skal, hva er galt? får inn area_id fra
  getLocationsByArea(area_id, success) {
    connection.query(
      'select l.id, l.name, l.area_id from Locations l, Area a where l.area_id = a.id and l.area_id = ?',
      [area_id],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  addLocation(name, streetAddress, streetNum, postalNum, place, area_id) {
    connection.query(
      'insert into Locations (id, name, streetAddress, streetNum, postalNum, place, area_id) value ( null, ?, ?, ?, ?, ?, ?)',
      [name, streetAddress, streetNum, postalNum, place, area_id],
      error => {
        if (error) return console.error(error);
      }
    );
  }

  getArea(success) {
    connection.query('select id as area_id, areaName from Area', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getAreaID(area, success) {
    connection.query('select id from Area where areaName = ?', [area], (error, result) => {
      if (error) return console.error(error);

      success(result[0]);
    });
  }

  addArea(id, areaName) {
    connection.query('insert into Area (id, areaName) value (null, ?)', [id, areaName], error => {
      if (error) return console.error(error);
    });
  }

  // "b.id not in (select ob.bike_id from OrderedBike ob, " +
  // "Orders o where ob.order_id = o.id and o.fromDateTime " +
  // "between ? and ? and o.toDateTime between ? and ?) " +

  getBookingSearch(locName, typeName, startDate, endDate, success) {
    connection.query(
      'select b.id, bt.typeName, bt.brand, l.name, bt.wheelSize, bt.weight_kg, bt.price from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id and l.name like ? and bt.typeName like ? and b.bikeStatus = "OK" and b.id not in (select ob.bike_id from OrderedBike ob, Orders o where ob.order_id = o.id and ((o.fromDateTime between ? and ?) or (o.toDateTime between ? and ?) or (o.fromDateTime <= ? and o.toDateTime >= ?))' +
        ')order by b.id',
      [locName, typeName, startDate, endDate, startDate, endDate, startDate, endDate],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getMonthlyPrice(success) {
    connection.query(
      'select sum(price) as sumPrice, month(dateOrdered) as month from Orders group by month(dateOrdered)',
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getLoginInfo(username, success) {
    connection.query('select user_id, password from Account where username = ?', [username], (error, results) => {
      if (error) return console.error(error);
      success(results);
    });
  }

  getRentedBikes(success) {
    connection.query(
      'select b.id, b.bikeStatus, bt.typeName, bt.brand, bt.model, l.name from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id and (b.bikeStatus = "Utleid" or b.bikeStatus = "Stjålet")',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getOrderedBikes(today, success) {
    connection.query(
      'select b.id, b.bikeStatus, l.name, ob.order_id, c.firstName, c.lastName, bt.typeName, bt.brand, bt.model, o.fromDateTime from Bikes b, BikeType bt, Orders o, OrderedBike ob, Customers c, Locations l where b.type_id = bt.id and c.id = o.customer_id and ob.order_id = o.id and ob.bike_id = b.id and b.location_id = l.id and b.bikeStatus != "Utleid" and ob.order_id in (select id from Orders where fromDateTime >= ?)',
      [today],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
}

export let rentalService = new RentalService();
