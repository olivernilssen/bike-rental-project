import { connection } from './mysql_connection';

class BikeService {
  getBikeTypes(success) {
    connection.query('select * from BikeType order by typeName', (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }

  getTypeID(name, success) {
    connection.query('select id from BikeType where typeName = ?', [name], (error, idResult) => {
      if (error) return console.error(error);
      success(idResult);
    });
  }

  getBikeTypesWhere(id, success) {
    connection.query('select * from BikeType where id = ?', [id], (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }

  getDistinctBikeType(success) {
    connection.query('select distinct typeName, id from BikeType', (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }

  getBikesbyTypeID(id, success) {
    connection.query(
      'select b.id, l.name, b.bikeStatus from Bikes b, Locations l where b.location_id=l.id and type_id = ?',
      [id],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getBikes(success) {
    connection.query('select * from Bikes', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  updateBikes(id, status, locID, note) {
    connection.query(
      'update Bikes set location_id = ?, bikeStatus = ?, bikeNote = ? where id = ?',
      [locID, status, note, id],
      error => {
        if (error) return console.error(error);
      }
    );
  }

  addBike(locId, typeId, bikeStatus) {
    connection.query(
      'insert into Bikes (id, location_id, type_id, bikeStatus) value (null, ?, ?, ?)',
      [locId, typeId, bikeStatus],
      error => {
        if (error) return console.error(error);
        success();
      }
    );
  }
  getAllBikesByType(success) {
    connection.query(
      'select b.id, bt.typeName, bt.brand, bt.model, bt.year, bt.suitedFor, bt.price, l.name, b.bikeStatus from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id',
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
      error => {
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

  getBike(id, success) {
    connection.query(
      'select * from BikeType bt, Bikes b, Locations l where l.id = b.location_id and b.type_id = bt.id and b.id = ?',
      [id],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      }
    );
  }

  searchBikes(searchWord, success) {
    connection.query(
      'select distinct b.id, bt.typeName, bt.brand, bt.model, bt.year, bt.suitedFor, bt.price, l.name, b.bikeStatus from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id and (b.id like ? or l.name like ? or bt.typeName like ? or bt.model like ? or bt.brand like ?)',
      [searchWord, searchWord, searchWord, searchWord, searchWord],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
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

  updateBikeType(price, id) {
    connection.query('update BikeType set price = ? where id = ?', [price, id], error => {
      if (error) console.error(error);
    });
  }
}

export let bikeService = new BikeService();
