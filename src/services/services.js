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
      'select ot.typeName, c.firstName, c.lastName, o.id, o.customer_id, o.type_id, o.dateOrdered, o.fromDateTime, o.toDateTime, o.price from OrderType ot, Customers c, Orders o, Workers w WHERE c.id = o.customer_id AND  w.worker_id = ? AND ot.id = o.type_Id AND  w.worker_id = o.soldBy_id',
      [employeeID],
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
    })
  }
    // Denne funker ikke som den skal, hva er galt? får inn area_id fra
  getLocationsByArea(area_id, success) {
    connection.query('select l.id, l.name, l.area_id from Locations l, Area a where l.area_id = a.id and l.area_id = ?', [area_id], (error, results) => {
      if (error) return console.error(error);
      success(results);
    });
  }

  addLocation(id, name, postalNum, place, streetAddress, streetNum, area_id, success) {
    connection.query(
      'insert into Locations (name, postalNum, place, streetAddress, streetNum, area_id) value (null, ?, ?,?,?,?)',
      [id, name, postalNum, place, streetAddress, streetNum, area_id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getArea(success) {
    connection.query('select id as area_id, areaName from Area', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  addArea(id, areaName, success) {
    connection.query('insert into Area (id, areaName) value (null, ?)', [id, areaName], (error, results) => {
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
