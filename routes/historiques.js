/** 
  * @file       historiques.js 
  * @author     Elliot Wood
  * @version    1 
  * @date       22/09/2025 
  * @brief      Routeur principal pour la page d'historique
  */
var express = require('express');
var fs = require('fs');
var router = express.Router();

const fileName = "transactions.txt";

function getTransactions(phone) {
    if (!fs.existsSync(fileName)) {
        console.log("File not found");
        return [];
    }
    console.log("Reading file:", fileName);
    const lines = fs.readFileSync(fileName, "utf8").split('\n').filter(line => line);
    return lines
        .filter(line => line.startsWith(phone + ':'))
        .map(line => {
            try {
                return JSON.parse(line.split(':').slice(1).join(':'));
            } catch (e) {
                console.error("Error parsing JSON for line:", line, e);
                return null;
            }
        })
        .filter(item => item !== null);
}

router.get('/', function(req, res, next) {
    console.log("Route/historiques");
    const phone = req.query.phone || "";
    let history = [];

    if (phone) {
        console.log("phone =", phone);
        history = getTransactions(phone);
    }
    console.log("history =", history);
    res.render('pages/historique', { 
        title: 'Historique',
        phone: phone,
        history: history 
    });
});

module.exports = router;