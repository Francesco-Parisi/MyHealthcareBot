const { TextPrompt } = require('botbuilder-dialogs');

module.exports.EmailPrompt = class EmailPrompt extends TextPrompt {
    constructor(dialogId) {
        super(dialogId, async(prompt) => {
            if (!prompt.recognized.succeeded) {
                return false;
            } else {
                const value = prompt.recognized.value;
                var mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;;

                if (!value.match(mailformat)) {
                    await prompt.context.sendActivity('Formato Errato! 🛑\n\nInserisci un\'E-mail valida.');
                    return false;
                } else {
                    return true;
                }
            }
        });
    }
};