"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors');
admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();
exports.getFilteredOffers = functions.https.onRequest((req, res) => {
    console.log("ok");
    res.status(200).send({ data: "ok" });
});
//# sourceMappingURL=index.js.map