/**
 * @file     contacts.js
 * @author   Éliott Desbordes-Boom (202257861@edu.clg.qc.ca)
 * @version  1
 * @date     23/09/2025
 * @brief    Routeur pour la gestion des contacts de la pizzeria
 */
const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('pages/contacts', { title: 'Contacts Pizzeria' });
});

module.exports = router;