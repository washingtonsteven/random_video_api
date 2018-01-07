const mysql = require('mysql');

const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  port:'8889',
  password:'root',
  database:'random_videos'
});

module.exports.connection = module.exports.db = connection;

module.exports.query = query => {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results, fields) => {
      if (err) return reject(err);
      return resolve(results, fields);
    });
  });
}
