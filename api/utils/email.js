const Nodemailer = require('nodemailer');
const Promise = require('bluebird');
  
const smtpTransport = Nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GFOOD_EMAIL,
        pass: process.env.GFOOD_EMAIL_PASS
    }
});
const sendMail = module.exports.sendMail = function (to, from, subject, mailbody) {

    return new Promise(function (resolve, reject) {

        var mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: mailbody
        };

        var responseObject = {};

        smtpTransport.sendMail(mailOptions, function (err, info) {
            if (err) {
                responseObject.status = false;
                responseObject.msg = 'Error al enviar el correo : ' + err;
                console.log(err);
                resolve(responseObject); 
            } else {
                responseObject.status = true;
                responseObject.msg = 'Correo enviado enviado a ' + to;
                resolve(responseObject);
            }
        });
    });

};
