// Import required types from libraries
const { InputHints, ActivityTypes } = require('botbuilder');
const { ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');

class LogoutDialog extends ComponentDialog {
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
        if (innerDc.context.activity.type === ActivityTypes.Message) {
            const text = innerDc.context.activity.text.toLowerCase();

            if (text.localeCompare("/help") == 0) {
                const helpMessageText = 'Una volta completato il login da sito esterno, riceverai un codice da inserire all\'interno del bot. A questo punto potrai accedere alle funzionalità a te dedicate.\n\nSe vuoi uscire dall\'area admin scrivi "esci", altrimenti continua con l\'inserimento dei dati.';
                await innerDc.context.sendActivity(helpMessageText, helpMessageText, InputHints.ExpectingInput);
                return { status: DialogTurnStatus.waiting };

            } else if (text.toLowerCase() === 'esci') {
                const cancelMessageText = 'Sono uscito dall\'area admin. 🔓';
                await innerDc.context.sendActivity(cancelMessageText, cancelMessageText, InputHints.IgnoringInput);
                return await innerDc.cancelAllDialogs();
            }
        }
    }
}

module.exports.LogoutDialog = LogoutDialog;