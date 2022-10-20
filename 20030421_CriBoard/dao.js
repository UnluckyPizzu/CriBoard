"use strict"

const sqlite = require('sqlite3');
const db = new sqlite.Database('avvisi.db', (err) => {
  if (err) throw err;
});

const db2 = new sqlite.Database('servizi.db', (err) => {
    if (err) throw err;
  });

const db3 = new sqlite.Database('adesione.db', (err) => {
    if (err) throw err;
  });


exports.getAllServizi = function(){
    return new Promise((resolve, reject) =>{
    const sql = 'SELECT * FROM servizi';
    db2.all(sql,(err, rows) => {
        if(err)
        {
            reject(err);
            throw err;
        }

        const Servizi = rows.map((e) => ({id: e.id, data: e.data, orario: e.orario, carico: e.carico, scarico: e.scarico, tipo: e.tipo, autista: e.autista, barelliere: e.barelliere}));
        resolve(Servizi);
    });
    });
};

exports.getAllAvvisi = function(){
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM avvisi';
        db.all(sql,(err, rows) => {
            if(err)
            {
                reject(err);
                throw err;
            }

            const Avvisi = rows.map((e) => ({id: e.id, contenuto: e.contenuto}));
            resolve(Avvisi);
        });
    });
};

exports.getAvvisiById = function(AvvisiId) {
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM avvisi WHERE id=?';
    db.get(sql, [AvvisiId],(err, row) => 
    {
        if(err)
        {
            reject(err);
            return;
        }
        if(row === undefined) 
        {
            resolve({error : 'Avviso not found.'});
        }
        else
        {
            const avviso = {id: row.id,contenuto: row.contenuto};
            resolve(avviso);
        }
    });
});
};

exports.getServizioById = function(servizioId) {
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM servizi WHERE id=?';
    db2.get(sql, [servizioId],(err, row) => 
    {
        if(err)
        {
            reject(err);
            return;
        }
        if(row === undefined) 
        {
            resolve({error : 'Servizio not found.'});
        }
        else
        {
            const servizio = {id: row.id, data: row.data, orario: row.orario, carico: row.carico, scarico: row.scarico, tipo: row.tipo, autista: row.autista, barelliere: row.barelliere};
            resolve(servizio);
        }
    });
});
};

exports.getServizioByNome = function(servizioBarelliere) {
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM servizi WHERE barelliere=? OR autista =?';
    db2.all(sql, [servizioBarelliere,servizioBarelliere ],(err, rows) => 
    {
        if(err)
        {
            reject(err);
            return;
        }
        if(rows === undefined) 
        {
            resolve({error : 'Servizio not found.'});
        }
        else
        {
            const Servizi = rows.map((e) => ({id: e.id, data: e.data, orario: e.orario, carico: e.carico, scarico: e.scarico, tipo: e.tipo, autista: e.autista, barelliere: e.barelliere}));
            resolve(Servizi);
        }
    });
});
};

exports.getServizioByBarelliereAutistaTipo = function(servizioBarelliere, servizioAutista,servizioTipo) {
    return new Promise((resolve, reject) =>{
        const sql = 'SELECT * FROM servizi WHERE barelliere LIKE ? AND autista LIKE ? AND tipo LIKE ? ';
    db2.all(sql, [servizioBarelliere,servizioAutista,servizioTipo ],(err, rows) => 
    {
        if(err)
        {
            reject(err);
            return;
        }
        if(rows === undefined) 
        {
            resolve({error : 'Servizio not found.'});
        }
        else
        {
            const Servizi = rows.map((e) => ({id: e.id, data: e.data, orario: e.orario, carico: e.carico, scarico: e.scarico, tipo: e.tipo, autista: e.autista, barelliere: e.barelliere}));
            resolve(Servizi);
        }
    });
});
};


exports.getAllServiziBarelliereByNull = function(){
    return new Promise((resolve, reject) =>{
    const sql = 'SELECT * FROM servizi WHERE barelliere IS NULL OR barelliere= "" ';
    db2.all(sql, (err, rows) => {
        if(err)
        {
            reject(err);
            throw err;
        }

        const Servizi = rows.map((e) => ({id: e.id, data: e.data, orario: e.orario, carico: e.carico, scarico: e.scarico, tipo: e.tipo, autista: e.autista, barelliere: e.barelliere}));
        resolve(Servizi);
    });
    });
};

exports.getAllServiziAutistaByNull = function(Nome){
    return new Promise((resolve, reject) =>{
    const sql = 'SELECT * FROM servizi WHERE (autista != ? AND barelliere != ?) AND ((barelliere IS NULL OR barelliere= "") OR (autista IS NULL OR autista= ""))';
    db2.all(sql,[Nome,Nome],(err, rows) => {
        if(err)
        {
            reject(err);
            throw err;
        }

        const Servizi = rows.map((e) => ({id: e.id, data: e.data, orario: e.orario, carico: e.carico, scarico: e.scarico, tipo: e.tipo, autista: e.autista, barelliere: e.barelliere}));
        resolve(Servizi);
    });
    });
};





exports.createAvviso = function(avviso) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO avvisi(contenuto) VALUES (?)';
        db.run(sql,[avviso.contenuto], function(err){
        if(err)
        {
            reject(err);
        } 
        else 
        {
            resolve(this.lastID);
        }
        
    });
});
};

exports.createAdesione = function(adesione) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO adesione(email) VALUES (?)';
        db3.run(sql,[adesione.email], function(err){
        if(err)
        {
            reject(err);
        } 
        else 
        {
            resolve(this.lastID);
        }
        
    });
});
};

exports.createServizio = function(servizio) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO servizi(data, orario, carico, scarico, tipo, autista, barelliere) VALUES (?,?,?,?,?,?,?)';
        db2.run(sql,[servizio.data,servizio.orario,servizio.carico,servizio.scarico,servizio.tipo,servizio.autista,servizio.barelliere], function(err){
        if(err)
        {
            reject(err);
        } 
        else 
        {
            resolve(this.lastID);
        }
        
    });
});
};

exports.deleteAvvisiById = function(AvvisiId) {
    return new Promise((resolve, reject) =>{
        const sql = 'DELETE FROM avvisi WHERE id=?';
    db.run(sql, [AvvisiId],function(err){
        if(err)
        {
            reject(err);
        } 
        else if(this.changes === 0)
        {
            resolve({error: "Avviso non trovato"});
        }
        else{
            resolve();
        }
    });
});
};


exports.deleteServizioById = function(servizioId) {
    return new Promise((resolve, reject) =>{
        const sql = 'DELETE FROM servizi WHERE id=?';
    db2.run(sql, [servizioId],function(err){
        if(err)
        {
            reject(err);
        } 
        else if(this.changes === 0)
        {
            resolve({error: "Servizio non trovato"});
        }
        else{
            resolve();
        }
    });
});
};

exports.updateAvvisiById = function(avviso,AvvisiId) {
    return new Promise((resolve, reject) =>{
        const sql = 'UPDATE avvisi SET contenuto=? WHERE id=?';
    db.run(sql, [avviso.contenuto,AvvisiId],function(err){
        if(err)
        {
            reject(err);
        } 
        else if(this.changes === 0)
        {
            resolve({error: "Avviso non trovato"});
        }
        else{
            resolve();
        }
    });
});
};

exports.updateBarelliereById = function(servizio,servizioId) {
    return new Promise((resolve, reject) =>{
        const sql = 'UPDATE servizi SET barelliere=? WHERE id=?';
    db2.run(sql, [servizio.barelliere,servizioId],function(err){
        if(err)
        {
            reject(err);
        } 
        else if(this.changes === 0)
        {
            resolve({error: "Servizio non trovato"});
        }
        else{
            resolve();
        }
    });
});
};

exports.updateAutistaById = function(servizio,servizioId) {
    return new Promise((resolve, reject) =>{
        const sql = 'UPDATE servizi SET autista=? WHERE id=?';
    db2.run(sql, [servizio.autista,servizioId],function(err){
        if(err)
        {
            reject(err);
        } 
        else if(this.changes === 0)
        {
            resolve({error: "Servizio non trovato"});
        }
        else{
            resolve();
        }
    });
});
};
    