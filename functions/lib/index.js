"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();
exports.getFilteredOffers = functions.https.onRequest((req, res) => {
    // Set cross origin
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    const result = [];
    // Query ordered by prices
    let query = firestore.collection(`/games/${req.query.gameId}/offers`).orderBy('price', 'asc');
    // If price != 0 we filter with price max
    if (parseInt(req.query.price)) {
        query = query.where('price', '<=', parseInt(req.query.price));
    }
    // If server selected, filter by servers
    if (req.query.server) {
        query = query.where('server', '<=', req.query.price);
    }
    // Then we filter each offer by name containing string
    query.get().then((offers) => {
        offers.docs.forEach((doc) => {
            const offer = doc.data();
            offer.id = doc.id;
            // Filter on name
            if (req.query.name && offer.name.trim().toLowerCase().indexOf(req.query.name.trim().toLocaleLowerCase()) !== -1) {
                result.push(offer);
            }
        });
        res.status(200).send({ data: result });
    }).catch((err) => console.error(err));
});
//# sourceMappingURL=index.js.map