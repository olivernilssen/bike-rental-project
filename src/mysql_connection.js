import mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
export let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql-ait.stud.idi.ntnu.no',
    user: 'g_idri1005_22',
    password: 'aG7lN98x',
    database: 'g_idri1005_22'
  });

  // Connect to MySQL-server
  connection.connect(error => {
    if (error) console.error(error); // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', error => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      // Reconnect if connection to server is lost
      connect();
    } else {
      console.error(error);
    }
  });
}
connect();
