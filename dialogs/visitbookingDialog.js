const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({
    path: ENV_FILE
});

//Mongo Configuration
const config = require('../config');

const QRCode = require('qrcode');
const sha256 = require('js-sha256');
const fs = require('fs');
const moment = require('moment');
const axios = require('axios');

const { collectionDoc, collectionClinic, collectionVisit } = config;
const { TextPrompt, ChoicePrompt, NumberPrompt, ChoiceFactory, DialogSet, DialogTurnStatus, WaterfallDialog, AttachmentPrompt } = require('botbuilder-dialogs');
const { ActivityTypes, MessageFactory, CardFactory } = require('botbuilder');
const { BlobServiceClient } = require('@azure/storage-blob');

const { EmailPrompt } = require('../prompts/emailPrompt');
const { RecapitoPrompt } = require('../prompts/recapitoPrompt');
const { ExitDialog } = require('./exitDialog');

const VISIT_BOOKING_DIALOG = 'VISIT_BOOKING_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const EMAIL_PROMPT = 'EMAIL_PROMPT';
const PHONE_PROMPT = 'PHONE_PROMPT';

const STORAGE_ACCOUNT_NAME = process.env.StorageAccountName;
const SA_CONNECTION_STRING = process.env.SAConnectionString;
const FUNCTION_ENDPOINT = process.env.FunctionEndpoint;

class VisitBookingDialog extends ExitDialog {
    constructor(luisRecognizer, userState) {
        super(VISIT_BOOKING_DIALOG);

        this.luisRecognizer = luisRecognizer;
        this.userState = userState;

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT));
        this.addDialog(new EmailPrompt(EMAIL_PROMPT));
        this.addDialog(new RecapitoPrompt(PHONE_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.infoStep.bind(this),
            this.emailStep.bind(this),
            this.recapitoStep.bind(this),
            this.showHealthFacilitiesStep.bind(this),
            this.specialistChoiceStep.bind(this),
            this.doctorStep.bind(this),
            this.timeChoiceStep.bind(this),
            this.resumeStep.bind(this),
            this.sendInfoStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async infoStep(step) {
        const reply = {
            type: ActivityTypes.Message
        };

        var card = CardFactory.thumbnailCard(
            'Prenotazione Visita Specialistica 👨‍⚕️', [{
                url: "http://www.myhealthcarebot.altervista.org/images/farmacia.jpg"
            }], [], {
                text: 'Per poter prenotare una visita specialistica è necessario inserire alcune informazioni personali. Iniziamo!'
            }
        );
        reply.attachments = [card];
        await step.context.sendActivity(reply)
        return await step.prompt(TEXT_PROMPT, 'Inserisci il tuo nome e cognome.');
    }

    async emailStep(step) {
        step.values.info = step.result;
        return await step.prompt(EMAIL_PROMPT, `Inserisci la tua e-mail.`);
    }

    async recapitoStep(step) {
        step.values.email = step.result;
        return await step.prompt(PHONE_PROMPT, 'Inserisci un tuo recapito telefonico.');

    }
    async showHealthFacilitiesStep(step) {
        step.values.cellulare = step.result;

        const query = await ((collectionClinic.find({})).toArray());
        const clinica = query.map(function(i) { return i.nome_clinica });

        const card = CardFactory.heroCard(
            undefined, undefined, clinica, {
                text: 'Strutture Sanitarie Convenzionate'
            }
        );
        const message = MessageFactory.attachment(card);
        await step.context.sendActivity(message);

        return await step.prompt(TEXT_PROMPT, 'Scegli una Struttura Sanitaria.');

    }
    async specialistChoiceStep(step) {
        step.values.struttura = step.result;
        const reply = {
            type: ActivityTypes.Message
        };

        const queryCheck = await (collectionVisit.find({ email: step.values.email, struttura_sanitaria: step.values.struttura }).toArray());
        const checkStruttura = queryCheck.map(function(i) { return i.struttura_sanitaria });

        //Controllo numero di prenotazioni fatte da un paziente
        if (checkStruttura.length >= 2) {
            reply.text = 'Non puoi prenotare un\'altra visita in questa struttura sanitaria.🛑\n\nIl limite massimo è di due prenotazioni a settimana per struttura.';
            await step.context.sendActivity(reply);
            return await step.endDialog();
        }

        const query = await (collectionClinic.find({ nome_clinica: step.values.struttura }).toArray());
        const clinica = query.map(function(i) { return i.nome_clinica });

        if (clinica.includes(step.values.struttura)) {

            const query = await (collectionClinic.findOne({ nome_clinica: step.values.struttura }));
            const specialistica = (query.visite_specialistiche.map(function(i) { return i.specialistica }));

            const card = CardFactory.heroCard(
                undefined, undefined, specialistica, {
                    text: 'Visite Specialistiche'
                }
            );
            reply.attachments = [card];
            await step.context.sendActivity(reply);

        } else {
            reply.text = 'Hai digitato una struttura non presente. ❌ Riprova!';
            await step.context.sendActivity(reply);
            return await step.replaceDialog(this.id);
        }

        return await step.prompt(TEXT_PROMPT, 'Scegli una Visita Specialistica.');

    }
    async doctorStep(step) {
        step.values.visitaSpecialistica = step.result;

        const query = await (collectionDoc.find({ clinica: step.values.struttura }).toArray());
        const specialistica = query.map(function(i) { return i.specializzazione });

        if (specialistica.includes(step.values.visitaSpecialistica)) {
            const doctor = await (collectionDoc.findOne({ clinica: step.values.struttura, specializzazione: step.values.visitaSpecialistica }));
            step.values.dottore = doctor.info;

        } else {
            await step.context.sendActivity('Hai digitato una visita specialistica non presente. ❌ Riprova!');
            return await step.replaceDialog(this.id);
        }

        return await step.next(step.values.dottore);

    }
    async timeChoiceStep(step) {
        step.values.dottore = step.result;

        const dottore_visita = await (collectionDoc.findOne({ info: step.values.dottore }));

        //AdaptiveCard dinamica in base al dottore scelto
        var adaptivecard = {
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [{
                "type": "ColumnSet",
                "columns": [{
                        "type": "Column",
                        "width": "auto",
                        "items": [{
                            "type": "Image",
                            "url": dottore_visita.immagine,
                            "size": "medium",
                            "style": "compact"
                        }]
                    },
                    {
                        "type": "Column",
                        "width": "stretch",
                        "items": [{
                                "type": "TextBlock",
                                "text": step.values.dottore,
                                "weight": "bolder",
                                "size": "large",
                                "wrap": true
                            },
                            {
                                "type": "TextBlock",
                                "text": "Specializzazione: " + dottore_visita.specializzazione,
                                "isSubtle": true
                            },
                            {
                                "type": "TextBlock",
                                "text": "Orario Visite: " + dottore_visita.orario_visite,
                                "isSubtle": true,
                                "spacing": "none"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Recapito Telefonico: " + dottore_visita.recapito,
                                "isSubtle": true,
                                "spacing": "none"
                            }
                        ]
                    }
                ]
            }]
        };
        const card = CardFactory.adaptiveCard(adaptivecard);
        const msg = MessageFactory.attachment(card);
        await step.context.sendActivity(msg);

        const query = await (collectionDoc.findOne({ info: step.values.dottore }));
        const visita = ((query.visita.filter(i => i.isActive == '0')).map(function(i) { return (i.giorno + i.data_visita + i.orario) }));

        //Controllo disponibilità di slot prenotabili
        if (visita.length == 0) {
            await step.context.sendActivity('Prenotazione non disponibile. ❌\n\nNon è stato possibile recuperare visite prenotabili. \n\nRiprova la settimana prossima!');
            return await step.endDialog();
        }

        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Scegli la data e l\'orario della visita.',
            choices: ChoiceFactory.toChoices(visita)
        });

    }

    async resumeStep(step) {
        step.values.orarioPrenotazione = step.result.value;

        const infoMedicalVisit = step.values;
        infoMedicalVisit.info = step.values.info;
        infoMedicalVisit.email = step.values.email;
        infoMedicalVisit.cellulare = step.values.cellulare;
        infoMedicalVisit.struttura = step.values.struttura;
        infoMedicalVisit.visitaSpecialistica = step.values.visitaSpecialistica;
        infoMedicalVisit.dottore = step.values.dottore;
        infoMedicalVisit.orarioPrenotazione = step.values.orarioPrenotazione;

        await step.context.sendActivity('Ecco il riepilogo delle informazioni da te inserite:');

        const resume =
            `Nome e Cognome: ${ infoMedicalVisit.info }\n\n` +
            `E-mail: ${ infoMedicalVisit.email }\n\n` +
            `Recapito Telefonico: ${ infoMedicalVisit.cellulare }\n\n` +
            `Struttura Sanitaria: ${ infoMedicalVisit.struttura }\n\n` +
            `Visita Specialistica: ${ infoMedicalVisit.visitaSpecialistica }\n\n` +
            `Dottore della visita: ${ infoMedicalVisit.dottore }\n\n` +
            `Data e ora: ${ infoMedicalVisit.orarioPrenotazione }`;
        await step.context.sendActivity(resume);

        return await step.prompt(CHOICE_PROMPT, 'Vuoi confermare la prenotazione?', ['Si', 'No']);
    }
    async sendInfoStep(step) {

        const infoMedicalVisit = step.values;
        infoMedicalVisit.info = step.values.info;
        infoMedicalVisit.email = step.values.email;
        infoMedicalVisit.cellulare = step.values.cellulare;
        infoMedicalVisit.struttura = step.values.struttura;
        infoMedicalVisit.visitaSpecialistica = step.values.visitaSpecialistica;
        infoMedicalVisit.dottore = step.values.dottore;
        infoMedicalVisit.orarioPrenotazione = step.values.orarioPrenotazione;

        const info = `${ infoMedicalVisit.info }`;
        const email = `${ infoMedicalVisit.email }`;
        const cellulare = `${ infoMedicalVisit.cellulare }`;
        const struttura = `${ infoMedicalVisit.struttura }`;
        const visita = `${ infoMedicalVisit.visitaSpecialistica }`;
        const dottore = `${ infoMedicalVisit.dottore }`;
        const orario = `${ infoMedicalVisit.orarioPrenotazione }`;
        var datetime = moment().format('DD/MM/YYYY HH:mm:ss');

        //Aggiungere 36 per event. errore
        const id = Math.random().toString().substring(2, 15);
        const qrcode_name = id + '.png'

        const query = await (collectionDoc.findOne({ info: dottore }));
        const codice = JSON.stringify((query.visita.filter(i => (i.giorno + i.data_visita + i.orario) == orario)).map(function(i) { return i.code })).replace(/[["\]]/g, '');
        const subject = "Prenotazione Visita medica: " + infoMedicalVisit.info + ' [MyHealthcareBot]';
        const object =
            'Salve ' + info + ', la tua prenotazione è stata confermata. Di seguito vengono riportate le informazioni relative alla tua prenotazione:' +
            '\n\nStruttura sanitaria scelta: ' + struttura + '\n\nVisita: ' + visita +
            '\n\nSpecialista: ' + dottore + '\n\nData e Ora stabilite: ' + orario +
            '\n\nCodice Coda: ' + codice +
            '\n\nNei pressi della struttura sanitaria scelta scansiona il seguente QR code sul totem per poter procedere con il pagamento del ticket medico e accedere all\'ambulatorio.\n\nSaluti da MyHealthcareBot.'

        if (step.result.value === 'Si' || step.result.value.toLowerCase().includes('s')) {

            //Controllo Concorrenza prenotazione
            const querySlot = await (collectionDoc.findOne({ info: infoMedicalVisit.dottore }));
            const isActive_check = await (querySlot.visita.filter(i => (i.giorno + i.data_visita + i.orario) == infoMedicalVisit.orarioPrenotazione)).map(function(i) { return i.isActive });

            if (isActive_check == '1') {
                await step.context.sendActivity('Mi dispiace, non sei riuscito a prenotare in tempo questo slot orario. ⌚\n\nRiprova a prenotare una visita scegliendo un\'altra data o orario.');
                return await step.replaceDialog(this.id);
            }

            step.context.sendActivity('Attendi il completamento dell\'operazione...');

            //QRcode generation
            const qrCode_hash = sha256(id + email);
            QRCode.toFile('./images/myhealthcare-' + qrcode_name, qrCode_hash);
            const qrcode_path = './myhealthcare-' + qrcode_name;

            //Connection and Storage with BlobStorage
            const connectionString = SA_CONNECTION_STRING;
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient('public');
            const blobclient = containerClient.getBlockBlobClient(qrcode_path);
            const path = "..\\MyHealthcareBot-src\\images\\myhealthcare-" + qrcode_name;


            let fileStream = fs.createReadStream(path);

            const blobOptions = {
                blobHTTPHeaders: {
                    blobContentType: 'image/png'
                }
            };
            blobclient.uploadStream(fileStream, undefined, undefined, blobOptions);

            var qrcode = 'https://' + STORAGE_ACCOUNT_NAME + '.blob.core.windows.net/public/myhealthcare-' + qrcode_name;

            var url = FUNCTION_ENDPOINT;
            var option = {
                method: 'post',
                url: url,
                params: {
                    email: email
                },
                data: {
                    subject: subject,
                    object: object,
                    attachment: qrcode
                }
            }

            const res = await axios(option);
            if (res.status = 200) {

                collectionDoc.updateOne({ "info": dottore }, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.code": codice }] });

                await step.context.sendActivity('Prenotazione effettuata con successo! ✅\n\nBuona Giornata ' + info);

                //Delete file
                await fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })

                const newVisitBooking = {
                    "info": info,
                    "email": email,
                    "recapito": cellulare,
                    "struttura_sanitaria": struttura,
                    "visita": visita,
                    "dottore": dottore,
                    "data": orario,
                    "codice": codice,
                    "data_orario_prenotazione": datetime,
                    "qrcode": qrcode
                }

                await collectionVisit.insertOne(newVisitBooking);

            } else {
                await step.context.sendActivity('Mi dispiace, non sono riuscito a concludere la prenotazione. 🛑');
            }

            return await step.endDialog();

        } else {
            await step.context.sendActivity('La tue informazioni non saranno inviate. 🛑');
            return await step.endDialog();
        }
    }
}

module.exports.VisitBookingDialog = VisitBookingDialog;
module.exports.VISIT_BOOKING_DIALOG = VISIT_BOOKING_DIALOG;