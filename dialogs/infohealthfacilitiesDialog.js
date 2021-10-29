// Import required types from libraries
const { AttachmentLayoutTypes, CardFactory } = require('botbuilder');
const { DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');

const { ExitDialog } = require('./exitDialog');

const INFO_HEALTH_FACILITIES_DIALOG = 'INFO_HEALTH_FACILITIES_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

class InfoHealthFacilityDialog extends ExitDialog {
    constructor(luisRecognizer, userState) {
        super(INFO_HEALTH_FACILITIES_DIALOG);

        this.luisRecognizer = luisRecognizer;
        this.userState = userState;

        // Adding used dialogs
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.showHealthFacilitiesStep.bind(this)
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

    async showHealthFacilitiesStep(step) {
        await step.context.sendActivity({
            attachments: [
                this.clinicaVesuvioCard(),
                this.casaLaMadonninaCard(),
                this.centroAscioneCard(),
                this.clinicaTrussoCard()
            ],
            attachmentLayout: AttachmentLayoutTypes.Carousel

        })

        return await step.endDialog();
    }

    clinicaVesuvioCard() {
        return CardFactory.thumbnailCard(
            'Clinica Vesuvio', [{
                url: 'http://www.myhealthcarebot.altervista.org/images/Case-Clinica-Vesuvio-Napoli-001-480w.webp'
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
    }

    casaLaMadonninaCard() {
        return CardFactory.thumbnailCard(
            'Casa di Cura La Madonnina', [{
                url: 'http://www.myhealthcarebot.altervista.org/images/logo_la_madonnina.png'
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
    }

    centroAscioneCard() {
        return CardFactory.thumbnailCard(
            'Centro Medico Ascione', [{
                url: 'http://www.myhealthcarebot.altervista.org/images/Centro-Medico-Ascione.png'
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
    }

    clinicaTrussoCard() {
        return CardFactory.thumbnailCard(
            'Clinica Trusso', [{
                url: 'http://www.myhealthcarebot.altervista.org/images/logo-clinica-trusso.png'
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
    }
}

module.exports.InfoHealthFacilityDialog = InfoHealthFacilityDialog;
module.exports.INFO_HEALTH_FACILITIES_DIALOG = INFO_HEALTH_FACILITIES_DIALOG;