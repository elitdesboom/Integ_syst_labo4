/**
 * @file     index.js
 * @author   Éliott Desbordes-Boom (202257861@edu.clg.qc.ca)
 * @version  2
 * @date     23/09/2025
 * @brief    Routeur principal pour la pizzeria - Ajout POST pour commande (Partie 3)
 */
const express = require('express');
const router = express.Router();

// Route GET pour accueil
router.get('/', function (req, res, next) {
    res.render('pages/index', { title: 'Accueil Pizzeria' });
});

// Route GET pour formulaire (Partie 2)
router.get('/cmd', function (req, res, next) {
    res.render('pages/cmd', { title: 'Commander une Pizza' });
});

// Nouvelle route POST pour soumission (Partie 3)
router.post('/submit-order', function (req, res, next) {
    const { pizzaType, quantity, size, extras, address, postalCode, name, surname, phone, email, payment } = req.body;

    // Validation basique côté serveur (redondance avec HTML5 patterns)
    const qty = parseInt(quantity);
    if (qty < 1 || qty > 99 || isNaN(qty)) {
        return res.render('pages/cmd', { title: 'Erreur', error: 'Quantité invalide (1-99).' });
    }
    const postalRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/;
    if (!postalRegex.test(postalCode)) {
        return res.render('pages/cmd', { title: 'Erreur', error: 'Code postal invalide (ex. A1A 1A1).' });
    }
    const phoneRegex = /^[\d\-()]+$/;
    if (!phoneRegex.test(phone)) {
        return res.render('pages/cmd', { title: 'Erreur', error: 'Numéro de téléphone invalide.' });
    }

    // Calcul du prix (fonction helper)
    const prixUnitaire = calculerPrixUnitaire(pizzaType, extras ? extras.length : 0, size);
    const prixAvantTaxes = prixUnitaire * qty;
    const taxes = 0.14975; // TPS 5% + TVQ 9.975% = 14.975% (Québec 2025, restauration)
    const prixApresTaxes = prixAvantTaxes * (1 + taxes);

    // Rendu de la page résultat avec résumé
    res.render('pages/resultats', {
        title: 'Résumé de la Commande',
        commande: {
            pizzaType,
            quantity: qty,
            size,
            extras: extras || [],
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

// Fonction helper pour calculer le prix unitaire (basée sur le PDF Lab 4)
function calculerPrixUnitaire(type, nbExtras, taille) {
    const prixBase = {
        'Hawaïenne': 7.00,
        'All-dressed': 8.10,
        'Sicilienne': 6.30
    }[type] || 0;

    const prixExtras = nbExtras * 0.50;
    const multiplicateurTaille = {
        'Small': 0.8,
        'Medium': 1,
        'Large': 1.2
    }[taille] || 1;

    return (prixBase + prixExtras) * multiplicateurTaille;
}

module.exports = router;