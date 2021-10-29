const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({
    path: ENV_FILE
});

// Import required types from libraries
const { ActivityTypes, CardFactory, MessageFactory, InputHints } = require('botbuilder');
const { TextPrompt, ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const { LuisRecognizer } = require('botbuilder-ai');

const { ADMIN_PANEL_DIALOG, AdminPanelDialog } = require('./adminpanelDialog');
const { VISIT_BOOKING_DIALOG, VisitBookingDialog } = require('./visitbookingDialog');
const { INFO_DOCTOR_DIALOG, InfoDoctorDialog } = require('./infodoctorDialog');
const { INFO_HEALTH_FACILITIES_DIALOG, InfoHealthFacilityDialog } = require('./infohealthfacilitiesDialog');

const MAIN_DIALOG = 'MAIN_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const WELCOMED_USER = 'WELCOMES_USER_PROPERTY';

class MainDialog extends ComponentDialog {
    constructor(luisRecognizer, userState) {
        super(MAIN_DIALOG);
        this.luisRecognizer = luisRecognizer;
        this.userState = userState;
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new AdminPanelDialog(luisRecognizer));
        this.addDialog(new VisitBookingDialog(luisRecognizer));
        this.addDialog(new InfoHealthFacilityDialog(luisRecognizer));
        this.addDialog(new InfoDoctorDialog(luisRecognizer));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.welcomeStep.bind(this),
            this.messageStep.bind(this),
            this.choiceStep.bind(this),
            this.loopStep.bind(this)
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

    async welcomeStep(step) {
        const reply = {
            type: ActivityTypes.Message
        };
        const welcomeMessage = await this.welcomedUserProperty.get(step.context, false);
        if (welcomeMessage === false) {
            var card = CardFactory.thumbnailCard(
                'MyHealthcareBot ti dà il benvenuto! 🤖', [{
                    url: "http://www.myhealthcarebot.altervista.org/images/My-Healthcare-Bot.png"
                }], [], {
                    text: 'Ecco qualche informazione utile: \n\n' +
                        '1️⃣ Per avere tutte le informazioni che ti servono puoi chiedermi informazioni per una certa struttura, per conoscere le strutture presenti oppure i dottori operanti.\n\n' +
                        '2️⃣ Per poter prenotare correttamente una visita è richiesto l\'inserimento di dati personali validi.\n\n' +
                        '3️⃣ Se sei amministratore di una struttura sanitaria e devi accedere al pannello di controllo inserisci il comando "/login".\n\n' +
                        '4️⃣ Se qualcosa non è chiaro oppure hai problemi con le funzionalità presenti inserisci il comando "/help".\n\n',
                }
            );
            reply.attachments = [card];
            await step.context.sendActivity(reply)
            await this.welcomedUserProperty.set(step.context, true);

        }
        return await step.next();
    }
    async messageStep(step) {
        if (!this.luisRecognizer.isConfigured) {
            var messageText = 'LUIS non è configurato. Controlla il file .env';
            await step.context.sendActivity(messageText, null, InputHints.IgnoringInput);
            return await step.next();
        }
        var messageText = step.options.restartMsg ? step.options.restartMsg : 'Cosa posso fare per te?';
        const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await step.prompt(TEXT_PROMPT, {
            prompt: promptMessage
        });
    }

    async choiceStep(step) {
        const message = step.result;
        const luisResult = await this.luisRecognizer.executeLuisQuery(step.context);

        const reply = {
            type: ActivityTypes.Message
        };

        if (LuisRecognizer.topIntent(luisResult) === 'Info_Vesuvio') {

            var card = CardFactory.thumbnailCard(
                'Clinica Vesuvio', [{
                    url: '' //Image Url
                }], [{
                    type: 'openUrl',
                    title: 'Vai al sito',
                    value: 'https://www.clinicavesuvio.it/'
                }], {
                    text: 'Sede: Via Luigi Volpicella 493, 80147 Napoli (NA)\n\n' +
                        'E-mail: info@clinicavesuvio.com\n\n' +
                        'Orario Apertura: Dal lunedì al venerdì dalle ore 7.00 alle ore 19.00\n\n' +
                        'La nostra Clinica Vesuvio è un centro di diagnostica per immagini, esami clinici e analisi mediche convenzionato con il S.S.N. ' +
                        'Siamo anche un centro specialistico di chirurgia, otorinolaringoiatria e cardiologia con certificazione di qualità ISO 9001:2000.' +
                        '\n\nVisite Specialistiche: Cardiologia, Pediatria.'
                }
            );
            reply.attachments = [card];
            await step.context.sendActivity(reply)
            return await step.replaceDialog(this.id);

        } else if (LuisRecognizer.topIntent(luisResult) === 'Info_La_Madonnina') {
            var card = CardFactory.thumbnailCard(
                'Casa di Cura La Madonnina', [{
                    url: '' //Image Url
                }], [{
                    type: 'openUrl',
                    title: 'Vai al sito',
                    value: 'http://www.casadicuralamadonnina.it/'
                }], {
                    text: 'Sede: Via Roma 29, 80040 San Gennaro Vesuviano (NA)\n\n' +
                        'E-mail: info@casadicuralamadonnina.it\n\n' +
                        'Orario Apertura: Tutti i giorni dalle ore 7:00 alle 21:00\n\n' +
                        'La Casa di Cura La Madonnina è una struttura sanitaria polispecialistica privata che dal 1967 è punto di riferimento nella Medicina Generale.' +
                        ' Con 60 posti letto accreditati con il SSN e servizi ambulatoriali esterni rappresenta una della più importanti case di cura della Provincia di Napoli.' +
                        '\n\nVisite Specialistiche: Cardiologia Pediatrica, Ortopedia.'
                }
            );
            reply.attachments = [card];
            await step.context.sendActivity(reply)
            return await step.replaceDialog(this.id);

        } else if (LuisRecognizer.topIntent(luisResult) === 'Info_Ascione') {
            var card = CardFactory.thumbnailCard(
                'Centro Medico Ascione', [{
                    url: '' //Image Url
                }], [{
                    type: 'openUrl',
                    title: 'Vai al sito',
                    value: 'http://www.centromedicoascione.it/'
                }], {
                    text: 'Sede: Via Nazionale 717B, 80059 Torre del Greco (NA)\n\n' +
                        'E-mail: info@centromedicoascione.com\n\n' +
                        'Orario Apertura: Tutti i giorni dalle ore 8:00 alle 19:00\n\n' +
                        'Il Centro Medico Ascione S.r.l. nasce dalla pluridecennale esperienza del Centro Polidiagnostico Dr.i Ascione e Pannella S.r.l. ' +
                        'operante nel settore della diagnostica strumentale dal 1978.' +
                        'Tutti i processi del Centro sono certificati secondo le norme ISO 9001:2000.' +
                        '\n\nVisite Specialistiche: Chirurgia Plastica, Oculistica.'
                }
            );
            reply.attachments = [card];
            await step.context.sendActivity(reply)
            return await step.replaceDialog(this.id);

        } else if (LuisRecognizer.topIntent(luisResult) === 'Info_Trusso') {
            var card = CardFactory.thumbnailCard(
                'Clinica Trusso', [{
                    url: '' //Image Url
                }], [{
                    type: 'openUrl',
                    title: 'Vai al sito',
                    value: 'https://www.clinicatrusso.it/'
                }], {
                    text: 'Sede: Via San Giovanni Bosco 3, 80044 Ottaviano (NA)\n\n' +
                        'E-mail: info@clinicatrusso.it\n\n' +
                        'Orario Apertura: Dal lunedì al venerdì dalle ore 7.00 alle ore 19.00 e il sabato dalle ore 8.00 alle ore 19.00\n\n' +
                        'La Clinica Polispecialistica Trusso opera seguendo un percorso che coniuga umanità nell\'accoglienza e nell\'assistenza, rigore professionale e ' +
                        'attenzione verso l\'innovazione in medicina. In una struttura caratterizzata da aspetti tecnologici e architettonici avanzati.' +
                        '\n\nVisite Specialistiche: Urologia, Dermatologia.'
                }
            );
            reply.attachments = [card];
            await step.context.sendActivity(reply)
            return await step.replaceDialog(this.id);

        } else if (LuisRecognizer.topIntent(luisResult) === 'Strutture') {
            return await step.beginDialog(INFO_HEALTH_FACILITIES_DIALOG);

        } else if (LuisRecognizer.topIntent(luisResult) === 'Prenotazione_Visita') {
            return await step.beginDialog(VISIT_BOOKING_DIALOG);

        } else if (LuisRecognizer.topIntent(luisResult) === 'Dottori') {
            return await step.beginDialog(INFO_DOCTOR_DIALOG);

        } else if (message.localeCompare("/login") == 0) {
            return await step.beginDialog(ADMIN_PANEL_DIALOG);

        } else if (message.localeCompare("/start") == 0) {
            await this.welcomedUserProperty.set(step.context, false);
            return await step.replaceDialog(this.id);

        } else if (message.localeCompare("/help") == 0 || LuisRecognizer.topIntent(luisResult) === 'Utilities_Help') {
            var info = {
                "channelData": [{
                    "method": "sendMessage",
                    "parameters": {
                        "text": "<b>MyHealthcareBot </b> mette a disposizione diverse funzioni, anche interagendo in linguaggio naturale, tra cui: \n\n" +
                            "<b> ● Strutture Sanitarie 🏥 </b>: Vengono mostrate tutte le strutture sanitare che aderiscono a tale iniziativa, permettendo all\'utente di poter visualizzare tutte le informazioni necessarie per raggiungere la struttura scelta oppure per prenotare una visita. Per visualizzare le strutture presenti puoi interagire con me chiedendomi informazioni relative alle Strutture Sanitarie.\n\n" +
                            "<b> ● Dottori 👨‍⚕️ </b>: Hai a disposizione per ogni struttura sanitaria tutte le informazioni relative ai dottori. Questo permette di conoscere non solo gli orari di visita di uno specialista ma anche il recapito telefonico per un consulto e le patologie che vengono trattate. Per visualizzare le informazioni basta chiedermi informazioni relative ai Dottori, scegliere la struttura sanitaria di interesse e di conseguenza verrà mostrata la scheda personale di ogni dottore operante.\n\n" +
                            "<b> ● Prenotazione Visita Specialistica ☎️ </b>: Non devi fare altro che inserire le informazioni personali quando richieste, scegliere la struttura in cui intendi effettuare la visita, scegliere il tipo di visita, scegliere uno degli slot liberi per la prenotazione e confermare le informazioni inserite. Riceverai una mail con le informazioni relative alla visita prenotata e un QRcode da scannerizzare in struttura per proseguire con il pagamento del ticket e l\'accesso in ambulatorio. \n\n" +
                            "Hai ancora dubbi? 🤔\n\n" +
                            "Contattaci via email a aiuto-botmyhealthcare@gmail.com'\n\n",
                        "parse_mode": "HTML"
                    }
                }]
            }
            await step.context.sendActivity(info);
            return await step.replaceDialog(this.id);

        } else {
            await step.context.sendActivity('Hai digitato un comando che non conosco. 🛑 Riprova!')
            return await step.replaceDialog(this.id);
        }
    }

    async loopStep(step) {
        return await step.replaceDialog(this.id);
    }
}

module.exports.MainDialog = MainDialog;
module.exports.MAIN_DIALOG = MAIN_DIALOG;