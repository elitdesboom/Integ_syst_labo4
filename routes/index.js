/**
 * @file     index.js
 * @author   Éliott Desbordes-Boom (202257861@edu.clg.qc.ca)
 * @version  1
 * @date     23/09/2025
 * @brief    Routeur principal pour la pizzeria
 */
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('pages/index', { title: 'Accueil Pizzeria' });
});

// Nouvelle route pour le formulaire de commande (Partie 2)
router.get('/cmd', function (req, res, next) {
    res.render('pages/cmd', { title: 'Commander une Pizza' });
});

module.exports = router;