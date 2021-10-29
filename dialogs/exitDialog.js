// Import required types from libraries
const { InputHints } = require('botbuilder');
const { ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');

class ExitDialog extends ComponentDialog {
    constructor(id) {
        super(id);
    }

    async onBeginDialog(innerDc, options) {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onBeginDialog(innerDc, options);
    }

    async onContinueDialog(innerDc) {
        const result = await this.interrupt(innerDc);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(innerDc);
    }

    async interrupt(innerDc) {

        if (innerDc.context.activity.text) {
            const text = innerDc.context.activity.text.toLowerCase();

            if (text.localeCompare("/help") == 0 || text === 'help') {
                const helpMessageText = 'Se vuoi annullare un\'operazione scrivi "esci" oppure "annulla", altrimenti continua con l\'inserimento dei dati.';
                await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                return { status: DialogTurnStatus.waiting };

            } else if (text.toLowerCase() === 'esci') {
                const cancelMessageText = 'Sono uscito. ❌';
                await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                return await innerDc.cancelAllDialogs();

            } else if (text.toLowerCase() === 'annulla') {
                const cancelMessageText = 'Operazione annullata. ❌';
                await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                return await innerDc.cancelAllDialogs();
            }

        }
    }
}


module.exports.ExitDialog = ExitDialog;