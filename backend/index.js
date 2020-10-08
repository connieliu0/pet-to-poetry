const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const express = require('express');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://img2lyrics.firebaseio.com"
});

const db = admin.firestore();

const app = express();
app.use(express.json());
app.use(cors());
const port = 8080;

const playlists = db.collection('playlists');

// get information for all the members
app.get('/getSongsByStyle', async function (req, res) {
  const ID = req.query.id;
  await playlists.doc(ID).get()
    .then((docRef) => { res.send(docRef.data()) });
});

app.listen(process.env.PORT || port, function () {
  console.log('app started');
  console.log('CORS-enabled web server listening on port 80');
});