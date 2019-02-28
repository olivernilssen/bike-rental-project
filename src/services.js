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
      'select *, type_id from BikeType, Bikes b, Locations lok where b.location_id=lok.id and lok.id=? order by type_id',
      [id],
      (error, results) => {
        if (error) return console.error(error);
        // console.log(results.length);
        success(results);
      }
    );
  }
}

export let rentalService = new RentalService();
