const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://my-project-6665-4491d.firebaseio.com'
});

const db = admin.firestore();

const collection = db.collection('users');

module.exports = collection;
