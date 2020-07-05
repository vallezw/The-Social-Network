const admin = require('firebase-admin')

var app = admin.initializeApp();

const db = admin.firestore()

module.exports = { admin, app, db}
