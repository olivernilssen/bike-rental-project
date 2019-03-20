import { connection } from './mysql_connection';
import { start } from 'repl';

class EquipmentService {
  getEquipmentTypes(success) {
    connection.query('select * from EquipmentType', (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }

  getDistinctEquipType(success) {
    connection.query('select distinct typeName, id from EquipmentType', (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }

  getTypeID(name, success) {
    connection.query('select id from EquipmentType where typeName = ?', [name], (error, idResult) => {
      if (error) return console.error(error);
      success(idResult);
    });
  }

  getEquipmentByTypeID(id, success) {
    connection.query(
      'select id, location_id, objectStatus from Equipment where type_id = ?',
      [id],
      (error, results) => {
        if (error) return console.error(error);
        success(results);
      }
    );
  }

  getEquipmentTypesWhere(id, success) {
    connection.query('select * from EquipmentType where id = ?', [id], (error, results) => {
      if (error) console.error(error);

      success(results);
    });
  }

  addEquipment(locId, typeId, objectStatu) {
    connection.query(
      'insert into Equipment (id, location_id, type_id, objectStatus) value (null, ?, ?, ?)',
      [locId, typeId, objectStatus],
      error => {
        if (error) return console.error(error);
        success();
      }
    );
  }
  // getBikes(success) {
  //   connection.query('select * from Bikes', (error, results) => {
  //     if (error) return console.error(error);
  //
  //     success(results);
  //   });
  // }
  //
  // addBike(locId, typeId, bikeStatus) {
  //   connection.query(
  //     'insert into Bikes (id, location_id, type_id, bikeStatus) value (null, ?, ?, ?)',
  //     [locId, typeId, bikeStatus],
  //     error => {
  //       if (error) return console.error(error);
  //       success();
  //     }
  //   );
  // }
  // getAllBikesByType(success) {
  //   connection.query(
  //     'select b.id, bt.typeName, bt.brand, bt.model, bt.year, bt.suitedFor, bt.price, l.name from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id',
  //     (error, results) => {
  //       if (error) console.error(error);
  //
  //       success(results);
  //     }
  //   );
  // }
  //
  // newBikeType(
  //   typeName,
  //   brand,
  //   model,
  //   year,
  //   frameSize,
  //   wheelSize,
  //   gears,
  //   gearSystem,
  //   brakeSystem,
  //   weight_kg,
  //   suitedFor,
  //   price,
  //   success
  // ) {
  //   connection.query(
  //     'insert into BikeType (typeName, brand, model, year, frameSize, wheelSize, gears, gearSystem, brakeSystem, weight_kg, suitedFor, price) values (?,?,?,?,?,?,?,?,?,?,?,?)',
  //     [typeName, brand, model, year, frameSize, wheelSize, gears, gearSystem, brakeSystem, weight_kg, suitedFor, price],
  //     error => {
  //       if (error) return console.error(error);
  //
  //       success();
  //     }
  //   );
  // }
  //
  // getBikeStatus(success) {
  //   connection.query('select distinct bikeStatus from Bikes', (error, results) => {
  //     if (error) console.error(error);
  //
  //     success(results);
  //   });
  // }
  //
  // getBikesByStatus(bikeStatus, success) {
  //   connection.query(
  //     'select b.id, l.name, bt.typeName from Bikes b, Locations l, BikeType bt where b.location_id = l.id and b.type_id = bt.id and b.bikeStatus = ?',
  //     [bikeStatus],
  //     (error, results) => {
  //       if (error) console.error(error);
  //
  //       success(results);
  //     }
  //   );
  // }
  //
  // getBike(id, success) {
  //   connection.query(
  //     'select * from BikeType bt, Bikes b where b.type_id = bt.id and b.id = ?',
  //     [id],
  //     (error, results) => {
  //       if (error) return console.error(error);
  //
  //       success(results[0]);
  //     }
  //   );
  // }
  //
  // searchBikes(searchWord, success) {
  //   connection.query(
  //     'select distinct b.id, bt.typeName, bt.brand, bt.model, bt.year, bt.suitedFor, bt.price, l.name, b.bikeStatus from Bikes b, BikeType bt, Locations l where b.type_id = bt.id and b.location_id = l.id and (b.id like ? or l.name like ? or bt.typeName like ? or bt.model like ? or bt.brand like ?)',
  //     [searchWord, searchWord, searchWord, searchWord, searchWord],
  //     (error, results) => {
  //       if (error) return console.error(error);
  //       success(results);
  //     }
  //   );
  // }
  //
  // getBikesOnLocation(id, success) {
  //   connection.query(
  //     'select b.id, bt.typeName, bt.brand, bt.year, bt.frameSize, bt.wheelSize, bt.gears, bt.gearSystem, bt.brakeSystem, bt.weight_kg, bt.suitedFor, bt.price from BikeType bt, Bikes b, Locations lok where b.location_id=lok.id and bt.id = b.type_id and lok.id=? order by b.id',
  //     [id],
  //     (error, results) => {
  //       if (error) return console.error(error);
  //       // console.log(results.length);
  //       success(results);
  //     }
  //   );
  // }
}

export let equipmentService = new EquipmentService();
