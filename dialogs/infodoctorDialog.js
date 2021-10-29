// Import required types from libraries
const { ActionTypes, ActivityTypes, CardFactory } = require('botbuilder');
const { TextPrompt, DialogSet, DialogTurnStatus, WaterfallDialog, AttachmentPrompt } = require('botbuilder-dialogs');

const { LuisRecognizer } = require('botbuilder-ai');
const { ExitDialog } = require('./exitDialog');

const INFO_DOCTOR_DIALOG = 'INFO_DOCTOR_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';

class InfoDoctorDialog extends ExitDialog {
    constructor(luisRecognizer, userState) {
        super(INFO_DOCTOR_DIALOG);

        this.luisRecognizer = luisRecognizer;
        this.userState = userState;

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.structStep.bind(this),
            this.eventStep.bind(this)
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

    async structStep(step) {

        const reply = {
            type: ActivityTypes.Message
        };
        const buttons = [{
                type: ActionTypes.ImBack,
                title: 'Clinica Vesuvio',
                value: 'Clinica Vesuvio'
            },
            {
                type: ActionTypes.ImBack,
                title: 'Casa di Cura La Madonnina',
                value: 'Casa di Cura La Madonnina'
            },
            {
                type: ActionTypes.ImBack,
                title: 'Centro Medico Ascione',
                value: 'Centro Medico Ascione'
            },
            {
                type: ActionTypes.ImBack,
                title: 'Clinica Trusso',
                value: 'Clinica Trusso'
            }
        ];

        const card = CardFactory.heroCard(
            undefined,
            undefined,
            buttons, {
                text: 'Health Facilities Menu'
            }
        );
        reply.attachments = [card];
        await step.context.sendActivity(reply);

        return await step.prompt(TEXT_PROMPT, {
            prompt: 'Seleziona una struttura sanitaria dal menu per visualizzare i dottori presenti.'
        });
    }

    async eventStep(step) {
        const reply = {
            type: ActivityTypes.Message
        };

        const luisResult = await this.luisRecognizer.executeLuisQuery(step.context);

        const message = step.result;
        if (message === 'Clinica Vesuvio' || LuisRecognizer.topIntent(luisResult) === 'Clinica_Vesuvio') {
            var cardDott1 = CardFactory.thumbnailCard(
                'Dott. Vito di Palma', [{
                    url: 'http://www.myhealthcarebot.altervista.org/images/Baldi-Antonio.jpg'
                }], [], {
                    subtitle: 'Specializzazione: Cardiologia\n\nTelefono: 349 733 1388\n\nOrario Visite: Lunedi-Giovedi dalle 9:00 alle 12:00',
                    text: 'Sono un cardiologo con particolare interesse\nper la Cardiologia Interventistica.' +
                        'Laureato e Specializzato presso l\'Università Federico II di Napoli.Subito dopo la Specializzazione ' +
                        'ho intrapreso una collaborazione triennale dal 2015 al 2018 presso la Clinica Mediterranea di Napoli.' +
                        'Successivamente ho avuto incarichi di ruolo come Dirigente Medico di I livello presso i presidi ospedalieri' +
                        'Umberto I di Nocera Inferiore e presso il San Giovanni Bosco di Napoli.Dal giugno 2019 svolgo la mia attività ' +
                        'come Dirigente Medico di I livello presso l\'Ospedale Santa Maria delle grazie di Pozzuoli.' +
                        '\n\nPatologie Trattate: Insufficienza cardiaca,Ipertensione e Aritmia.'
                }
            );
            reply.attachments = [cardDott1];
            await step.context.sendActivity(reply);

            var cardDott2 = CardFactory.thumbnailCard(
                'Dott. Sergio Oliva', [{
                    url: 'http://www.myhealthcarebot.altervista.org/images/Dott-De-Simoni-Pierangelo.jpg'
                }], [], {
                    subtitle: 'Specializzazione:  Pediatria\n\nTelefono: 081 1929 5488\n\nOrario Visite: Martedì-Venerdì dalle 9:00 alle 12:00',

                    text: 'Sono un medico con oltre trenta anni di esperienza in Pediatria, Allergologia, Omeopatia ed omotossicologia,' +
                        'Agopuntura e medicina integrata, Posturologia con esame con pedana stabilometrica.' +
                        'Mi occupo del paziente a 360 gradi avvalendomi anche di tecnologie diagnostiche e terapeutiche \'avanguardia.' +
                        '\n\nPatologie Trattate:Asma, Disturbi Della Crescita, Allergia alimentare, Dermatite atopica, Orticaria, Rinite, Allergia.'
                }
            );
            reply.attachments = [cardDott2];
            await step.context.sendActivity(reply);
        } else if (message === 'Casa di Cura La Madonnina' || LuisRecognizer.topIntent(luisResult) === 'Casa_di_Cura_La_Madonnina') {
            var cardDott3 = CardFactory.thumbnailCard(
                'Dott.ssa Beniamina Giordano', [{
                    url: 'http://www.myhealthcarebot.altervista.org/images/Bernardini-Maria-Luisa.jpg',
                    size: "medium"
                }], [], {
                    subtitle: 'Specializzazione: Cardiologia Pediatrica\n\nTelefono: 081 1928 8378\n\nOrario Visite: Lunedì-Mercoledì dalle 15:00 alle 18:00',
                    text: 'Specializzata in Cardiologia Pediatrica.Laureata in Medicina e chirurgia nel 1981, si è specializzata in Cardiologia ' +
                        'presso l\'Università degli Studi di Milano nel 1983, conseguendo una seconda specializzazione in Ginecologia e Ostetricia nel 1991.' +
                        'È esperta nel trattamento delle cardiopatie congenite, dei soffi cardiaci e delle aritmie nei bambini. Inoltre, si occupa anche delle future' +
                        'mamme affette da ipertensione in gravidanza.' +
                        '\n\nPatologie Trattate: Insufficienza cardiaca, Ipertensione, Aritmia, Dolore toracico, Cardiopalmo.'
                }
            );
            reply.attachments = [cardDott3];
            await step.context.sendActivity(reply);

            var cardDott4 = CardFactory.thumbnailCard(
                'Dott. Ennio Flores', [{
                    url: 'http://www.myhealthcarebot.altervista.org/images/stocchi-ovidio.jpg'
                }], [], {
                    subtitle: 'Specializzazione: Ortopedia\n\nTelefono: 081 1928 9010\n\nOrario Visite: Martedì-Giovedì dalle 10:00 alle 13:00',
                    text: 'Specializzato in Ortopedia e Traumatologia presso la Prima Università di Napoli con voto 70/70 ' +
                        'nell\'anno 1993. Ha avuto esperienza lavorativa per circa 4 anni presso il CTO di Napoli, successivamente ' +
                        'nell\' anno 2000 Dirigente Medico presso PO di Solofra (AVELLINO) reparto di Ortopedia e Traumatologia, ' +
                        'occupandosi prevalentemente della Chirurgia della Mano avendo frequentato per circa otto anni in Aggiornamento' +
                        ' Professionale il reparto del Vecchio Pellegrini di Napoli.' +
                        '\n\nPatologie Trattate: Dorsopatia, Mialgia, Artrite, Articolazione, Torcicollo, Cifosi.'
                }
            );
            reply.attachments = [cardDott4];
            await step.context.sendActivity(reply);

        } else
        if (message === 'Centro Medico Ascione' || LuisRecognizer.topIntent(luisResult) === 'Centro_Medico_Ascione') {
            var cardDott5 = CardFactory.thumbnailCard(
                'Dott. Giuseppe Stabile', [{
                    url: 'http://www.myhealthcarebot.altervista.org/images/manenti-marco.jpg'
                }], [], {
                    subtitle: 'Specializzazione: Chirurgia Plastica\n\nTelefono: 081 717 8111\n\nOrario Visite: Martedì-Mercoledì dalle 16:00 alle 18:00"',
                    text: 'Il Dott. Carmine Andrea Nunziata è Specialista in Chirurgia Plastica, Ricostruttiva ed Estetica.' +
                        'Laureato in Medicina e Chirurgia presso l\'Università Federico II di Napoli nel 1995, si è specializzato nel' +
                        ' 2001 ed ha completato la sua formazione con numerosi corsi inter-universitari ed un Dottorato di Ricerca in Chirurgia' +
                        ' Maxillo-Facciale nel 2008.' +
                        '\n\nPatologie Trattate: Blefaroplastica, Rinoplastica, Lipofilling, Mastoplastica additiva, Ricostruzione mammaria, Dermochirurgia.'
                }
            );
            reply.attachments = [cardDott5];
            await step.context.sendActivity(reply);

            var cardDott6 = CardFactory.thumbnailCard(
                'Dott. Vincenzo Napolitano', [{
                    url: 'http://www.myhealthcarebot.altervista.org/images/Dott-Di-placido-Vincenzo.jpg'
                }], [], {
                    subtitle: 'Specializzazione: Oculistica\n\nTelefono: 081 1928 9064\n\nOrario Visite: Martedì-Mercoledì dalle 9:00 alle 12:00',
                    text: 'Specialista in Oftalmologia. Responsabile del Servizio glaucoma ' +
                        'presso la Clinica Mediterranea di Napoli. È stato Responsabile del Servizio di registrazione dei Movimenti ' +
                        'Oculari e aiuto del Servizio di Elettrofisiologia della Visione presso il Dipartimento di Oftalmologia della Facoltà ' +
                        'di Medicina e Chirurgia dell\'Università Federico II di Napoli. È stato Surgical Consulant per la sperimentazione clinica ' +
                        'delle lentine intraoculari dopo l\'intervento di cataratta con microincisione.' +
                        '\n\nPatologie Trattate:  Cataratta, Chirurgia laser, Chirurgia refrattiva, Glaucoma, Lenti intraoculari, Neuroftalmologia.'
                }
            );
            reply.attachments = [cardDott6];
            await step.context.sendActivity(reply);

        } else if (message === 'Clinica Trusso' || LuisRecognizer.topIntent(luisResult) === 'Clinica_Trusso') {
            var cardDott7 = CardFactory.thumbnailCard(
                'Dott. Giovanni Grimaldi ', [{
                    url: 'http://www.myhealthcarebot.altervista.org/images/Coculla_Marco_Holos3m.jpg'
                }], [], {
                    subtitle: 'Specializzazione: Urologia\n\nTelefono: 081 455 1730\n\nOrario Visite: Lunedì-Venerdì dalle 15:00 alle 18:00',
                    text: 'Mi sono laureato nel 2010 in Medicina e Chirurgia presso la Seconda Università degli Studi di Napoli con il massimo dei voti,' +
                        ' lode e plauso della commissione esaminatrice e tesi in urologia sul trattamento percutaneo della calcolosi urinaria.' +
                        '\n\nPatologie Trattate: Calcolosi Renale, Cistite, Cistocele, Sterilità, Disfunzione erettile, Prostatite, Tumore del testicolo.'
                }
            );
            reply.attachments = [cardDott7];
            await step.context.sendActivity(reply);

            var cardDott8 = CardFactory.thumbnailCard(
                'Dott.ssa Milena Cappello', [{
                    url: 'http://www.myhealthcarebot.altervista.org/images/morganti-milena.jpg'
                }], [], {
                    subtitle: 'Specializzazione: Dermatologia\n\nTelefono: 081 1928 8067\n\nOrario Visite: Lunedì-Giovedì dalle 10:00 alle 12:00',
                    text: 'Laurea Magistrale in Medicina e Chirurgia con votazione finale 110 e lode presso Università degli Studi di NAPOLI' +
                        'Federico II con la Tesi sperimentale dal titolo "Psoriasi e melanogenesi: possibile relazione protettiva".' +
                        'Abilitazione all\'esercizio della professione di Medico-Chirurgo presso Ordine dei Medici Chirurghi e degli Odontoiatri' +
                        'di Caserta. Specializzazione in Dermatologia e Venereologia presso Università degli Studi di NAPOLI Federico II.' +
                        '\n\nPatologie Trattate:  Verruche, Acne, Alopecia, Dermatite atopica, Psoriasi, Acne rosacea, Herpes zoster, Micosi.'
                }
            );
            reply.attachments = [cardDott8];
            await step.context.sendActivity(reply);

        } else {
            reply.text = 'Hai digitato un comando che non conosco. 🛑 Riprova!';
            await step.context.sendActivity(reply)
        }

        return await step.endDialog();
    }

}

module.exports.InfoDoctorDialog = InfoDoctorDialog;
module.exports.INFO_DOCTOR_DIALOG = INFO_DOCTOR_DIALOG;