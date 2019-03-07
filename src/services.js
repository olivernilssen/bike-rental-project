import { connection } from './mysql_connection';
import { start } from 'repl';

class RentalService {
  getBikeTypes(success) {
    connection.query('select * from BikeType', (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }

  getAnsatt(ansattId, success) {

    connection.query('select * from Workers w, Address a WHERE w.worker_id = ? and w.address_id = a.id', [ansattId], (error, results) => {

      if (error) return console.error(error);

      success(results[0]);
    });
  }


  updateAnsatt(ansattId, fornavn, etternavn, email, tlf, gate, poststed, postnummer, gatenr, success) {

    connection.query('update Workers w, Address a set w.firstName = ?, w.lastName = ?, w.email = ?, w.tlf = ?, a.streetAddress = ?, a.postalNum = ?, a.place = ?, a.streetNum = ? where w.worker_id = ? and w.address_id = a.id', [fornavn, etternavn, email, tlf, gate, postnummer, poststed, gatenr, ansattId], (error, results) => {

      if (error) return console.error(error);

      success();
    });
  }

  getDistinctBikeType(success) {
    connection.query("select distinct typeName from BikeType", (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }


  getBikes(success) {
    connection.query('select * from Bikes', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getAllBikesByType(success) {
    connection.query(
      'select b.id, bt.typeName, bt.brand, bt.model, bt.year, bt.suitedFor, bt.price, l.name from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id',
      (error, results) => {
        if (error) console.error(error);

        success(results);
      }
    );
  }

  newBikeType(
    typeName,
    brand,
    model,
    year,
    frameSize,
    wheelSize,
    gears,
    gearSystem,
    brakeSystem,
    weight_kg,
    suitedFor,
    price,
    success
  ) {
    connection.query(
      'insert into BikeType (typeName, brand, model, year, frameSize, wheelSize, gears, gearSystem, brakeSystem, weight_kg, suitedFor, price) values (?,?,?,?,?,?,?,?,?,?,?,?)',
      [typeName, brand, model, year, frameSize, wheelSize, gears, gearSystem, brakeSystem, weight_kg, suitedFor, price],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  getBikeStatus(success) {
    connection.query('select distinct bikeStatus from Bikes', (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }

  getBikesByStatus(bikeStatus, success) {
    connection.query(
      'select b.id, l.name, bt.typeName from Bikes b, Locations l, BikeType bt where b.location_id = l.id and b.type_id = bt.id and b.bikeStatus = ?',
      [bikeStatus],
      (error, results) => {
        if (error) console.error(error);

        success(results);
      }
    );
  }

  getAvailableBikes(success) {
    connection.query(
      'select * from Bikes where object_id in (select object_id from RentalObjects where objectStatus = "OK"))',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getBike(id, success) {
    connection.query('select * from Bikes where object_id = ?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  searchBikes(searchWord, success) {
    connection.query(
      'select distinct b.id, bt.typeName, bt.brand, bt.model, bt.year, bt.suitedFor, bt.price, l.name from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id and (b.id like ? or l.name like ? or bt.typeName like ? or bt.model like ?)',
      [searchWord, searchWord, searchWord, searchWord],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getBikesByLocation(location, success) {
    connection.query(
      'select * from Bikes where object_id in (select object_id from RentalObjects where currentLocation = ?))',
      [location],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getCustomers(success) {
    connection.query('select * from Customers', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getCustomer(id, success) {
    connection.query('select c.id, c.lastName, c.firstName, c.tlf, c.email, a.postalNum, a.place, a.streetAddress, a.streetNum from Customers c, Address a where a.id = c.address_id and c.id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  getLocations(success) {
    connection.query('select * from Locations', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getBikesOnLocation(id, success) {
    connection.query(
      'select b.id, bt.typeName, bt.brand, bt.year, bt.frameSize, bt.wheelSize, bt.gears, bt.gearSystem, bt.brakeSystem, bt.weight_kg, bt.suitedFor, bt.price from BikeType bt, Bikes b, Locations lok where b.location_id=lok.id and bt.id = b.type_id and lok.id=? order by b.id',
      [id],
      (error, results) => {
        if (error) return console.error(error);
        // console.log(results.length);
        success(results);
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
}

export let rentalService = new RentalService();
