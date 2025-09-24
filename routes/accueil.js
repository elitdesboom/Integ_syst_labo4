/**
 * @file     accueil.js
 * @author   Éliott Desbordes-Boom (202257861@edu.clg.qc.ca)
 * @version  1
 * @date     23/09/2025
 * @brief    Routeur pour la gestion de la page d'accueil de la pizzeria
 */

const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/accueil', { title: 'Accueil' });
});

module.exports = router;