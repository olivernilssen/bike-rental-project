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
}

export let orderService = new OrderService();
