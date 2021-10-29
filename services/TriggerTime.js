const { MongoClient } = require('mongodb');
var moment = require('moment');

module.exports = async function(context) {

    const url = 'mongodb://botcosmosdbmongo:GLIBudChxLncA96ynMFrVGtMyvkzK1T0oleHWrUcc2oChfbjdpkB2KK3AFFoFsbCEqIh677B14bOTABPfVBYDA==@botcosmosdbmongo.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@botcosmosdbmongo@';
    const client = new MongoClient(url);

    client.connect();
    const database = client.db("DbCloud");
    const collectionVisit = database.collection("visitBooking");
    const collectionDoc = database.collection("doctors");

    var timeStamp = moment();
    timeStamp.locale('it');
    var data = timeStamp.format('dddd');

    var datetime = moment().format("DD/MM");

    switch (data) {

        case 'martedì':
            context.log(data);
            var lunedi = (moment(datetime, "DD/MM").add(6, 'days')).format(" DD/MM ");
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].data_visita": lunedi } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Lun.*" } }] });
            break;

        case 'mercoledì':
            context.log(data);
            var martedi = (moment(datetime, "DD/MM").add(6, 'days')).format(" DD/MM ");
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].data_visita": martedi } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mar.*" } }] });
            break;

        case 'giovedì':
            context.log(data);
            var mercoledi = (moment(datetime, "DD/MM").add(6, 'days')).format(" DD/MM ");
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].data_visita": mercoledi } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mer.*" } }] });
            break;

        case 'venerdì':
            context.log(data);
            var giovedi = (moment(datetime, "DD/MM").add(6, 'days')).format(" DD/MM ");
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].data_visita": giovedi } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Gio.*" } }] });
            break;

        case 'sabato':
            context.log(data);
            var venerdi = (moment(datetime, "DD/MM").add(6, 'days')).format(" DD/MM ");
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].data_visita": venerdi } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Ven.*" } }] });
            break;

        case 'domenica':
            context.log(data);
            collectionVisit.remove({});
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "0" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".* .*" } }] });
            break;
    }

};