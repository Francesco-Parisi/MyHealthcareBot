var nodemailer = require('nodemailer');

module.exports = async function(context, req) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '', // your GMail email address 
            pass: '' // your Gmail password
        }
    });

    const email = (req.query.email || (req.body && req.body.email));
    const subject = (req.query.subject || (req.body && req.body.subject));
    const object = (req.query.object || (req.body && req.body.object));
    const attachment = (req.query.attachment || (req.body && req.body.attachment));

    const mailOptions = {
        from: '', // your GMail email address 
        to: email,
        subject: subject,
        text: object,
        attachments: [{
            path: attachment
        }]
    };

    let success;

    try {
        success = await transporter.sendMail(mailOptions);
    } catch (err) {
        context.log(err);
        success = false;
    }

    if (success) {
        await context.log('Prenotazione inviata con successo al paziente!');
    } else {
        await context.log('Mi dispiace, non sono riuscito ad inviare la prenotazione.');
    }

}