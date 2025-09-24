/**
  * @file     app.js
  * @author   Éliott Desbordes-Boom (202257861@edu.clg.qc.ca)
  * @version  1
  * @date     23/09/2025
  * @brief    Laboratoire 4 - Intégration de systèmes - Serveur Express de la pizzeria
  */


const PORT = 8080;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', require('./routes/accueil'));
app.use('/accueil', require('./routes/accueil'));
app.use('/cmd', require('./routes/cmd'));
app.use('/contacts', require('./routes/contacts'));

app.use(function (req, res, next) 
{
    res.status(404)
    res.render("pages/404.ejs");
});

let server = app.listen(PORT, function()
{
    console.log("Serveur à l'écoute sur le port " + PORT);
});

// gestion des erreurs
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // afficher la page d’erreurs
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;