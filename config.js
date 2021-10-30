const { MongoClient } = require('mongodb');
const url = 'URL MONGO';
const client = new MongoClient(url);

client.connect();
const database = client.db("DbCloud");
const collectionDoc = database.collection("doctors");
const collectionAdmin = database.collection("admin");
const collectionClinic = database.collection("clinic");
const collectionVisit = database.collection("visitBooking");
const collectionOtp = database.collection("otp");

const config = { collectionDoc, collectionAdmin, collectionClinic, collectionVisit, collectionOtp }

module.exports = config;
