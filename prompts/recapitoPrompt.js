const { TextPrompt } = require('botbuilder-dialogs');

module.exports.RecapitoPrompt = class RecapitoPrompt extends TextPrompt {
    constructor(dialogId) {
        super(dialogId, async(prompt) => {
            if (!prompt.recognized.succeeded) {
                return false;
            } else {
                const value = prompt.recognized.value;
                var phoneformat = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

                if (!value.match(phoneformat)) {
                    await prompt.context.sendActivity('Formato Errato! 🛑\n\nInserisci un recapito valido.');
                    return false;
                } else {
                    return true;
                }
            }
        });
    }
};