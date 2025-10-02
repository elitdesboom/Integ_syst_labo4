/**
 * @file     cmd.js
 * @author   Éliott Desbordes-Boom (202257861@edu.clg.qc.ca)
 * @version  1
 * @date     23/09/2025
 * @brief    Routeur pour la gestion des commandes de la pizzeria
 */

const express = require('express');
const router = express.Router();

// Constantes de prix
const PIZZA_PRICES = {
    'Hawaïenne': 7.00,
    'All-dressed': 8.10,
    'Sicilienne': 6.30
};
const EXTRA_PRICE = 0.50;
const SIZE_MULTIPLIERS = {
    'Small': 0.8,
    'Medium': 1.0,
    'Large': 1.2
};

// Fonction utilitaire pour rendre une page d'erreur
function renderErrorPage(res, pizzaType, errorMessage) {
    return res.render('pages/cmd', { 
        title: 'Erreur', 
        error: errorMessage, 
        preselected: pizzaType 
    });
}

// GET /cmd  -> afficher le formulaire (prend pizza via query string pour préremplir)
router.get('/', function (req, res, next) {
    const preselected = req.query.pizza || '';
    res.render('pages/cmd', { title: 'Commander une Pizza', preselected });
});

// POST /cmd/submit-order -> traiter le formulaire
router.post('/submit-order', function (req, res, next) {
    const { pizzaType, quantity, size, extras, address, postalCode, name, surname, phone, email, payment } = req.body;

    
    const extrasArr = extras
      ? (Array.isArray(extras) ? extras : [extras])
      : [];

    // validations basiques
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1 || qty > 99) {
                return renderErrorPage(res, pizzaType, 'Quantité invalide (1-99).');
    }
    const postalRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
    if (!postalRegex.test(postalCode)) {
        return renderErrorPage(res, pizzaType, 'Code postal invalide.');
    }
    const phoneRegex = /^[\d\-()\s]+$/;
    if (!phoneRegex.test(phone)) {
         return renderErrorPage(res, pizzaType, 'Numéro de téléphone invalide.');
    }

    // calcul prix — utiliser extrasArr.length
    const prixUnitaire = calculerPrixUnitaire(pizzaType, extrasArr.length, size);
    const prixAvantTaxes = prixUnitaire * qty;
    const taxes = 0.14975;
    const prixApresTaxes = prixAvantTaxes * (1 + taxes);

    res.render('pages/resultats', 
    {
        title: 'Résumé de la Commande',
        commande: 
        {
            pizzaType,
            quantity: qty,
            size,
            extras: extrasArr,
            address,
            postalCode,
            nom: `${name} ${surname}`,
            phone,
            email,
            payment
        },
        prixAvantTaxes: prixAvantTaxes.toFixed(2),
        prixApresTaxes: prixApresTaxes.toFixed(2),
        taxesRate: (taxes * 100).toFixed(2)
    });
});

function calculerPrixUnitaire(type, nbExtras, taille)
{
    const prixBase = PIZZA_PRICES[type] || 0;
    const prixExtras = nbExtras * EXTRA_PRICE;
    const multiplicateurTaille = SIZE_MULTIPLIERS[taille] || 1;
    return (prixBase + prixExtras) * multiplicateurTaille;
}

module.exports = router;