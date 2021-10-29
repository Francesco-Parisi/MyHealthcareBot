const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({
    path: ENV_FILE
});

//Mongo Configuration
const config = require('../config');

// Import required types from libraries
const { collectionAdmin, collectionDoc, collectionOtp, collectionVisit } = config;
const { ActionTypes, MessageFactory, CardFactory } = require('botbuilder');
const { DialogSet, DialogTurnStatus, TextPrompt, ChoicePrompt, ChoiceFactory, NumberPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { LuisRecognizer } = require('botbuilder-ai');

const { LogoutDialog } = require('./logoutDialog');

const ADMIN_BOOKING_DIALOG = 'ADMIN_BOOKING_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';

class AdminBookingDialog extends LogoutDialog {
    constructor(luisRecognizer, userState) {
        super(ADMIN_BOOKING_DIALOG);

        this.luisRecognizer = luisRecognizer;
        this.userState = userState;

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.viewMenuStep.bind(this),
            this.displayFunctionStep.bind(this),
            this.doctorChoiceStep.bind(this),
            this.visitChoiceStep.bind(this),
            this.resumeStep.bind(this),
            this.cancelVisitStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async run(context, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async viewMenuStep(step) {

        return await step.prompt(CHOICE_PROMPT, 'Seleziona una delle funzioni presenti.', ['Annulla Visita', 'Prenotazioni']);

    }

    async displayFunctionStep(step) {
        const option = step.result.value;
        const luisResult = await this.luisRecognizer.executeLuisQuery(step.context);

        const admin = await (collectionAdmin.findOne({ conversation: step.context.activity.conversation.id }));
        const email = admin.email;

        if (option.localeCompare("/login") == 0) {
            await step.context.sendActivity('É già stato effettuato il login! 🔒\n\nContinua con una delle funzioni presenti o digita "esci" per effettuare il logout.');
            return await step.replaceDialog(this.id);

        } else if (option === 'Annulla Visita' || LuisRecognizer.topIntent(luisResult) === 'Annulla_Visita') {
            const admin_struttura = await (collectionAdmin.findOne({ email: email }));
            const struttura = await ((collectionDoc.find({ clinica: admin_struttura.clinica })).toArray());
            const dottore = struttura.map(function(i) { return i.info });

            const card = CardFactory.heroCard(
                undefined, undefined, dottore, {
                    text: 'Dottori della Struttura Sanitaria',
                }
            );
            const message = MessageFactory.attachment(card);
            await step.context.sendActivity(message);
            return await step.next();

        } else if (option === 'Prenotazioni' || LuisRecognizer.topIntent(luisResult) === 'Pannello_Prenotazioni') {
            const query = await (collectionAdmin.findOne({ email: email }));
            const clinica = await (collectionVisit.find({ struttura_sanitaria: query.clinica }).toArray());

            if (clinica.length < 1) {
                await step.context.sendActivity('Non è ancora presente alcuna prenotazione. ❌ Riprova più tardi!');
            }
            for (var i = 0; i < clinica.length; i++) {
                var adaptivecard = {
                    "type": "AdaptiveCard",
                    "version": "1.0",
                    "body": [{
                        "type": "ColumnSet",
                        "columns": [{
                                "type": "Column",
                                "width": "large",
                                "items": [{
                                    "type": "Image",
                                    "url": clinica[i].qrcode,
                                    "size": "large",
                                    "style": "compact"
                                }]
                            },
                            {
                                "type": "Column",
                                "width": "300px",
                                "items": [{
                                        "type": "TextBlock",
                                        "text": clinica[i].info,
                                        "weight": "bolder",
                                        "size": "small",
                                        "wrap": true
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Email: " + clinica[i].email,
                                        "isSubtle": true,
                                        "size": "small",
                                        "spacing": "none"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Recapito Telefonico: " + clinica[i].recapito,
                                        "isSubtle": true,
                                        "size": "small",
                                        "spacing": "none"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Visita: " + clinica[i].visita,
                                        "isSubtle": true,
                                        "size": "small",
                                        "spacing": "none"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Specialista: " + clinica[i].dottore,
                                        "isSubtle": true,
                                        "size": "small",
                                        "spacing": "none"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Data e Orario visita: " + clinica[i].data,
                                        "isSubtle": true,
                                        "size": "small",
                                        "spacing": "none"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Codice Prenotazione: " + clinica[i].codice,
                                        "isSubtle": true,
                                        "size": "small",
                                        "spacing": "none"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "Effettuata il " + clinica[i].data_orario_prenotazione,
                                        "isSubtle": true,
                                        "size": "small",
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
            }

            return await step.replaceDialog(this.id);

        } else {
            await step.context.sendActivity('Hai digitato un comando che non conosco. 🛑 Riprova!');
            return await step.replaceDialog(this.id);
        }

    }

    async doctorChoiceStep(step) {

        return await step.prompt(TEXT_PROMPT, 'Seleziona uno dei dottori presenti.');

    }

    async visitChoiceStep(step) {
        step.values.dottore = step.result;

        const admin = await (collectionAdmin.findOne({ conversation: step.context.activity.conversation.id }));
        const email = admin.email;

        const admin_struttura = await (collectionAdmin.findOne({ email: email }));
        const struttura = await ((collectionDoc.find({ clinica: admin_struttura.clinica })).toArray());
        const dottori = struttura.map(function(i) { return i.info });

        if (dottori.includes(step.values.dottore)) {

            const clinica = await (collectionDoc.findOne({ info: step.values.dottore }));
            const orario = ((clinica.visita.filter(i => i.isActive == '0')).map(function(i) { return (i.giorno + i.data_visita + i.orario) }));

            //Controllo disponibilità di slot visite
            if (orario.length == 0) {
                await step.context.sendActivity('Visite Terminate. ❌\n\nNon è stato possibile recuperare visite da annullare!');
                return await step.replaceDialog(this.id);
            }

            return await step.prompt(CHOICE_PROMPT, {
                prompt: 'Scegli la data e l\'orario della visita da annullare.',
                choices: ChoiceFactory.toChoices(orario)
            });

        } else if (step.values.dottore.localeCompare("/login") == 0) {
            await step.context.sendActivity('É già stato effettuato il login! 🔒\n\nContinua con una delle funzioni presenti o digita "esci" per effettuare il logout.');
            return await step.replaceDialog(this.id);

        } else {
            await step.context.sendActivity('Hai digitato una dottore non presente. 🛑 Riprova!');
            return await step.replaceDialog(this.id);
        }
    }

    async resumeStep(step) {
        step.values.orario = step.result.value;

        return await step.prompt(CHOICE_PROMPT, 'Confermi l\'annullamento della visita scelta?', ['Si', 'No']);
    }

    async cancelVisitStep(step) {

        const query = await (collectionDoc.findOne({ info: step.values.dottore }));
        const codice = JSON.stringify((query.visita.filter(i => (i.giorno + i.data_visita + i.orario) == step.values.orario)).map(function(i) { return i.code })).replace(/[["\]]/g, '');

        if (step.result.value === 'Si' || step.result.value.toLowerCase().includes('s')) {
            collectionDoc.updateOne({ "info": step.values.dottore }, { $set: { "visita.$[elem].isActive": "1" } }, { arrayFilters: [{ "elem.code": codice }] });
            await step.context.sendActivity('Visita annullata con successo! ✅');
            return await step.replaceDialog(this.id);

        } else {
            await step.context.sendActivity('La visita scelta non è stata annullata. 🛑');
            return await step.replaceDialog(this.id);
        }
    }
}

module.exports.AdminBookingDialog = AdminBookingDialog;
module.exports.ADMIN_BOOKING_DIALOG = ADMIN_BOOKING_DIALOG;