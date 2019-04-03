import { connection } from './mysql_connection';
import { start } from 'repl';

class OrderService {
  getOrders(success) {
    connection.query('select * from Orders', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getOrder(id, success) {
    connection.query(
      'select o.id, o.customer_id, c.firstName, c.lastName, ot.typeName, o.dateOrdered, o.fromDateTime, o.toDateTime, o.price from Orders o, Customers c, OrderType ot, Workers w where o.customer_id = c.id and o.type_id = ot.id and o.id = ?',
      [id],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      }
    );
  }
  getBikesFromOrder(orderId, success) {
    connection.query(
      'select b.id, bt.typeName, bt.brand, bt.model, bt.year, bt.frameSize, bt.wheelSize, bt.gears, bt.gearSystem, bt.brakeSystem, bt.weight_kg, bt.suitedFor, bt.price FROM BikeType bt, OrderedBike ob, Orders o, Bikes b WHERE o.id = ob.order_id and ob.bike_id = b.id and b.type_id = bt.id and o.id = ?',
      [orderId],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getEquipmentFromOrder(orderId, success) {
    connection.query(
      'select et.id, et.typeName, et.brand, et.year, et.comment, et.price FROM EquipmentType et, OrderedEquipment oe, Orders o where o.id = oe.order_id and oe.equip_id = et.id and o.id = ?',
      [orderId],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getOrderSearch(phrase, success) {
    connection.query(
      'select * from Orders where id like ? or customer_id like ? order by dateOrdered desc',
      [phrase, phrase],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  //QUERIES FOR ADDING A NEW ORDER TO THE DATABASE
  makeOrder(cID, typeID, today, fromDate, toDate, price, employee){
    connection.query('insert into Orders (id, customer_id, type_id, dateOrdered, fromDateTime, toDateTime, price, soldBy_id) values(null, ?, ?, ?, ?, ?, ?, ?)',
    [cID, typeID, today, fromDate, toDate, price, employee],
    (error) => {
      if(error) return console.error(error);
    })
  }

  makeBikeOrder(cID, today, bikeID) {
    connection.query('insert into OrderedBike (order_id, bike_id) values ((select id from Orders where customer_id = ? and dateOrdered = ?), ?)',
    [cID, today, bikeID],
    (error) => {
      if(error) console.error(error);
    })
  }

  makeEquipOrder(cID, today, equipID){
    connection.query('insert into OrderedEquipment (order_id, equip_id) values ((select id from Orders where customer_id = ? and dateOrdered = ?), ?)',
    [cID, today, equipID],
    (error) => {
      if(error) return console.error(error);
    })
  }

  deleteOrderedBike(id) {
    connection.query('DELETE FROM OrderedBike where order_id=?', [id], (error) => {
      if(error) return console.error(error);
    })
  }

  deleteOrderedEquipment(id) {
    connection.query('DELETE FROM OrderedEquipment where order_id=?', [id], (error) => {
      if(error) return console.error(error);
    })
  }

  deleteOrder(id) {
    connection.query('DELETE FROM Orders where id=?', [id], (error) => {
      if(error) return console.error(error);
    })
  }
}

export let orderService = new OrderService();
