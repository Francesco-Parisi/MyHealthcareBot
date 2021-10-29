const { MongoClient } = require('mongodb');
const url = 'mongodb://botcosmosdbmongo:GLIBudChxLncA96ynMFrVGtMyvkzK1T0oleHWrUcc2oChfbjdpkB2KK3AFFoFsbCEqIh677B14bOTABPfVBYDA==@botcosmosdbmongo.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@botcosmosdbmongo@';
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