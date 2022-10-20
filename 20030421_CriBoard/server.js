'use strict'

const express = require('express');
const { request } = require('http');
const morgan = require('morgan');
const {check, validationResult} = require('express-validator');
const dao = require('./dao.js');
const user_dao = require('./user-dao.js');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const FileStore = require('session-file-store')(session);


passport.use(new LocalStrategy(
    function(username, password, done) {
        user_dao.getUser(username, password).then(({user, check}) => {
        if (!user) {
          return done(null, false, { message: 'Codice Utente errato.' });
        }
        if (!check) {
          return done(null, false, { message: 'Password errata.' });
        }
        return done(null, user);
      })
    }
  ));


passport.serializeUser(function(user, done) {
    done(null, user.code);
});
  
passport.deserializeUser(function(id, done) {
    user_dao.getUserById(id).then(user => {
        done(null, user);
    });
});
  
const app = express();
const port = 3000;


app.use(morgan('tiny'));


const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({"statusCode" : 401, "message" : "not authenticated"});
}

app.use(express.json());
/*
app.use(express.static('public'));
*/
app.use(express.static(__dirname + '/public', {
    extensions: ['html']
  }));

app.use(session({
    //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false 
  }));
  
  // init passport
  app.use(passport.initialize());
  app.use(passport.session());


// GET /centralino
// Porta al file centralinista_page.html
app.get('/centralino',isLoggedIn, (req, res) => res.sendFile(path.resolve(__dirname, 'public/centralinista_page.html')));

// GET /volontario
// Porta al file volontario_page.html
app.get('/volontario',isLoggedIn, (req, res) => res.sendFile(path.resolve(__dirname, 'public/volontario_page.html')));

// GET /user
// Restituisce l'user attuale
app.get('/user',isLoggedIn, (req, res) => res.send(req.user));

app.get('/login', (req, res) => res.sendFile(path.resolve(__dirname, 'public/login.html')));


// GET /servizi
// Restituisce tutti i servizi
app.get('/servizi',isLoggedIn, (req, res) =>{
    dao.getAllServizi()
  .then((Servizi) => res.json(Servizi))
  .catch(() => res.status(500).end());
});

// GET /servizi/null/barelliere
// Restituisce tutti i servizi con barelliere mancante
app.get('/servizi/null/barelliere',isLoggedIn, (req, res) =>{
    dao.getAllServiziBarelliereByNull()
  .then((Servizi) => res.json(Servizi))
  .catch(() => res.status(500).end());
});

// GET /servizi/null/autista/:nome
// Restituisce tutti i servizi con barelliere e autista mancante e che non siano già occupati dall'autista stesso
app.get('/servizi/null/autista/:nome',isLoggedIn, (req, res) =>{
    dao.getAllServiziAutistaByNull(req.params.nome)
  .then((Servizi) => res.json(Servizi))
  .catch(() => res.status(500).end());
});

// GET /avvisi
// Restituisce tutti gli avvisi
app.get('/avvisi',isLoggedIn, (req, res) =>{
    dao.getAllAvvisi()
  .then((Avvisi) => res.json(Avvisi))
  .catch(() => res.status(500).end());
});

// GET /avvisi/:id
// Restituisce l'avviso con id dato in api
app.get('/avvisi/:id',isLoggedIn, (req, res) => {
    dao.getAvvisiById(req.params.id)
    .then((avviso) => res.json(avviso))
    .catch((error) => res.status(404).json(error));
})

// GET /servizi/:id
// Restituisce il servizio con id dato in api
app.get('/servizi/:id',isLoggedIn, (req, res) => {
    dao.getServizioById(req.params.id)
    .then((servizio) => res.json(servizio))
    .catch((error) => res.status(404).json(error));
})


// GET /servizi/search/:barelliere/:autista/:tipo
// Restituisce il servizio con barelliere, autista e tipo dato in api
app.get('/servizi/search/:barelliere/:autista/:tipo',isLoggedIn, (req, res) => {
    if(req.params.barelliere == 'star'){
        req.params.barelliere = '%';
    };
    if(req.params.autista == 'star'){
        req.params.autista = '%';
    };
    if(req.params.tipo == 'star'){
        req.params.tipo = '%';
    };
    dao.getServizioByBarelliereAutistaTipo(req.params.barelliere,req.params.autista,req.params.tipo )
    .then((Servizi) => res.json(Servizi))
    .catch((error) => res.status(404).json(error));
})

// GET /avvisi/:id
// Restituisce il servizi con autista o barelliere con nome dato in api
app.get('/servizi/nome/:nome',isLoggedIn, (req, res) => {
    dao.getServizioByNome(req.params.nome)
    .then((Servizi) => res.json(Servizi))
    .catch((error) => res.status(404).json(error));
})

// POST /avvisi
// Post dell'avviso dato nel req.body
app.post('/avvisi',[
    check('contenuto').notEmpty(),
],isLoggedIn, (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(422).json({error: error.array()});
    }

    const avviso = 
    {
        contenuto: req.body.contenuto
    }
    dao.createAvviso(avviso)
    .then((result) => res.status(201).header('Location','/avvisi/' + result).end())
    .catch((err) => res.status(503).json({error: 'Database error during post'}));
});

// POST /adesioni
// Post dell'adesione dato nel req.body
app.post('/adesioni',[
    check('email').notEmpty(),
], (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(422).json({error: error.array()});
    }

    const adesione = 
    {
        email: req.body.email
    }
    dao.createAdesione(adesione)
    .then((result) => res.status(201).header('Location','/adesione/' + result).end())
    .catch((err) => res.status(503).json({error: 'L\' email che hai inserito è già stata usata per richiedere l\'adesione'}));
});

// POST /servizi
// Post del servizio dato nel req.body
app.post('/servizi',[
    check('data').notEmpty(),
    check('orario').notEmpty(),
    check('carico').notEmpty(),
    check('scarico').notEmpty(),
    check('tipo').notEmpty(),
],isLoggedIn, (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(422).json({error: error.array()});
    }

    const servizio = 
    {
        data: req.body.data,
        orario: req.body.orario,
        carico: req.body.carico,
        scarico: req.body.scarico,
        tipo: req.body.tipo,
        autista: req.body.autista,
        barelliere: req.body.barelliere,
    }
    dao.createServizio(servizio)
    .then((result) => res.status(201).header('Location','/servizi/' + result).end())
    .catch((err) => res.status(503).json({error: 'Database error during post'}));
});

// DELETE /avvisi/:id
// Delete dell'avviso di cui l'id dato in api
app.delete('/avvisi/:id',isLoggedIn, (req, res) => {
    dao.deleteAvvisiById(req.params.id)
    .then((result) => {
        if(result)
            res.status(404).json(result);
        else
            res.status(204).end();
    })
    .catch((error) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}]
    }));
});

// DELETE /servizi/:id
// Delete del servizio di cui l'id dato in api
app.delete('/servizi/:id',isLoggedIn, (req, res) => {
    dao.deleteServizioById(req.params.id)
    .then((result) => {
        if(result)
            res.status(404).json(result);
        else
            res.status(204).end();
    })
    .catch((error) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}]
    }));
});

// PUT /avvisi/:id
// Put dell'avviso di cui l'id dato in api e contenuto dato nel req.body
app.put('/avvisi/:id',[
    check('contenuto').notEmpty(),
],isLoggedIn, (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(422).json({error: error.array()});
    }

    const avviso = 
    {
        contenuto: req.body.contenuto
    }
    dao.updateAvvisiById(avviso, req.params.id)
    .then((result) => {
        if(result)
            res.status(404).json(result);
        else
            res.status(204).end();
    })
    .catch((error) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}]
    }));
});

// PUT /servizi/barelliere/:id
// Put del servizio di cui l'id dato in api del campo barelliere di cui il nome dato in req.body
app.put('/servizi/barelliere/:id',[
    check('barelliere').notEmpty(),
],isLoggedIn, (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(422).json({error: error.array()});
    }
    const servizio = 
    {
        barelliere: req.body.barelliere,
    }
    dao.updateBarelliereById(servizio, req.params.id)
    .then((result) => {
        if(result)
            res.status(404).json(result);
        else
            res.status(204).end();
    })
    .catch((error) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}]
    }));
});


// PUT /servizi/autista/:id
// Put del servizio di cui l'id dato in api del campo autista di cui il nome dato in req.body
app.put('/servizi/autista/:id',[
    check('autista').notEmpty(),
],isLoggedIn, (req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(422).json({error: error.array()});
    }
    const servizio = 
    {
        autista: req.body.autista,
    }
    dao.updateAutistaById(servizio, req.params.id)
    .then((result) => {
        if(result)
            res.status(404).json(result);
        else
            res.status(204).end();
    })
    .catch((error) => res.status(500).json({
        errors: [{'param': 'Server', 'msg': err}]
    }));
});

//POST /api/Session
// Login
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, function(err) {
          if (err) { return next(err); }
          // req.user contains the authenticated user
          return res.json(req.user);
        });
    })(req, res, next);
  });
  
  // ALTERNATIVE: if we are not interested in sending error messages...
  /*
  app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json(req.user.username);
  });
  */
  
  // DELETE /sessions/current 
  // Logout
  app.delete('/api/sessions/current', function(req, res){
    req.logout();
    res.end();
  });
  
// qualsiasi altra GET request porta al login
app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'public/index.html'));
  });

app.listen(port, () =>
    console.log('Server ready'));
