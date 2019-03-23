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

  getDistinctBikeType(eqName, success) {
    connection.query('select distinct typeName from BikeType where typeName NOT IN (select bt.typeName from BikeType bt, Restrictions r, EquipmentType et where bt.id = r.bikeType_id and et.id = r.equipmentType_id and et.typeName = ?)', [eqName], (error, results) => {
      if (error) console.error(error);
console.log(results);
      success(results);
    });
  }

  getRestrictions(name, success) {
    connection.query('select bt.typeName, bt.id from BikeType bt, Restrictions r, EquipmentType et where bt.id = r.bikeType_id and et.id = r.equipmentType_id and et.typeName = ?', [name],
    (error, results) => {
      if (error) return console.error(error);


      success(results);
    });

  }

  addRestriction(biketype, equipmenttype, success) {
    connection.query("insert into Restrictions (bikeType_id, equipmentType_id) values (?, ?)", [biketype, equipmenttype],
  (error, results) => {
    if (error) return console.error(error);

    success();
  });
  }

  deleteRestriction(bikeid, equipmentid, success) {
    connection.query('DELETE FROM Restrictions where bikeType_id = ? AND equipmentType_id = ?', [bikeid, equipmentid],
    (error, results) => {
      if (error) return console.error(error);

      success();
    });

  }

  getBikeIdByName(name, success) {
    connection.query('select id from BikeType where typeName = ?', [name], (error, idResult) => {
      if (error) return console.error(error);
      success(idResult[0]);
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
      'select e.id, l.name, e.objectStatus from Equipment e, Locations l where e.location_id = l.id and e.type_id = ?',
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

  addEquipment(locId, typeId, objectStatus) {
    connection.query(
      'insert into Equipment (location_id, type_id, objectStatus) value (?, ?, ?)',
      [locId, typeId, objectStatus],
      error => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  newEquipmentType(typeName, brand, year, comment, price) {
    connection.query(
      'insert into EquipmentType (typeName, brand, year, comment, price) values (?,?,?,?,?)',
      [typeName, brand, year, comment, price],
      error => {
        if (error) return console.error(error);

        success();
      }
    );
  }
}

export let equipmentService = new EquipmentService();
