const { MongoClient } = require('mongodb');
var moment = require('moment');

module.exports = async function(context) {

    const url = 'mongodb://botcosmosdbmongo:GLIBudChxLncA96ynMFrVGtMyvkzK1T0oleHWrUcc2oChfbjdpkB2KK3AFFoFsbCEqIh677B14bOTABPfVBYDA==@botcosmosdbmongo.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@botcosmosdbmongo@';
    const client = new MongoClient(url);

    client.connect();
    const database = client.db("DbCloud");
    const collectionDoc = database.collection("doctors");

    var timeStamp = moment();
    timeStamp.locale('it');
    var data = timeStamp.format('dddd HH');

    switch (data) {
        case 'lunedì 08':
            context.log(data);
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Lun.*" }, "elem.orario": { "$regex": ".*9.*" } }] });
            break;
        case 'lunedì 09':
            context.log(data);
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Lun.*" }, "elem.orario": { "$regex": ".*10.*" } }] });
            break;
        case 'lunedì 10':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Lun.*" }, "elem.orario": { "$regex": ".*11.*" } }] });
            break;
        case 'lunedì 11':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Lun.*" }, "elem.orario": { "$regex": ".*12.*" } }] });
            break;
        case 'lunedì 14':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Lun.*" }, "elem.orario": { "$regex": ".*15.*" } }] });
            break;
        case 'lunedì 15':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Lun.*" }, "elem.orario": { "$regex": ".*16.*" } }] });
            break;
        case 'lunedì 16':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Lun.*" }, "elem.orario": { "$regex": ".*17.*" } }] });
            break;
        case 'lunedì 17':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Lun.*" }, "elem.orario": { "$regex": ".*18.*" } }] });
            break;
        case 'martedì 08':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mar.*" }, "elem.orario": { "$regex": ".*9.*" } }] });
            break;
        case 'martedì 09':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mar.*" }, "elem.orario": { "$regex": ".*10.*" } }] });
            break;
        case 'martedì 10':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mar.*" }, "elem.orario": { "$regex": ".*11.*" } }] });
            break;
        case 'martedì 11':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mar.*" }, "elem.orario": { "$regex": ".*12.*" } }] });
            break;
        case 'martedì 12':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mar.*" }, "elem.orario": { "$regex": ".*13.*" } }] });
            break;
        case 'martedì 15':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mar.*" }, "elem.orario": { "$regex": ".*16.*" } }] });
            break;
        case 'martedì 16':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mar.*" }, "elem.orario": { "$regex": ".*17.*" } }] });
            break;
        case 'martedì 17':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mar.*" }, "elem.orario": { "$regex": ".*18.*" } }] });
            break;
        case 'mercoledì 08':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mer.*" }, "elem.orario": { "$regex": ".*9.*" } }] });
            break;
        case 'mercoledì 09':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mer.*" }, "elem.orario": { "$regex": ".*10.*" } }] });
            break;
        case 'mercoledì 10':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mer.*" }, "elem.orario": { "$regex": ".*11.*" } }] });
            break;
        case 'mercoledì 11':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mer.*" }, "elem.orario": { "$regex": ".*12.*" } }] });
            break;
        case 'mercoledì 14':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mer.*" }, "elem.orario": { "$regex": ".*15.*" } }] });
            break;
        case 'mercoledì 15':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mer.*" }, "elem.orario": { "$regex": ".*16.*" } }] });
            break;
        case 'mercoledì 16':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mer.*" }, "elem.orario": { "$regex": ".*17.*" } }] });
            break;
        case 'mercoledì 17':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Mer.*" }, "elem.orario": { "$regex": ".*18.*" } }] });
            break;
        case 'giovedì 08':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Gio.*" }, "elem.orario": { "$regex": ".*9.*" } }] });
            break;
        case 'giovedì 09':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Gio.*" }, "elem.orario": { "$regex": ".*10.*" } }] });
            break;
        case 'giovedì 10':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Gio.*" }, "elem.orario": { "$regex": ".*11.*" } }] });
            break;
        case 'giovedì 11':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Gio.*" }, "elem.orario": { "$regex": ".*12.*" } }] });
            break;
        case 'giovedì 12':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Gio.*" }, "elem.orario": { "$regex": ".*13.*" } }] });
            break;
        case 'venerdì 08':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Ven.*" }, "elem.orario": { "$regex": ".*9.*" } }] });
            break;
        case 'venerdì 09':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Ven.*" }, "elem.orario": { "$regex": ".*10.*" } }] });
            break;
        case 'venerdì 10':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Ven.*" }, "elem.orario": { "$regex": ".*11.*" } }] });
            break;
        case 'venerdì 11':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Ven.*" }, "elem.orario": { "$regex": ".*12.*" } }] });
            break;
        case 'venerdì 14':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Ven.*" }, "elem.orario": { "$regex": ".*15.*" } }] });
            break;
        case 'venerdì 15':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Ven.*" }, "elem.orario": { "$regex": ".*16.*" } }] });
            break;
        case 'venerdì 16':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Ven.*" }, "elem.orario": { "$regex": ".*17.*" } }] });
            break;
        case 'venerdì 17':
            collectionDoc.updateMany({}, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.giorno": { "$regex": ".*Ven.*" }, "elem.orario": { "$regex": ".*18.*" } }] });
            break;
    }

};