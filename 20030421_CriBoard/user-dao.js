'use strict';

const bcrypt = require('bcrypt');

const sqlite = require('sqlite3');
const db = new sqlite.Database('utenti.db', (err) => {
  if (err) throw err;
});


exports.getUser = function(code, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utenti WHERE code = ?';
        db.get(sql, [code], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
              const user = {code: row.code};
              let check = false;
              
              if(bcrypt.compareSync(password, row.password))
                check = true;
  
              resolve({user, check});
            }
        });
    });
  };


  exports.getUserById = function(code) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utenti WHERE code = ?';
        db.get(sql, [code], (err, row) => {
            if (err) 
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
                const user = {code: row.code, nome: row.nome, tipo: row.tipo};
                resolve(user);
            }
        });
    });
  };

  exports.createUser = function(user) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO utenti(code, password,nome,tipo) VALUES (?, ?, ?,?)';
      // create the hash as an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
      bcrypt.hash(user.password, 10).then((hash => {
        db.run(sql, [user.email, hash, user.nome, user.tipo], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      }));
    });
  }