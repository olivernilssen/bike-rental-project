import { connection } from './mysql_connection';

class RentalService {
  getBikeTypes(success) {
    connection.query('select * from BikeType', (error, results) => {
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
    connection.query('select * from Customers where customer_id=?', [id], (error, results) => {
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

  // "b.id not in (select ob.bike_id from OrderedBike ob, " +
  // "Orders o where ob.order_id = o.id and o.fromDateTime " +
  // "between ? and ? and o.toDateTime between ? and ?) " +

  findRentedBikes(success) {
    connection.query('select * from OrderedBike', (error, results) => {
      if (error) return console.error(error);
      success(results);
    });
  }

  findAllBikes(success) {
    connection.query(
      'select b.id, bt.typeName, bt.brand, l.name, bt.wheelSize, bt.weight_kg, bt.price from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id order by b.id',
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getBookingSearch(locName, typeName, startDate, endDate, success) {
    connection.query(
      'select b.id, bt.typeName, bt.brand, l.name, bt.wheelSize, bt.weight_kg, bt.price from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id and l.name like ? and bt.typeName like ? and b.id not in (select ob.bike_id from OrderedBike ob, Orders o where ob.order_id = o.id and ((o.fromDateTime <= ? and o.toDateTime >= ?) or (o.fromDateTime >= ? and o.toDateTime >= ?))) order by b.id',
      [locName, typeName, endDate, startDate, endDate, startDate],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }
}

export let rentalService = new RentalService();
