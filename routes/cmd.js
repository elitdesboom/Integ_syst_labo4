/**
 * @file     cmd.js
 * @author   Éliott Desbordes-Boom (202257861@edu.clg.qc.ca)
 * @version  1
 * @date     23/09/2025
 * @brief    Routeur pour la gestion des commandes de la pizzeria
 */

const express = require('express');
const router = express.Router();

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
        return res.render('pages/cmd', { title: 'Erreur', error: 'Quantité invalide (1-99).', preselected: pizzaType });
    }
    const postalRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
    if (!postalRegex.test(postalCode)) {
        return res.render('pages/cmd', { title: 'Erreur', error: 'Code postal invalide.', preselected: pizzaType });
    }
    const phoneRegex = /^[\d\-()\s]+$/;
    if (!phoneRegex.test(phone)) {
        return res.render('pages/cmd', { title: 'Erreur', error: 'Numéro de téléphone invalide.', preselected: pizzaType });
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
    const prixBase = 
    {
        'Hawaïenne': 7.00,
        'All-dressed': 8.10,
        'Sicilienne': 6.30
    }[type] || 0;
    const prixExtras = nbExtras * 0.50;
    const multiplicateurTaille = 
    {
        'Small': 0.8,
        'Medium': 1,
        'Large': 1.2
    }[taille] || 1;
    return (prixBase + prixExtras) * multiplicateurTaille;
}

module.exports = router;