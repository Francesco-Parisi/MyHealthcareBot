const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({
    path: ENV_FILE
});

//Mongo Configuration
const config = require('../config');
const { collectionAdmin, collectionOtp } = config;

// Import required types from libraries
const { ActionTypes, ActivityTypes, MessageFactory, CardFactory } = require('botbuilder');
const { DialogSet, DialogTurnStatus, TextPrompt, ChoicePrompt, NumberPrompt, WaterfallDialog, ComponentDialog, ChoiceFactory } = require('botbuilder-dialogs');

const { LuisRecognizer } = require('botbuilder-ai');
const { LogoutDialog } = require('./logoutDialog');

const { ADMIN_BOOKING_DIALOG, AdminBookingDialog } = require('./adminbookingDialog')

const ADMIN_PANEL_DIALOG = 'ADMIN_PANEL_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';

class AdminPanelDialog extends LogoutDialog {
    constructor(luisRecognizer, userState) {
        super(ADMIN_PANEL_DIALOG);

        this.luisRecognizer = luisRecognizer;
        this.userState = userState;

        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT));
        this.addDialog(new AdminBookingDialog(luisRecognizer));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.loginStep.bind(this),
            this.otpStep.bind(this),
            this.otpVerifyStep.bind(this),
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

    //Mostra la card di login
    async loginStep(step) {
        const reply = {
            type: ActivityTypes.Message
        };

        var card = CardFactory.thumbnailCard(
            'Login Area 🔒', [{
                url: "http://www.myhealthcarebot.altervista.org/images/fascicolo-sanitario.jpg"
            }], [{
                type: 'openUrl',
                title: 'Login',
                value: 'https://myhealthcarelogin.azurewebsites.net/',

            }], {
                text: 'Premi sul pulsante Login per autenticarti al bot.',
            }
        );
        reply.attachments = [card];
        await step.context.sendActivity(reply)

        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Completato il login?',
            choices: ChoiceFactory.toChoices(["Si ✅"])
        });

    }

    async otpStep(step) {

        return await step.prompt(NUMBER_PROMPT, 'Inserisci il codice OTP contenuto nell\'email appena inviata alla tua casella di posta elettronica. 📧');
    }


    async otpVerifyStep(step) {
        step.values.otp = step.result;

        const authentication = step.values;
        authentication.otp = step.values.otp;
        const otp = `${ authentication.otp }`;

        const reply = {
            type: ActivityTypes.Message
        };
        const query = await (collectionOtp.findOne({ otp: otp }));

        if (query != null) {
            await step.context.sendActivity('Login effettuato con successo. ✅');
            const admin = await (collectionAdmin.findOne({ email: query.email }));
            console.log(admin);
            var card = CardFactory.thumbnailCard(
                'Salve ' + query.nome + ' 🗃️ 🤖', [{
                    url: admin.cover
                }], [], {
                    text: 'In quest\'area puoi visualizzare le Prenotazioni della Struttura o Annullare una Visita.\n\n' +
                        'Scrivi "/help" in qualsiasi momento per visualizzare le opzioni disponibili dell\'area admin.'
                }
            );

            reply.attachments = [card];
            await step.context.sendActivity(reply)
            await collectionOtp.deleteOne(query);

            const conversationId = step.context.activity.conversation.id;

            var newvalue = { $set: { conversation: conversationId } };
            await collectionAdmin.updateOne(admin, newvalue);
            return await step.beginDialog(ADMIN_BOOKING_DIALOG);
        } else {
            await step.context.sendActivity('Codice OPT Errato! 🛑\n\Inserisci il codice ricevuto via e-mail.');
            return await step.replaceDialog(this.id);
        }
    }

}

module.exports.AdminPanelDialog = AdminPanelDialog;
module.exports.ADMIN_PANEL_DIALOG = ADMIN_PANEL_DIALOG;